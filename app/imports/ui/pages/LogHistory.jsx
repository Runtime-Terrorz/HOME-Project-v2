import React, { useState } from 'react';
import { Container, Table, Header, Grid, Loader, Icon, Input } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import LogHistoryItem from '../components/LogHistoryItem';
import { InventoryAudit } from '../../api/InventoryAudit/InventoryAuditCollection';

/** Renders a table containing all of the past items added to the inventory table. */
const LogHistory = ({ ready, audit }) => {
  const [search, setSearch] = useState('');
  let sorted = audit;

  /** Set search state to the value that is typed in the search bar */
  const handleSearch = (e, data) => {
    e.preventDefault();
    setSearch(data.value);
  };

  const emailFind = (searchItem) => {
    const lowerCase = search.toLowerCase();
    return searchItem.owner.toLowerCase().includes(lowerCase);
  };

  if (search) {
    sorted = _.sortBy(sorted.filter(inventory => emailFind(inventory)), 'owner');
  }
  return ((ready) ? (
    <Container id={PAGE_IDS.LOG_HISTORY}>
      <Grid container column={3}>
        <Grid.Row column={2}>
          <Grid.Column>
            <Header as="h2" textAlign="center">Log History</Header>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Table inverted celled style={{ backgroundColor: '#88a7b3' }}>
        <Table.Header>
          <Table.Cell width={12}>
            <Input type='text' size='large' placeholder='Search by e-mail...' icon='search' fluid
              onChange={handleSearch}/>
          </Table.Cell>
          <Table.Row>
            <Table.HeaderCell><Icon name={'user'}/> Added By</Table.HeaderCell>
            <Table.HeaderCell>Date Changed</Table.HeaderCell>
            <Table.HeaderCell>PatientID</Table.HeaderCell>
            <Table.HeaderCell>Dispense Location</Table.HeaderCell>
            <Table.HeaderCell>Medication</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Quantity Added/Changed</Table.HeaderCell>
            <Table.HeaderCell>Lot Number</Table.HeaderCell>
            <Table.HeaderCell>Expiration Date</Table.HeaderCell>
            <Table.HeaderCell>Notes</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {sorted.map((audits) => <LogHistoryItem key={audits._id} audit={audits}/>)}
        </Table.Body>
      </Table>
    </Container>
  ) : <Loader active>Getting data</Loader>);
};
/** Require an array of Inventory documents in the props. */
LogHistory.propTypes = {
  audit: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to aduit documents.
  const subscription = InventoryAudit.subscribeInventoryAdmin();
  // Determine if the subscription is ready
  const ready = subscription.ready();
  // Get the audit documents and sort them by name.
  const audit = InventoryAudit.getLogs();
  return {
    audit,
    ready,
  };
})(LogHistory);
