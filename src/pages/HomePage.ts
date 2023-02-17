import {expect} from '@playwright/test';
import {BasePage} from './BasePage';

export class HomePage extends BasePage {

    constructor(page) {
        super(page);
    }

    async gotoProduct(product: string) {
        let productURL = await this.getCurrentProductURL(product);
        await this.page.goto(productURL, {waitUntil: 'domcontentloaded'});
        await this.page.context().clearCookies();
        await expect(this.page).toHaveURL(String(productURL));
    }

    async getCurrentProductURL(product: string): Promise<string> {

        let baseurl = String('https://nuglobalbasev1-uat.skavacommerce.com/us/en/catalog/all_');
        let url = '';

        switch (product) {
            case 'Beauty Devices':
                url = String('/beauty_devices');
                break;
            case 'Skin & Beauty':
                url = String(baseurl + 'andBeauty');
                break;
            case 'Nutrition':
                url = String(baseurl + '_nutrition');
                break;
            case 'Product Lines':
                url = String(baseurl + 'products');
                break;
            case 'New & Loved':
                url = String(baseurl + 'new_andloved');
                break;
        }
        return url;
    }

}
