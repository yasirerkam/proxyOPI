import { Page } from "playwright-core";
import { Proxy } from "../../proxyProvider";

export default class PageProxyListOrg {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies() {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//div[@class='table-wrap']//ul`).all();
        for (const proxyRow of proxyRows) {
            const proxyIpPort = (await proxyRow.locator(`xpath=//li[@class='proxy']`).innerText()).split(":");
            const ip: string = proxyIpPort[0];
            const port: string = proxyIpPort[1];
            const country: string | undefined = await proxyRow.locator(`xpath=//span[@class='country-code']//span[@class='name']`).getAttribute("code") as string | undefined;
            const city: string = await proxyRow.locator(`xpath=//span[@class='city']//span`).innerText();
            const anonymityLevel: string = await proxyRow.locator(`xpath=//li[@class="type"]`).innerText();
            const protocol: string = await proxyRow.locator(`xpath=//li[@class='https']`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, city: city, anonymityLevel: anonymityLevel, protocols: [protocol], sourceSite: this.sourceSite };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}