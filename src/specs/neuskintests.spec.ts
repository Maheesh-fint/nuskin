import { test } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { HomePage } from '../pages/HomePage';
import { ProductsContentPage } from '../pages/ProductsContentPage';

test.use({ launchOptions: { slowMo: 20 } });
test.describe.configure({ mode: 'parallel' });

test.describe('NUSKIN Product scenarios', () => {
  let basePage;
  let homePage;
  let productsContentPage;

  // test('Nuskin Beauty Devices product content verification',async ({ baseURL,page}, testInfo) => {
   
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   productsContentPage=new ProductsContentPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Beauty Devices");
  //   await productsContentPage.clickEachProduct("Beauty Devices",testInfo,baseURL,"NO");
  // });

  // test('Nuskin Skin & Beauty product content verification', async ({baseURL, page}, testInfo) => {
  
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   productsContentPage = new ProductsContentPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct('Skin & Beauty');
  //   await productsContentPage.clickEachProduct('Skin & Beauty',testInfo,baseURL,"No");
  // });

//   test('Nuskin Nutrition product content verification', async ({baseURL,page}, testInfo) => {
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage = new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct('Nutrition');
//     await productsContentPage.clickEachProduct('Nutrition',testInfo,baseURL,"NO");
//   });

 
//   test('Nuskin New & Loved product content verification', async ({baseURL, page}, testInfo) => {
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage = new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct('New & Loved');
//     await productsContentPage.clickEachProduct('New & Loved',testInfo,baseURL,"NO");
//   });

// test('Nuskin Product Lines ageLOC LumiSpa content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines ageLOC LumiSpa");
//     await productsContentPage.clickEachProduct("Product Lines ageLOC LumiSpa",testInfo,baseURL,"brand");
//   });
//   test('Nuskin Product Lines ageLOC TR90 content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines ageLOC TR90");
//     await productsContentPage.clickEachProduct("Product Lines ageLOC TR90",testInfo,baseURL,"brand");
//   });
//   test('Nuskin Product Lines aBeauty Focus content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines aBeauty Focus");
//     await productsContentPage.clickEachProduct("Product Lines aBeauty Focus",testInfo,baseURL,"brand");
//   });
//   test('Nuskin Product Lines Epoch content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines Epoch");
//     await productsContentPage.clickEachProduct("Product Lines Epoch",testInfo,baseURL,"brand");
//   });
//  test('Nuskin Product Lines LifePak content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines LifePak");
//     await productsContentPage.clickEachProduct("Product Lines LifePak",testInfo,baseURL,"brand");
//   });
//   test('Nuskin Product Lines Nu Colour content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines Nu Colour");
//     await productsContentPage.clickEachProduct("Product Lines Nu Colour",testInfo,baseURL,"brand");
//   });
//   test('Nuskin Product Lines Nu Skin Body content verification', async ({ baseURL,page}, testInfo) => {
 
//     basePage = new BasePage(page);
//     homePage = new HomePage(page);
//     productsContentPage=new ProductsContentPage(page);
//     await basePage.navigate();
//     await homePage.gotoProduct("Product Lines Nu Skin Body");
//     await productsContentPage.clickEachProduct("Product Lines Nu Skin Body",testInfo,baseURL,"brand");
//   });
  // test('Nuskin Product Lines Nu Skin Other content verification', async ({ baseURL,page}, testInfo) => {
 
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   productsContentPage=new ProductsContentPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Product Lines Nu Skin Other");
  //   await productsContentPage.clickEachProduct("Product Lines Nu Skin Other",testInfo,baseURL,"brand");
  // });
  // test('Nuskin Product Lines Nutricentials content verification', async ({ baseURL,page}, testInfo) => {
 
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   productsContentPage=new ProductsContentPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Product Lines Nutricentials");
  //   await productsContentPage.clickEachProduct("Product Lines Nutricentials",testInfo,baseURL,"brand");
  // });
  // test('Nuskin Product Lines Pharmanex Digestion & Detox content verification', async ({ baseURL,page}, testInfo) => {
 
  //   basePage = new BasePage(page);
  //   homePage = new HomePage(page);
  //   productsContentPage=new ProductsContentPage(page);
  //   await basePage.navigate();
  //   await homePage.gotoProduct("Product Lines Pharmanex Digestion & Detox");
  //   await productsContentPage.clickEachProduct("Product Lines Pharmanex Digestion & Detox",testInfo,baseURL,"brand");
  // });
  test('Nuskin content verification for single Product ', async ({baseURL,page}, testInfo) => {
   // let productUrl = baseURL+"/us/en/product/wellness-premium-kit-US";
    let productUrl =baseURL+"/us/en/product/180-face-wash?categoryId=anti-aging";
    basePage = new BasePage(page);
    homePage = new HomePage(page);
    productsContentPage = new ProductsContentPage(page);
    await basePage.navigate();
    await productsContentPage.validateSingleProduct(productUrl,testInfo,baseURL);
  });

});
