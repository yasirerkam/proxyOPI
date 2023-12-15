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
        const page = await this.browser.newPage(this.pageOptions);

        let url = `https://hidemy.io/en/proxy-list/?start=${startNumber}#list`;
        await page.goto(url);
        const pageProxyListOrg = new PageHideMyIo(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
} 