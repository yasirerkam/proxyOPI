import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageFreeProxyCz from "./pages/pageFreeProxyCz";

export default class FreeProxyCz implements ISource {

    readonly sourceSite = "free-proxy.cz";
    readonly numberOfPages = 5;

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        // dont use Promise.allSettled. probably site blocking for multiple requests 
        const proxyList: Proxy[] = [];

        for (const protocol of [Protocol.http, Protocol.https, Protocol.socks5]) {
            for (const anonymityLevel of [AnonymityLevel.transparent, AnonymityLevel.anonymous, AnonymityLevel.elite]) {
                for (let pageNumber = 1; pageNumber <= this.numberOfPages; pageNumber++) {
                    let level = "";
                    if (anonymityLevel === AnonymityLevel.transparent) {
                        level = "level3";
                    } else if (anonymityLevel === AnonymityLevel.anonymous) {
                        level = "level2";
                    } else if (anonymityLevel === AnonymityLevel.elite) {
                        level = "level1";
                    }
                    const url: string = `http://free-proxy.cz/en/proxylist/country/all/${protocol}/ping/${level}/${pageNumber}`;

                    try {
                        const context = await this.browser.newContext({ ignoreHTTPSErrors: true, ...this.browserContextOptions });
                        context.setDefaultNavigationTimeout(60000);
                        const pageFreeProxyCz = await PageFreeProxyCz.constructAsync(context, url, this.sourceSite, protocol, anonymityLevel);
                        await pageFreeProxyCz?.getProxies().then(proxies => {
                            proxyList.push(...proxies);
                        });
                        await context.close();
                    } catch (err) {
                        console.error("\n" + err);
                        break;
                    }
                }
            }
        }

        return proxyList;
    }
} 