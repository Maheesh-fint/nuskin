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
      //  url = String('https://test.nuskin.com/us/en/catalog/beauty_devices');
        url = String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/beauty_devices');
      
        break;
      case 'Skin & Beauty':
        url = String('https://test.nuskin.com/us/en/catalog/all_skin_andBeauty');
        //url=  String('https://test.nuskin.com/us/en/en/catalog/clear_action');
        break;
      case 'Nutrition':
       url = String('https://test.nuskin.com/us/en/catalog/all_nutrition');
        //url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_productCategory%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22all_nutrition%22%7D%5D%7D');
        break;
      case 'Product Lines ageLOC LumiSpa':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22ageLOC%20LumiSpa%22%7D%5D%7D');
        break;
      case 'Product Lines ageLOC TR90':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22ageLOC%20TR90%22%7D%5D%7D');
        break;
      case 'Product Lines aBeauty Focus':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Beauty%20Focus%22%7D%5D%7D');
        break;
      case 'Product Lines Epoch':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Epoch%22%7D%5D%7D');
        break;
      case 'Product Lines LifePak':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22LifePak%22%7D%5D%7D');
        break;
      case 'Product Lines Nu Colour':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Nu%20Colour%22%7D%5D%7D'); 
        break;
      case 'Product Lines Nu Skin Body':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Nu%20Skin%20Body%22%7D%5D%7D');
        break;
      case 'Product Lines Nu Skin Other':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Nu%20Skin%20Other%22%7D%5D%7D');
        break;
        case 'Product Lines Nutricentials':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Nutricentials%22%7D%5D%7D');
        break;
        case 'Product Lines Pharmanex Digestion & Detox':
        url = String('https://test.nuskin.com/us/en/catalog/all_products?filter=%7B%22filters%22%3A%5B%7B%22field%22%3A%22facet_brand%22%2C%22operation%22%3A%22IN%22%2C%22value%22%3A%22Nu%20Skin%20Other%22%7D%5D%7D');
        break;
      case 'New & Loved':
        url = String('https://test.nuskin.com/us/en/catalog/all_new_andloved');
        // url= String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/lumispa_kits');
        break;
    }
    return url;
  }
}
