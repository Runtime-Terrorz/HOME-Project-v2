import React from 'react';
import { Button, Dropdown, Icon, Table } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import swal from 'sweetalert';
import { withTracker } from 'meteor/react-meteor-data';
import { ROLE } from '../../api/role/Role';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { defineMethod, removeItMethod } from '../../api/base/BaseCollection.methods';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { SuperAdminProfiles } from '../../api/user/SuperAdminProfileCollection';

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
  {
    key: 'SUPER',
    text: 'SUPER',
    value: ROLE.SUPER,
  },
];

/** Renders a single row in the List User (Admin) table. See pages/ListUserAdmin.jsx. */
const UserItemAdmin = ({ user }) => {
  const email = user.email;
  const firstName = user.firstName;
  const lastName = user.lastName;
  const oldCollectionName = UserProfiles.getCollectionNameForProfile(user);
  let collectionName;
  const definitionData = { email, firstName, lastName };
  // On change, remove user from previous role and add to selected role.
  const handleOnChange = (e, data) => {
    removeItMethod.callPromise({ collectionName: oldCollectionName, instance: user._id })
      .catch(error => swal('Error', error.message, 'error'))
      .then(() => {});
    if (data.value == ROLE.ADMIN) {
      collectionName = AdminProfiles.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Updated',
          });
        });
    } else if (data.value == ROLE.USER) {
      collectionName = UserProfiles.getCollectionName();
      defineMethod.callPromise({ collectionName, definitionData })
        .catch(error => swal('Error', error.message, 'error'))
        .then(() => {
          swal({
            title: 'Success',
            text: 'Role Updated',
          });
        });
    } else if (data.value == ROLE.SUPER) {
      collectionName = SuperAdminProfiles.getCollectionName();
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
    collectionName = UserProfiles.getCollectionNameForProfile(user);
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
  const subscriptionSuper = SuperAdminProfiles.subscribeSuperAdminProfile();
  // Determine if the subscription is ready
  const ready = subscriptionUser.ready() && subscriptionAdmin.ready() && subscriptionSuper.ready();
  return {
    ready,
  };
})(UserItemAdmin);
