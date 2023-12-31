import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PagePremProxyCom from "./pages/pagePremProxyCom";

export default class PremProxyCom implements ISource {

    readonly sourceSite = "premproxy.com";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        for (let pageNumber = 1; pageNumber <= this.numberOfPages; pageNumber++) {
            const url: string = `https://premproxy.com/list/${pageNumber.toLocaleString('en-US', { minimumIntegerDigits: 2, useGrouping: false })}.htm`;
            try {
                const context = await this.browser.newContext(this.browserContextOptions);
                context.setDefaultNavigationTimeout(60000);
                const pagePremProxyCom = await PagePremProxyCom.constructAsync(context, url, this.sourceSite);
                await pagePremProxyCom?.getProxies().then(proxies => {
                    proxyList.push(...proxies);
                });
                await context.close();
            } catch (err) {
                console.error("\n" + err);
                break;
            }
        }

        return proxyList;
    }
} 