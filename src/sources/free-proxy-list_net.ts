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
    readonly sourceSite = "free-proxy-list.net";

    constructor(public browser: Browser) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const url of this.urls) {
            const promise = this.browser.newContext().then(async context => {
                context.setDefaultNavigationTimeout(60000);
                await PageFreeProxyListNet.constructAsync(context, url, this.sourceSite).then(async pageFreeProxyListNet => {
                    await pageFreeProxyListNet?.getProxies().then(proxies => {
                        proxyList.push(...proxies);
                    });
                });
            });

            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }
} 