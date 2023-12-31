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

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const url of this.urls) {
            const promise = this.browser.newContext(this.browserContextOptions).then(async context => {
                context.setDefaultNavigationTimeout(60000);
                await PageMyProxyCom.constructAsync(context, url[0], this.sourceSite, url[1] as Protocol, url[2] as AnonymityLevel).then(async pageFreeProxyListNet => {
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