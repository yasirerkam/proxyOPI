import { Browser } from "playwright-core";
import { Proxy } from "../types.js";
import ISource from "./iSource.js";
import PageProxyListOrg from "./pages/pageProxyListOrg.js";

export default class ProxyListOrg implements ISource {

    readonly url = "https://proxy-list.org/english/index.php";
    readonly sourceSite = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (let i = 1; i <= this.numberOfPages; i++) {
            const urlStr = this.url + "?p=" + i;
            const promise = this.browser.newContext(this.browserContextOptions).then(async context => {
                context.setDefaultNavigationTimeout(60000);
                await PageProxyListOrg.constructAsync(context, urlStr, this.sourceSite).then(async pageFreeProxyListNet => {
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