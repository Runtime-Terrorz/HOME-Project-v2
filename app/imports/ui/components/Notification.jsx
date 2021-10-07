import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Dropdown, Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import NotificationFeed from './NotificationFeed';

const Notification = ({ lowInventory }) => (
  <Dropdown id={COMPONENT_IDS.NAVBAR_NOTIFICATION} key='notification' icon={'mail'} pointing="top left">
    <Dropdown.Menu>
      <Card>
        <Card.Content>
          <Card.Header>Notifications</Card.Header>
          <Link to={'/bad'}>
            <Button color='red' id={COMPONENT_IDS.GENERATE_REPORT_BUTTON}>Generate Report</Button>
          </Link>
        </Card.Content>
        <Card.Content className='notitem'>
          {lowInventory.map((inventory) => <NotificationFeed key={inventory._id} inventory={inventory}/>)}
        </Card.Content>
      </Card>
    </Dropdown.Menu>
  </Dropdown>
);

Notification.propTypes = {
  lowInventory: PropTypes.array,
};

const NotificationContainer = withTracker(() => {
  // Get access to Stuff documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Stuff documents and sort them by name.
  const lowInventory = Inventories.find({ status: 'bad' }).fetch().reverse();

  return {
    ready,
    lowInventory,
  };
})(Notification);

export default withRouter(NotificationContainer);
