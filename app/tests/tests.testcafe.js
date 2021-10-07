import { Selector, t } from 'testcafe';
import { addInventoryPage, listInventoryPage, signOutPage } from './simple.page';
import { signInPage } from './signin.page';
import { navBar } from './navbar.component';
import { signUpPage } from './signup.page';
import { landingPage } from './landing.page';
import { addOrder } from './addorder.page';
import { editOrder } from "./editinventory.page";
// import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

/* global fixture:false, test:false */

/** Credentials for one of the sample users defined in settings.development.json. */
const credentials = { username: 'john@foo.com', password: 'changeme' };
const adminCredentials = { username: 'admin@foo.com', password: 'changeme' };
const newCredentials = { username: 'jane@foo.com', password: 'changeme' };
const testOrder = { medication: 'p', name: 'test medication', location: 'r', threshold: '3', quantity: '20', lot: 'ABC123' };
const updatedOrder = { medication: 'g', name: 'test medication edited', location: 'r', threshold: '5', quantity: '25', lot: 'ABC124' };

fixture('matrp localhost test with default db')
  .page('http://localhost:3000');

test('Test that landing page shows up', async () => {
  await landingPage.isDisplayed();
});

test('Test that sign in and sign out work', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that sign up and sign out work', async () => {
  await navBar.gotoSignupPage();
  await signUpPage.signupUser(newCredentials.username, newCredentials.password);
  await navBar.isLoggedIn(newCredentials.username);
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that user can add an order', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddOrderPage();
  await addOrder.orderIsAdded(testOrder.medication, testOrder.name, testOrder.location, testOrder.threshold, testOrder.quantity, testOrder.lot);
  await navBar.gotoListInventoryPage();
  const inventoryExists = Selector('ABC123');
  await t.expect(inventoryExists).ok();
});

test('Test that user can edit an order', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoListInventoryPage();
  await t.click('a[id="list-inventory-edit"]');
  await editOrder.orderIsEdited(updatedOrder.medication, updatedOrder.name, updatedOrder.location, updatedOrder.threshold, updatedOrder.quantity, updatedOrder.lot);
  await navBar.gotoListInventoryPage();
  const inventoryExists = Selector('ABC124');
  await t.expect(inventoryExists).ok();
});


test('Test that user pages show up', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(credentials.username, credentials.password);
  await navBar.isLoggedIn(credentials.username);
  await navBar.gotoAddOrderPage();
  await addInventoryPage.isDisplayed();
  await navBar.gotoListInventoryPage();
  await listInventoryPage.isDisplayed();
  /*  // want to see if we can get to the editStuffPage
  const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  await t.click(editLinks.nth(0));
  await editStuffPage.isDisplayed(); */
  await navBar.logout();
  await signOutPage.isDisplayed();
});

test('Test that admin pages show up', async () => {
  await navBar.gotoSigninPage();
  await signInPage.signin(adminCredentials.username, adminCredentials.password);
  await navBar.isLoggedIn(adminCredentials.username);
  await navBar.gotoAddOrderPage();
  await addInventoryPage.isDisplayed();
  await navBar.gotoListInventoryPage();
  await listInventoryPage.isDisplayed();
  // want to see if we can get to the editStuffPage
  /* const editLinks = await Selector(`.${COMPONENT_IDS.LIST_STUFF_EDIT}`);
  await t.click(editLinks.nth(0));
  await editStuffPage.isDisplayed();
  await navBar.gotoListInventoryAdminPage();
  await list.isDisplayed();
  await navBar.gotoManageDatabasePage();
  await manageDatabasePage.isDisplayed(); */
});
