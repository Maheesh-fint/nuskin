import { expect, TestInfo } from '@playwright/test';

import { isVisible } from '../utils/commonactions';
import { BasePage } from './BasePage';
import { HomePage } from './HomePage';
import { Logger } from 'tslog';
import { ProductPage } from './ProductPage';
import { Page } from '@playwright/test';



let homePage: HomePage;
let basePage: BasePage;
let logger: Logger<unknown>;
let productPage: ProductPage;

export class ProductsContentPage extends BasePage {
  constructor(page: Page) {
    super(page);
    homePage = new HomePage(page);
    basePage = new BasePage(page);
    logger = new Logger();

  }
  public readonly noOfPages = "//a[contains(@aria-label,'Gotopage')]";
  public readonly nextLink =
    "//li[@class='page-item']//a[@class='page-link']//span[text()='Next']";
  public isNextPageAvaialable = 'false';
  public readonly productImages = "//a[@class='image-container-wrap']";
  public readonly noProductImage = "(//*[contains(text(),'No Product')])[1]";
  public readonly totalProducts = "//*[@class='product-count']";

  async clickEachProduct(productCategory: string, testInfo: TestInfo,baseURL:string, brand:string) {
    let totalProductscount;
    productPage = new ProductPage(this.page, testInfo);
    const sleep = (ms: number | undefined) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };
    logger.info('Product Category:[' + productCategory + ']');
    let url = await this.page.url();
    let pageNo = 1;
    if ((await this.page.title()).indexOf('Product Not Found') === -1 && (await this.page.title()).indexOf('Page Not Found') === -1) {
      await this.page.waitForSelector(this.totalProducts);
       totalProductscount = (await this.page.locator(this.totalProducts).textContent());
      totalProductscount = String(totalProductscount).split(" ")[0].replace("(", "");
      logger.info('Total Products:[' + totalProductscount + ']');
      // logger.info('Page No:[' + pageNo + ']');
    }

    let productNameValue = '';
    do {
     let pageTitle= await this.page.title();
      if (pageTitle.indexOf('Product Not Found') === -1 && pageTitle.indexOf('Page Not Found') === -1) {
   
        await this.page.waitForSelector(this.productImages);
        expect(this.page.locator(this.productImages).nth(1)).toBeVisible();
        const count = (await this.page.$$(this.productImages)).length;
        logger.info('Total Products in Page ' + pageNo + ':[' + count + ']');

        for (let productNo = 0; productNo < count; productNo++) {
          productNameValue = ''
          // looping all the products in the page
          try {
            const productNameXpath =
              "((//a[@class='image-container-wrap'])[" +
              (productNo + 1) +
              ']/..//a)[2]';
            await sleep(200);
            if (await this.page.isVisible(productNameXpath)) {
              productNameValue += await this.page.textContent(productNameXpath);
            } else {
              basePage.navigateToPage(url);
              productNameValue += await this.page.textContent(productNameXpath);
            }
            const productURL =baseURL+await this.page
              .locator(this.productImages)
              .nth(productNo)
              .getAttribute('href');
            logger.info('Page No:[' + pageNo + '] : Product: [' + (productNo + 1) + ']');
            logger.info('Product Name:[' + productNameValue + ']\n');
            logger.info('-------------------------------------------------------------------');
            await productPage.createProductPage(String(productURL),productNameValue);
            //Product avaialability
            await productPage.verifyProductStatus();
            //Image validation
            await productPage.verifyProductImageDetails();
            //Price validation
            await productPage.validateProductPriceDetails();
            //How To Use It validation
            await productPage.validateHowToUseIt();
            //Ingrediatnts validation
            await productPage.validateIngrediatntsDetails();
            //Product Kit validation
            await productPage.validateProductKitDetails();
           // await productPage.closeProductPage();
          } catch (error) {

           // if (error instanceof playwright.errors.TimeoutError){
              logger.error("error message is:"+error.message);
            logger.info('Got Exception while validating Product Name:[' + String(productNameValue) + '] \n');
            continue;
            //  }
          } finally {
           // logger.info("finally :productNameValue---===---"+productNameValue);
            await productPage.closeProductPage(pageNo,(productNo + 1),totalProductscount);
            logger.info('-------------------------------------------------------------------');
          }
        }

      } else {
        logger.info('Products not available in page:' + pageNo);
      }
      if (await basePage.isElementVisisble(this.nextLink)) { // checking next page available
        this.isNextPageAvaialable = 'true';
        logger.info('FINISHED Page No:[' + pageNo + '] ');
        logger.info('-------------------------------------------------------------------');
     //   logger.info('Page No::[' + ++pageNo + ']');
        pageNo = pageNo + 1;
        url =
          (await homePage.getCurrentProductUR(productCategory));
          if(brand==='brand'){
            url+= '&page=';
            }else{
              url+= '?page=';
            }
      url+= pageNo;
          console.log("url===-==-==-==-=="+url);
        basePage.navigateToPage(url);
        expect(this.page).toHaveURL(url);
      } else {
        this.isNextPageAvaialable = 'false';
      }
    } while (this.isNextPageAvaialable == 'true');
 
   }
   async validateSingleProduct(productUrl: string, testInfo: TestInfo) {
    productPage = new ProductPage(this.page, testInfo);
    await productPage.createProductPage(String(productUrl),'Product Not Found');
    //Product avaialability
    await productPage.verifyProductStatus();
    // Image validation
    await productPage.verifyProductImageDetails();
    //Price validation
    await productPage.validateProductPriceDetails();
    //How To Use It validation
    await productPage.validateHowToUseIt();
    //Ingrediatnts validation
    await productPage.validateIngrediatntsDetails();
    //Product Kit validation
     await productPage.validateProductKitDetails();
     await productPage.closeProductPage(1,1,"1");
  }
}
