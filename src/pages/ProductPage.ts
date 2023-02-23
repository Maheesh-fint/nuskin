import { Page } from '@playwright/test';
import { TestInfo } from '@playwright/test';
import { user } from '../testdata/testdata';
import { Logger } from 'tslog';
import { BasePage } from './BasePage';
import { appendFileSync } from "fs";
import { expect } from '@playwright/test';
import { setTimeout } from 'timers/promises';
import { readFileSync } from 'fs';

let logger: Logger<unknown>;
let basePage: BasePage;
let prductpage: Page;
let producPageTestInfo: TestInfo;
let url;
let logText = '';
export class ProductPage extends BasePage {
  constructor(page, testInfo) {
    super(page);
    basePage = new BasePage(page);
    logger = new Logger({ type: "pretty" });
    producPageTestInfo = testInfo;
    // logger.attachTransport((logObj) => {
    //   appendFileSync("logs.txt", JSON.stringify(logObj) + "\n");
    // });
  }

  public readonly imageNumber =
    "(//*[@class='text-center f-14 mt-4' or contains(text(),'No Product')])[1]";
  public readonly imagePath =
    "(//div[@class='slick-slide slick-active slick-current' or @class='productcarousel product_video']//img)[1]";
  public readonly nextImage = "//button[@aria-label='Next Image']";
  public readonly priceTags =
    "//*[contains(text(),'$') and contains(text(),'.00')]";
  public readonly noProductImage = "(//*[contains(text(),'No Product')])[1]";
  public readonly videoPath =
    "//(//div[@class='slick-slide slick-active slick-current'])[1]//video//source";

  public readonly howUseItButtonPath = "//*[contains(text(),'How to Use It')]";
  public readonly howUseItContent = "//*[@class='how-to-use-accordion align-items-start justify-content-start flex-wrap']";

  public readonly ingredientsPath = "//div[contains(text(),'Ingredients')]";
  public readonly keyIngredientsImages = "//*[@class='key-ingredients-inner d-flex flex-row align-items-center mb-4']//img";
  public readonly keyIngredientsName = "//*[@class='key-ingredients-inner d-flex flex-row align-items-center mb-4']//h4";
  public readonly keyIngredientsContent = "//*[@class='key-ingredients-inner d-flex flex-row align-items-center mb-4']//p";
  public readonly activeIngredients = "//*[text()='Active Ingredients']";
  public readonly activeIngredientsContent = "//*[text()='Active Ingredients']";
  public readonly otherIngredient = "//h4[text()='Other Ingredients']/../p";
  public readonly otherIngredientContent = "//h4[text()='Other Ingredients']/../p";
  public readonly otherIngredientimg = "//*[@class='Otheringredient-img']";
  public readonly otherIngredientimgFile = "//*[@class='Otheringredient-img']//img";



  //product kit xpaths


  public readonly productKitTextPath = "//h4[contains(text(),'Items in this Bundle')]";
  public readonly totalKitItems = "//h4[contains(text(),'Items in this Bundle')]/../..//div[1]//span[1]"
  public readonly kitItemsDivPath = "//h4[contains(text(),'Items in this Bundle')]/../../..//div[@class='border-top border-dark py-2 w-100 row no-gutters']";


  async createProductPage(productURL: string,productNameValue:string) {
    console.log("productNameValue-->"+productNameValue)
    url = 'https://nuglobalbasev1-uat.skavacommerce.com' + productURL;
    logText = 'ProductName:'+productNameValue+"--> URL:"+url+"\n";
    await setTimeout(2000);
    prductpage = await this.page.context().newPage();
    
    // url = "https://nuglobalbasev1-uat.skavacommerce.com/us/en/product/wellness-premium-kit";
    await prductpage.goto(url,{timeout:123000000});
    //this.waitUntilPageLoadHTML(prductpage)
    await prductpage.waitForLoadState();
    await prductpage.context().clearCookies();
    await prductpage.waitForURL(url);
    expect(prductpage).toHaveURL(url, { timeout: 220000 });
    const screenshot = await prductpage.screenshot();
    await producPageTestInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    await setTimeout(2000);
  }
  async closeProductPage(productNameValue: string) {
    //logger.info("closeProductPage :productNameValue---===---"+productNameValue);
    
    let prdName = String(productNameValue).replace('/','');
    this.createFile(logText, prdName);
    await setTimeout(2000);

    await producPageTestInfo.attach(String(prdName), { path: String(prdName) + '.txt' });
    prductpage.close();
    await setTimeout(2000);
  }

