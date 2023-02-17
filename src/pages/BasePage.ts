import { Page } from '@playwright/test';
import { user } from '../testdata/testdata';
import { Logger } from 'tslog';
let logger;

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logger = new Logger();
  }

  async navigate() {
    await this.page.goto(user.baseUrl);
    await this.page.context().clearCookies();
  }

  async navigateToPage(url: string) {
    let i = 0;
    do {
      try {
        await this.page.context().clearCookies();
        await this.page.goto(url);
        await this.page.context().clearCookies();
        await this.page.waitForLoadState('domcontentloaded');
        break;
      } catch (e) {
        i++;
      }
    } while (i < 3);
  }

  async isElementVisisble(locatorValue: string): Promise<boolean> {
    const sleep = (ms: number | undefined) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    let flag = false;
    try {
      await sleep(1000);
      if ((await this.page.$$(locatorValue)).length > 0) {
        flag = true;
      }
    } catch (error) {
      flag = false;
    }
    return flag;
  }

   async isElmntVisisble(page: Page, locator: string): Promise<boolean> {
    await page.waitForSelector(locator);
    return await page.isVisible(locator);
}
}
