import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Table, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { PAGE_IDS } from '../utilities/PageIDs';

/** Renders a table of the current user's name and role. */
const UserProfile = ({ currentUser, ready }) => ((ready) ? (
  <Container className="UserProfile" id={PAGE_IDS.USER_PROFILE}>
    <Table inverted style={{ backgroundColor: '#b86d4e' }}>
      <Table.Header>
        <Table.Row>
          <Header as="h1" textAlign='center'>firstName{currentUser.firstName} lastName{currentUser.lastName}</Header>
        </Table.Row>
        <Table.Row>
          <Header as="h1" textAlign='center' sub>You Are A</Header>
          <Header size='huge' textAlign='center'>ROLE</Header>
        </Table.Row>
        <Table.Row>
          <Header as="h1" textAlign='center'>{currentUser.role}</Header>
        </Table.Row>
      </Table.Header>
    </Table>
  </Container>
) : <Loader active>Getting data</Loader>);

// Require an array of User Admin profiles in the props.
UserProfile.propTypes = {
  admins: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  currentUser: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

// withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker
export default withTracker(() => {
  const currentUser = Meteor.user() ? Meteor.user().username : '';
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
    currentUser,
  };
})(UserProfile);
