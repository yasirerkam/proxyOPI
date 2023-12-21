import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageProxyDailyCom from "./pages/pageProxyDailyCom";

export default class ProxyDailyCom implements ISource {

    readonly sourceSite = "proxy-daily.com";

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        const url = "https://proxy-daily.com/";
        try {
            const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
            const pageFreeProxyCz = await PageProxyDailyCom.constructAsync(context, url, this.sourceSite);
            await pageFreeProxyCz?.getProxies().then(proxies => {
                proxyList.push(...proxies);
            });
        } catch (err) {
            console.error(err);
        }

        return proxyList;
    }
} 