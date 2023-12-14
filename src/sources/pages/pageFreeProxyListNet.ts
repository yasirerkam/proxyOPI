import { Page } from "playwright-core";
import { Proxy } from "../../proxyProvider";

export default class PageFreeProxyListNet {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies() {
        const proxyList = [];

        const proxyRows = await this.page.locator(`//table[@class='table table-striped table-bordered']/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ip: string = await proxyRow.locator(`/td[1]`).innerText();
            const port: string = await proxyRow.locator(`/td[2]`).innerText();
            const country: string | undefined = await proxyRow.locator(`/td[3]`).innerText();
            const anonymityLevel: string = await proxyRow.locator(`/td[5]`).innerText();
            const protocol: string = await proxyRow.locator(`/td[7]`).innerText();
            const lastCheked: string = await proxyRow.locator(`/td[8]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, anonymityLevel: anonymityLevel, protocols: [protocol], sourceSite: this.sourceSite, lastTested: lastCheked };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}