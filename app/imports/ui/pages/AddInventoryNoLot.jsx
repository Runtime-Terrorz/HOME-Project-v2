import React, { useEffect, useState } from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Inventories, inventoryMedications } from '../../api/inventory/InventoryCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import QRCode from 'qrcode';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  medication: {
    type: String,
    allowedValues: inventoryMedications,
    defaultValue: 'Allergy & Cold Medicines',
  },
  name: String,
  location: String,
  should_have: Number,
  quantity: Number,
  lot: String,
  expiration: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddInventory = () => {
  /** Check if the quantity against the threshold to determine the status */
  const checkAmount = (quantity, threshold) => {
    console.log(`Threshold: ${threshold} Quantity: ${quantity}`);
    console.log(quantity <= threshold);
    switch (quantity <= threshold) {
    case true:
      return 'bad';
    default:
      return 'good';
    }
  };

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { medication, name, location, should_have, quantity, lot, expiration } = data;
    const owner = Meteor.user().username;
    const status = checkAmount(quantity, should_have);
    const collectionName = Inventories.getCollectionName();
    const definitionData = { medication, name, location, should_have, quantity, lot, expiration, owner, status };

    /**Generates QR Code for dispense page**/
    let qrCode;
    QRCode.toDataURL('http://localhost:3000/#/dispense/' + lot)
      .then(url => {
        qrCode = url;
      })

    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal({
          title: 'Success',
          text: 'Order added successfully. Save QRCode for dispensing.',
          icon: qrCode,
        });
        formRef.reset();
      });
  };
  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  let fRef = null;
  return (
    <Grid id={PAGE_IDS.ADD_INVENTORY} container centered>
      <Grid.Column width={10}>
        <Header as="h2" textAlign="center">Add Inventory</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment inverted style={{ backgroundColor: '#FB785E' }}>
            <SelectField name='medication'/>
            <TextField name='name' placeholder={'Diphenhydramine 50 mg/mL'}/>
            <Form.Group widths={'equal'}>
              <TextField name='location'/>
              <Form.Group>
                <NumField name='should_have' decimal={false}/>
                <NumField name='quantity' decimal={false}/>
              </Form.Group>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <TextField name='expiration' placeholder={'Ex: 08/04/2022'}/>
              <TextField name='lot'/>
            </Form.Group>
            <SubmitField value='Submit'/>
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddInventory;
