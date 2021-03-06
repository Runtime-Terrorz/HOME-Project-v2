import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, Redirect } from 'react-router-dom';
import { Button, Container, Divider, Form, Grid, Header, Message, Segment } from 'semantic-ui-react';
import { Accounts } from 'meteor/accounts-base';
import { PAGE_IDS } from '../utilities/PageIDs';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
const Signup = ({ location }) => {
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

  /* Handle Signup submission. Create user account and a profile entry, then redirect to the home page. */
  const submit = () => {
    Accounts.createUser({ email, username: email, password }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError('');
        setRedirectToReferer(true);
      }
    });
  };

  /* Display the signup form. Redirect to add page after successful registration and login. */
  const { from } = location.state || { from: { pathname: '/add' } };
  // if correct authentication, redirect to from: page instead of signup screen
  if (redirectToReferer) {
    return <Redirect to={from} />;
  }
  return (
    <Container id={PAGE_IDS.SIGN_UP} className="logup-page">
      <Grid textAlign="center" verticalAlign="middle" centered columns={2}>
        <Grid.Column width={8} style={{ backgroundColor: '#b86d4e' }}>
          <Segment padded='very' stacked inverted style={{ backgroundColor: '#b86d4e' }}>
            <Header inverted as="h3" textAlign="center">
              <p>Create a New Account</p>
            </Header>
            <Form inverted onSubmit={submit}>
              <Form.Group widths={'equal'}>
                <Form.Input
                  label="First Name"
                  icon="user"
                  iconPosition="left"
                  name="firstName"
                  type="name"
                  placeholder="First Name"
                  onChange={handleChange}
                />
                <Form.Input
                  label="Last Name"
                  icon="user"
                  iconPosition="left"
                  name="lastName"
                  type="name"
                  placeholder="First Name"
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Input
                label="Email"
                id={COMPONENT_IDS.SIGN_UP_FORM_EMAIL}
                icon="mail"
                iconPosition="left"
                name="email"
                type="email"
                placeholder="E-mail address"
                onChange={handleChange}
              />
              <Form.Input
                label="Password"
                id={COMPONENT_IDS.SIGN_UP_FORM_PASSWORD}
                icon="lock"
                iconPosition="left"
                name="password"
                placeholder="Password"
                type="password"
                onChange={handleChange}
              />
              <Grid>
                <Grid.Column textAlign="center">
                  <Form.Button id={COMPONENT_IDS.SIGN_UP_FORM_SUBMIT} content="Sign Up" color='blue' icon='signup'/>
                </Grid.Column>
              </Grid>
            </Form>
            {error === '' ? (
              ''
            ) : (
              <Message warning
                error
                header="Registration was not successful"
                content={error}
              />
            )}
            <Divider inverted horizontal>OR</Divider>
            <Header textAlign='center' as='h4'>Already have an account?</Header>
            <Grid>
              <Grid.Column textAlign="center">
                <Link to="/signin">
                  <Button content="Sign In" color='blue' icon='sign in'/>
                </Link>
              </Grid.Column>
            </Grid>
          </Segment>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

/* Ensure that the React Router location object is available in case we need to redirect. */
Signup.propTypes = {
  location: PropTypes.object,
};

export default Signup;