  async verifyProductImageDetails() {
    await setTimeout(2000);
    if (!((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      logText += 'No Product(s) Found\n';
      logger.error('No Product(s) Found');
      logger.info();
      logText += 'URL:' + url + '\n';
      logger.error('URL:' + url);
    } else {
      expect(prductpage.locator(this.imageNumber)).toBeVisible({ timeout: 220000 });
      const imageCount = (
        await prductpage.locator(this.imageNumber).textContent()
      )?.charAt(4);
      let i = Number(imageCount);
      logText += 'Total Images:[' + i + ']\n';
      logText += "----------\n";
      logger.info('Total Images:[' + i + ']');
      logger.info("----------\n");
      let j = 1;
      if (i > 0) {
        do { // loop for checking images

          const locator = prductpage.locator(this.imagePath);
          await expect(locator).toBeVisible({ timeout: 220000 });
          await prductpage.waitForSelector(this.imagePath);
          if ((await prductpage.$$(this.imagePath)).length > 0) {
            prductpage.waitForSelector(this.imagePath);
            const producImageSrc = await prductpage
              .locator(this.imagePath)
              .getAttribute('src');
            if (String(producImageSrc).indexOf('image-not-found') === -1) {
              logText += 'AVAILABLE at ' + j + '\n';
              logger.info('AVAILABLE at ' + j + '\n');
            } else {
              logText += 'NOT AVAILABLE at :' + j;
              logText += 'URL:' + url + '\n';
              logger.error(
                'NOT AVAILABLE at :' + j + ''
              );
              logger.error('URL:' + url + '\n');
            }
          } else if ((await prductpage.$$(this.videoPath)).length > 0) {
            const producImageSrc = await prductpage
              .locator(this.videoPath)
              .getAttribute('src');
            if (String(producImageSrc).indexOf('image-not-found') === -1) {
              logText += 'VIDEO Streaming at :' + j + '\n';
              logger.info('VIDEO Streaming at :' + j + '\n');
            } else {
              logText += 'NOT AVAILABLE at :' + j + '';
              logText += 'URL:' + url + '\n';
              logger.error(
                'NOT AVAILABLE at :' + j + ''
              );
              logger.error('URL:' + url + '\n');
            }
          }
          i--;
          j++;
          if (i > 0) {
            await prductpage.waitForSelector(this.nextImage);
            await prductpage.click(this.nextImage);
          }

        } while (i > 0);
      } else {
        logText += 'Images not available';
        logText += 'URL:' + url + '\n';
        logger.error('Images not available');
        logger.error('URL:' + url + '\n');
      }
    }
    await setTimeout(2000);
  }
  async validateProductPriceDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      const pricePositionsCount = (await prductpage.$$(this.priceTags)).length;
      logText += "Price:\n-----\n"
      logText += 'Total Price Count:[' + pricePositionsCount + ']\n';
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
          logText += 'Price At ' +
            (priceCount + 1) +
            ' value is:[' +
            priceValue +
            ']\n';
          logger.info(
            'Price At ' +
            (priceCount + 1) +
            ' value is:[' +
            priceValue +
            ']\n'
          );
        } else if (Number(productPrice) <= 0) {
          logText += 'Price At ' +
            (priceCount + 1) +
            '] value ' +
            priceValue +
            '] showing as below or equal to zero\n';
          logger.error(
            'Price At ' +
            (priceCount + 1) +
            '] value ' +
            priceValue +
            '] showing as below or equal to zero\n'
          );
        }
      }
    }
    await setTimeout(2000);
  }

  async validateHowToUseIt() {

    if (((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      const howUseIt = (await prductpage.$$(this.howUseItButtonPath)).length;
      logText += "How To Use It:\n-------------\n";
      logger.info("How To Use It:");
      logger.info("-------------\n");
      if (howUseIt > 0) {
        await prductpage.click(this.howUseItButtonPath);

        await prductpage.waitForSelector(this.howUseItContent);
        const howUseItContent = await prductpage.locator(this.howUseItContent).textContent();
        if (String(howUseItContent).length > 0) {
          logText += "               Content available\n"
          logger.info("               Content available\n");
        }
      } else {
        logText += "                 Section not available\n"
        logger.info("                 Section not available\n");
      }
    }
  }

  async validateIngrediatntsDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      logText += "Ingredients:\n-------------\n";
      logger.info("Ingredients:");
      logger.info("-------------\n");
      const ingredientsElement = (await prductpage.$$(this.ingredientsPath)).length;

      if (ingredientsElement > 0) {
        if ((await prductpage.$$(this.otherIngredientimg)).length > 0) {
          const ingredientImageSrc = await prductpage
            .locator(this.otherIngredientimgFile)
            .getAttribute('src');
          if (String(ingredientImageSrc).indexOf('image-not-found') === -1) {
            logText += "Image displayed";
            logger.info("Image displayed");
          } else {
            logText += "Image not displayed";
            logger.info("Image not displayed");
          }
        } else {
          await prductpage.click(this.ingredientsPath);
          await prductpage.waitForSelector(this.ingredientsPath);
          let ingredientImages = (await prductpage.$$(this.keyIngredientsImages)).length;
          logText += "Total Ingredients:[" + ingredientImages + "]\n------------------------\n";
          logger.info("Total Ingredients:[" + ingredientImages + "]");
          logger.info("------------------------\n");
          let j = 0;
          do { // loop for checking images in ingredients
            if (ingredientImages > 0) {
              const ingredientName = await prductpage
                .locator(this.keyIngredientsName).nth(j).textContent();
              logText += "Ingredient:" + (j + 1) + ":Name:" + ingredientName + '-->';
              logger.info("Ingredient:" + (j + 1) + ":Name:" + ingredientName);
              const ingredientContent = await prductpage
                .locator(this.keyIngredientsContent).nth(j).textContent();
              if (String(ingredientContent).length > 0) {
                logText += "               Content available\n";
                logger.info("               Content available\n");
              } else {
                logText += "               Section not available\n";
                logger.info("                 Section not available\n");
              }
              if ((await prductpage.$$(this.keyIngredientsImages)).length > 0) {
                const producImageSrc = await prductpage
                  .locator(this.keyIngredientsImages).nth(j)
                  .getAttribute('src');
                if (String(producImageSrc).indexOf('image-not-found') === -1) {
                  logText += '        IMage Available \n'
                  logger.info('        IMage Available \n');
                } else {
                  logText += 'IMage not Available --> URL:' + url + '\n\n';
                  logger.error(
                    '                 IMage not Available ');
                  logger.error('URL:' + url + '\n');
                }
              }
              ingredientImages--;
              j++;
            } else {
              logText += 'URL:' + url + '\n';
              logger.error('URL:' + url + '\n');
            }
          } while (ingredientImages > 0);
          logText += "Active Ingredients:\n-------------------\n"
          logger.info("Active Ingredients:");
          logger.info("-------------------\n");
          let activeIngredientsLength = (await prductpage.$$(this.activeIngredients)).length;
          if (activeIngredientsLength > 0) {
            const activeIngredientsContent = await prductpage.locator(this.activeIngredientsContent).textContent();
            if (String(activeIngredientsContent).length > 0) {
              logText += "               Content available\n";
              logger.info("               Content available\n");
            }
          } else {
            logText += "                 Section not available\n";
            logger.info("                 Section not available\n");
          }
          logText += "Other Ingredients:\n-------------\n";
          logger.info("Other Ingredients:");
          logger.info("-------------\n");
          let otherIngredientsLength = (await prductpage.$$(this.otherIngredient)).length;
          if (otherIngredientsLength > 0) {
            const otherIngredientsContent = await prductpage.locator(this.otherIngredientContent).textContent();
            if (String(otherIngredientsContent).length > 0) {
              logText += "               Content available\n";
              logger.info("               Content available\n");
            }
          } else {
            logText += "                 Section not available\n";
            logger.info("                 Section not available\n");
          }
        }
      } else {
        logText += "                 Section not available\n";
        logger.info("                 Section not available\n");
      }
    }
    await setTimeout(2000);
  }

  async validateProductKitDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1)) {
      logText += "Product KIT:\n-------------\n";
      logger.info("Product KIT:");
      logger.info("-------------\n");
      const productKit = (await prductpage.$$(this.productKitTextPath)).length;

      if (productKit > 0) {
        const totalKitItems = Number(await prductpage.locator(this.totalKitItems).textContent());
        //  const totalKitItems2 = await prductpage.$$(this.kitItemsDivPath);
        logText += "Total Bundle Size:" + totalKitItems + "\n--------------------\nProduct URL:" + prductpage.url() + "\n";
        logger.info("Total Bundle Size:" + totalKitItems);
        logger.info("--------------------\n");
        logger.info("Product URL:" + prductpage.url() + "\n");
        for (let i = 0; i < totalKitItems; i++) {

          let itemName = await prductpage.locator(this.kitItemsDivPath).nth(i).locator("//div[@class='font-weight-bold row no-gutters']").textContent();
          logText += (i + 1) + " Item in the Bundle:" + String(itemName) + "\n------------------------------\n";
          logger.info((i + 1) + " Item in the Bundle:" + String(itemName));
          logger.info("------------------------------\n");
          const itenLinkElement = await prductpage.locator(this.kitItemsDivPath).nth(i).locator("//a[@class='text-dark']");
          const prodyctImageLoc = await prductpage.locator(this.kitItemsDivPath).nth(i).locator("//a[@aria-label='productimage']/img");
          const prodyctImageLinkLoc = await prductpage.locator(this.kitItemsDivPath).nth(i).locator("//a[@aria-label='productimage']");

          itenLinkElement.scrollIntoViewIfNeeded();
          prodyctImageLoc.scrollIntoViewIfNeeded();
          prodyctImageLinkLoc.scrollIntoViewIfNeeded();
          let itemLinkText = await itenLinkElement.getAttribute("href");
          let prodyctImage = await prodyctImageLoc.getAttribute("src");
          let prodyctImageLink = await prodyctImageLinkLoc.getAttribute("href");

          if (String(prodyctImageLink).length > 0) {
            logText += "Product image link available:" + prodyctImageLink;
            logger.info("Product image link available:" + prodyctImageLink);

          } else {
            logText += "Url :" + prductpage.url() + "\nProduct image link not available"
            logger.error("Url :" + prductpage.url())
            logger.error("Product image link not available");
          }
          if (String(itemLinkText).length > 0) {
            logText += "\nBundle Item having link:" + String(itemLinkText);
            logger.info("Bundle Item having link:" + String(itemLinkText));

          } else {
            logText += "Bundle Item not having link\nUrl :" + prductpage.url()
            logger.error("Bundle Item not having link");
            logger.error("Url :" + prductpage.url())
          }

          if (String(prodyctImage).indexOf("Not found") == -1) {
            logText += "\nProdcut Image displayed\n";
            logger.info("Prodcut Image displayed\n");

          } else {
            logText += "Url :" + prductpage.url() + "Prodcut Image not displayed\n";
            logger.error("Url :" + prductpage.url())
            logger.error("Prodcut Image not displayed\n");
          }

        }
      } else {
        logText += "Product not having bundle items\n";
        logger.info("Product not having bundle items\n");
      }
    }
    await setTimeout(2000);
  }
  private fs = require('fs');
  createFile(myText: string, productNameValue: string) {
    //const myText = 'Hi!\r\n';
    this.fs.writeFileSync('./' + productNameValue + '.txt', myText);
  }

}
