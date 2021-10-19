import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import {
  Inventories,
  inventoryStates,
  inventoryMedications,
  inventoryPublications,
  medLocations,
} from './InventoryCollection';
import { removeAllEntities } from '../base/BaseUtilities';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('StuffCollection', function testSuite() {
    before(function setup() {
      removeAllEntities();
    });

    after(function teardown() {
      removeAllEntities();
    });

    it('Can define and removeIt', function test1(done) {
      fc.assert(
        fc.property(fc.integer(0, inventoryMedications.length - 1), fc.lorem(2), fc.integer(0, inventoryPublications.length - 1), fc.integer(5, 10), fc.integer(0, 10), fc.date(), fc.lorem(1), fc.lorem(1), fc.integer(0, inventoryStates.length - 1),
          (medChoice, name, locChoice, threshold, quantity, lot, expiration, owner, statusChoice) => {
            const medication = inventoryMedications[medChoice];
            const location = medLocations[locChoice];
            const status = inventoryStates[statusChoice];
            const docID = Inventories.define({
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
            expect(Inventories.isDefined(docID)).to.be.true;
            Inventories.removeIt(docID);
            expect(Inventories.isDefined(docID)).to.be.false;
          }),
      );
      done();
    });

    it('Can define duplicates', function test2() {
      const medication = inventoryMedications[Math.floor(Math.random() * inventoryMedications.length)];
      const name = faker.animal.dog();
      const location = medLocations[Math.floor(Math.random() * medLocations.length)];
      const threshold = faker.datatype.number({ min: 1, max: 100 });
      const quantity = faker.datatype.number({ min: 1, max: 100 });
      const lot = faker.datatype.number({ min: 1, max: 1000 });
      const expiration = faker.date.between('2021-10-19', '2021-12-31').toLocaleDateString('en-US');
      const owner = faker.internet.email();
      const status = inventoryStates[Math.floor(Math.random() * inventoryStates.length)];
      const docID1 = Inventories.define({ medication, name, location, threshold, quantity, lot, expiration, owner, status });
      const docID2 = Inventories.define({ medication, name, location, threshold, quantity, lot, expiration, owner, status });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const medication = inventoryMedications[faker.datatype.number({ min: 1, max: inventoryMedications.length - 1 })];
      const name = faker.lorem.words();
      const location = medLocations[faker.datatype.number({ min: 1, max: medLocations.length - 1 })];
      const threshold = faker.datatype.number({ min: 1, max: 10 });
      const quantity = faker.datatype.number({ min: 1, max: 10 });
      const lot = faker.lorem.words();
      const expiration = faker.date.between('2021-10-19', '2021-12-31').toLocaleDateString('en-US');
      const owner = faker.lorem.words();
      const status = inventoryStates[faker.datatype.number({ min: 1, max: inventoryStates.length - 1 })];
      const docID = Inventories.define({
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
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(fc.integer(0, inventoryMedications.length - 1), fc.lorem(2), fc.integer(0, inventoryPublications.length - 1), fc.integer(5, 10), fc.integer(0, 10), fc.date(), fc.lorem(1), fc.lorem(1), fc.integer(0, inventoryStates.length - 1),
          (newMedication, newName, newLocation, newThreshold, newQuantity, newLot, newExpiration, newOwner, newStatus) => {
            Inventories.update(docID, {
              medication: newMedication,
              name: newName,
              location: newLocation,
              threshold: newThreshold,
              quantity: newQuantity,
              expiration: newExpiration,
              owner: newOwner,
              status: inventoryStates[newStatus],
            });
            const inventory = Inventories.findDoc(docID);
            expect(inventory.medication).to.equal(newMedication);
            expect(inventory.name).to.equal(newName);
            expect(inventory.location).to.equal(newLocation);
            expect(inventory.threshold).to.equal(newThreshold);
            expect(inventory.quantity).to.equal(newQuantity);
            expect(inventory.lot).to.equal(newLot);
            expect(inventory.expiration).to.equal(newExpiration);
            expect(inventory.owner).to.equal(newOwner);
            expect(inventory.status).to.equal(inventoryStates[newStatus]);
          }),
      );
      done();
    });

    it('Can dumpOne, removeIt, and restoreOne', function test4() {
      const origDoc = Inventories.findOne({});
      let docID = origDoc._id;
      const dumpObject = Inventories.dumpOne(docID);
      Inventories.removeIt(docID);
      expect(Inventories.isDefined(docID)).to.be.false;
      docID = Inventories.restoreOne(dumpObject);
      expect(Inventories.isDefined(docID)).to.be.true;
      const doc = Inventories.findDoc(docID);
      expect(doc.medication).to.equal(origDoc.medication);
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.location).to.equal(origDoc.location);
      expect(doc.threshold).to.equal(origDoc.threshold);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.lot).to.equal(origDoc.lot);
      expect(doc.expiration).to.equal(origDoc.expiration);
      expect(doc.owner).to.equal(origDoc.owner);
      expect(doc.status).to.equal(origDoc.status);
    });
  });
}
