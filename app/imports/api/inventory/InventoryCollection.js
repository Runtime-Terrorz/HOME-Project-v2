import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';

export const inventoryMedications = ['Allergy & Cold Medicines', 'Analgesics/Anti-inflammatory', 'Anti-hypertensives',
  'Anti-microbial', 'Cardiac/Cholesterol', 'Dermatological Preparations', 'Diabetes Meds', 'Ear and Eye Preparations',
  'Emergency Kit', 'GI Meds', 'GYN Meds', 'Pulmonary', 'Smoking Cessation', 'Vitamins and Supplements'];

export const medLocations = ['Case 1', 'Case 2', 'Case 3', 'Case 4', 'Case 5', 'Case 6', 'Case 7', 'Case 8',
  'Refrigerator', 'Refrigerator Closet', 'Freezer', 'Freezer-Derm', 'Drawer 2-2', 'Drawer 2-3', 'Emergency Kit'];

export const inventoryPublications = {
  inventory: 'Inventory',
};
export const inventoryStates = { good: 'good', ok: 'ok', bad: 'bad' };

class InventoryCollection extends BaseCollection {
  constructor() {
    super('Inventories', new SimpleSchema({
      medication: {
        type: String,
        allowedValues: inventoryMedications,
        defaultValue: 'Allergy & Cold Medicines',
      },
      name: String,
      location: {
        type: String,
        allowedValues: medLocations,
        defaultValue: 'Case 1',
      },
      threshold: Number,
      quantity: Number,
      lot: String,
      expiration: Date,
      owner: String,
      status: {
        type: String,
        allowedValues: inventoryStates,
        defaultValue: 'good',
      },
    }));
  }

  /**
   * Defines a new Inventory item.
   * @param medication the classification of medicine.
   * @param name the name of the item.
   * @param location the location of the item.
   * @param threshold the number of items that is recommended to have in stock.
   * @param quantity the number of items.
   * @param lot the lot number of the item.
   * @param expiration expiration date of the item.
   * @param owner owner of the inventory item
   * @param status determine whether the item is low in stock
   * @return {String} the docID of the new document.
   */
  define({ medication, name, location, threshold, quantity, lot, expiration, owner, status }) {
    const docID = this._collection.insert({
      medication,
      name,
      location,
      threshold,
      quantity,
      lot,
      expiration,
      owner,
      status,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param name the name of the item.
   * @param location the location of the item.
   * @param threshold the number of items that is recommended to have in stock.
   * @param quantity the number of items.
   * @param expiration expiration date of the item.
   * @param status current state of the item to update
   */
  update(docID, { name, location, threshold, quantity, expiration, status }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (location) {
      updateData.location = location;
    }
    if (_.isNumber(threshold)) {
      updateData.threshold = threshold;
    }
    // if (quantity) { NOTE: 0 is falsy so we need to check if the quantity is a number.
    if (_.isNumber(quantity)) {
      updateData.quantity = quantity;
    }
    if (expiration) {
      updateData.expiration = expiration;
    }
    if (status) {
      updateData.status = status;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Compares the quantity vs the threshold and determines status
   * @param quantity the amount of the inventory left
   * @param threshold the amount that will determine that status
   * @return the status of the item
   */
  checkStatus(quantity, threshold) {
    let status;
    // if quantity is less than or equal to 0
    if (quantity <= 0) {
      // status is set to bad
      status = inventoryStates.bad;
      // if quantity is greater than zero, but less than or equal to thresh hold
    } else if (quantity <= threshold && quantity > 0) {
      // set status to ok
      status = inventoryStates.ok;
    } else {
      // if quantity is greater than threshold
      // set status to good
      status = inventoryStates.good;
    }
    return status;
  }

  /**
   * A stricter form of remove that throws an error if the document or docID could not be found in this collection.
   * @param { String | Object } name A document or docID in this collection.
   * @returns true
   */
  removeIt(name) {
    const doc = this.findDoc(name);
    check(doc, Object);
    this._collection.remove(doc._id);
    return true;
  }

  /**
   * Default publication method for entities.
   * It publishes the entire collection and just the inventory associated to an owner.
   */

  publish() {
    if (Meteor.isServer) {
      // get the InventoryCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(inventoryPublications.inventory, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
    }
  }

  /**
   * Subscription method for inventory owned by the current user.
   */
  subscribeInventory() {
    if (Meteor.isClient) {
      return Meteor.subscribe(inventoryPublications.inventory);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeInventoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(inventoryPublications.inventoryAdmin);
    }
    return null;
  }

  /**
   * Default implementation of assertValidRoleForMethod. Asserts that userId is logged in as an Admin or User.
   * This is used in the define, update, and removeIt Meteor methods associated with each class.
   * @param userId The userId of the logged in user. Can be null or undefined
   * @throws { Meteor.Error } If there is no logged in user, or the user is not an Admin or User.
   */
  assertValidRoleForMethod(userId) {
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER]);
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const medication = doc.medication;
    const name = doc.name;
    const threshold = doc.threshold;
    const quantity = doc.quantity;
    const lot = doc.lot;
    const expiration = doc.expiration;
    const owner = doc.owner;
    const status = doc.status;
    return { medication, name, threshold, quantity, lot, expiration, owner, status };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Inventories = new InventoryCollection();
