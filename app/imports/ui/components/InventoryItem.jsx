import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { inventoryStates } from '../../api/inventory/InventoryCollection';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const InventoryItem = ({ inventory }) => {
  let quantity;
  if (inventory.status === inventoryStates.bad) {
    quantity = <Table.Cell style={ { backgroundColor: '#D64242', color: '#FFFFFF' } }>{inventory.quantity}</Table.Cell>;
  } else if (inventory.status === inventoryStates.ok) {
    quantity = <Table.Cell style={{ backgroundColor: '#FFEF4A' }}>{inventory.quantity}</Table.Cell>;
  } else {
    quantity = <Table.Cell>{inventory.quantity}</Table.Cell>;
  }

  return (
    <Table.Row>
      <Table.Cell>{inventory.medication}</Table.Cell>
      <Table.Cell>{inventory.name}</Table.Cell>
      <Table.Cell>{inventory.threshold}</Table.Cell>
      {quantity}
      <Table.Cell>{inventory.location}</Table.Cell>
      <Table.Cell>{inventory.lot}</Table.Cell>
      <Table.Cell>{inventory.expiration.toLocaleDateString()}</Table.Cell>
      <Table.Cell>
        <Link id={COMPONENT_IDS.LIST_INVENTORY_EDIT} to={`/edit/${inventory._id}`}>
          <Icon name='edit outline'/>
        </Link>
      </Table.Cell>
      <Table.Cell>
        <Link id={COMPONENT_IDS.LIST_INVENTORY_DISPENSE} to={`/dispense/${inventory._id}/${inventory.lot}`}>
          <Icon name='recycle'/>
        </Link>
      </Table.Cell>
    </Table.Row>);
};

/** Require a document to be passed to this component. */
InventoryItem.propTypes = {
  inventory: PropTypes.shape({
    medication: PropTypes.string,
    name: PropTypes.string,
    threshold: PropTypes.number,
    quantity: PropTypes.number,
    location: PropTypes.string,
    lot: PropTypes.string,
    expiration: PropTypes.instanceOf(Date),
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(InventoryItem);
