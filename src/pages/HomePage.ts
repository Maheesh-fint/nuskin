import { expect } from '@playwright/test';
import { user } from '../testdata/testdata';
import { isVisible } from '../utils/commonactions';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page) {
    super(page);
  }

  async gotoProduct(product: string) {
    
    let productURL = await this.getCurrentProductUR(product);
    await this.page.goto(productURL);
   // this.waitUntilPageLoadHTML(this.page);
    await this.page.context().clearCookies();
    expect(this.page).toHaveURL(String(productURL));
  }

  async getCurrentProductUR(product: string): Promise<string> {
    let url;
    switch (product) {
      case 'Beauty Devices':
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/beauty_devices');
        break;
      case 'Skin & Beauty':
        //url=  String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_skin_andBeauty');
        url=  String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/clear_action');
        break;
      case 'Nutrition':
       // url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_nutrition');
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_productCategory%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22all_nutrition%22%7D%5D%7D');
        break;
      case 'Product Lines':
      //  url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_products');
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/lumispa');
        break;
      case 'New & Loved':
       // url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_new_andloved');
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/lumispa_kits');
        break;
    }
   return url;
  }
}
