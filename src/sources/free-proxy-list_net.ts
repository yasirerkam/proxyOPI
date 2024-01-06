import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider.js";
import ISource from "./iSource.js";
import PageFreeProxyListNet from "./pages/pageFreeProxyListNet.js";

export default class FreeProxyListNet implements ISource {

    readonly urls = [
        'https://free-proxy-list.net/',
        'https://www.us-proxy.org/',
        'https://free-proxy-list.net/uk-proxy.html',
        'https://www.sslproxies.org/',
        'https://free-proxy-list.net/anonymous-proxy.html',
    ];
    readonly sourceSite = "free-proxy-list.net";

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const url of this.urls) {
            const promise = this.browser.newContext(this.browserContextOptions).then(async context => {
                context.setDefaultNavigationTimeout(60000);
                await PageFreeProxyListNet.constructAsync(context, url, this.sourceSite).then(async pageFreeProxyListNet => {
                    await pageFreeProxyListNet?.getProxies().then(proxies => {
                        proxyList.push(...proxies);
                    });
                });
                await context.close();
            });

            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }
} 