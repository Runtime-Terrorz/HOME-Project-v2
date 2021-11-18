import React from 'react';
import { Button, Dropdown, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';

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
];

/** Renders a single row in the List User (Admin) table. See pages/ListUserAdmin.jsx. */
const UserItemAdmin = ({ user }) => {
  const handleOnChange = (e, data) => {
    if (data.value === ROLE.ADMIN) {
      const email = user.email;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const collectionName = AdminProfiles.getCollectionName();
      const oldCollectionName = UserProfiles.getCollectionName();
      const definitionData = { email, firstName, lastName };
      removeItMethod.callPromise({ collectionName: oldCollectionName, instance: user._id })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Removed',
          });
        });
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Updated',
          });
        });
    } else if (data.value === ROLE.USER) {
      const email = user.email;
      const firstName = user.firstName;
      const lastName = user.lastName;
      const collectionName = UserProfiles.getCollectionName();
      const oldCollectionName = AdminProfiles.getCollectionName();
      const definitionData = { email, firstName, lastName };
      removeItMethod.callPromise({ collectionName: oldCollectionName, instance: user._id })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Removed',
          });
        });
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Updated',
          });
        });
    }
  };

  const handleOnClick = () => {
    const collectionName = UserProfiles.getCollectionNameForProfile(user);
    removeItMethod.callPromise({ collectionName: collectionName, instance: user._id })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => swal('Success', 'User Removed', 'success'));
  };
  return (
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
      <Table.Cell>
        <Button color={'red'} onClick={handleOnClick} icon fluid><Icon name={'remove circle'}/></Button>
      </Table.Cell>
    </Table.Row>
  );
};

// Require a document to be passed to this component.
UserItemAdmin.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
  ready: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  // Get access to User and Admin profiles.
  const subscriptionUser = UserProfiles.subscribeUserProfile();
  const subscriptionAdmin = AdminProfiles.subscribeAdminProfile();
  // Determine if the subscription is ready
  const ready = subscriptionUser.ready() && subscriptionAdmin.ready();
  return {
    ready,
  };
})(UserItemAdmin);
