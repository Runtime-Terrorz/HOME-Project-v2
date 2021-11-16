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

export const medUnits = ['N/A', 'ml', 'l', 'mg', 'g', 'each', 'capsule', 'tablet'];

export const inventoryPublications = {
  inventory: 'Inventory',
};
export const quantityStates = { good: 'good', ok: 'ok', bad: 'bad' };
export const expirationStates = { good: 'good', soon: 'soon', expired: 'expired' };

class InventoryCollection extends BaseCollection {
  constructor() {
    super('Inventories', new SimpleSchema({
      medication: {
        type: String,
        allowedValues: inventoryMedications,
        defaultValue: 'Allergy & Cold Medicines',
      },
      name: String,
      unit: {
        type: String,
        optional: true,
        allowedValues: medUnits,
        defaultValue: 'N/A',
      },
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
      quantityStatus: String,
      expirationStatus: String,
      note: String,
    }));
  }

  /**
   * Defines a new Inventory item.
   * @param medication the classification of medicine.
   * @param name the name of the item.
   * @param unit of the medication.
   * @param location the location of the item.
   * @param threshold the number of items that is recommended to have in stock.
   * @param quantity the number of items.
   * @param lot the lot number of the item.
   * @param expiration expiration date of the item.
   * @param owner owner of the inventory item
   * @param status determine whether the item is low in stock
   * @param note any note about the medicine
   * @return {String} the docID of the new document.
   */
  define({ medication, name, unit, location, threshold, quantity, lot, expiration, owner, quantityStatus, expirationStatus, note }) {
    const docID = this._collection.insert({
      medication,
      name,
      unit,
      location,
      threshold,
      quantity,
      lot,
      expiration,
      owner,
      quantityStatus,
      expirationStatus,
      note,
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
   * @param note any note about the medicine
   */
  update(docID, { name, unit, location, threshold, quantity, expiration, quantityStatus, expirationStatus, note }) {
    const updateData = {};
    if (name) {
      updateData.name = name;
    }
    if (unit) {
      updateData.unit = unit;
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
    if (quantityStatus) {
      updateData.quantityStatus = quantityStatus;
    }
    if (expirationStatus) {
      updateData.expirationStatus = expirationStatus;
    }
    if (note) {
      updateData.note = note;
    }
    this._collection.update(docID, { $set: updateData });
  }

  /**
   * Compares the quantity vs the threshold and determines status
   * @param quantity the amount of the inventory left
   * @param threshold the amount that will determine that status
   * @return the quantity status of the item
   */
  checkQuantityStatus(quantity, threshold) {
    let quantityStatus;
    if (quantity <= 0) {
      quantityStatus = quantityStates.bad;
    } else if (quantity <= threshold && quantity > 0) {
      quantityStatus = quantityStates.ok;
    } else {
      quantityStatus = quantityStates.good;
    }
    return quantityStatus;
  }

  /**
   * Compares the current date vs the expiration date and determines status
   * @param expiration the expiration date that the medicine expires
   * @return the expiration status of the item
   */
  checkExpirationStatus(expiration) {
    const today = new Date();
    const days = expiration - today;
    const offset = (24 * 60 * 60 * 1000) * 7;
    let expiredStatus;
    if (days <= 0) {
      expiredStatus = expirationStates.expired;
    } else if (days <= offset && days > 0) {
      expiredStatus = expirationStates.soon;
    } else {
      expiredStatus = expirationStates.good;
    }
    return expiredStatus;
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
   * It publishes the entire collection for all users to see
   */

  publish() {
    if (Meteor.isServer) {
      // get the InventoryCollection instance.
      const instance = this;
      /** This subscription publishes documents associated with all users */
      Meteor.publish(inventoryPublications.inventory, function publish() {
        if (this.userId) {
          // Find Users that have SUPER or USER as role as properties and push into array
          const user = Meteor.users.find({}, { role: { $in: [ROLE.USER, ROLE.SUPER] } }).fetch();
          const userArr = [];
          user.forEach(obj => userArr.push(obj.username));
          return instance._collection.find({ owner: { $in: userArr } });
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
    this.assertRole(userId, [ROLE.SUPER, ROLE.ADMIN, ROLE.USER]);
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
    const unit = doc.unit;
    const threshold = doc.threshold;
    const quantity = doc.quantity;
    const lot = doc.lot;
    const expiration = doc.expiration;
    const owner = doc.owner;
    const status = doc.status;
    const note = doc.note;
    return { medication, name, unit, threshold, quantity, lot, expiration, owner, status, note };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const Inventories = new InventoryCollection();
