import React from 'react';
import { Container, Table, Header, Loader, Icon, Button, Grid } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { CSVLink } from 'react-csv';
import swal from 'sweetalert';
import { expirationStates, Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import { PAGE_IDS } from '../utilities/PageIDs';
import { removeMultipleMethod } from '../../api/base/BaseCollection.methods';
import BadInventoryItem from '../components/BadInventoryItem';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const BadInventory = ({ ready, badInventory }) => {
  // Array of item id that we want to delete
  const badId = [];
  const changeFields =
      ({ medication, name, location, quantity, lot, expiration, quantityStatus, expirationStatus }) => ({ medication, name, location, quantity, lot, expiration, quantityStatus, expirationStatus });
  // Filter the Bad Inventory fields to be exported to csv
  const csvObj = badInventory.map(obj => changeFields(obj));
  const collectionName = Inventories.getCollectionName();
  const today = new Date();
  const csvName = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}-InventoryReport.csv`;
  // Put items to delete in array
  badInventory.forEach(obj => badId.push(obj._id));
  const handleClick = () => {
    swal({
      title: 'Are you sure you want to delete all the items?',
      text: 'Will not be able to revert',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        // Delete all of the items that are in badId
        removeMultipleMethod.callPromise({ collectionName, instance: badId });
        swal(
          'Deleted!',
          'All items have been deleted',
          'success',
        );
      } else {
        swal('Did not delete');
      }
    });
  };

  return (ready) ? (
    <Container style={{ backgroundColor: '#88a7b3', marginTop: '-20px' }} id={PAGE_IDS.LIST_BAD_INVENTORY}>
      <Grid container centered>
        <br/><Header as="h1">Report</Header>
        <Grid.Row>
          <Header as="h3"><em>Expired and No Stock Supplies</em></Header>
        </Grid.Row>
        <Table inverted celled style={{ backgroundColor: '#88a7b3' }}>
          <Table.Cell width={3}>
            <Button style={{ backgroundColor: '#97B9C7', color: 'white' }}
              icon
              color='red'
              labelPosition='left'
              onClick={handleClick} >
              <Icon name='trash'/>
              Delete All
            </Button>
          </Table.Cell>
          <Table.Cell width={9}>
          </Table.Cell>
          <Table.Cell width={3}>
            <CSVLink
              data={csvObj}
              filename={csvName}>
              <Button style={{ backgroundColor: '#97B9C7', color: 'white' }}
                icon
                color='green'
                labelPosition='left'>
                <Icon name='share'/>Export to CSV
              </Button>
            </CSVLink>
          </Table.Cell>
        </Table>
      </Grid>
      <Table inverted celled className="listContainer" style={{ backgroundColor: '#88a7b3' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Medication</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Unit</Table.HeaderCell>
            <Table.HeaderCell>Threshold</Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell>Storage Location</Table.HeaderCell>
            <Table.HeaderCell>Lot #</Table.HeaderCell>
            <Table.HeaderCell>Expiration Date</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {badInventory.map((inventory) => <BadInventoryItem key={inventory._id} inventory={inventory}/>)}
        </Table.Body>
      </Table>
    </Container>
  ) : <Loader active>Getting data</Loader>;
};

/** Require an array of Inventory documents in the props. */
BadInventory.propTypes = {
  badInventory: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Inventory documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Inventory documents and sort them by name.
  const badInventory = Inventories.find({ $or: [{ quantityStatus: quantityStates.bad },
    { expirationStatus: expirationStates.expired }] }).fetch().reverse();
  return {
    badInventory,
    ready,
  };
})(BadInventory);
