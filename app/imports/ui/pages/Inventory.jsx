import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import { Container, Table, Header, Grid, Dropdown, Loader, Input } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Inventories, inventoryStates } from '../../api/inventory/InventoryCollection';
import InventoryItem from '../components/InventoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const Inventory = ({ ready, inventories }) => {
  // State functions
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  // variable that allows the inventory to be changed via sort functions
  let sorted = inventories;
  // handleChange to setFilter state to the value that is chosen in filter dropdown
  const handleChange = (e, data) => {
    e.preventDefault();
    // set filter state to the filter value
    setFilter(data.value);
  };
  // handleSearch to setSearch state to the value that is entered in the search bar
  const handleSearch = (e, data) => {
    e.preventDefault();
    // set search state to the search value
    setSearch(data.value);
  };
  // matches the search to the item that we are trying to search for
  const medFind = (searchItem) => {
    // set search value to lowercase
    const lowerCase = search.toLowerCase();
    // find the item that starts with the search value
    return searchItem.name.toLowerCase().startsWith(lowerCase);
  };

  if (ready) {
    if (filter === 'thresholdok') {
      // set the sorted variable to the filtered inventory statuses ok or bad
      sorted = inventories.filter(inventory => inventory.status === inventoryStates.ok || inventory.status === inventoryStates.bad);
    } else if (filter === 'thresholdbad') {
      // set the sorted variable to the filtered inventory statuses bad
      sorted = inventories.filter(inventory => inventory.status === inventoryStates.bad);
      // set the sorted variable to the filtered inventory statuses ok or bad
    } else if (filter === 'quantity') {
      // reverse the order of the quantities to show the greater items first
      sorted = _.sortBy(inventories, filter).reverse();
    } else {
      // sort the items by the filter value
      sorted = _.sortBy(inventories, filter);
    }
    // if anything is typed in the search bar
    if (search) {
      // filter the inventory items by the search value and sort by the name of the item
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
          <Grid.Column floated='right' width={4}>
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
                <Dropdown.Item onClick ={handleChange} value = 'medication'>Medicines</Dropdown.Item>
                <Dropdown.Item onClick ={handleChange} value = 'expiration'>Expiration Date</Dropdown.Item>
                <Dropdown.Item onClick ={handleChange} value = 'quantity'>Quantity</Dropdown.Item>
                <Dropdown.Item onClick ={handleChange} value = 'thresholdok'>Low Inventory</Dropdown.Item>
                <Dropdown.Item onClick ={handleChange} value = 'thresholdbad'>No Inventory</Dropdown.Item>
                <Dropdown.Item onClick ={handleChange}>Category Tags</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table inverted celled className="listcontainer" style={{ backgroundColor: '#88a7b3' }}>
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
