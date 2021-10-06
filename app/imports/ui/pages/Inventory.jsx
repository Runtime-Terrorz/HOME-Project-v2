import React from 'react';
import { Container, Table, Header, Grid, Dropdown, Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { Inventories } from '../../api/inventory/InventoryCollection';
import InventoryItem from '../components/InventoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const Inventory = ({ ready, inventories }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_INVENTORY}>
    <Grid container column={3}>
      <Grid.Row column={2} className="inventory">
        <Grid.Column width={10}>
          <Header as="h1" textAlign="left">Inventory</Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width={12}>
            Showing 1-3 of 3
        </Grid.Column>
        <Grid.Column width={4}>
          <Dropdown
            text='Filter'
            icon='filter'
            floating
            labeled
            button
            className='icon'
          >
            <Dropdown.Menu>
              <Dropdown.Header icon='tags' content='Filter by tag'/>
              <Dropdown.Divider/>
              <Dropdown.Item>Medicines</Dropdown.Item>
              <Dropdown.Item>Vaccines</Dropdown.Item>
              <Dropdown.Item>Pills</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Grid.Column>
      </Grid.Row>
    </Grid>
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
