import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import swal from 'sweetalert';
import { Card, Dropdown, Button, Icon } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { expirationStates, Inventories, quantityStates } from '../../api/inventory/InventoryCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import NotificationFeed from './NotificationFeed';
import { removeMultipleMethod } from '../../api/base/BaseCollection.methods';

const Notification = ({ lowInventory }) => {
  const badId = [];
  const collectionName = Inventories.getCollectionName();
  lowInventory.forEach(obj => badId.push(obj._id));
  const handleClick = () => {
    // badId.forEach(id => removeItMethod.callPromise({ collectionName, instance: id }));
    swal({
      title: 'Are you sure you want to delete?',
      text: 'Will not be able to revert',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        removeMultipleMethod.callPromise({ collectionName, instance: badId });
        swal(
          'Deleted!',
          'Your file has been deleted.',
          'success',
        );
      } else {
        swal('Did not delete');
      }
    });
  };

  return (
    <Dropdown id={COMPONENT_IDS.NAVBAR_NOTIFICATION} key='notification' icon={'mail'} pointing="top right">
      <Dropdown.Menu>
        <Card>
          <Card.Content style={{ backgroundColor: '#eee7da' }}>
            <Card.Header>Notifications</Card.Header>
            <Button icon color='red' labelPosition='left' onClick={handleClick}><Icon name='trash'/>Delete</Button>
          </Card.Content>
          <Card.Content className='notificationItem'>
            {lowInventory.map((inventory) => <NotificationFeed key={inventory._id} inventory={inventory}/>)}
          </Card.Content>
        </Card>
      </Dropdown.Menu>
    </Dropdown>);
};

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
