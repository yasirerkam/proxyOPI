import { Page } from "playwright-core";
import { Proxy } from "../../proxyProvider";

export default class PageMyProxyCom {
    constructor(private page: Page, private sourceSite: string) { }

    async getProxies(protocol: string, anonimityLevel?: string): Promise<Proxy[]> {
        const proxyList = [];

        const proxies = (await this.page.locator(`//div[@class='list']`).innerText()).match(/((\d{1,3}\.){3}\d{1,3})\:(\d{1,4})(#([a-zA-Z]{1,4}))?/gm);
        // /((\d{1,3}\.){3}\d{1,3})\:(\d{1,4})(#([a-zA-Z]{1,4}))?/gm
        for (const prxy of proxies?.map(p => p.split(":")) ?? []) {
            const ip: string = prxy[0];
            const port: string = prxy[1].split("#")[0];
            const country: string | undefined = prxy[1]?.split("#")[1];

            const proxy: Proxy = { ip: ip, port: port, country: country, protocols: [protocol], sourceSite: this.sourceSite, anonymityLevel: anonimityLevel };
            proxyList.push(proxy);
        }

        return proxyList;
    }
}