import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import BaseCollection from '../base/BaseCollection';
import { ROLE } from '../role/Role';
import { expirationStates } from '../inventory/InventoryCollection';

export const inventoryAuditPublications = {
  audit: 'audit',
  auditAdmin: 'auditAdmin',
};

class InventoryAuditCollection extends BaseCollection {
  constructor() {
    super('InventoryAudit', new SimpleSchema({
      owner: String,
      medication: String,
      patientID: {
        type: String,
        optional: true,
        defaultValue: 'N/A',
      },
      dispenseLocation: {
        type: String,
        optional: true,
        defaultValue: 'N/A',
      },
      name: String,
      lot: String,
      quantityChanged: Number,
      dateChanged: Date,
      expirationDate: Date,
      expirationStatus: String,
      changeNotes: {
        type: String,
        optional: true,
        defaultValue: 'N/A',
      },
      isDispenseChanged: Boolean,
    }));
  }

  /**
   * Defines a new Inventory item.
   * @param owner who made the change
   * @param medication the classification of medicine.
   * @param patientID ID of the patient from dispense
   * @param dispenseLocation location of where dispense happened
   * @param name the name of the item.
   * @param lot the lot number of the item.
   * @param quantityChanged amount changed.
   * @param dateChanged the date add/edit or dispense happened
   * @param isDispenseChanged bit to disinguish between add/edit and dispense change
   * @return {String} the docID of the new document.
   */
  define({ owner, medication, patientID, dispenseLocation, name, lot, quantityChanged, dateChanged, expirationDate, expirationStatus, changeNotes, isDispenseChanged }) {
    const docID = this._collection.insert({
      owner,
      medication,
      patientID,
      dispenseLocation,
      name,
      lot,
      quantityChanged,
      dateChanged,
      expirationDate,
      expirationStatus,
      changeNotes,
      isDispenseChanged,
    });
    return docID;
  }

  /**
   * Updates the given document.
   * @param docID the id of the document to update.
   * @param owner who made the change
   * @param medication the classification of medicine.
   * @param patientID ID of the patient from dispense
   * @param dispenseLocation location of where dispense happened
   * @param name the name of the item.
   * @param lot the lot number of the item.
   * @param quantityChanged the number of items changed.
   * @param dateChanged the date add/edit or dispense happened
   */
  update(docID, { owner, medication, patientID, dispenseLocation, name, lot, quantityChanged, expirationStatus, changeNotes }) {
    const updateData = {};
    if (owner) {
      updateData.owner = owner;
    }
    if (medication) {
      updateData.medication = medication;
    }
    if (patientID) {
      updateData.patientID = patientID;
    }
    if (dispenseLocation) {
      updateData.dispenseLocation = dispenseLocation;
    }
    if (name) {
      updateData.name = name;
    }
    if (lot) {
      updateData.lot = lot;
    }
    if (changeNotes) {
      updateData.changeNotes = changeNotes;
    }
    if (expirationStatus) {
      updateData.expirationStatus = expirationStatus;
    }
    // if (quantityChanged) { NOTE: 0 is falsy so we need to check if the quantityChanged is a number.
    if (_.isNumber(quantityChanged)) {
      updateData.quantityChanged = quantityChanged;
    }
    this._collection.update(docID, { $set: updateData });
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
   * It publishes the entire collection and just the inventory associated to an owner.
   */

  publish() {
    if (Meteor.isServer) {
      // get the InventoryCollection instance.
      const instance = this;
      /** This subscription publishes only the documents associated with the logged in user */
      Meteor.publish(inventoryAuditPublications.audit, function publish() {
        if (this.userId) {
          const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find({ owner: username });
        }
        return this.ready();
      });
      Meteor.publish(inventoryAuditPublications.auditAdmin, function publish() {
        if (this.userId) {
          // const username = Meteor.users.findOne(this.userId).username;
          return instance._collection.find();
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
      return Meteor.subscribe(inventoryAuditPublications.audit);
    }
    return null;
  }

  /**
   * Subscription method for admin users.
   * It subscribes to the entire collection.
   */
  subscribeInventoryAdmin() {
    if (Meteor.isClient) {
      return Meteor.subscribe(inventoryAuditPublications.auditAdmin);
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
    this.assertRole(userId, [ROLE.ADMIN, ROLE.USER, ROLE.SUPER]);
  }

  /**
  * Gets all records from the collection
  */
  getLogs() {
    return this._collection.find({}, {}).fetch();
  }

  /**
   * Returns an object representing the definition of docID in a format appropriate to the restoreOne or define function.
   * @param docID
   * @return {{owner: (*|number), condition: *, quantity: *, name}}
   */
  dumpOne(docID) {
    const doc = this.findDoc(docID);
    const owner = doc.owner;
    const medication = doc.medication;
    const patientID = doc.patientID;
    const dispenseLocation = doc.dispenseLocation;
    const name = doc.name;
    const lot = doc.lot;
    const quantityChanged = doc.quantityChanged;
    const dateChanged = doc.dateChanged;
    const expirationDate = doc.expirationDate;
    const expirationStatus = doc.expirationStatus;
    const changeNotes = doc.changeNotes;
    const isDispenseChanged = doc.isDispenseChanged;
    return { owner, medication, patientID, dispenseLocation, name, lot, quantityChanged, dateChanged, expirationDate, expirationStatus, changeNotes, isDispenseChanged };
  }
}

/**
 * Provides the singleton instance of this class to all other entities.
 */
export const InventoryAudit = new InventoryAuditCollection();
