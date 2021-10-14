import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';
import { COMPONENT_IDS } from '../imports/ui/utilities/ComponentIDs';

class EditOrderPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.EDIT_INVENTORY}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }

  async orderIsEdited(medication, name, location, threshold, quantity, expiration, lot) {
    await this.isDisplayed();
    await t.typeText(`#${COMPONENT_IDS.EDIT_INVENTORY_MEDICATION}`, medication);
    await t.typeText(`#${COMPONENT_IDS.EDIT_INVENTORY_NAME}`, name);
    await t.click(`#${COMPONENT_IDS.EDIT_INVENTORY_LOCATION}`);
    await t.click('option[value="Case 2"]');
    await t.typeText(`#${COMPONENT_IDS.EDIT_INVENTORY_THRESHOLD}`, threshold);
    await t.typeText(`#${COMPONENT_IDS.EDIT_INVENTORY_QUANTITY}`, quantity);
    await t.typeText(`#${COMPONENT_IDS.EDIT_INVENTORY_LOT}`, lot);
    await t.click(`#${COMPONENT_IDS.EDIT_INVENTORY_SUBMIT}`);
    await t.click('button[class="swal-button swal-button--confirm"]');
  }
}

export const editOrder = new EditOrderPage();
