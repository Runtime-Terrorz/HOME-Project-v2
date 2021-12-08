import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import { Button, Container, Divider, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
const Signin = ({ location }) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [redirectToReferer, setRedirectToReferer] = useState(false);

  // Update the form controls each time the user interacts with them.
  const handleChange = (e, { name, value }) => {
    switch (name) {
    case 'email':
      setEmail(value);
      break;
    case 'password':
      setPassword(value);
      break;
    default:
      // do nothing.
    }
  };

  // Handle Signin submission using Meteor's account mechanism.
  const submit = () => {
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  // Render the signin form.
  const { from } = location.state || { from: { pathname: '/' } };
  // if correct authentication, redirect to page instead of login screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }
  // Otherwise return the Login form.
  return (
    <Container id={PAGE_IDS.SIGN_IN} className="login-page">
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column width={6} style={{ backgroundColor: '#b86d4e' }}>
          <Segment stacked inverted style={{ backgroundColor: '#b86d4e' }}>
            <Header inverted as="h2" textAlign="center">
              <p>Sign In to Your Account</p>
            </Header>
            <Form inverted onSubmit={submit}>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.SIGN_IN_FORM_EMAIL}
                icon="user"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.SIGN_IN_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Grid>
                <Grid.Column textAlign="center">
                  <Form.Button id={COMPONENT_IDS.SIGN_IN_FORM_SUBMIT} content="Sign In" color='blue' icon='sign in' style={{ marginLeft: 'auto', marginRight: 'auto' }} />
                </Grid.Column>
              </Grid>
            </Form>
            {error === '' ? (
              ''
            ) : (
              <Message
                error
                header="Login was not successful"
                content={error}
              />
            )}
            <Divider inverted horizontal>OR</Divider>
            <Header textAlign='center' as='h3'>Don&apos;t have an account?</Header>
            <Grid>
              <Grid.Column textAlign="center">
                <Link to="/signup">
                  <Button content="Sign Up" color='blue' icon='signup' style={{ marginLeft: 'auto', marginRight: 'auto' }} />
                </Link>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

// Ensure that the React Router location object is available in case we need to redirect.
Signin.propTypes = {
  location: PropTypes.object,
};

export default Signin;
