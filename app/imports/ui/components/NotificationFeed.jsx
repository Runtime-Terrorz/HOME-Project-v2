import { withRouter } from 'react-router-dom';
import { Feed, Container } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';

const NotificationFeed = ({ inventory }) => (
  <Feed>
    <Feed.Event>
      <Feed.Content>
        <Feed.Date content='1 day ago'/>
        <Feed.Summary>
            Running Low on <a>{inventory.name}</a> with lot # {inventory.lot}.
        </Feed.Summary>
      </Feed.Content>
    </Feed.Event>
  </Feed>
);

NotificationFeed.propTypes = {
  inventory: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    lot: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default withRouter(NotificationFeed);