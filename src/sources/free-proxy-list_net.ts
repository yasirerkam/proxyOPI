import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageFreeProxyListNet from "./pages/pageFreeProxyListNet";

export default class FreeProxyListNet implements ISource {

    readonly urls = [
        'https://free-proxy-list.net/',
        'https://www.us-proxy.org/',
        'https://free-proxy-list.net/uk-proxy.html',
        'https://www.sslproxies.org/',
        'https://free-proxy-list.net/anonymous-proxy.html',
    ];
    readonly sourceName = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const url of this.urls) {
            const promise = this.getProxyListFromURLs(url).then(proxies => {
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

    async getProxyListFromURLs(url: string): Promise<Proxy[]> {
        const page = await this.browser.newPage(this.pageOptions);
        page.setDefaultNavigationTimeout(30000);

        await page.goto(url);
        const pageProxyListOrg = new PageFreeProxyListNet(page);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
} 