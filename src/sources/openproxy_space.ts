import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import Source from "./iSource";
import PageOpenproxySpace from "./pages/pageOpenproxySpace";

export default class OpenproxySpace implements Source {

    readonly sourceSite = "openproxy.space";

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

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
                await this.getProxyListFromPage(url[0], protocol).then(proxies => {
                    proxyList.push(...proxies);
                });
            } catch (err) {
                console.error(err);
                break;
            }
        }

        return proxyList;
    }

    async getProxyListFromPage(url: string, protocol: Protocol): Promise<Proxy[]> {
        const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
        const page = await context.newPage();
        let proxyList: Proxy[] = [];

        const response = await page.goto(url);
        if (response?.status() === 200)
            proxyList = await new PageOpenproxySpace(page, this.sourceSite).getProxies(protocol);

        await context.close();

        return proxyList;
    }
} 