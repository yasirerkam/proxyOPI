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
    readonly sourceSite = "proxy-list.org";

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
        const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
        const page = await context.newPage();

        await page.goto(url);
        const pageProxyListOrg = new PageFreeProxyListNet(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        await context.close();

        return proxyList;
    }
} 