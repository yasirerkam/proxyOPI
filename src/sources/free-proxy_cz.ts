import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import Source from "./iSource";
import PageFreeProxyCz from "./pages/pageFreeProxyCz";

export default class FreeProxyCz implements Source {

    readonly sourceSite = "free-proxy.cz";
    readonly numberOfPages = 5;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

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
                        await this.getProxyListFromPage(url, protocol, anonymityLevel).then(proxies => {
                            proxyList.push(...proxies);
                        });
                    } catch (err) {
                        console.error(err);
                        break;
                    }
                }
            }
        }

        return proxyList;
    }

    async getProxyListFromPage(url: string, protocol: Protocol, anonimityLevel: AnonymityLevel): Promise<Proxy[]> {
        const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
        const page = await context.newPage();

        await page.goto(url);
        const pageFreeProxyCz = new PageFreeProxyCz(page, this.sourceSite);
        const proxyList: Proxy[] = await pageFreeProxyCz.getProxies(protocol, anonimityLevel);

        await context.close();

        return proxyList;
    }
} 