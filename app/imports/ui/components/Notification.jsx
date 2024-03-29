import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Card, Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { expirationStates, Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import NotificationFeed from './NotificationFeed';

const Notification = ({ lowInventory }) => (
  <Dropdown id={COMPONENT_IDS.NAVBAR_NOTIFICATION} key='notification' icon={'mail'} pointing="top left">
    <Dropdown.Menu>
      <Card>
        <Card.Content style={{ backgroundColor: '#e8e8e8'}}>
          <Card.Header>Notifications</Card.Header>
        </Card.Content>
        <Card.Content className='notificationItem'>
          {lowInventory.map((inventory) => <NotificationFeed key={inventory._id} inventory={inventory}/>)}
        </Card.Content>
      </Card>
    </Dropdown.Menu>
  </Dropdown>);

Notification.propTypes = {
  lowInventory: PropTypes.array,
};

const NotificationContainer = withTracker(() => {
  // Get access to inventory documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the Inventory documents and sort them by name.
  const lowInventory = Inventories.find({ quantityStatus: { $in: [quantityStates.bad, quantityStates.ok] },
    expirationStatus: { $in: [expirationStates.expired, expirationStates.soon] } }).fetch().reverse();

  return {
    ready,
    lowInventory,
  };
})(Notification);

export default withRouter(NotificationContainer);
