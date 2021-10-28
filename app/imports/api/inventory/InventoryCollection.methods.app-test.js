import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import faker from 'faker';
// eslint-disable-next-line import/named
import { Inventories, inventoryStates, medLocations, inventoryMedications } from './InventoryCollection';
import { defineTestUser, withLoggedInUser, withSubscriptions } from '../../test-utilities/test-utilities';
import { defineMethod, updateMethod, removeItMethod } from '../base/BaseCollection.methods';

/* eslint prefer-arrow-callback: "off",  no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isClient) {
  describe('InventoryCollection Meteor Methods', function testSuite() {
    it('Can define, update, and removeIt', async function test1() {
      const { username, password } = await defineTestUser.callPromise();
      await withLoggedInUser({ username, password });
      await withSubscriptions();
      const collectionName = Inventories.getCollectionName();
      const definitionData = {};
      definitionData.medication = inventoryMedications[Math.floor(Math.random() * inventoryMedications.length)];
      definitionData.name = faker.lorem.words();
      definitionData.location = medLocations[Math.floor(Math.random() * medLocations.length)];
      definitionData.threshold = faker.datatype.number({ min: 1, max: 10 });
      definitionData.quantity = faker.datatype.number({ min: 1, max: 10 });
      definitionData.lot = faker.datatype.number({ min: 1, max: 1000 });
      definitionData.expiration = faker.date.between('2021-10-19', '2021-12-31').toLocaleDateString('en-US');
      definitionData.owner = username;
      definitionData.status = inventoryStates[faker.datatype.number({ min: 0, max: inventoryStates.length - 1 })];
      // console.log(collectionName, definitionData);
      const docID = await defineMethod.callPromise({ collectionName, definitionData });
      expect(Inventories.isDefined(docID)).to.be.true;
      let doc = Inventories.findDoc(docID);
      expect(doc.medication).to.equal(definitionData.medication);
      expect(doc.name).to.equal(definitionData.name);
      expect(doc.location).to.equal(definitionData.location);
      expect(doc.threshold).to.equal(definitionData.threshold);
      expect(doc.quantity).to.equal(definitionData.quantity);
      expect(doc.lot).to.equal(definitionData.lot);
      expect(doc.expiration).to.equal(definitionData.expiration);
      expect(doc.status).to.equal(definitionData.status);
      const updateData = {};
      updateData.id = docID;
      updateData.medication = inventoryMedications[Math.floor(Math.random() * inventoryMedications.length)];
      updateData.name = faker.lorem.words();
      updateData.location = medLocations[Math.floor(Math.random() * medLocations.length)];
      updateData.threshold = faker.datatype.number({ min: 1, max: 10 });
      updateData.quantity = faker.datatype.number({ min: 1, max: 10 });
      updateData.lot = faker.datatype.number({ min: 1, max: 1000 });
      updateData.expiration = faker.date.between('2021-10-19', '2021-12-31').toLocaleDateString('en-US');
      updateData.owner = username;
      updateData.status = inventoryStates[faker.datatype.number({ min: 0, max: inventoryStates.length - 1 })];
      await updateMethod.callPromise({ collectionName, updateData });
      doc = Inventories.findDoc(docID);
      expect(doc.medication).to.equal(updateData.medication);
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
