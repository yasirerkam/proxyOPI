import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageFreeProxyCz from "./pages/pageFreeProxyCz";

export default class FreeProxyCz implements ISource {

    url = "";
    readonly sourceName = "free-proxy.cz";
    readonly numberOfPages = 5;

    constructor(public browser: Browser) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

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
                    const promise = this.getProxyListFromPage(url, protocol, anonymityLevel).then(proxies => {
                        proxyList.push(...proxies);
                    }, err => {
                        console.error(err);
                    }).catch(err => {
                        console.error(err);
                    });

                    promises.push(promise);
                }
            }
        }

        await Promise.allSettled(promises);

        return proxyList;
    }

    async getProxyListFromPage(url: string, protocol: string, anonimityLevel: string): Promise<Proxy[]> {
        const page = await this.browser.newPage();
        page.setDefaultNavigationTimeout(90000);

        await page.goto(url);
        const pageFreeProxyCz = new PageFreeProxyCz(page);
        const proxyList: Proxy[] = await pageFreeProxyCz.getProxies(protocol, anonimityLevel);

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
} 