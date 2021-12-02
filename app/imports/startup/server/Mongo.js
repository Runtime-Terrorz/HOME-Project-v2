import { Meteor } from 'meteor/meteor';
import { Inventories } from '../../api/inventory/InventoryCollection';
/* eslint-disable no-console */

function addInventoryData(data) {
  console.log(`  Adding: ${data.medication} (${data.owner})`);
  Inventories.define(data);
}
/** Initialize the collection if empty. */
if (Inventories.count() === 0) {
  if (Meteor.settings.defaultInventory) {
    console.log('Creating default data for inventory.');
    Meteor.settings.defaultInventory.map(data => addInventoryData(data));
  }
}
