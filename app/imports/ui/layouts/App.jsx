import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Landing from '../pages/Landing';
import Inventory from '../pages/Inventory';
import AddInventory from '../pages/AddInventory';
import EditInventory from '../pages/EditInventory';
import DispenseInventory from '../pages/DispenseInventory';
import BadInventory from '../pages/BadInventory';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Signup from '../pages/Signup';
import Signout from '../pages/Signout';
import ManageDatabase from '../pages/ManageDatabase';
import LogHistory from '../pages/LogHistory';
import { ROLE } from '../../api/role/Role';
import ListUserAdmin from '../pages/ListUserAdmin';
import SideBar from "../components/SideBar";

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDesktop: false,
    };
    this.updatePredicate = this.updatePredicate.bind(this);
  }

  componentDidMount() {
    this.updatePredicate();
    window.addEventListener('resize', this.updatePredicate);
  }

  componentWillMount() {
    window.removeEventListener('resize', this.updatePredicate);
  }

  updatePredicate() {
    this.setState({ isDesktop: window.innerWidth > 900 });
  }

  render() {
    const isDesktop = this.state.isDesktop;
    const routes = () => (
      <Switch>
        <Route exact path="/" component={Landing}/>
        <Route path="/signin" component={Signin}/>
        <Route path="/signup" component={Signup}/>
        <Route path="/signout" component={Signout}/>
        <ProtectedRoute path="/list" component={Inventory}/>
        <ProtectedRoute path="/edit/:_id" component={EditInventory}/>
        <ProtectedRoute path="/dispense/:_id/:lot" component={DispenseInventory}/>
        <ProtectedRoute path="/bad" component={BadInventory}/>
        <ProtectedRoute path="/add" component={AddInventory}/>
        <AdminProtectedRoute path="/log" component={LogHistory}/>
        <AdminProtectedRoute path="/manage-database" component={ManageDatabase}/>
        <AdminProtectedRoute path="/admin" component={ListUserAdmin}/>
        <Route component={NotFound}/>
      </Switch>
    );
    return (
      <Router>
        <div>
          {isDesktop ? (
            <div>
              <NavBar/>
              {routes()}
              <Footer/>
            </div>
          ) : (
            <div>
              <SideBar/>
              {routes()}
              <Footer/>
            </div>
          )}
        </div>
      </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and user/super role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isUserOrSuper = Roles.userIsInRole(Meteor.userId(), [ROLE.USER, ROLE.SUPER]);
      return (isLogged && isUserOrSuper) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin/super role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      const isAdminOrSuper = Roles.userIsInRole(Meteor.userId(), [ROLE.ADMIN, ROLE.SUPER]);
      return (isLogged && isAdminOrSuper) ?
        (<Component {...props} />) :
        (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
        );
    }}
  />
);

// Require a component and location to be passed to each ProtectedRoute.
ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

// Require a component and location to be passed to each AdminProtectedRoute.
AdminProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
  location: PropTypes.object,
};

export default App;
