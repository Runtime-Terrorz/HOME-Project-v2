import React from 'react';
import { Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';

/** Renders a single row in the List Stuff (Admin) table. See pages/ListStuffAdmin.jsx. */
const UserItemAdmin = ({ user }) => (
  <Table.Row>
    <Table.Cell>{user.firstName}</Table.Cell>
    <Table.Cell>{user.lastName}</Table.Cell>
    <Table.Cell>{user.email}</Table.Cell>
    <Table.Cell>{user.role}</Table.Cell>
  </Table.Row>
);

// Require a document to be passed to this component.
UserItemAdmin.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default UserItemAdmin;
