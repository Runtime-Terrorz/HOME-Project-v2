import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { expirationStates, Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import { updateMethod } from '../../api/base/BaseCollection.methods';

/** Renders a single row in the LogHistory table. See pages/ListStuff.jsx. */
const LogHistory = ({ inventory }) => {
  let quantity;
  let expiration;
  let startDate;
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
      {startDate}
      <Table.Cell>{inventory.owner}</Table.Cell>
      <Table.Cell>{inventory.medication}</Table.Cell>
      <Table.Cell>{inventory.name}</Table.Cell>
      <Table.Cell>{inventory.unit}</Table.Cell>
      <Table.Cell>{inventory.threshold}</Table.Cell>
      {quantity}
      <Table.Cell>{inventory.location}</Table.Cell>
      <Table.Cell>{inventory.lot}</Table.Cell>
      {expiration}
    </Table.Row>);
};

/** Require a document to be passed to this component. */
LogHistory.propTypes = {
  inventory: PropTypes.shape({
    owner: PropTypes.string,
    medication: PropTypes.string,
    name: PropTypes.string,
    unit: PropTypes.string,
    threshold: PropTypes.number,
    quantity: PropTypes.number,
    location: PropTypes.string,
    lot: PropTypes.string,
    expiration: PropTypes.instanceOf(Date),
    startDate: PropTypes.instanceOf(Date),
    quantityStatus: PropTypes.string,
    expirationStatus: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(LogHistory);
