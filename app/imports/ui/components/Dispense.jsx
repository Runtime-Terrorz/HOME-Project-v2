import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Dropdown } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';
import DispenseMenu from './DispenseMenu';

const Dispense = ({ lot }) => (
  <Dropdown id={COMPONENT_IDS.DISPENSE} key='dispense' icons={'recycle'}>
    <Dropdown.Menu>
      {lot.map((inventory) => <DispenseMenu key={inventory._id} inventory={inventory}/>)}
    </Dropdown.Menu>
  </Dropdown>
);

Dispense.propTypes = {
  lot: PropTypes.array,
};

const DispenseContainer = withTracker(() => {
  // Get access to inventory documents.
  const subscription = Inventories.subscribeInventory();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  const inventories = Inventories.find({}, { sort: { name: 1 } }).fetch();

  return {
    ready,
    inventories,
  };
})(Dispense);

export default withRouter(DispenseContainer);
