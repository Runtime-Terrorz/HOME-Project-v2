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

const bridge = new SimpleSchema2Bridge(Inventories._schema);

/** Renders the Page for editing a single document. */
const EditInventory = ({ doc, ready }) => {
  // Check the quantity against the threshold to determine the status
  const checkAmount = (quantity, threshold) => {
    if (quantity <= threshold) {
      return 'bad';
    }
    return 'good';
  };
  // On successful submit, insert the data.
  const submit = (data) => {
    const { medication, name, location, threshold, quantity, lot, expiration, _id } = data;
    const status = checkAmount(quantity, threshold);
    const [startDate, setStartDate] = useState(new Date());

    // On successful submit, insert the data.
    const submit = (data) => {
      const { medication, name, location, threshold, quantity, lot, status, _id } = data;
      const expiration = startDate;
      const collectionName = Inventories.getCollectionName();
      const updateData = { id: _id, medication, name, location, threshold, quantity, lot, expiration, status };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => swal('Success', 'Inventory updated successfully', 'success'));
    };

    return (ready) ? (
      <Grid id={PAGE_IDS.EDIT_INVENTORY} container centered className="editinventory">
        <Grid.Column width={10}>
          <Header as="h2" textAlign="center">Edit Inventory</Header>
          <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
            <Segment inverted style={{ backgroundColor: '#992E2E' }}>
              <SelectField name='medication' />
              <TextField name='name' />
              <Form.Group widths={'equal'}>
                <TextField name='location' />
                <Form.Group>
                  <NumField name='threshold' decimal={false} />
                  <NumField name='quantity' decimal={false} />
                </Form.Group>
              </Form.Group>
              <Form.Group widths={'2'}>
                <Grid.Row>
                  Expiration Date
                  <Icon name='calendar alternate outline' />
                  <DatePicker name='expiration' selected={startDate} onChange={(date) => setStartDate(date)} />
                </Grid.Row>
                <TextField name='lot' />
              </Form.Group>
              <SubmitField value='Submit' />
              <ErrorsField />
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
