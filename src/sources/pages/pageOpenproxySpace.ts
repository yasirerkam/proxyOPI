import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage.js";

export default class PageOpenproxySpace implements IPage {
    constructor(public url: string, private page: Page, private source: string, private protocol: Protocol) { }

    static async constructAsync(context: BrowserContext, url: string, source: string, protocol: Protocol) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageOpenproxySpace(url, page, source, protocol);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const textArea = await this.page.locator("xpath=//textarea[@class='text-input']").textContent();
        if (textArea !== null && textArea !== undefined && textArea !== "") {
            const proxyRows = textArea.trim().split('\n');
            for (const proxyRow of proxyRows) {
                const proxyParts = proxyRow.split(':');
                const proxy: Proxy = { ipAddress: proxyParts[0].trim(), port: Number(proxyParts[1].trim()), anonymityLevel: AnonymityLevel.unknown, protocols: [this.protocol], source: this.source };

                proxyList.push(proxy);
            }
        }

        return proxyList;
    }
}