import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider.js";
import IPage from "./iPage.js";
import { BrowserContext } from "playwright-core";

export default class PageFreeProxyCz implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string, private protocol: Protocol, private anonymityLevel: AnonymityLevel) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string, protocol: Protocol, anonymityLevel: AnonymityLevel) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageFreeProxyCz(url, page, sourceSite, protocol, anonymityLevel);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//table[@id='proxy_list']/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ip: string = await proxyRow.locator(`xpath=/td[1]`).innerText();
            const port: string = await proxyRow.locator(`xpath=/td[2]`).innerText();
            const country: string | undefined = await proxyRow.locator(`xpath=/td[4]`).innerText();
            const city: string = await proxyRow.locator(`xpath=/td[6]`).innerText();
            const speed: string = await proxyRow.locator(`xpath=/td[8]`).innerText();
            const uptime: string = await proxyRow.locator(`xpath=/td[9]`).innerText();
            const response: string = await proxyRow.locator(`xpath=/td[10]`).innerText();
            const lastCheked: string = await proxyRow.locator(`xpath=/td[11]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, city: city, anonymityLevel: this.anonymityLevel, protocols: [this.protocol], sourceSite: this.sourceSite, speed: speed, uptime: uptime, responseTime: response, lastTested: lastCheked };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}