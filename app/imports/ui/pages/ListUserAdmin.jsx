import React from 'react';
import { Container, Table, Header, Loader, Icon, Grid } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import UserItemAdmin from '../components/UserItemAdmin';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table containing all of the User and Admin profiles. Use <UserItemAdmin> to render each row. */
const ListUserAdmin = ({ admins, users, ready }) => ((ready) ? (
  <Container className="listUserAdmin" id={PAGE_IDS.LIST_STUFF_ADMIN}>
    <Table inverted style={{ backgroundColor: '#b86d4e' }}>
      <Table.Header>
        <Table.Cell>
          <Table.Row>
            <Header as="h1" textAlign="center">Manage Accounts</Header>
          </Table.Row>
        </Table.Cell>
        <Table.Row>
          <Table.HeaderCell>First Name</Table.HeaderCell>
          <Table.HeaderCell width={3}>Last Name</Table.HeaderCell>
          <Table.HeaderCell><Icon name={'mail outline'}/> Email</Table.HeaderCell>
          <Table.HeaderCell><Icon name={'key'}/> Role</Table.HeaderCell>
          <Table.HeaderCell><Icon name={'trash alternate'}/> Remove Account</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {admins.map((user) => <UserItemAdmin key={user._id} user={user} />)}
        {users.map((user) => <UserItemAdmin key={user._id} user={user} />)}
      </Table.Body>
      <Table.Row>
        <Table.Cell width={5}>
          <Header as="h5"><em>The ADMIN role allows users to manage accounts.</em></Header>
        </Table.Cell>
      </Table.Row>
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
  const subscriptionUser = UserProfiles.subscribeUserProfile();
  const subscriptionAdmin = AdminProfiles.subscribeAdminProfile();
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
