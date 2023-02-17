import { Page } from '@playwright/test';
import { user } from '../testdata/testdata';
import { Logger } from 'tslog';
import { BasePage } from './BasePage';
import { appendFileSync } from "fs";
import { expect } from '@playwright/test';
let logger: Logger<unknown>;
let basePage: BasePage;
export class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    basePage = new BasePage(page);
    logger = new Logger({ type: "pretty" });
    logger.attachTransport((logObj) => {
      appendFileSync("logs.txt", JSON.stringify(logObj) + "\n");
    });
  }

  public readonly imageNumber =
    "(//*[@class='text-center f-14 mt-4' or contains(text(),'No Product')])[1]";
  public readonly imagePath =
    "(//div[@class='slick-slide slick-active slick-current']//img)[1]";
  public readonly nextImage = "//button[@aria-label='Next Image']";
  public readonly priceTags =
    "//*[contains(text(),'$') and contains(text(),'.00')]";
  public readonly noProductImage = "(//*[contains(text(),'No Product')])[1]";
  public readonly videoPath =
    "//(//div[@class='slick-slide slick-active slick-current'])[1]//video//source";

  public readonly howUseItButtonPath = "//*[contains(text(),'How to Use It')]";
  public readonly howUseItContent = "//*[@class='how-to-use-accordion align-items-start justify-content-start flex-wrap']//ul";
  async getProductDetails(productURL: string, productNameValue: string, productCategory: string, pageNo: number, productNo: number) {

    const sleep = (ms) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    logger.info(
      '------------------------------------------------------------------------'
    );
    //logger.info('Category:['+productCategory+']');
    logger.info('Page No:[' + pageNo + '] : Product: [' + (productNo + 1) + ']');
    logger.info('Product Name:[' + productNameValue + ']\n');

    const prductpage = await this.page.context().newPage();

    const url = 'https://nuglobalbasev1-uat.skavacommerce.com' + productURL;
    await prductpage.goto(url, { waitUntil: 'load' });

    await prductpage.context().clearCookies();
    await sleep(1000);
    await prductpage.waitForURL(url);
    expect(prductpage).toHaveURL(url);
    if (!((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      logger.error('No Product(s) Found');
      logger.info();
      logger.error('URL:' + url);
      await prductpage.close();
    } else {

      await sleep(500);
      expect(prductpage.locator(this.imageNumber)).toBeVisible();
      const imageCount = (
        await prductpage.locator(this.imageNumber).textContent()
      )?.charAt(4);
      let i = Number(imageCount);
      logger.info('Images:[' + i + ']');
      logger.info("----------\n");
      let j = 1;
      do { // loop for checking images
        expect(prductpage.locator(this.imagePath)).toBeVisible();
        if ((await prductpage.$$(this.imagePath)).length > 0) {
          prductpage.waitForSelector(this.imagePath);
          const producImageSrc = await prductpage
            .locator(this.imagePath)
            .getAttribute('src');
          if (String(producImageSrc).indexOf('image-not-found') === -1) {
            logger.info('AVAILABLE at [' + j + ']\n');
          } else {
            logger.error(
              'NOT AVAILABLE at :[' + j + ']'
            );
            logger.error('URL:' + url + '\n');
          }
        } else if (await basePage.isElementVisisble(this.videoPath)) {
          const producImageSrc = await prductpage
            .locator(this.videoPath)
            .getAttribute('src');
          if (String(producImageSrc).indexOf('image-not-found') === -1) {
            logger.info('VIDEO Streaming at :[' + j + ']\n');
          } else {
            logger.error(
              'NOT AVAILABLE at :[' + j + ']'
            );
            logger.error('URL:' + url + '\n');
          }
        }
        i--;
        j++;
        if (i > 0) {
          await prductpage.click(this.nextImage);
        }
        await sleep(1000);
      } while (i > 0);
      let k = 0;

      const howUseIt = (await prductpage.$$(this.howUseItButtonPath)).length;
      await sleep(1000);
      logger.info("How To Use It:");
      logger.info("-------------\n");
      if (howUseIt > 0) {
        await prductpage.click(this.howUseItButtonPath);
        await sleep(1000);
        await prductpage.waitForSelector(this.howUseItContent);
        expect(prductpage.locator(this.howUseItContent)).toBeVisible();
        const howUseItContent = await prductpage.locator(this.howUseItContent).textContent();

        if (String(howUseItContent).length > 0) {

          logger.info("               Content available\n");
        }
      } else {
        logger.info("                 Section not available\n");
      }
      const pricePositionsCount = (await prductpage.$$(this.priceTags)).length;
      logger.info("Price:");
      logger.info("-----\n");
      logger.info('Total Price Count:[' + pricePositionsCount + ']\n');
      for (let priceCount = 0; priceCount < pricePositionsCount; priceCount++) { // loop for checking prices
        const priceValue = await prductpage
          .locator(this.priceTags)
          .nth(priceCount)
          .textContent();
        const dollarIndex = String(priceValue).indexOf('$');
        const dotIndex = String(priceValue).indexOf('.');
        const productPrice = String(priceValue).substring(
          dollarIndex + 1,
          dotIndex
        );
        if (Number(productPrice) > 0) {
          logger.info(
            'Price At [' +
            (priceCount + 1) +
            '] value is:[' +
            priceValue +
            ']'
          );
        } else if (Number(productPrice) <= 0) {
          logger.error(
            'Price At [' +
            (priceCount + 1) +
            '] value [' +
            priceValue +
            '] showing as below or equal to zero'
          );
        }

      }
      await prductpage.close();
    }
  }


}
