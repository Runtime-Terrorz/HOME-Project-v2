import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Inventories } from '../../api/inventory/InventoryCollection';
import InventoryItem from '../components/InventoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const BadInventory = ({ ready, inventories }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_BAD_INVENTORY}>
    <Header as="h1" textAlign="left" inverted>Report</Header>
    <Table celled className="listcontainer" >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Medication</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
          <Table.HeaderCell>Threshold</Table.HeaderCell>
          <Table.HeaderCell>Quantity</Table.HeaderCell>
          <Table.HeaderCell>Storage Location</Table.HeaderCell>
          <Table.HeaderCell>Lot #</Table.HeaderCell>
          <Table.HeaderCell>Expiration Date</Table.HeaderCell>
          <Table.HeaderCell>Edit</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {inventories.map((inventory) => <InventoryItem key={inventory._id} inventory={inventory}/>)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

/** Require an array of Inventory documents in the props. */
BadInventory.propTypes = {
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
  const inventories = Inventories.find({ status: 'bad' }, { sort: { name: 1 } }).fetch();
  return {
    inventories,
    ready,
  };
})(BadInventory);
