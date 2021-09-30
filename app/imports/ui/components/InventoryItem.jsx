import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
const InventoryItem = ({ inventory }) => (
  <Table.Row>
    <Table.Cell>{inventory.medication}</Table.Cell>
    <Table.Cell>{inventory.name}</Table.Cell>
    <Table.Cell>{inventory.threshold}</Table.Cell>
    <Table.Cell>{inventory.quantity}</Table.Cell>
    <Table.Cell>{inventory.location}</Table.Cell>
    <Table.Cell>{inventory.lot}</Table.Cell>
    <Table.Cell>{inventory.expiration}</Table.Cell>
  </Table.Row>
);

/** Require a document to be passed to this component. */
InventoryItem.propTypes = {
  inventory: PropTypes.shape({
    medication: PropTypes.string,
    name: PropTypes.string,
    threshold: PropTypes.number,
    quantity: PropTypes.number,
    location: PropTypes.string,
    lot: PropTypes.string,
    expiration: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(InventoryItem);
