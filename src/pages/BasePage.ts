import { Page } from '@playwright/test';
import { user } from '../testdata/testdata';
import { Logger } from 'tslog';
import { setTimeout } from 'timers/promises';
let logger;

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
    logger = new Logger();
  }

  async navigate() {
    await this.page.goto(user.baseUrl,{timeout:540000});
    await this.page.context().clearCookies();
  }

  async navigateToPage(url: string) {
    const waitTillHTMLRendered = async (page, timeout = 220000) => {
      const checkDurationMsecs = 1000;
      const maxChecks = timeout / checkDurationMsecs;
      let lastHTMLSize = 0;
      let checkCounts = 1;
      let countStableSizeIterations = 0;
      const minStableSizeIterations = 3;

      while (checkCounts++ <= maxChecks) {
        let html = await page.content();
        let currentHTMLSize = html.length;

        let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

        //console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

        if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
          countStableSizeIterations++;
        else
          countStableSizeIterations = 0; //reset the counter

        if (countStableSizeIterations >= minStableSizeIterations) {
        //  logger.info("Page rendered fully..");
          break;
        }

        lastHTMLSize = currentHTMLSize;
        await page.waitForTimeout(checkDurationMsecs);
      }
    };
   
    let i = 0;
    do {
      try {
        await this.page.context().clearCookies();
        await this.page.goto(url);
        await waitTillHTMLRendered(this.page);
        await this.page.context().clearCookies();
        await this.page.waitForLoadState('domcontentloaded');
        break;
      } catch (e) {
        i++;
      }
    } while (i < 3);
  }

  async isElementVisisble(locatorValue: string): Promise<boolean> {
    let flag = false;
    try {
      await setTimeout(1000);
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

// async waitUntilPageLoadHTML(page2:Page) {
    
//   const waitTillHTMLRendered = async (page2, timeout = 220000) => {
//     const checkDurationMsecs = 1000;
//     const maxChecks = timeout / checkDurationMsecs;
//     let lastHTMLSize = 0;
//     let checkCounts = 1;
//     let countStableSizeIterations = 0;
//     const minStableSizeIterations = 3;
//     while (checkCounts++ <= maxChecks) {
//       let html = await page2.content();
//       let currentHTMLSize = html.length;
//       let bodyHTMLSize = await page2.evaluate(() => document.body.innerHTML.length);
//       // console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);
//       if (lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize)
//         countStableSizeIterations++;
//       else
//         countStableSizeIterations = 0; //reset the counter
//       if (countStableSizeIterations >= minStableSizeIterations) {
//        //  logger.info("Page loaded..");
//         break;
//       }
//       lastHTMLSize = currentHTMLSize;
//       await setTimeout(5000);
//       // await page.waitForTimeout(checkDurationMsecs);
//     }
//   };
//   waitTillHTMLRendered(page2);
// }
}
