import React from 'react';
import { Grid, Segment, Header, Form } from 'semantic-ui-react';
import { AutoForm, ErrorsField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import swal from 'sweetalert';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import SimpleSchema from 'simpl-schema';
import { Inventories, inventoryMedications } from '../../api/inventory/InventoryCollection';
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
  location: String,
  threshold: Number,
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
    const { medication, name, location, threshold, quantity, lot, expiration } = data;
    const owner = Meteor.user().username;
    const status = checkAmount(quantity, threshold);
    const collectionName = Inventories.getCollectionName();
    const definitionData = { medication, name, location, threshold, quantity, lot, expiration, owner, status };
    defineMethod.callPromise({ collectionName, definitionData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Order added successfully', 'success');
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
                name='location'
                placeholder={'Top Shelf'}
                id={COMPONENT_IDS.ADD_INVENTORY_LOCATION}
              />
              <Form.Group>
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
            </Form.Group>
            <Form.Group widths={'equal'}>
              <TextField
                name='expiration'
                placeholder={'Ex: 08/04/2022'}
                id={COMPONENT_IDS.ADD_INVENTORY_EXPIRATION}
              />
              <TextField
                name='lot'
                placholder={'ABC123'}
                id={COMPONENT_IDS.ADD_INVENTORY_LOT}
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
