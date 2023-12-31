import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageProxyListOrg from "./pages/pageProxyListOrg";

export default class ProxyListOrg implements ISource {

    readonly url = "https://proxy-list.org/english/index.php";
    readonly sourceSite = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (let i = 1; i <= this.numberOfPages; i++) {
            const urlStr = this.url + "?p=" + i;
            const promise = this.browser.newContext().then(async context => {
                context.setDefaultNavigationTimeout(60000);
                await PageProxyListOrg.constructAsync(context, urlStr, this.sourceSite).then(async pageFreeProxyListNet => {
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