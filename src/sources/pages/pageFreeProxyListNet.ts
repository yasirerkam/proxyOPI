import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage.js";

export default class PageFreeProxyListNet implements IPage {
    constructor(public url: string, private page: Page, private source: string) { }

    static async constructAsync(context: BrowserContext, url: string, source: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageFreeProxyListNet(url, page, source);
        });
    }

    async getProxies() {
        const proxyList: Proxy[] = [];

        const proxyRows = await this.page.locator(`//table[@class='table table-striped table-bordered']/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ipAddress: string = await proxyRow.locator(`/td[1]`).innerText();
            const port: number = Number(await proxyRow.locator(`/td[2]`).innerText());
            const country: string | undefined = await proxyRow.locator(`/td[3]`).innerText();
            const anonymityLevel: AnonymityLevel = this.transformAnonymityLevel(await proxyRow.locator(`/td[5]`).innerText());
            const protocol: Protocol = this.transformProtocol(await proxyRow.locator(`/td[7]`).innerText());
            const lastCheked: string = await proxyRow.locator(`/td[8]`).innerText();

            const proxy: Proxy = { ipAddress: ipAddress, port: port, country: country, anonymityLevel: anonymityLevel, protocols: [protocol], source: this.source, lastTested: lastCheked };
            proxyList.push(proxy);
        }

        return proxyList;
    }

    transformProtocol(protocol: string): Protocol {
        switch (protocol.trim().toLowerCase()) {
            case "no":
                return Protocol.http;
            case "yes":
                return Protocol.https;
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
            case "elite proxy":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}