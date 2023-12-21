import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage";

export default class PageFreeProxyListNet implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageFreeProxyListNet(url, page, sourceSite);
        });
    }

    async getProxies() {
        const proxyList = [];

        const proxyRows = await this.page.locator(`//table[@class='table table-striped table-bordered']/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ip: string = await proxyRow.locator(`/td[1]`).innerText();
            const port: string = await proxyRow.locator(`/td[2]`).innerText();
            const country: string | undefined = await proxyRow.locator(`/td[3]`).innerText();
            const anonymityLevel: AnonymityLevel = this.transformAnonymityLevel(await proxyRow.locator(`/td[5]`).innerText());
            const protocol: Protocol = this.transformProtocol(await proxyRow.locator(`/td[7]`).innerText());
            const lastCheked: string = await proxyRow.locator(`/td[8]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, anonymityLevel: anonymityLevel, protocols: [protocol], sourceSite: this.sourceSite, lastTested: lastCheked };
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