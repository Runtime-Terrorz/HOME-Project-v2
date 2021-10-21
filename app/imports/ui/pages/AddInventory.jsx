import React, { useState } from 'react';
import { Grid, Segment, Header, Form, Icon } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import QRCode from 'qrcode';
import { Inventories, inventoryMedications, medLocations } from '../../api/inventory/InventoryCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Create a schema to specify the structure of the data to appear in the form. */
const formSchema = new SimpleSchema({
  medication: {
    type: String,
    allowedValues: inventoryMedications,
    defaultValue: 'Allergy & Cold Medicines',
  },
  name: String,
  location: {
    type: String,
    allowedValues: medLocations,
    defaultValue: 'Case 1',
  },
  threshold: Number,
  quantity: Number,
  lot: String,
  note: String,
});

const bridge = new SimpleSchema2Bridge(formSchema);

/** Renders the Page for adding a document. */
const AddInventory = () => {
  const [startDate, setStartDate] = useState(new Date());

  // On submit, insert the data.
  const submit = (data, formRef) => {
    const { medication, name, location, threshold, quantity, lot, note } = data;
    const owner = Meteor.user().username;
    const expiration = startDate;
    const status = Inventories.checkStatus(quantity, threshold);
    const collectionName = Inventories.getCollectionName();
    const definitionData = { medication, name, location, threshold, quantity, lot, expiration, owner, status, note };

    // Generates QR Code for dispense page
    let qrCode;
    QRCode.toDataURL(`http://localhost:3000/#/dispense/${lot}`)
      .then(url => {
        qrCode = url;
      });

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
    <Grid id={PAGE_IDS.ADD_INVENTORY} container centered className="addinventory">
      <Grid.Column width={8}>
        <Header inverted as="h1" textAlign="center">Add Inventory</Header>
        <AutoForm ref={ref => {
          fRef = ref;
        }} schema={bridge} onSubmit={data => submit(data, fRef)}>
          <Segment inverted style={{ backgroundColor: '#800000' }}>
            <SelectField
              name='medication'
              id={COMPONENT_IDS.ADD_INVENTORY_MEDICATION}
            />
            <TextField
              name='name'
              placeholder={'Diphenhydramine 50 mg/mL'}
              id={COMPONENT_IDS.ADD_INVENTORY_NAME}
            />
            <Form.Group widths={'equal'}>
              <TextField
                name='lot'
                placholder={'ABC123'}
                id={COMPONENT_IDS.ADD_INVENTORY_LOT}
              />
              <Grid.Row>
              Expiration Date
                <Icon name='calendar alternate outline'/>
                <DatePicker name='expiration'
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  id={COMPONENT_IDS.ADD_INVENTORY_EXPIRATION}
                />
              </Grid.Row>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <NumField
                name='threshold'
                placeholder={'5'}
                decimal={false}
                id={COMPONENT_IDS.ADD_INVENTORY_THRESHOLD}
              />
              <NumField
                name='quantity'
                placeholder={'10'}
                decimal={false}
                id={COMPONENT_IDS.ADD_INVENTORY_QUANTITY}
              />
            </Form.Group>
            <SelectField
              name='location'
              id={COMPONENT_IDS.ADD_INVENTORY_LOCATION}
            />
            <Form.Group widths={'equal'} >
              <TextField
                name='note'
                id={COMPONENT_IDS.ADD_INVENTORY_NOTE}
              />
            </Form.Group>
            <SubmitField
              value='Submit'
              id={COMPONENT_IDS.ADD_INVENTORY_SUBMIT}
            />
            <ErrorsField/>
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  );
};

export default AddInventory;
