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
let screenshot: Buffer;
let productNameValue;
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
  public readonly prdName = "//li[@class='breadcrumb-item breadcrumb-item-list text-truncate active']";

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
  public readonly activeIngredientsContent = "//*[text()='Active Ingredients']/../p";
  public readonly allIngredients = "//h4[text()='All Ingredients']/../p";
  public readonly allIngredientsContent = "//h4[text()='All Ingredients']/../p";

  public readonly otherIngredient = "//h4[text()='Other Ingredients']/../p";
  public readonly otherIngredientContent = "//h4[text()='Other Ingredients']/../p";
  public readonly otherIngredientimg = "//*[@class='Otheringredient-img']";
  public readonly otherIngredientimgFile = "//*[@class='Otheringredient-img']//img";



  //product kit xpaths


  public readonly productKitTextPath = "//h4[contains(text(),'Items in this Bundle')]";
  public readonly totalKitItems = "//h4[contains(text(),'Items in this Bundle')]/../..//div[1]//span[1]"
  public readonly kitItemsDivPath = "//h4[contains(text(),'Items in this Bundle')]/../../..//div[@class='border-top border-dark py-2 w-100 row no-gutters']";
  public readonly emptySpace = "//div[@class='error-wrapper ']";
  public readonly prdAvailable = "//*[@data-testid='qa-product-availability']";

  private fs = require('fs');

  async createProductPage(productURL: string, productName: string) {
    logText = '';

    url = productURL;
    await setTimeout(2000);
    prductpage = await this.page.context().newPage();
    await prductpage.goto(url);
    //this.waitUntilPageLoadHTML(prductpage)
    await prductpage.waitForLoadState();
    await prductpage.context().clearCookies();
    await prductpage.waitForURL(url);
    logText = '<html><head><style>';
    logText += ' table, th, td {';
    logText += 'border: 1px solid black;';
    logText += 'border-collapse: collapse;';
    logText += 'text-align:center;';
    logText += '}</style>';
    expect(prductpage).toHaveURL(url);
    //console.log("&&&^^^%%*******************>"+await this.page.title());
    //(await this.page.title()).indexOf('Product Not Found') !== -1 
    if (!((await prductpage.title()).indexOf('Product Not Found') === -1) || (await prductpage.title()).indexOf('Page Not Found') === 9 || (await prductpage.$$(this.emptySpace)).length > 0) {
      productNameValue = productName;
      logText += '<title>' + productNameValue + '</title></head><body>'
      logText += '<b>ProductName:</b>' + productNameValue + "--> <b>Product URL:</b>" + url + "<br>";
      logText += '<br><h4 style="color:red;" >No Product(s) Found<h4><br>';
      logger.error('No Product(s) Found');
      logger.info();
      // logText += 'URL:' + url + '\n';
      logger.error('URL:' + url);
    } else {
      productNameValue = await prductpage.locator(this.prdName).textContent();
      logText += '<title>' + productNameValue + '</title></head><body>'
      logText += '<div><b><u>ProductName:</u></b> &nbsp;&nbsp;' + productNameValue + "<b><br><br><u>URL:</u></b> &nbsp;" + url + "<br><br>";
    }

    await setTimeout(2000);
  }
  async closeProductPage(pageNo: number, prdNo: number, totalProducts: string) {
    await setTimeout(2000);
    await prductpage.evaluate(() => window.scrollTo(0, 0))
    await setTimeout(2000);
    screenshot = await prductpage.screenshot({ fullPage: true });
    // await producPageTestInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    const b64 = screenshot.toString('base64');
    logText += '<div><img style="flex: none; flex-grow: 0;flex-shrink: 0;flex-basis: auto;box-shadow: var(--box-shadow-thick);margin: 24px auto;min-width: 200px;max-width: 80%;" src="data:image/png;base64,' + b64 + '"/></div>';
    logText += "</div>";
    logText += '</body></html>'
    let prdName = String(productNameValue).replace('/', '');
    await setTimeout(2000);
    let pageName;

    if (pageNo > 1) {
      prdNo = ((pageNo - 1) * 12) + prdNo;
    }
    pageName = String(prdName + "[" + prdNo + " of " + totalProducts + "]");

    let fileName = String(pageName).replace(/ /g, "_");
    this.createFile(logText, fileName);
    await setTimeout(4000);
    await producPageTestInfo.attach(pageName, { contentType: "text/plain", path: fileName + '.html' });
    await setTimeout(4000);
    try {
      this.fs.unlink(fileName + '.html', function (err) {
        if (err) {
          throw err
        } else {
          console.log("Successfully deleted the file " + fileName + '.html')
        }

      })
    } catch (err) {
      logger.error("error message while deleting a file " + fileName + ": " + err.message);
    } finally {
      prductpage.close();
    }

  }
  createFile(myText: string, productNameValue: string) {

    this.fs.writeFileSync('./' + productNameValue + '.html', myText);

  }

  async verifyProductImageDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      expect(prductpage.locator(this.imageNumber)).toBeVisible();
      const imageCount = (
        await prductpage.locator(this.imageNumber).textContent()
      )?.charAt(4);
      let i = Number(imageCount);
      logText += '<div><b><u>Images:</u></b><br><br>';
      logger.info('Total Images:[' + i + ']');
      logger.info("----------\n");
      let j = 1;
      if (i > 0) {
        logText += '<table><tr><td><b>Total Images</b></td><td><b>Available at</b></td></tr>'
        logText += '<tr><td >[' + i + ']</td><td>';

        do { // loop for checking images
          const locator = prductpage.locator(this.imagePath);
          await expect(locator).toBeVisible();
          await prductpage.waitForSelector(this.imagePath);
          if ((await prductpage.$$(this.imagePath)).length > 0) {
            prductpage.waitForSelector(this.imagePath);
            const producImageSrc = await prductpage
              .locator(this.imagePath)
              .getAttribute('src');
            if (String(producImageSrc).indexOf('image-not-found') === -1) {
              logText += 'AVAILABLE at ' + j + '<br>';
              logger.info('AVAILABLE at ' + j + '\n');
            } else {
              logText += 'NOT AVAILABLE at :' + j + '<br>';
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
              logText += 'VIDEO Streaming at :' + j + '<br>';
              logger.info('VIDEO Streaming at :' + j + '\n');
            } else {
              logText += 'NOT AVAILABLE at :' + j + '<br>';
              logText += 'URL:' + url + '<br>';
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
        logText += "</td></tr></table>"
      } else {
        logText += '<br><b>Images not available</b><br>';
        logText += '<b>URL:</b>' + url + '<br>';
        logger.error('Images not available');
        logger.error('URL:' + url + '\n');
      }
    }
    logText += "</div>";
    await setTimeout(2000);
  }
  async verifyProductStatus() {
    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      logText += '<div><b><u>Product Availability:</u></b>';
      if ((await prductpage.$$(this.prdAvailable)).length > 0) {
        let productStatus = await prductpage.locator(this.prdAvailable).textContent();
        logText += '<b style="color:red" >&nbsp;&nbsp;' + productStatus + '</b></div><br>';
      } else {
        logText += '<b style="color:green" >&nbsp;&nbsp;YES</b></div><br>';
      }
    }
  }
  async validateProductPriceDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      const pricePositionsCount = (await prductpage.$$(this.priceTags)).length;

      logText += "<br><div><b><u>Price:</u><b><br><br>"
      logText += '<table><tr><td><b>Total Price Count</b></td><td><b>Price At</b></td></tr>'

      logText += '<tr><td>[' + pricePositionsCount + ']</td><td>';
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
            ']<br>';
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
            '] showing as below or equal to zero<br>';
          logger.error(
            'Price At ' +
            (priceCount + 1) +
            '] value ' +
            priceValue +
            '] showing as below or equal to zero\n'
          );
        }
      }
      logText += '</td></tr></table>'
    }
    logText += "</div>";
    await setTimeout(2000);
  }

  async validateHowToUseIt() {

    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      const howUseIt = (await prductpage.$$(this.howUseItButtonPath)).length;
      logText += "<br><div><b><u>How To Use It Content available:</u></b>"
      // logText += "How To Use It:\n-------------\n";
      logger.info("How To Use It:");
      logger.info("-------------\n");
      if (howUseIt > 0) {
        await prductpage.click(this.howUseItButtonPath);

        await prductpage.waitForSelector(this.howUseItContent);
        const howUseItContent = await prductpage.locator(this.howUseItContent).textContent();
        if (String(howUseItContent).length > 0) {
          logText += "<b style='color:green'>&nbsp;YES</b></div>"
          logger.info("               Content available\n");
        } else {
          logText += "<b style='color:green'>&nbsp;NO</b></div>"
          logger.info("                 Content not available\n");
        }
      } else {
        logText += "<b style='color:blue'>Section not available</b></div>"
        logger.info("                 Section not available\n");
      }

    }
  }

  async validateIngrediatntsDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      logText += "<br><div><b><u>Ingredients:</u></b><br>"
      //  logText += "Ingredients:\n-------------\n";
      logger.info("Ingredients:");
      logger.info("-------------\n");
      const ingredientsElement = (await prductpage.$$(this.ingredientsPath)).length;

      if (ingredientsElement > 0) {
        await prductpage.click(this.ingredientsPath);
        await setTimeout(2000);
        if ((await prductpage.$$(this.otherIngredientimg)).length > 0) {

          const ingredientImageSrc = await prductpage
            .locator(this.otherIngredientimgFile)
            .getAttribute('src');
          logText += '<br><div><b>Ingredient Image displayed:</b>';
          if (String(ingredientImageSrc).indexOf('image-not-found') === -1) {
            logText += '<b style="color:green">&nbsp;YES</b><br></div>';
            logger.info("Image displayed");
          } else {
            logText += '<b style="color:red">&nbsp;NO</b><br></div>';
            logger.info("Image not displayed");
          }
        }

        let ingredientImages = (await prductpage.$$(this.keyIngredientsImages)).length;
        logText += "<br><div><table>";
        if (ingredientImages > 0) {
          logText += "<tr><td colspan='3' style='text-align: center;'><b>Total Ingredients:[" + ingredientImages + "]</b></td></tr>";
          logText += '<tr><td><b>Ingredient Name</b></td><td><b>Content Available</b></td><td><b>Image Available</b></td></tr>';

          logger.info("Total Ingredients:[" + ingredientImages + "]");
          logger.info("------------------------\n");
          let j = 0;
          do { // loop for checking images in ingredients
            if (ingredientImages > 0) {
              logText += '<tr>'
              const ingredientName = await prductpage
                .locator(this.keyIngredientsName).nth(j).textContent();
              logText += "<td>" + ingredientName + "</td>";
              logger.info("Ingredient:" + (j + 1) + ":Name:" + ingredientName);
              const ingredientContent = await prductpage
                .locator(this.keyIngredientsContent).nth(j).textContent();
              if (String(ingredientContent).length > 0) {
                logText += "<td><b style='color:green'>YES</b></td>";
                logger.info("               Content available\n");
              } else {
                logText += "<td><bstyle='color:red'>No</b></td>";
                logger.info("                 Content not available\n");
              }
              if ((await prductpage.$$(this.keyIngredientsImages)).length > 0) {
                const producImageSrc = await prductpage
                  .locator(this.keyIngredientsImages).nth(j)
                  .getAttribute('src');
                if (String(producImageSrc).indexOf('image-not-found') === -1) {
                  logText += '<td><b style="color:green"> YES</b></td>'
                  logger.info('        IMage Available \n');
                } else {
                  logText += '<td><b style="color:red">NO</b></td>';
                  logger.error(
                    '                 IMage not Available ');
                  logger.error('URL:' + url + '\n');
                }
              }
              ingredientImages--;
              j++;
              logText += '</tr>';
            } else {
              logText += '<b>URL:' + url + '</b><br>';
              logger.error('URL:' + url + '\n');
            }
          } while (ingredientImages > 0);
        }
        logText += "<tr><td><b>All Ingredients:</b></td>"
        logger.info("All Ingredients:");
        logger.info("-------------------\n");
        let allIngredientsLength = (await prductpage.$$(this.allIngredients)).length;
        if (allIngredientsLength > 0) {
          const allIngredientsContent = await prductpage.locator(this.allIngredientsContent).textContent();
          if (String(allIngredientsContent).length > 0) {
            logText += "<td colspan='2'><b style='color:green'>Content available</b></td></tr>";
            logger.info("               Content available\n");
          } else {
            logText += "<td colspan='2'><b style='color:red'>Content not available</b></td></tr>";
            logger.info("               Content not available\n");
          }
        } else {
          logText += "<td colspan='2'><b style='color:blue'>Section not available</b></td></tr>";
          logger.info("                 Section not available\n");
        }


        logText += "<tr><td><b>Active Ingredients:</b></td>"
        logger.info("Active Ingredients:");
        logger.info("-------------------\n");
        let activeIngredientsLength = (await prductpage.$$(this.activeIngredients)).length;
        if (activeIngredientsLength > 0) {
          const activeIngredientsContent = await prductpage.locator(this.activeIngredientsContent).textContent();
          if (String(activeIngredientsContent).length > 0) {
            logText += "<td colspan='2'><b style='color:green'>Content available</b></td></tr>";
            logger.info("               Content available\n");
          } else {
            logText += "<td colspan='2'><b style='color:red'>Content not available</b></td></tr>";
            logger.info("               Content not available\n");
          }
        } else {
          logText += "<td colspan='2'><b style='color:blue'>Section not available</b></td></tr>";
          logger.info("                 Section not available\n");
        }
        logText += "<tr><td><b>Other Ingredients:</b></td>"
        logger.info("Other Ingredients:");
        logger.info("-------------\n");
        let otherIngredientsLength = (await prductpage.$$(this.otherIngredient)).length;
        if (otherIngredientsLength > 0) {
          const otherIngredientsContent = await prductpage.locator(this.otherIngredientContent).textContent();
          if (String(otherIngredientsContent).length > 0) {
            logText += "<td colspan='2'><b style='color:green'>Content available</b></td></tr></table></div>";
            logger.info("               Content available\n");
          } else {
            logText += "<td colspan='2'><b style='color:red'>Content not available</b></td></tr></table></div>";
            logger.info("               Content not available\n");
          }

        } else {
          logText += "<td colspan='2'><b style='color:blue'>Section not available</b></td></tr></table></div>";
          logger.info("                 Section not available\n");
        }
      }
      else {
        logText += "<b style='color:blue'>Section not available</b><br>";
        logger.info("                 Section not available\n");
      }
      logText += "</div>";
    }


    await setTimeout(2000);
  }

  async validateProductKitDetails() {
    await setTimeout(2000);
    if (((await prductpage.title()).indexOf('Product Not Found') === -1) && (await prductpage.title()).indexOf('Page Not Found') === -1 && (await prductpage.$$(this.emptySpace)).length === 0) {
      logText += "<br><div><div><b><u>Product KIT:</u></b><br>";
      logger.info("Product KIT:");
      logger.info("-------------\n");
      const productKit = (await prductpage.$$(this.productKitTextPath)).length;

      if (productKit > 0) {
        const totalKitItems = Number(await prductpage.locator(this.totalKitItems).textContent());
        //  const totalKitItems2 = await prductpage.$$(this.kitItemsDivPath);
        logText += "<table><tr><td colspan='4' style='text-align: center;'><b>Total Bundle Size:[" + totalKitItems + "]</b></td></tr>";
        logger.info("Total Bundle Size:" + totalKitItems);
        logger.info("--------------------\n");
        logger.info("Product URL:" + prductpage.url() + "\n");
        logText += '<tr><td><b>Item in the Bundle</b></td><td><b>Product image link available</b></td><td><b>Bundle Item having link</b></td><td><b>Prodcut Image displayed</b></td></tr>';

        for (let i = 0; i < totalKitItems; i++) {
          logText += '<tr>';
          let itemName = await prductpage.locator(this.kitItemsDivPath).nth(i).locator("//div[@class='font-weight-bold row no-gutters']").textContent();
          logText += '<td>' + String(itemName) + "</td>";
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
            //logText += "Product image link available:" + prodyctImageLink;
            logText += "<td><b style='color:green'>YES</b><br>" + prodyctImageLink + "</td>";
            logger.info("Product image link available:" + prodyctImageLink);

          } else {
            logText += "<td><b style='color:red'>NO</b></td>";
            //  logText += "Url :" + prductpage.url() + "\nProduct image link not available"
            logger.error("Url :" + prductpage.url())
            logger.error("Product image link not available");
          }
          if (String(itemLinkText).length > 0) {
            logText += "<td><b style='color:green'>YES</b><br>" + String(itemLinkText) + "</td>";
            //  logText += "\nBundle Item having link:" + String(itemLinkText);
            logger.info("Bundle Item having link:" + String(itemLinkText));

          } else {
            logText += "<td><b style='color:red'>NO</b></td>";
            logger.error("Bundle Item not having link");

            logger.error("Url :" + prductpage.url())
          }

          if (String(prodyctImage).indexOf("Not found") == -1) {
            logText += "<td><b style='color:green'>YES</b></td>";
            //logText += "\nProdcut Image displayed\n";
            logger.info("Prodcut Image displayed\n");

          } else {
            logText += "<td><b style='color:red'>NO</b</td>";
            //logText += "Url :" + prductpage.url() + "Prodcut Image not displayed\n";
            logger.error("Url :" + prductpage.url())
            logger.error("Prodcut Image not displayed\n");
          }
          logText += "</tr>";
        }
        logText += "</table></div>";
      } else {
        logText += "<b style='color:blue'>Product not having bundle items</b></div>";
        logger.info("Product not having bundle items\n");
      }
    }
    logText += "</div>"
    await setTimeout(2000);
  }


}
