import React from 'react';
import { Container, Header, Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { AdminProfiles } from '../../api/user/AdminProfileCollection';
import { Inventories } from '../../api/inventory/InventoryCollection';
import { UserProfiles } from '../../api/user/UserProfileCollection';
import UploadFixture from '../components/UploadFixture';
import DumpDbFixture from '../components/DumpDbFixture';
import { PAGE_IDS } from '../utilities/PageIDs';

const ManageDatabase = ({ ready }) => ((ready) ? (<Container id={PAGE_IDS.MANAGE_DATABASE}>
  <Header as="h1" textAlign="center">Manage Database</Header>
  <UploadFixture />
  <DumpDbFixture />
</Container>) : <Loader active>Getting data</Loader>);

ManageDatabase.propTypes = {
  ready: PropTypes.bool,
};

export default withTracker(() => {
  const ready = AdminProfiles.subscribe().ready() && Inventories.subscribeStuffAdmin().ready() && UserProfiles.subscribe().ready();
  return {
    ready,
  };
})(ManageDatabase);
