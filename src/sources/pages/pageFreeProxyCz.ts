import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";

export default class pageFreeProxyCz {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies(protocol: Protocol, anonimityLevel: AnonymityLevel): Promise<Proxy[]> {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//table[@id='proxy_list']/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ip: string = await proxyRow.locator(`xpath=//td[1]`).innerText();
            const port: string = await proxyRow.locator(`xpath=//td[2]`).innerText();
            const country: string | undefined = await proxyRow.locator(`xpath=//td[4]`).innerText();
            const city: string = await proxyRow.locator(`xpath=//td[6]`).innerText();
            const speed: string = await proxyRow.locator(`xpath=//td[8]`).innerText();
            const uptime: string = await proxyRow.locator(`xpath=//td[9]`).innerText();
            const response: string = await proxyRow.locator(`xpath=//td[10]`).innerText();
            const lastCheked: string = await proxyRow.locator(`xpath=//td[11]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, city: city, anonymityLevel: anonimityLevel, protocols: [protocol], sourceSite: this.sourceSite, speed: speed, uptime: uptime, responseTime: response, lastTested: lastCheked };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}