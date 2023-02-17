import { test } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { BeautyDevicesPage } from '../pages/ProductsContentPage';

test.use({ launchOptions: { slowMo: 20 } });
test.describe.configure({ mode: 'parallel' });

test.describe('NUSKIN Product scenarios', () => {
  let basePage;
  let homePage;
  let beautyDevicesPage;

  // test('Nuskin Beauty Devices product content verification', async ({ page }) => {
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   beautyDevicesPage=new BeautyDevicesPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Beauty Devices");
  //   await beautyDevicesPage.clickEachProduct("Beauty Devices");
  // });

  // test('Nuskin Skin & Beauty product content verification', async ({
  //   page
  // }) => {

  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   beautyDevicesPage = new BeautyDevicesPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct('Skin & Beauty');
  //   await beautyDevicesPage.clickEachProduct('Skin & Beauty');
  // });

  // test('Nuskin Nutrition product content verification', async ({ page }) => {
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   beautyDevicesPage = new BeautyDevicesPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct('Nutrition');
  //   await beautyDevicesPage.clickEachProduct('Nutrition');
  // });

  // test('Nuskin Product Lines product content verification', async ({ page }) => {
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   beautyDevicesPage=new BeautyDevicesPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Product Lines");
  //   await beautyDevicesPage.clickEachProduct("Product Lines");
  // });

  test('Nuskin New & Loved product content verification', async ({ page }) => {
    basePage = new BasePage(page);
    homePage = new HomePage(page);
    beautyDevicesPage = new BeautyDevicesPage(page);
    await basePage.navigate();
    await homePage.gotoProduct('New & Loved');
    await beautyDevicesPage.clickEachProduct('New & Loved');
  });
});
