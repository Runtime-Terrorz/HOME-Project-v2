import { Meteor } from 'meteor/meteor';
import { Stuffs } from '../../api/stuff/StuffCollection';
import { Inventories } from '../../api/inventory/InventoryCollection';
/* eslint-disable no-console */

function addInventoryData(data) {
  console.log(`  Adding: ${data.medication} (${data.owner})`);
  Inventories.define(data);
}

function addData(data) {
  console.log(`  Adding: ${data.name} (${data.owner})`);
  Stuffs.define(data);
}

// Initialize the StuffsCollection if empty.
if (Stuffs.count() === 0) {
  if (Meteor.settings.defaultData) {
    console.log('Creating default data.');
    Meteor.settings.defaultData.map(data => addData(data));
  }
}

/** Initialize the collection if empty. */
if (Inventories.count() === 0) {
  if (Meteor.settings.defaultInventory) {
    console.log('Creating default data for inventory.');
    Meteor.settings.defaultInventory.map(data => addInventoryData(data));
  }
}