import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <Container className="signout-page">
      <Header id={PAGE_IDS.SIGN_OUT} as="h1" textAlign="center" style={{ marginBottom: '500px' }} >
        You are signed out.
        We hope to see you again!
      </Header>
    </Container>
  );
};

export default Signout;
