import React from 'react';
import { Grid, Loader, Header, Segment, Form, TextArea } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import 'react-datepicker/dist/react-datepicker.css';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const bridge = new SimpleSchema2Bridge(Inventories._schema);

/** Renders the Page for dispensing a single document. */
const DispenseInventory = ({ doc, ready }) => {

  // On successful submit, update the data
  const submit = (data) => {
    const { medication, name, lot, threshold, _id } = data;
    const collectionName = Inventories.getCollectionName();
    const quantity = doc.quantity - data.quantity;
    const status = Inventories.checkStatus(quantity, threshold);
    const updateData = { id: _id, medication, name, threshold, quantity, lot, status };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Inventory dispensed successfully', 'success'));
  };

  return (ready) ? (
    <Grid id={PAGE_IDS.DISPENSE_INVENTORY} container centered className="dispenseInventory">
      <Grid.Column width={8}>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment inverted style={{ backgroundColor: '#b86d4e' }}>
            <Header inverted as="h1" textAlign="center">Dispense Inventory</Header>
            <SelectField
              name='medication'
              disabled
              id={COMPONENT_IDS.DISPENSE_INVENTORY_MEDICATION}
            />
            <TextField
              name='name'
              disabled
              id={COMPONENT_IDS.DISPENSE_INVENTORY_NAME}
            />
            <Form.Group widths={'equal'}>
              <TextField
                name='lot'
                disabled
                id={COMPONENT_IDS.DISPENSE_INVENTORY_LOT}
              />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <NumField
                name='threshold'
                decimal={false}
                disabled
                id={COMPONENT_IDS.EDIT_INVENTORY_THRESHOLD}
              />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <NumField
                name='quantity'
                decimal={false}
                min='0'
                id={COMPONENT_IDS.DISPENSE_INVENTORY_QUANTITY}
              />
            </Form.Group>
            <Form.Group>
              <TextArea
                placeholder='Notes'
                rows={3}
                id={COMPONENT_IDS.DISPENSE_INVENTORY_NOTES}
              />
            </Form.Group>
            <Form.Button id={COMPONENT_IDS.DISPENSE_INVENTORY_SUBMIT} content="Submit" style={{ backgroundColor: '#779AA8', color: 'white' }} />
            <ErrorsField/>
            <HiddenField name='owner' />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Inventory document in the props object. Uniforms adds 'model' to the props, which we use.
DispenseInventory.propTypes = {
  doc: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const { _id } = useParams();
  const documentId = _id;
  // Get access to Inventory documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the document
  const doc = Inventories.findDoc(documentId);
  return {
    doc,
    ready,
  };
})(DispenseInventory);
