import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider.js";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage.js";

export default class PageProxyListOrg implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageProxyListOrg(url, page, sourceSite);
        });
    }

    async getProxies() {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//div[@class='table-wrap']//ul`).all();
        for (const proxyRow of proxyRows) {
            const proxyIpPort = (await proxyRow.locator(`xpath=//li[@class='proxy']`).innerText()).split(":");
            const ip: string = proxyIpPort[0];
            const port: string = proxyIpPort[1];
            const country: string | undefined = await proxyRow.locator(`xpath=//span[@class='country-code']//span[@class='name']`).getAttribute("code") as string | undefined;
            const city: string = await proxyRow.locator(`xpath=//span[@class='city']//span`).innerText();
            const anonymityLevel: AnonymityLevel = this.transformAnonymityLevel(await proxyRow.locator(`xpath=//li[@class="type"]`).innerText());
            const protocol: Protocol = this.transformProtocol(await proxyRow.locator(`xpath=//li[@class='https']`).innerText());

            const proxy: Proxy = { ip: ip, port: port, country: country, city: city, anonymityLevel: anonymityLevel, protocols: [protocol], sourceSite: this.sourceSite };
            proxyList.push(proxy);
        }

        return proxyList;
    }

    transformProtocol(protocol: string): Protocol {
        switch (protocol.trim().toLowerCase()) {
            case "http":
                return Protocol.http;
            case "https":
                return Protocol.https;
            case "socks4":
                return Protocol.socks4;
            case "socks5":
                return Protocol.socks5;
            default:
                return Protocol.unknown;
        }
    }

    transformAnonymityLevel(anonymityLevel: string): AnonymityLevel {
        switch (anonymityLevel.trim().toLowerCase()) {
            case "transparent":
                return AnonymityLevel.transparent;
            case "anonymous":
                return AnonymityLevel.anonymous;
            case "elite":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}