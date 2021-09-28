import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
// eslint-disable-next-line import/named
import { Inventories, inventoryStates } from './InventoryCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('StuffCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Inventories.getCollectionName();
      const definitionData = {};
      definitionData.name = faker.lorem.words();
      definitionData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      definitionData.owner = username;
      definitionData.condition = inventoryStates[faker.datatype.number({ min: 0, max: inventoryStates.length - 1 })];
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Inventories.isDefined(docID)).to.be.true;
      let doc = Inventories.findDoc(docID);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.location).to.equal(definitionData.location);
      expect(doc.threshold).to.equal(definitionData.threshold);
      expect(doc.quantity).to.equal(definitionData.quantity);
      expect(doc.lot).to.equal(definitionData.lot);
      expect(doc.expiration).to.equal(definitionData.expiration);
      expect(doc.status).to.equal(definitionData.status);
      const updateData = {};
      updateData.id = docID;
      updateData.name = faker.lorem.words();
      updateData.quantity = faker.datatype.number({
        min: 1,
        max: 10,
      });
      updateData.status = inventoryStates[faker.datatype.number({ min: 1, max: inventoryStates.length - 1 })];
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Inventories.findDoc(docID);
      expect(doc.name).to.equal(updateData.name);
      expect(doc.location).to.equal(updateData.location);
      expect(doc.threshold).to.equal(updateData.threshold);
      expect(doc.quantity).to.equal(updateData.quantity);
      expect(doc.lot).to.equal(updateData.lot);
      expect(doc.expiration).to.equal(updateData.expiration);
      expect(doc.status).to.equal(updateData.status);
      await removeItMethod.callPromise({ collectionName, instance: docID });
      expect(Inventories.isDefined(docID)).to.be.false;
    });
  });
}
