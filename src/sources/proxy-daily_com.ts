import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider.js";
import ISource from "./iSource.js";
import PageProxyDailyCom from "./pages/pageProxyDailyCom.js";

export default class ProxyDailyCom implements ISource {

    readonly sourceSite = "proxy-daily.com";

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        const url = "https://proxy-daily.com/";
        try {
            const context = await this.browser.newContext(this.browserContextOptions);
            context.setDefaultNavigationTimeout(60000);
            const pageFreeProxyCz = await PageProxyDailyCom.constructAsync(context, url, this.sourceSite);
            await pageFreeProxyCz?.getProxies().then(proxies => {
                proxyList.push(...proxies);
            });
            await context.close();
        } catch (err) {
            console.error("\n" + err);
        }

        return proxyList;
    }
} 