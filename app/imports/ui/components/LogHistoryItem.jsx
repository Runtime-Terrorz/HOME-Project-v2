import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

/** Renders a single row in the LogHistory table. See pages/ListStuff.jsx. */
const LogHistoryItem = ({ audit }) => (
  <Table.Row>
    <Table.Cell style={{ backgroundColor: '#97B9C7' }}>{audit.owner}</Table.Cell>
    <Table.Cell>{audit.patientID}</Table.Cell>
    <Table.Cell>{audit.dispenseLocation}</Table.Cell>
    <Table.Cell>{audit.medication}</Table.Cell>
    <Table.Cell>{audit.name}</Table.Cell>
    <Table.Cell>{audit.quantityChanged}</Table.Cell>
    <Table.Cell>{audit.lot}</Table.Cell>
    <Table.Cell>{audit.dateChanged.toLocaleDateString()}</Table.Cell>
  </Table.Row>
);

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
    changeNotes: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(LogHistoryItem);
