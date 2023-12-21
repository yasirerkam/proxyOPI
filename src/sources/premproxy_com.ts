import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PagePremProxyCom from "./pages/pagePremProxyCom";

export default class PremProxyCom implements ISource {

    readonly sourceSite = "free-proxy.cz";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        for (let pageNumber = 1; pageNumber <= this.numberOfPages; pageNumber++) {
            const url: string = `https://premproxy.com/list/${pageNumber.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}.htm`;
            try {
                const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
                const pagePremProxyCom = await PagePremProxyCom.constructAsync(context, url, this.sourceSite);
                await pagePremProxyCom?.getProxies().then(proxies => {
                    proxyList.push(...proxies);
                });
            } catch (err) {
                console.error(err);
                break;
            }
        }

        return proxyList;
    }
} 