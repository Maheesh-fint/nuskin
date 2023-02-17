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
    await this.page.goto(productURL, { waitUntil: 'domcontentloaded' });
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
        url=  String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_skin_andBeauty');
        break;
      case 'Nutrition':
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_nutrition');
        break;
      case 'Product Lines':
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_products');
        break;
      case 'New & Loved':
        url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_new_andloved');
        break;
    }
   return url;
  }
}
