import { withRouter } from 'react-router-dom';
import { Card, Icon } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';

const NotificationFeed = ({ inventory }) => ((inventory.status === 'ok') ? (
  <Card style={{ backgroundColor: '#eee7da' }}>
    <Card.Content>
      <Icon color='yellow' name='warning sign'/>
      <p className='text'>Running Low on <a>{inventory.name}</a> with lot # {inventory.lot}.</p>
    </Card.Content>
  </Card>
) : <Card>
  <Card.Content style={{ backgroundColor: '#eee7da' }}>
    <Icon color='red' name='warning sign'/>
    <p className='text'>Out of stock on <a>{inventory.name}</a> with lot # {inventory.lot}.</p>
  </Card.Content>
</Card>);
NotificationFeed.propTypes = {
  inventory: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    threshold: PropTypes.number,
    lot: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default withRouter(NotificationFeed);
