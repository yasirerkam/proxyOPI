import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageMyProxyCom from "./pages/pageMyProxyCom";

export default class MyProxyCom implements ISource {

    readonly urls = [
        ["https://www.my-proxy.com/free-elite-proxy.html", Protocol.http, AnonymityLevel.elite],
        ["https://www.my-proxy.com/free-anonymous-proxy.html", Protocol.http, AnonymityLevel.anonymous],
        ["https://www.my-proxy.com/free-transparent-proxy.html", Protocol.http, AnonymityLevel.transparent],
        ["https://www.my-proxy.com/free-socks-4-proxy.html", Protocol.socks4, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-socks-5-proxy.html", Protocol.socks5, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-2.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-3.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-4.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-5.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-6.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-7.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-8.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-9.html", Protocol.http, AnonymityLevel.unknown],
        ["https://www.my-proxy.com/free-proxy-list-10.html", Protocol.http, AnonymityLevel.unknown],
    ];
    readonly sourceSite = "my-proxy.com";

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const url of this.urls) {
            const promise = this.getProxyListFromURLs(url).then(proxies => {
                proxyList.push(...proxies);
            }, err => {
                console.error(err);
            }).catch(err => {
                console.error(err);
            });

            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }

    async getProxyListFromURLs(url: string[]): Promise<Proxy[]> {
        const context = await this.browser.newContext(this.pageOptions);
        const page = await context.newPage();

        await page.goto(url[0]);
        const pageProxyListOrg = new PageMyProxyCom(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies(url[1] as Protocol, url[2] as AnonymityLevel);

        await context.close();

        return proxyList;
    }
} 