import {expect, Page} from '@playwright/test';
import {BasePage} from './BasePage';
import {HomePage} from './HomePage';
import {Logger} from 'tslog';
import {ProductPage} from './ProductPage';

let homePage: HomePage;
let basePage: BasePage;
let logger: Logger<unknown>;
let productPage: ProductPage;

export class BeautyDevicesPage extends BasePage {
    public readonly noOfPages = "//a[contains(@aria-label,'Gotopage')]";
    public readonly nextLink = "//li[@class='page-item']//a[@class='page-link']//span[text()='Next']";
    public isNextPageAvailable = 'false';
    public readonly productImages = "//a[@class='image-container-wrap']";
    public readonly noProductImage = "(//*[contains(text(),'No Product')])[1]";

    constructor(page: Page) {
        super(page);
        homePage = new HomePage(page);
        basePage = new BasePage(page);
        logger = new Logger();
        productPage = new ProductPage(page);
    }

    async clickEachProduct(productCategory: string) {
        const sleep = (ms: number | undefined) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };
        logger.info('Product Category:[' + productCategory + ']');
        let url = this.page.url();
        let pageNo = 1;
        logger.info('Page No:[' + pageNo + ']');
        let productNameValue: string | null;

        do {
            await this.page.waitForURL(url);
            await expect(this.page).toHaveURL(url);

            if ((await this.page.title()).indexOf('Product Not Found') === -1) {
                await this.page.waitForSelector(this.productImages);
                await expect(this.page.locator(this.productImages).nth(1)).toBeVisible();
                const count = (await this.page.$$(this.productImages)).length;
                logger.info('Product Count:[' + count + ']');
                for (let productNo = 0; productNo < count; productNo++) {
                    // looping all the products in the page
                    const productNameXpath = "((//a[@class='image-container-wrap'])[" + (productNo + 1) + ']/..//a)[2]';
                    await sleep(200);
                    if (await this.page.isVisible(productNameXpath)) {
                        productNameValue = await this.page.textContent(productNameXpath);
                    } else {
                        await basePage.navigateToPage(url);
                        productNameValue = await this.page.textContent(productNameXpath);
                    }
                    const productURL = await this.page
                        .locator(this.productImages)
                        .nth(productNo)
                        .getAttribute('href');
                    await productPage.getProductDetails(String(productURL), String(productNameValue), productCategory, pageNo, Number(productNo));
                }
            } else {
                logger.info('Products not available in page:' + pageNo);
            }
            if (await basePage.isElementVisible(this.nextLink)) { // checking next page available
                this.isNextPageAvailable = 'true';
                logger.info('FINISHED Page No:[' + pageNo + '] ');
                logger.info('-------------------------------------------------------------------');
                logger.info('Page No::[' + ++pageNo + ']');
                url = (await homePage.getCurrentProductURL(productCategory)) + '?page=' + pageNo;
                await basePage.navigateToPage(url);
                await this.page.waitForLoadState('domcontentloaded');
                await expect(this.page).toHaveURL(url);
            } else {
                this.isNextPageAvailable = 'false';
            }
        } while (this.isNextPageAvailable == 'true');
    }
}
