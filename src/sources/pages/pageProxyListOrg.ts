import { Page } from "playwright-core";

export default class PageProxyListOrg {
    constructor(public page: Page) { }

    async getProxies() {
        const proxyList = [];

        for (let i = 1; i < 15; i++) {
            const proxy = this.page.locator(`xpath=//div[@class='table-wrap']//ul[${i}]`);

            const proxyIpPort = (await proxy.locator(`xpath=//li[@class='proxy']`).innerText()).split(":");
            const ip: string = proxyIpPort[0];
            const port: string = proxyIpPort[1];
            const country: string | undefined = await proxy.locator(`xpath=//span[@class='country-code']//span[@class='name']`).getAttribute("code") as string | undefined;
            const city: string = await proxy.locator(`xpath=//span[@class='city']//span`).innerText();
            const anonymityLevel: string = await proxy.locator(`xpath=//li[@class="type"]`).innerText();
            const protocol: string = await proxy.locator(`xpath=//li[@class='https']`).innerText();

            proxyList.push({ ip, port, country, city, anonymityLevel, protocols: [protocol] as [string], sourceSite: "proxy-list.org" });
        }

        return proxyList;
    }
}