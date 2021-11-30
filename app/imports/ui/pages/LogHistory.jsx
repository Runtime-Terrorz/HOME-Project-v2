import React, { useState } from 'react';
import { Container, Table, Header, Grid, Loader, Icon, Input, Dropdown } from 'semantic-ui-react';
import { _ } from 'meteor/underscore';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import { PAGE_IDS } from '../utilities/PageIDs';
import LogHistoryItem from '../components/LogHistoryItem';
import { InventoryAudit } from '../../api/InventoryAudit/InventoryAuditCollection';

/** Renders a table containing all of the past items added to the inventory table. */
const LogHistory = ({ ready, audit }) => {
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [findDate, setFindDate] = useState('');
  let sorted = audit;

  /** Set filter state to the value that is chosen in filter dropdown */
  const handleFilter = (e, data) => {
    e.preventDefault();
    setFilter(data.value);
  };

  /** Set search state to the value that is typed in the search bar */
  const handleSearch = (e, data) => {
    e.preventDefault();
    setSearch(data.value);
  };

  const handleDate = (e, data) => {
    e.preventDefault();
    setFindDate(data.value);
  };

  const emailFind = (searchItem) => {
    const lowerCase = search.toLowerCase();
    return searchItem.owner.toLowerCase().includes(lowerCase);
  };

  const changeDateFormat = (dateFormat) => {
    const saveDate = dateFormat;
    const year = saveDate.substring(0, 4);
    const month = saveDate.substring(5, 7);
    const day = saveDate.substring(8, 10);
    return `${month}/${day}/${year}`;
  };

  if (ready) {
    // Check the filter state and filter the inventory
    if (filter === 'all') {
      sorted = _.sortBy(audit, filter).reverse();
    } else if (filter === 'isAddChange') {
      sorted = audit.filter(audits => audits.isDispenseChanged === false).reverse();
    } else if (filter === 'isDispenseChange') {
      sorted = audit.filter(audits => audits.isDispenseChanged === true).reverse();
    } else sorted = _.sortBy(audit, filter).reverse();

    if (search) {
      sorted = _.sortBy(sorted.filter(inventory => emailFind(inventory)), 'owner');
    }
    if (findDate) {
      sorted = _.sortBy(sorted.filter(audits => audits.dateChanged.toLocaleDateString() === changeDateFormat(findDate)), 'dateChanged');
    }
  }
  return ((ready) ? (
    <Container style={{ backgroundColor: '#88a7b3', marginTop: '-20px' }} id={PAGE_IDS.LOG_HISTORY}>
      <Grid container centered>
        <br/><Header as="h1">Log History</Header>
        <Grid.Row>
          <Header as="h3"><em>Audit</em></Header>
        </Grid.Row>
      </Grid>
      <Table inverted celled style={{ backgroundColor: '#88a7b3' }}>
        <Table.Row>
          <Table.Cell>
            <Dropdown style={{ backgroundColor: '#97B9C7', color: 'white' }}
              text='Filter'
              icon='filter'
              labeled
              button
              className='icon'
            >
              <Dropdown.Menu style={{ backgroundColor: '#88a7b3' }}>
                <Dropdown.Header icon='tags' style={{ color: 'white' }} content='Filter medicine by tag'/>
                <Dropdown.Divider/>
                <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'all'><Icon name={'list ol'}/>List All</Dropdown.Item>
                <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'isAddChange'><Icon name={'plus square'}/>Add Change</Dropdown.Item>
                <Dropdown.Item style={{ color: 'white' }} onClick ={handleFilter} value = 'isDispenseChange'><Icon name={'minus square'}/>Dispense Change</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Table.Cell>
          <Table.Cell width={5}>
            <Input type='date' size='large' placeholder='Search by Date Changed...' icon='search' fluid
              onChange={handleDate}>
            </Input>
          </Table.Cell>
          <Table.Cell width={5}>
            <Input type='text' size='large' placeholder='Search by e-mail...' icon='search' fluid
              onChange={handleSearch}/>
          </Table.Cell>
        </Table.Row>
      </Table>
      <Table inverted celled style={{ backgroundColor: '#88a7b3' }}>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell><Icon name={'user'}/> Added By</Table.HeaderCell>
            <Table.HeaderCell>Date Changed</Table.HeaderCell>
            <Table.HeaderCell>PatientID</Table.HeaderCell>
            <Table.HeaderCell>Dispense Location</Table.HeaderCell>
            <Table.HeaderCell>Medication</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Quantity Changed</Table.HeaderCell>
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
