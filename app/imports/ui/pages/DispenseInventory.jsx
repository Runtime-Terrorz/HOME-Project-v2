import React, { useState } from 'react';
import { Grid, Loader, Header, Segment, Form, TextArea, Select, Icon } from 'semantic-ui-react';
import swal from 'sweetalert';
import { AutoForm, ErrorsField, HiddenField, NumField, SelectField, TextField } from 'uniforms-semantic';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import SimpleSchema2Bridge from 'uniforms-bridge-simple-schema-2';
import { useParams } from 'react-router';
import 'react-datepicker/dist/react-datepicker.css';
import { Redirect } from 'react-router-dom';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { defineMethod, updateMethod } from '../../api/base/BaseCollection.methods';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { InventoryAudit } from '../../api/InventoryAudit/InventoryAuditCollection';

const bridge = new SimpleSchema2Bridge(Inventories._schema);

const countryOptions = [
  { key: 'joint', value: 'joint', text: 'Joint Outreach Center' },
  { key: 'kailua', value: 'kailua', text: 'Kailua YMCA' },
  { key: 'post', value: 'post', text: 'POST – Ke’ehi Lagoon' },
  { key: 'kaiaka', value: 'kaiaka', text: 'Kaiaka Bay Beach Park' },
  { key: 'augustine', value: 'augustine', text: 'St. Augustine Church by the Sea' },
  { key: 'onelauena', value: 'onelauena', text: 'Onelauena and Onemalu Shelters' },
  { key: 'paiolu', value: 'paiolu', text: 'Pai’olu Kaiaulu Shelter' },
  { key: 'weinberg', value: 'weinberg', text: 'Weinberg Village' },
  { key: 'kakaako', value: 'kakaako', text: 'Kaka’ako Waterfront Park' },
  { key: 'methodist', value: 'methodist', text: 'First United Methodist Church' },
];
/** Renders the Page for dispensing a single document. */

const DispenseInventory = ({ doc, ready }) => {

  const [finalPatientID, setFinalPatientID] = useState('');
  const [finalLocation, setFinalLocation] = useState('');
  const [finalNote, setFinalNote] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  const handleDropdown = (event, data) => {
    setFinalLocation(data.value);
  };

  // On successful submit, update the data
  const submit = (data) => {
    if (finalPatientID === '' || finalPatientID === null) {
      swal('Error', 'Please enter a PatientID', 'error');
    } else if (data.quantity > doc.quantity) {
      swal('Error', 'Unable to dispense requested amount', 'error');
    } else {
      const { medication, name, lot, threshold, _id } = data;
      let collectionName = Inventories.getCollectionName();
      const quantity = doc.quantity - data.quantity;
      const status = Inventories.checkQuantityStatus(quantity, threshold);

      // variables for log history
      const owner = Meteor.user().username;
      const dispenseLocation = finalLocation;
      console.log(dispenseLocation);
      console.log(finalLocation);
      const patientID = finalPatientID;
      const changeNotes = finalNote;
      const isDispenseChanged = true;
      const today = new Date();
      const stringDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      const quantityChanged = data.quantity * -1;
      const expirationDate = data.expiration;
      const dateChanged = new Date(stringDate);
      const collectionName2 = InventoryAudit.getCollectionName();

      const updateData = { id: _id, medication, name, threshold, quantity, lot, status };
      const definitionData = { owner, medication, patientID, dispenseLocation, name, lot, quantityChanged, dateChanged, expirationDate, changeNotes, isDispenseChanged };
      updateMethod.callPromise({ collectionName, updateData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal('Success', 'Inventory dispensed successfully', 'success');

          collectionName = collectionName2;
          defineMethod.callPromise({ collectionName, definitionData })
            .catch(error => swal('Error', error.message, 'error'))
            .then(() => {
            });

          setRedirectToReferer(true);
        });
    }
  };

  if (redirectToReferer) {
    return <Redirect to={'/list'}/>;
  }

  return (ready) ? (
    <Grid id={PAGE_IDS.DISPENSE_INVENTORY} container centered className="dispenseinventory">
      <Grid.Column width={12}>
        <AutoForm schema={bridge} onSubmit={data => submit(data)} model={doc}>
          <Segment padded='very' inverted style={{ backgroundColor: '#b86d4e' }}>
            <Header inverted as="h1" textAlign="center">Dispense Inventory</Header>
            <Form.Group>
              <Form.Field width={8}>
                <label>Patient ID</label>
                <input required placeholder='PatientID' value={finalPatientID} onChange={ e => setFinalPatientID(e.target.value)}/>
              </Form.Field>
              <Form.Field width={8}>
                <label>Clinical Location <Icon name={'hospital outline'}/></label>
                <Select placeholder='Select Location' options={countryOptions} onChange={handleDropdown} />
              </Form.Field>
            </Form.Group>
            <Form.Group widths={'equal'}>
              <SelectField
                name='medication'
                disabled
                id={COMPONENT_IDS.DISPENSE_INVENTORY_MEDICATION}
              />
            </Form.Group>
            <Form.Group widths={'equal'}>
              <TextField
                name='name'
                disabled
                id={COMPONENT_IDS.DISPENSE_INVENTORY_NAME}
              />
            </Form.Group>
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
              <NumField
                name='quantity'
                decimal={false}
                min='1'
                id={COMPONENT_IDS.DISPENSE_INVENTORY_QUANTITY}
              />
            </Form.Group>
            <Form.Field>
              <label>Notes</label>
              <TextArea
                placeholder='Write relevant information about this medication and directions on how to use it.'
                value={finalNote} onChange={ e => setFinalNote(e.target.value)}
                rows={3}
                id={COMPONENT_IDS.DISPENSE_INVENTORY_NOTES}
              />
            </Form.Field>
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
