import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageProxyListOrg from "./pages/pageProxyListOrg";

export default class ProxyListOrg implements ISource {

    readonly url = "https://proxy-list.org/english/index.php";
    readonly sourceSite = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (let i = 1; i <= this.numberOfPages; i++) {
            const promise = this.getProxyListFromPage(i).then(proxies => {
                proxyList.push(...proxies);
            }, err => {
                console.error(err);
            }).catch(err => {
                console.error(err);
            });

            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }

    async getProxyListFromPage(pageNumber: number): Promise<Proxy[]> {
        const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
        const page = await context.newPage();

        await page.goto(this.url + "?p=" + pageNumber);
        const pageProxyListOrg = new PageProxyListOrg(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        await context.close();

        return proxyList;
    }
} 