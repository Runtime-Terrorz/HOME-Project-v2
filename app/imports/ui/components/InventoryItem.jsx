import React from 'react';
import { Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import { Inventories, quantityStates, expirationStates } from '../../api/inventory/InventoryCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const InventoryItem = ({ inventory }) => {
  let quantity;
  let expiration;
  const expirationStatus = Inventories.checkExpirationStatus(inventory.expiration);
  const quantityStatus = Inventories.checkQuantityStatus(inventory.quantity, inventory.threshold);
  const collectionName = Inventories.getCollectionName();
  const updateData = { id: inventory._id, expirationStatus, quantityStatus };
  updateMethod.callPromise({ collectionName, updateData });

  if (inventory.quantityStatus === quantityStates.bad) {
    quantity = <Table.Cell style={ { backgroundColor: '#D64242', color: '#FFFFFF' } }>{inventory.quantity}</Table.Cell>;
  } else if (inventory.quantityStatus === quantityStates.ok) {
    quantity = <Table.Cell style={{ backgroundColor: '#D0BE4E' }}>{inventory.quantity}</Table.Cell>;
  } else {
    quantity = <Table.Cell>{inventory.quantity}</Table.Cell>;
  }
  if (inventory.expirationStatus === expirationStates.expired) {
    expiration = <Table.Cell style={ { backgroundColor: '#D64242', color: '#FFFFFF' } }>{inventory.expiration.toLocaleDateString()}</Table.Cell>;
  } else if (inventory.expirationStatus === expirationStates.soon) {
    expiration = <Table.Cell style={{ backgroundColor: '#D0BE4E' }}>{inventory.expiration.toLocaleDateString()}</Table.Cell>;
  } else {
    expiration = <Table.Cell>{inventory.expiration.toLocaleDateString()}</Table.Cell>;
  }

  return (
    <Table.Row>
      <Table.Cell>{inventory.medication}</Table.Cell>
      <Table.Cell>{inventory.name}</Table.Cell>
      <Table.Cell>{inventory.unit}</Table.Cell>
      <Table.Cell>{inventory.threshold}</Table.Cell>
      {quantity}
      <Table.Cell>{inventory.location}</Table.Cell>
      <Table.Cell>{inventory.lot}</Table.Cell>
      {expiration}
      <Table.Cell style={{ backgroundColor: '#97B9C7' }}>
        <Link id={COMPONENT_IDS.LIST_INVENTORY_EDIT} to={`/edit/${inventory._id}`}>
          <Icon style={{ marginLeft: '30px' }} inverted name='edit outline'/>
        </Link>
      </Table.Cell>
      <Table.Cell style={{ backgroundColor: '#97B9C7' }}>
        <Link id={COMPONENT_IDS.LIST_INVENTORY_DISPENSE} to={`/dispense/${inventory._id}`}>
          <Icon style={{ marginLeft: '20px' }} inverted name='recycle'/>
        </Link>
      </Table.Cell>
    </Table.Row>);
};

/** Require a document to be passed to this component. */
InventoryItem.propTypes = {
  inventory: PropTypes.shape({
    medication: PropTypes.string,
    name: PropTypes.string,
    unit: PropTypes.string,
    threshold: PropTypes.number,
    quantity: PropTypes.number,
    location: PropTypes.string,
    lot: PropTypes.string,
    expiration: PropTypes.instanceOf(Date),
    quantityStatus: PropTypes.string,
    expirationStatus: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(InventoryItem);
