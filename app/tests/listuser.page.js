import { Selector, t } from 'testcafe';
import { PAGE_IDS } from '../imports/ui/utilities/PageIDs';

class ListUserPage {
  constructor() {
    this.pageId = `#${PAGE_IDS.LIST_USER_ADMIN}`;
    this.pageSelector = Selector(this.pageId);
  }

  /** Checks that this page is currently displayed. */
  async isDisplayed() {
    await t.expect(this.pageSelector.exists).ok();
  }
}

export const listUserPage = new ListUserPage();
