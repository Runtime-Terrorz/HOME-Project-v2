import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
import fc from 'fast-check';
import { Inventories, inventoryStates } from './InventoryCollection';
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
        fc.property(fc.lorem(2), fc.integer(1, 10), fc.lorem(1), fc.integer(0, inventoryStates.length - 1),
          (medication, name, location, threshold, quantity, lot, expiration, owner, choice) => {
            const status = inventoryStates[choice];
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
      const name = faker.animal.dog();
      const quantity = faker.datatype.number({ min: 1, max: 100 });
      const owner = faker.internet.email();
      const status = inventoryStates[Math.floor(Math.random() * inventoryStates.length)];
      const docID1 = Inventories.define({ medication, name, location, threshold, quantity, lot, expiration, owner, status });
      const docID2 = Inventories.define({ medication, name, location, threshold, quantity, lot, expiration, owner, status });
      expect(docID1).to.not.equal(docID2);
    });

    it('Can update', function test3(done) {
      const name = faker.lorem.words();
      const quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      const owner = faker.lorem.words();
      const condition = inventoryStates[faker.datatype.number({ min: 1, max: inventoryStates.length - 1 })];
      const docID = Inventories.define({
        name,
        quantity,
        owner,
        condition,
      });
      // console.log(Stuffs.findDoc(docID));
      fc.assert(
        fc.property(fc.lorem(2), fc.integer(10), fc.integer(0, inventoryStates.length - 1),
          (newName, newQuantity, index) => {
            Inventories.update(docID, {
              name: newName,
              quantity: newQuantity,
              condition: inventoryStates[index],
            });
            const stuff = Inventories.findDoc(docID);
            expect(stuff.name).to.equal(newName);
            expect(stuff.quantity).to.equal(newQuantity);
            expect(stuff.condition).to.equal(inventoryStates[index]);
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
      expect(doc.name).to.equal(origDoc.name);
      expect(doc.quantity).to.equal(origDoc.quantity);
      expect(doc.condition).to.equal(origDoc.condition);
      expect(doc.owner).to.equal(origDoc.owner);
    });
  });
}
