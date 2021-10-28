import React from 'react';
import { Dropdown, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { ROLE } from '../../api/role/Role';
import swal from 'sweetalert';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod } from '../../api/base/BaseCollection.methods';

const roleOptions = [
  {
    key: 'ADMIN',
    text: 'ADMIN',
    value: ROLE.ADMIN,
  },
  {
    key: 'USER',
    text: 'USER',
    value: ROLE.USER,
  },
]

const handleOnChange = (user) => {
}

/** Renders a single row in the List User (Admin) table. See pages/ListUserAdmin.jsx. */
const UserItemAdmin = ({ user }) => (
  <Table.Row>
    <Table.Cell>{user.firstName}</Table.Cell>
    <Table.Cell>{user.lastName}</Table.Cell>
    <Table.Cell>{user.email}</Table.Cell>
    <Table.Cell>
      <Dropdown
        defaultValue={user.role}
        fluid
        selection
        options={roleOptions}
        onChange={handleOnChange}
      />
    </Table.Cell>
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
