import React, { useState } from 'react';
import { Grid, Loader, Header, Segment, Form, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, SubmitField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const bridge = new SimpleSchema2Bridge(Inventories._schema);

/** Renders the Page for editing a single document. */
const EditInventory = ({ doc, ready }) => {
  const [startDate, setStartDate] = useState(new Date());

  // Check the quantity against the threshold to determine the status
  const checkAmount = (quantity, threshold) => {
    if (quantity <= threshold) {
      return 'bad';
    }
    return 'good';
  };

  // On successful submit, insert the data.
  const submit = (data) => {
    const { medication, name, location, threshold, quantity, lot, _id } = data;
    const expiration = startDate;
    const status = checkAmount(quantity, threshold);
    const collectionName = Inventories.getCollectionName();
    const updateData = { id: _id, medication, name, location, threshold, quantity, lot, expiration, status };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'Inventory updated successfully', 'success'));
  };

  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_INVENTORY} container centered className="editinventory">
      <Grid.Column width={8}>
        <Header inverted as="h2" textAlign="center">Edit Inventory</Header>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment inverted style={{ backgroundColor: '#800000' }}>
            <SelectField
              name='medication'
              id={COMPONENT_IDS.EDIT_INVENTORY_MEDICATION}
            />
            <TextField
              name='name'
              id={COMPONENT_IDS.EDIT_INVENTORY_NAME}
            />
            <Form.Group widths={'equal'}>
              <TextField
                name='lot'
                id={COMPONENT_IDS.EDIT_INVENTORY_LOT}
              />
              <Grid.Row>
                  Expiration Date
                <Icon name='calendar alternate outline'/>
                <DatePicker
                  name='expiration'
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  id={COMPONENT_IDS.EDIT_INVENTORY_EXPIRATION}
                />
              </Grid.Row>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <NumField
                name='threshold'
                decimal={false}
                id={COMPONENT_IDS.EDIT_INVENTORY_THRESHOLD}
              />
              <NumField
                name='quantity'
                decimal={false}
                id={COMPONENT_IDS.EDIT_INVENTORY_QUANTITY}
              />
            </Form.Group>
            <TextField
              name='location'
              id={COMPONENT_IDS.EDIT_INVENTORY_LOCATION}
            />
            <SubmitField
              value='Submit'
              id={COMPONENT_IDS.EDIT_INVENTORY_SUBMIT}
            />
            <ErrorsField/>
            <HiddenField name='owner' />
          </Segment>
        </AutoForm>
      </Grid.Column>
    </Grid>
  ) : <Loader active>Getting data</Loader>;
};

// Require the presence of a Inventory document in the props object. Uniforms adds 'model' to the props, which we use.
EditInventory.propTypes = {
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
})(EditInventory);
