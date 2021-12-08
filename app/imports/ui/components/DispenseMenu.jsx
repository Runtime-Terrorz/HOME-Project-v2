import { Link, withRouter } from 'react-router-dom';
import { Dropdown } from 'semantic-ui-react';
import React from 'react';
import PropTypes from 'prop-types';
import { COMPONENT_IDS } from '../utilities/ComponentIDs';

const DispenseMenu = ({ inventory }) => (
  <Dropdown.Item>
    <Link id={COMPONENT_IDS.LIST_INVENTORY_DISPENSE} to={`/dispense/${inventory._id}`}>
      <p className='dispenseItem'>
        {inventory.lot}
      </p>
    </Link>
  </Dropdown.Item>
);

DispenseMenu.propTypes = {
  inventory: PropTypes.shape({
    name: PropTypes.string,
    quantity: PropTypes.number,
    threshold: PropTypes.number,
    lot: PropTypes.string,
    status: PropTypes.string,
    _id: PropTypes.string,
  }).isRequired,
};

export default withRouter(DispenseMenu);
