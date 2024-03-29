import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../types.js";
import ISource from "./iSource.js";
import PageOpenproxySpace from "./pages/pageOpenproxySpace.js";

export default class OpenproxySpace implements ISource {

    readonly sourceSite = "openproxy.space";

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        const urls: string[][] = [
            ["https://openproxy.space/list/http", Protocol.http],
            ["https://openproxy.space/list/socks4", Protocol.socks4],
            ["https://openproxy.space/list/socks5", Protocol.socks5],
        ];
        for (const url of urls) {
            const protocol = url[1] as Protocol;
            try {
                const context = await this.browser.newContext(this.browserContextOptions);
                context.setDefaultNavigationTimeout(60000);
                const pageFreeProxyCz = await PageOpenproxySpace.constructAsync(context, url[0], this.sourceSite, protocol);
                await pageFreeProxyCz?.getProxies().then(proxies => {
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