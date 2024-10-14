import { Page } from "playwright-core";
import { Proxy, Protocol, AnonymityLevel } from "../../types.js";
import { BrowserContext } from "playwright-core";
import IPage from "./iPage.js";

export default class PageMyProxyCom implements IPage {
    constructor(public url: string, private page: Page, private source: string, private protocol: Protocol, private anonymityLevel: AnonymityLevel) { }

    static async constructAsync(context: BrowserContext, url: string, source: string, protocol: Protocol, anonymityLevel: AnonymityLevel) {
        const page = await context.newPage();
        return await page.goto(url).then(response => {
            if (response?.status() === 200)
                return new PageMyProxyCom(url, page, source, protocol, anonymityLevel);
        });
    }

    async getProxies(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const proxies = (await this.page.locator(`//div[@class='list']`).innerText()).match(/((\d{1,3}\.){3}\d{1,3})\:(\d{1,4})(#([a-zA-Z]{1,4}))?/gm);
        // /((\d{1,3}\.){3}\d{1,3})\:(\d{1,4})(#([a-zA-Z]{1,4}))?/gm
        for (const prxy of proxies?.map(p => p.split(":")) ?? []) {
            const ipAddress: string = prxy[0];
            const port: number = Number(prxy[1].split("#")[0]);
            const country: string | undefined = prxy[1]?.split("#")[1];

            const proxy: Proxy = { ipAddress: ipAddress, port: port, country: country, protocols: [this.protocol], source: this.source, anonymityLevel: this.anonymityLevel };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}