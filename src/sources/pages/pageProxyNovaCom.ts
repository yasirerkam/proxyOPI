import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage.js";

export default class PageProxyNovaCom implements IPage {
    constructor(public url: string, private page: Page, private source: string, private country: string) { }

    static async constructAsync(context: BrowserContext, url: string, source: string, country: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageProxyNovaCom(url, page, source, country);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const proxyRows = await this.page.locator(`xpath=//table[@id="tbl_proxy_list"]/tbody/tr`).all();
        for (const proxyRow of proxyRows) {
            const ipAddress: string = await proxyRow.locator(`xpath=/td[1]`).innerText();
            const port: number = Number(await proxyRow.locator(`xpath=/td[2]`).innerText());
            const lastCheck: string = await proxyRow.locator(`xpath=/td[3]`).innerText();
            const speed: string = await proxyRow.locator(`xpath=/td[4]/div`).innerText();
            const anonimityLevel: AnonymityLevel = this.transformAnonymityLevel(await proxyRow.locator(`xpath=/td[7]`).innerText());

            const proxy: Proxy = { ipAddress: ipAddress, port: port, country: this.country, anonymityLevel: anonimityLevel, protocols: [Protocol.http], source: this.source, speed: speed, lastTested: lastCheck };
            proxyList.push(proxy);
        }

        return proxyList;
    }

    transformAnonymityLevel(anonymityLevel: string): AnonymityLevel {
        switch (anonymityLevel.trim().toLowerCase()) {
            case "transparent":
                return AnonymityLevel.transparent;
            case "anonymous":
                return AnonymityLevel.anonymous;
            case "high anonymity":
                return AnonymityLevel.elite;
            case "elite":
                return AnonymityLevel.elite;
            default:
                return AnonymityLevel.unknown;
        }
    }
}