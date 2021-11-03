import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Container, Table, Header, Grid, Dropdown, Loader, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import InventoryItem from '../components/InventoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const Inventory = ({ ready, inventories }) => {
  // State functions
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  let sorted = inventories;
  /** Set filter state to the value that is chosen in filter dropdown */
  const handleFilter = (e, data) => {
    e.preventDefault();
    setFilter(data.value);
  };
  /** Set search state to the value that is typed in the search bar */
  const handleSearch = (e, data) => {
    e.preventDefault();
    setSearch(data.value);
  };
  /** matches the search to the item that we are trying to search for */
  const medFind = (searchItem) => {
    const lowerCase = search.toLowerCase();
    return searchItem.name.toLowerCase().contains(lowerCase);
  };

  if (ready) {
    // Check the filter state and filter the inventory
    if (filter === 'inventoryok') {
      sorted = inventories.filter(inventory => inventory.status === quantityStates.ok || inventory.status === quantityStates.bad);
    } else if (filter === 'inventorybad') {
      sorted = inventories.filter(inventory => inventory.status === quantityStates.bad);
    } else if (filter === 'quantity') {
      sorted = _.sortBy(inventories, filter).reverse();
    } else {
      sorted = _.sortBy(inventories, filter);
    }
    // If something is typed in search bar, sort and filter inventory
    if (search) {
      sorted = _.sortBy(inventories.filter(inventory => medFind(inventory)), 'name');
    }
  }
  return ((ready) ? (
    <Container id={PAGE_IDS.LIST_INVENTORY}>
      <Grid container column={3}>
        <Grid.Row column={2} className="inventory">
          <Grid.Column width={10}>
            <Header as="h1" textAlign="left">Inventory</Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column floated='right' width={5}>
            <Input type='text' size='large' placeholder='Search by name...' icon='search' fluid
              onChange={handleSearch}/>
          </Grid.Column>
          <Grid.Column width={2}>
            <Dropdown style={{ backgroundColor: '#88a7b3' }}
              text='Filter'
              icon='filter'
              floating
              labeled
              button
              className='icon'
            >
              <Dropdown.Menu style={{ color: 'black !important', backgroundColor: '#88a7b3' }}>
                <Dropdown.Header icon='tags' content='Filter by tag'/>
                <Dropdown.Divider/>
                <Dropdown.Item onClick ={handleFilter} value = 'medication'>Medicines</Dropdown.Item>
                <Dropdown.Item onClick ={handleFilter} value = 'expiration'>Expiration Date</Dropdown.Item>
                <Dropdown.Item onClick ={handleFilter} value = 'quantity'>Quantity</Dropdown.Item>
                <Dropdown.Item onClick ={handleFilter} value = 'inventoryok'>Low Inventory</Dropdown.Item>
                <Dropdown.Item onClick ={handleFilter} value = 'inventorybad'>No Inventory</Dropdown.Item>
                <Dropdown.Item onClick ={handleFilter}>Category Tags</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
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
            <Table.HeaderCell>Edit</Table.HeaderCell>
            <Table.HeaderCell>Dispense</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sorted.map((inventory) => <InventoryItem key={inventory._id} inventory={inventory}/>)}
        </Table.Body>
      </Table>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};
/** Require an array of Inventory documents in the props. */
Inventory.propTypes = {
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
})(Inventory);
