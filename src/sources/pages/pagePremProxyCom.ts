import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import IPage from "./iPage.js";
import { BrowserContext } from "playwright-core";

export default class PagePremProxyCom implements IPage {
    constructor(public url: string, private page: Page, private source: string) { }

    static async constructAsync(context: BrowserContext, url: string, source: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PagePremProxyCom(url, page, source);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const proxyRows = await this.page.locator(`xpath=//table[@id="proxylistt"]/tbody/tr`).all();
        proxyRows.pop(); // last row is empty
        for (const proxyRow of proxyRows) {
            const ipPort: string[] = (await proxyRow.locator(`xpath=/td[1]`).innerText()).split(':');
            const ipAddress: string = ipPort[0];
            const port: number = Number(ipPort[1]);
            const anonymityType: string = await proxyRow.locator(`xpath=/td[2]`).innerText();
            const lastCheked: string = await proxyRow.locator(`xpath=/td[3]`).innerText();
            const country: string | undefined = await proxyRow.locator(`xpath=/td[4]`).innerText();
            const city: string = await proxyRow.locator(`xpath=/td[5]`).innerText();

            const proxy: Proxy = { ipAddress: ipAddress, port: port, country: country, city: city, anonymityLevel: this.transformAnonymityLevel(anonymityType), protocols: [this.transformProtocol(anonymityType)], source: this.source, lastTested: lastCheked };
            proxyList.push(proxy);
        }

        return proxyList;
    }

    transformProtocol(anonymityType: string): Protocol {
        if (anonymityType.toLowerCase().includes("ssl"))
            return Protocol.https;
        else
            return Protocol.http;
    }

    transformAnonymityLevel(anonymityType: string): AnonymityLevel {
        switch (anonymityType.split(",")[0].trim().toLowerCase()) {
            case "transparent":
                return AnonymityLevel.transparent;
            case "anonymous":
                return AnonymityLevel.anonymous;
            case "high-anonymous":
                return AnonymityLevel.anonymous;
            case "elite":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}