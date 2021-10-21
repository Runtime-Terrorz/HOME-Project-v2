import React from 'react';
import { Container, Table, Header, Grid, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import InventoryItem from '../components/InventoryItem';
import { Inventories } from '../../api/inventory/InventoryCollection';

/** Renders a table containing all of the past items added to the inventory table. */
const LogHistory = ({ ready, inventories }) => ((ready) ? (
  <Container id={PAGE_IDS.LOG_HISTORY}>
    <Grid container column={3}>
      <Grid.Row column={2}>
        <Grid.Column width={10}>
          <Header as="h1" textAlign="left">Log History</Header>
        </Grid.Column>
      </Grid.Row>
    </Grid>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date Added</Table.HeaderCell>
          <Table.HeaderCell>Added By</Table.HeaderCell>
          <Table.HeaderCell>Medication</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Threshold</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Storage Location</Table.HeaderCell>
          <Table.HeaderCell>Lot #</Table.HeaderCell>
          <Table.HeaderCell>Expiration Date</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {inventories.map((inventory) => <InventoryItem key={inventory._id} inventory={inventory}/>)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

/** Require an array of Inventory documents in the props. */
LogHistory.propTypes = {
  inventories: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Inventory documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Inventory documents and sort them by name.
  const inventories = Inventories.find({}, { sort: { name: 1 } }).fetch();
  return {
    inventories,
    ready,
  };
})(LogHistory);
