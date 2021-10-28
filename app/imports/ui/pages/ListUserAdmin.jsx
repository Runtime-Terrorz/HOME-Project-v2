import React from 'react';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import UserItemAdmin from '../components/UserItemAdmin';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the User and Admin profiles. Use <UserItemAdmin> to render each row. */
const ListUserAdmin = ({ admins, users, ready }) => ((ready) ? (
  <Container id={PAGE_IDS.LIST_STUFF_ADMIN}>
    <Header as="h2" textAlign="center">List Profiles</Header>
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>FirstName</Table.HeaderCell>
          <Table.HeaderCell>LastName</Table.HeaderCell>
          <Table.HeaderCell>Email</Table.HeaderCell>
          <Table.HeaderCell>Role</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {admins.map((user) => <UserItemAdmin key={user._id} user={user} />)}
        {users.map((user) => <UserItemAdmin key={user._id} user={user} />)}
      </Table.Body>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of User Admin profiles in the props.
ListUserAdmin.propTypes = {
  admins: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  // Get access to User and Admin profiles.
  const subscriptionUser = UserProfiles.subscribeUserProfileAdmin();
  const subscriptionAdmin = AdminProfiles.subscribeAdminProfileAdmin();
  // Determine if the subscription is ready
  const ready = subscriptionUser.ready() && subscriptionAdmin.ready();
  // Get the User and Admin profiles and sort by owner then name
  const admins = AdminProfiles.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  const users = UserProfiles.find({}, { sort: { owner: 1, name: 1 } }).fetch();
  return {
    admins,
    users,
    ready,
  };
})(ListUserAdmin);
