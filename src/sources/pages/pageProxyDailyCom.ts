import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../proxyProvider";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage";

export default class PageProxyDailyCom implements IPage {
    constructor(public url: string, private page: Page, private sourceSite: string) { }

    static async constructAsync(context: BrowserContext, url: string, sourceSite: string) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageProxyDailyCom(url, page, sourceSite);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList = [];

        const xpathProtocol = [
            ["//div[@id='free-proxy-list']/div[2]", Protocol.http],
            ["//div[@id='free-proxy-list']/div[4]", Protocol.socks4],
            ["//div[@id='free-proxy-list']/div[6]", Protocol.socks5]];

        for (const [xpath, protocol] of xpathProtocol) {
            const textArea = await this.page.locator(`xpath=${xpath}`).textContent();
            if (textArea !== null && textArea !== undefined && textArea !== "") {
                const proxyRows = textArea.trim().split('\n');
                for (const proxyRow of proxyRows) {
                    const proxyParts = proxyRow.split(':');
                    const proxy: Proxy = { ip: proxyParts[0].trim(), port: proxyParts[1].trim(), anonymityLevel: AnonymityLevel.unknown, protocols: [protocol as Protocol], sourceSite: this.sourceSite };

                    proxyList.push(proxy);
                }
            }
        }

        return proxyList;
    }
}