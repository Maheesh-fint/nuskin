import {Logger} from 'tslog';
import {BasePage} from './BasePage';
import {appendFileSync} from "fs";
import {expect} from '@playwright/test';

let logger: Logger<unknown>;
let basePage: BasePage;

export class ProductPage extends BasePage {

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

    constructor(page) {
        super(page);
        basePage = new BasePage(page);
        logger = new Logger({type: "pretty"});
        logger.attachTransport((logObj) => {
            appendFileSync("logs.txt", JSON.stringify(logObj) + "\n");
        });
    }

    async getProductDetails(productURL: string, productNameValue: string, productCategory: string, pageNo: number, productNo: number) {

        const sleep = (ms) => {
            return new Promise((resolve) => setTimeout(resolve, ms));
        };

        logger.info('------------------------------------------------------------------------');
        logger.info('Page No:[' + pageNo + '] : Product: [' + (productNo + 1) + ']');
        logger.info('Product Name:[' + productNameValue + ']\n');

        const productPage = await this.page.context().newPage();

        const url = 'https://nuglobalbasev1-uat.skavacommerce.com' + productURL;
        await productPage.goto(url, {waitUntil: 'load'});

        await productPage.context().clearCookies();
        await sleep(1000);
        await productPage.waitForURL(url);
        await expect(productPage).toHaveURL(url);

        if (!((await productPage.title()).indexOf('Product Not Found') === -1)) {

            logger.error('No Product(s) Found');
            logger.info();
            logger.error('URL:' + url);
            await productPage.close();

        } else {

            await sleep(500);
            await expect(productPage.locator(this.imageNumber)).toBeVisible();
            const imageCount = (
                await productPage.locator(this.imageNumber).textContent()
            )?.charAt(4);
            let i = Number(imageCount);
            logger.info('Images:[' + i + ']');
            logger.info("----------\n");
            let j = 1;
            do { // loop for checking images
                await expect(productPage.locator(this.imagePath)).toBeVisible();
                if ((await productPage.$$(this.imagePath)).length > 0) {
                    await productPage.waitForSelector(this.imagePath);
                    const productImageSrc = await productPage.locator(this.imagePath).getAttribute('src');

                    if (String(productImageSrc).indexOf('image-not-found') === -1) {
                        logger.info('AVAILABLE at [' + j + ']\n');
                    } else {
                        logger.error(
                            'NOT AVAILABLE at :[' + j + ']'
                        );
                        logger.error('URL:' + url + '\n');
                    }
                } else if (await basePage.isElementVisible(this.videoPath)) {
                    const productImageSrc = await productPage
                        .locator(this.videoPath)
                        .getAttribute('src');
                    if (String(productImageSrc).indexOf('image-not-found') === -1) {
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
                    await productPage.click(this.nextImage);
                }
                await sleep(1000);
            } while (i > 0);


            const howUseIt = (await productPage.$$(this.howUseItButtonPath)).length;
            await sleep(1000);
            logger.info("How To Use It:");
            logger.info("-------------\n");

            if (howUseIt > 0) {
                await productPage.click(this.howUseItButtonPath);
                await sleep(1000);
                await productPage.waitForSelector(this.howUseItContent);
                await expect(productPage.locator(this.howUseItContent)).toBeVisible();
                const howUseItContent = await productPage.locator(this.howUseItContent).textContent();

                if (String(howUseItContent).length > 0) {
                    logger.info("               Content available\n");
                }
            } else {
                logger.info("                 Section not available\n");
            }

            const pricePositionsCount = (await productPage.$$(this.priceTags)).length;
            logger.info("Price:");
            logger.info("-----\n");
            logger.info('Total Price Count:[' + pricePositionsCount + ']\n');

            for (let priceCount = 0; priceCount < pricePositionsCount; priceCount++) { // loop for checking prices

                const priceValue = await productPage.locator(this.priceTags).nth(priceCount).textContent();
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
            await productPage.close();
        }
    }


}
