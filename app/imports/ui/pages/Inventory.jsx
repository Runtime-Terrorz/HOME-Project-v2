import React, { useState } from 'react';
import { _ } from 'meteor/underscore';
import {
  Container,
  Table,
  Header,
  Grid,
  Dropdown,
  Loader,
  Input,
  Checkbox,
  Icon,
  Button,
  Modal, List,
} from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { expirationStates, Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import InventoryItem from '../components/InventoryItem';
import { PAGE_IDS } from '../utilities/PageIDs';
import DispenseComponent from '../components/DispenseComponent';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/** Renders a table containing all of the Inventory documents. Use <InventoryItem> to render each row. */
const Inventory = ({ ready, inventories }) => {
  // State functions
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [dispense, setDispense] = useState([]);

  /** Sets the modal to open or closed state */
  const [firstOpen, setFirstOpen] = React.useState(false);
  const [secondOpen, setSecondOpen] = React.useState(false);

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
    return searchItem.name.toLowerCase().includes(lowerCase);
  };

  /** saves the name of what was selected for dispense */
  const [selection, setSelection] = useState([]);
  const takeValue = (e, { label, checked }) => {
    if (checked) {
      const save = inventories.filter(inventory => inventory.name === label);
      setSelection([...selection, label]);
      setDispense([...dispense, save[0]._id]);
    } else {
      const save = inventories.filter(inventory => inventory.name === label);
      setSelection(selection.filter(el => el !== label));
      setDispense(dispense.filter(el => el !== save[0]._id));
    }
  };

  /** Cancel Button used for both Modals */
  const cancelButton = () => {
    setDispense([]);
    setFirstOpen(false);
    setSecondOpen(false);
  };

  /** Submit button used for first modal */
  const submitButton = () => {
    if (dispense.length === 0) {
      swal('Error', 'Please Select Item to Dispense', 'error');
    } else {
      setSecondOpen(true);
    }
  };

  if (ready) {
    // Check the filter state and filter the inventory
    if (filter === 'inventoryOk') {
      sorted = inventories.filter(inventory => inventory.quantityStatus === quantityStates.ok || inventory.quantityStatus === quantityStates.bad);
    } else if (filter === 'inventoryBad') {
      sorted = inventories.filter(inventory => inventory.quantityStatus === quantityStates.bad);
    } else if (filter === 'high') {
      sorted = _.sortBy(inventories, 'quantity').reverse();
    } else if (filter === 'low') {
      sorted = _.sortBy(inventories, 'quantity');
    } else if (filter === 'expired') {
      sorted = inventories.filter(inventory => inventory.expirationStatus === expirationStates.expired);
    } else if (filter === 'notExpired') {
      sorted = inventories.filter(inventory => inventory.expirationStatus === expirationStates.good || inventory.expirationStatus === expirationStates.soon);
    } else {
      sorted = _.sortBy(inventories, filter);
    }
    // If something is typed in search bar, sort and filter inventory
    if (search) {
      sorted = _.sortBy(sorted.filter(inventory => medFind(inventory)), 'name');
    }
  }

  return ((ready) ? (
    <Container style={{ backgroundColor: '#88a7b3', marginTop: '-20px' }} id={PAGE_IDS.LIST_INVENTORY}>
      <Grid container centered>
        <br/><Header as="h1">Inventory</Header>
        <Grid.Row>
          <Header as="h3"><em>Medications and Medical Supplies</em></Header>
        </Grid.Row>
        <Table inverted celled style={{ backgroundColor: '#88a7b3' }}>
          <Table.Row>
            <Table.Cell width={2}>
              <Dropdown style={{ backgroundColor: '#97B9C7', color: 'white' }}
                text='Filter'
                icon='filter'
                labeled
                button
                className='icon'
              >
                <Dropdown.Menu style={{ backgroundColor: '#88a7b3' }}>
                  <Dropdown.Header icon='tags' style={{ color: 'white' }} content='Filter medicine by tag'/>
                  <Dropdown.Divider/>
                  <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'medication'>Medicines</Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown icon='chevron right' style={{ color: 'white' }} text='Medication Quantity '>
                      <Dropdown.Menu style={{ backgroundColor: '#88a7b3' }}>
                        <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'low'><Icon name={'sort numeric down'}/>Quantity (Low-High)</Dropdown.Item>
                        <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'high'><Icon name={'sort numeric up'}/>Quantity (High-Low)</Dropdown.Item>
                        <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'inventoryBad'><Icon name={'ban'}/>No Quantity</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Dropdown icon='chevron right' text='Expiration Date ' style={{ color: 'white' }}>
                      <Dropdown.Menu style={{ backgroundColor: '#88a7b3' }}>
                        <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'expired'><Icon name={'calendar times'}/>Expired</Dropdown.Item>
                        <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'notExpired'><Icon name={'calendar check'}/>Not Expired</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Table.Cell>
            <Table.Cell width={9}>
              <Input type='text' size='large' placeholder='Search by name...' icon='search' fluid
                onChange={handleSearch}/>
            </Table.Cell>
            <Table.Cell width={3}>
              <Link id={COMPONENT_IDS.LIST_INVENTORY_DISPENSE} to={'/report'}>
                <Button icon color='yellow' labelPosition='left' ><Icon name='warning'/>Generate Report</Button>
              </Link>
            </Table.Cell>
            <Table.Cell width={6}>
              <Modal
                onClose={() => setFirstOpen(false)}
                onOpen={() => setFirstOpen(true)}
                open={firstOpen}
                closeOnDimmerClick={false}
                size={'tiny'}
                trigger={<Button icon color='white' inverted labelPosition='left'><Icon name='pills'/>Multi-Dispense</Button>}
              >
                <Header size={'small'} style={{ backgroundColor: '#b86d4e', color: 'whitesmoke' }} as="h1" textAlign="center">SELECT ITEMS TO DISPENSE</Header>
                <Modal.Content scrolling style={{ backgroundColor: '#EEE7DA' }}>
                  <List>
                    {sorted.map((inventory) => <List.Item key={inventory._id}>
                      <Checkbox label={inventory.name} onChange={takeValue}/>
                    </List.Item>)}
                  </List>
                </Modal.Content>
                <Modal.Actions style={{ backgroundColor: '#b86d4e' }}>
                  <Button content='Cancel' icon={'x'} color='red' onClick={cancelButton}/>
                  <Button
                    content="Multi Dispense"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={submitButton}
                    positive
                  />
                </Modal.Actions>

                <Modal
                  onClose={() => setSecondOpen(false)}
                  closeOnDimmerClick={false}
                  open={secondOpen}
                  size='medium'
                >
                  <Header style={{ backgroundColor: '#b86d4e', color: 'whitesmoke' }} as="h5" textAlign="center">SCROLL DOWN TO SEE ALL THE MEDICATIONS<Icon name={'arrow circle down'}/></Header>
                  <Modal.Content style={{ backgroundColor: '#EEE7DA' }}>
                    {dispense.map((toBeDispense) => <DispenseComponent key={toBeDispense} dispense={toBeDispense} inventories={inventories}/>)}
                  </Modal.Content>
                  <Modal.Actions style={{ backgroundColor: '#b86d4e' }}>
                    <Button content='Cancel' icon='x' color='red' onClick={cancelButton}>
                    </Button>
                  </Modal.Actions>
                </Modal>
              </Modal>
            </Table.Cell>
          </Table.Row>
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
            <Table.HeaderCell>Lot Number</Table.HeaderCell>
            <Table.HeaderCell>Expiration Date</Table.HeaderCell>
            <Table.HeaderCell>Edit/Delete</Table.HeaderCell>
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
