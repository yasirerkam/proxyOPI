import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageHideMyIo from "./pages/pageHideMyIo";

export default class HideMyIo implements ISource {

    readonly sourceSite = "hidemy.io";
    readonly numberOfPages = 200;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        for (let i = 150; i < this.numberOfPages; i++) {
            try {
                await this.getProxyListFromPage(i).then(proxies => {
                    proxyList.push(...proxies);
                });
            } catch (err) {
                console.error(err);
                break;
            }
        }

        return proxyList;
    }

    async getProxyListFromPage(startNumber: number): Promise<Proxy[]> {
        const context = await this.browser.newContext(this.pageOptions);
        const page = await context.newPage();

        let url = `https://hidemy.io/en/proxy-list/?start=${startNumber * 64}#list`;
        await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
        const pageProxyListOrg = new PageHideMyIo(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        await context.close();

        return proxyList;
    }
} 