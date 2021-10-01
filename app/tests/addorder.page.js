import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class AddOrderPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.ADD_INVENTORY}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  async orderIsAdded(medication, name, location, threshold, quantity, expiration, lot) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_MEDICATION}`, medication);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_NAME}`, name);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_LOCATION}`, location);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_THRESHOLD}`, threshold);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_QUANTITY}`, quantity);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_EXPIRATION}`, expiration);
    await t.typeText(`#${COMPONENT_IDS.ADD_INVENTORY_LOT}`, lot);
    await t.click(`#${COMPONENT_IDS.ADD_INVENTORY_SUBMIT}`);
  }
}

export const addOrder = new AddOrderPage();
