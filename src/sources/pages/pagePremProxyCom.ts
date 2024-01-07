import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import IPage from "./iPage.js";
import { BrowserContext } from "playwright-core";

export default class PagePremProxyCom implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PagePremProxyCom(url, page, sourceSite);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList = [];

        const proxyRows = await this.page.locator(`xpath=//table[@id="proxylistt"]/tbody/tr`).all();
        proxyRows.pop(); // last row is empty
        for (const proxyRow of proxyRows) {
            const ipPort: string[] = (await proxyRow.locator(`xpath=/td[1]`).innerText()).split(':');
            const ip: string = ipPort[0];
            const port: string = ipPort[1];
            const anonymityType: string = await proxyRow.locator(`xpath=/td[2]`).innerText();
            const lastCheked: string = await proxyRow.locator(`xpath=/td[3]`).innerText();
            const country: string | undefined = await proxyRow.locator(`xpath=/td[4]`).innerText();
            const city: string = await proxyRow.locator(`xpath=/td[5]`).innerText();

            const proxy: Proxy = { ip: ip, port: port, country: country, city: city, anonymityLevel: this.transformAnonymityLevel(anonymityType), protocols: [this.transformProtocol(anonymityType)], sourceSite: this.sourceSite, lastTested: lastCheked };
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
            case "anonymous" || "high-anonymous":
                return AnonymityLevel.anonymous;
            case "elite":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}