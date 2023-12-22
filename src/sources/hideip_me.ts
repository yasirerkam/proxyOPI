import { Browser } from "playwright-core";
import { Proxy, AnonymityLevel, Protocol } from "../proxyProvider";
import ISource from "./iSource";

export default class HideIpMe implements ISource {

    readonly sourceSite: string = "hideip.me";
    readonly urls = [
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt", Protocol.http],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt", Protocol.https],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt", Protocol.socks4],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt", Protocol.socks5],
    ];

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
        const page = await context.newPage();

        // await page.goto(this.url);
        for (const url of this.urls) {
            const promise = page.request.get(url[0]).then(async response => {
                if (response.status() === 200) {
                    const proxies = (await response.text()).split("\n");
                    for (let i = 0; i < proxies.length; i++) {
                        const proxy = proxies[i].split(":");
                        proxyList.push({ ip: proxy[0]?.trim(), port: proxy[1]?.trim(), protocols: [url[1] as Protocol], sourceSite: this.sourceSite, anonymityLevel: AnonymityLevel.unknown, country: proxy[2]?.trim() });
                    }
                }
                else
                    console.error("Response status is not 200 -> " + response.status());
            }, err => {
                console.error(err);
            }).catch(err => {
                console.error(err);
            });

            promises.push(promise);
        }

        await Promise.allSettled(promises);
        await context.close();

        return proxyList;
    }
}