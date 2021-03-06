import React, { useState } from 'react';
import { Grid, Loader, Header, Segment, Form, Icon, Button, Modal } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, TextField } from 'uniforms-semantic';
import { Redirect } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { updateMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const bridge = new SimpleSchema2Bridge(Inventories._schema);

/** Renders the Page for editing a single document. */
const EditInventory = ({ doc, ready }) => {
  const [open, setOpen] = React.useState(false);
  const [startDate, setStartDate] = useState(doc.expiration);
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  // On successful submit, insert the data.
  const submit = (data) => {
    const { medication, unit, note, name, location, threshold, quantity, lot, _id } = data;
    const expiration = startDate;
    const status = Inventories.checkQuantityStatus(quantity, threshold);
    const collectionName = Inventories.getCollectionName();
    const updateData = { id: _id, medication, unit, note, name, location, threshold, quantity, lot, expiration, status };
    updateMethod.callPromise({ collectionName, updateData })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Inventory updated successfully', 'success', { timer: 2000 });
        setRedirectToReferer(true);
      });
  };

  // Delete item from inventory
  const handleDelete = () => {
    const collectionName = Inventories.getCollectionName();
    const instance = doc._id;
    removeItMethod.callPromise({ collectionName, instance })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {
        swal('Success', 'Item Removed', 'success', { timer: 2000 });
        setRedirectToReferer(true);
      });
  };

  if (redirectToReferer) {
    return <Redirect to={'/list'}/>;
  }

  return (ready) ? (
    <Grid id={PAGE_IDS.EDIT_INVENTORY} container centered className="editinventory">
      <Grid.Column width={8}>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment padded='very' inverted style={{ backgroundColor: '#b86d4e' }}>
            <Header as="h2" textAlign="center">Edit Item</Header>
            <SelectField
              name='medication'
              id={COMPONENT_IDS.EDIT_INVENTORY_MEDICATION}
            />
            <Form.Group widths={'equal'}>
              <TextField
                name='name'
                icon={'medkit'}
                placeholder={'Diphenhydramine 50 mg/mL'}
                id={COMPONENT_IDS.EDIT_INVENTORY_NAME}
              />
              <Grid.Column widths={2}>
                <SelectField
                  name='unit'
                  id={COMPONENT_IDS.EDIT_INVENTORY_UNIT}
                />
              </Grid.Column>
            </Form.Group>
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
                min='0'
                id={COMPONENT_IDS.EDIT_INVENTORY_THRESHOLD}
              />
              <NumField
                name='quantity'
                decimal={false}
                min='0'
                id={COMPONENT_IDS.EDIT_INVENTORY_QUANTITY}
              />
            </Form.Group>
            <SelectField
              name='location'
              id={COMPONENT_IDS.EDIT_INVENTORY_LOCATION}
            />
            <Form.Group widths={'equal'} >
              <TextField
                name='note'
                id={COMPONENT_IDS.ADD_INVENTORY_NOTE}
              />
            </Form.Group>
            <Form.Button id={COMPONENT_IDS.EDIT_INVENTORY_SUBMIT} content="Submit" style={{ backgroundColor: '#779AA8', color: 'white' }} />
            <ErrorsField/>
            <HiddenField name='owner' />
          </Segment>
        </AutoForm>
        <Modal
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
          open={open}
          trigger={<Button className='deleteButton' content='Delete' icon='trash' labelPosition='left' color='red'/>}
        >
          <Modal.Content style={{ backgroundColor: '#b86d4e', color: 'white' }}>
            <Modal.Description>
              <Header as={'h3'}>Are you sure you want to delete this item?</Header>
              <p><em>This item will be deleted permanently. You cannot undo this action.</em></p>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions style={{ backgroundColor: '#EEE7DA', color: 'white' }}>
            <Button color='green' inverted onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              color='red'
              inverted
              content="Delete"
              labelPosition='right'
              icon='x'
              onClick={handleDelete}
              positive
            />
          </Modal.Actions>
        </Modal>
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
