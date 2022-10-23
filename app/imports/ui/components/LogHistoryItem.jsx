import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { expirationStates } from '../../api/inventory/InventoryCollection';

/** Renders a single row in the LogHistory table. See pages/LogHistory.jsx. */
const LogHistoryItem = ({ audit }) => {
  let expiration;

  if (audit.expirationStatus === expirationStates.expired) {
    expiration = <Table.Cell style={ { backgroundColor: '#D64242', color: '#FFFFFF' } }>{audit.expirationDate.toLocaleDateString()}</Table.Cell>;
  } else if (audit.expirationStatus === expirationStates.soon) {
    expiration = <Table.Cell style={{ backgroundColor: '#D0BE4E' }}>{audit.expirationDate.toLocaleDateString()}</Table.Cell>;
  } else {
    expiration = <Table.Cell>{audit.expirationDate.toLocaleDateString()}</Table.Cell>;
  }

  return (
    <Table.Row>
      <Table.Cell style={{ backgroundColor: '#c77c5b' }}>{audit.owner}</Table.Cell>
      <Table.Cell>{audit.dateChanged.toLocaleDateString()}</Table.Cell>
      <Table.Cell>{audit.patientID}</Table.Cell>
      <Table.Cell>{audit.dispenseLocation}</Table.Cell>
      <Table.Cell>{audit.medication}</Table.Cell>
      <Table.Cell>{audit.name}</Table.Cell>
      <Table.Cell>{audit.quantityChanged}</Table.Cell>
      <Table.Cell>{audit.lot}</Table.Cell>
      {expiration}
      <Table.Cell>{audit.changeNotes}</Table.Cell>
    </Table.Row>);
};

/** Require a document to be passed to this component. */
LogHistoryItem.propTypes = {
  audit: PropTypes.shape({
    owner: PropTypes.string,
    medication: PropTypes.string,
    patientID: PropTypes.string,
    dispenseLocation: PropTypes.string,
    name: PropTypes.string,
    lot: PropTypes.string,
    quantityChanged: PropTypes.number,
    dateChanged: PropTypes.instanceOf(Date),
    expirationDate: PropTypes.instanceOf(Date),
    expirationStatus: PropTypes.string,
    changeNotes: PropTypes.string,
    isDispenseChanged: PropTypes.bool,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(LogHistoryItem);
