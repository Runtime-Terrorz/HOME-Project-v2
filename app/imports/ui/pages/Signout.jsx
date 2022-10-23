import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Grid, Header, Image } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';

/** After the user clicks the "Signout" link in the NavBar, log them out and display this page. */
const Signout = () => {
  Meteor.logout();
  return (
    <Container className="signout-page">
      <Grid.Column width={6}>
        <Image centered width={'320px'} src="/images/logo.png"/>
        <Header id={PAGE_IDS.SIGN_OUT} as="h2" textAlign="center">
          <em>
            <p>You are signed out.
              <p>We hope to see you again!</p></p>
          </em>
        </Header>
      </Grid.Column>
    </Container>
  );
};

export default Signout;
