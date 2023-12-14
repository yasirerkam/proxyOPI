import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageMyProxyCom from "./pages/pageMyProxyCom";

export default class MyProxyCom implements ISource {

    readonly urls = [
        ["https://www.my-proxy.com/free-elite-proxy.html", Protocol.http, AnonymityLevel.elite],
        ["https://www.my-proxy.com/free-anonymous-proxy.html", Protocol.http, AnonymityLevel.anonymous],
        ["https://www.my-proxy.com/free-transparent-proxy.html", Protocol.http, AnonymityLevel.transparent],
        ["https://www.my-proxy.com/free-socks-4-proxy.html", Protocol.socks4, ""],
        ["https://www.my-proxy.com/free-socks-5-proxy.html", Protocol.socks5, ""],
        ["https://www.my-proxy.com/free-proxy-list.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-2.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-3.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-4.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-5.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-6.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-7.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-8.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-9.html", Protocol.http, ""],
        ["https://www.my-proxy.com/free-proxy-list-10.html", Protocol.http, ""],
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
        const page = await this.browser.newPage(this.pageOptions);

        await page.goto(url[0]);
        const pageProxyListOrg = new PageMyProxyCom(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies(url[1], url[2]);

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
} 