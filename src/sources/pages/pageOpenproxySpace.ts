import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";
import { text } from "stream/consumers";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage";

export default class PageOpenproxySpace implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string, private protocol: Protocol) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string, protocol: Protocol) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageOpenproxySpace(url, page, sourceSite, protocol);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList = [];

        const textArea = await this.page.locator("xpath=//textarea[@class='text-input']").textContent();
        if (textArea !== null && textArea !== undefined && textArea !== "") {
            const proxyRows = textArea.split('\n');
            for (const proxyRow of proxyRows) {
                const proxyParts = proxyRow.split(':');
                const proxy: Proxy = { ip: proxyParts[0].trim(), port: proxyParts[1].trim(), anonymityLevel: AnonymityLevel.unknown, protocols: [this.protocol], sourceSite: this.sourceSite };

                proxyList.push(proxy);
            }
        }

        return proxyList;
    }
}