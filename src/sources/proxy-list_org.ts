import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageProxyListOrg from "./pages/pageProxyListOrg";

export default class ProxyListOrg implements ISource {

    readonly url = "https://proxy-list.org/english/index.php";
    readonly sourceName = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser) { }

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
        const page = await this.browser.newPage();
        page.setDefaultNavigationTimeout(90000);

        await page.goto(this.url + "?p=" + pageNumber);
        const pageProxyListOrg = new PageProxyListOrg(page);
        const proxies = await pageProxyListOrg.getProxies();

        const proxyList: Proxy[] = [];
        proxyList.push(...proxies);

        return proxyList;
    }
} 