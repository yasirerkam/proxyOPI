import { Browser } from "playwright-core";
import { Proxy, AnonymityLevel, Protocol } from "../types.js";
import ISource from "./iSource.js";

export default class HideIpMe implements ISource {

    readonly sourceSite: string = "hideip.me";
    readonly urls = [
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/http.txt", Protocol.http],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/https.txt", Protocol.https],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks4.txt", Protocol.socks4],
        ["https://raw.githubusercontent.com/zloi-user/hideip.me/main/socks5.txt", Protocol.socks5],
    ];

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        const context = await this.browser.newContext(this.browserContextOptions);
        context.setDefaultNavigationTimeout(60000);
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
                    console.error(`\nURL -> ${url}\nResponse status is not 200 -> ${response.status()}`);
            }, err => {
                console.error("\n" + err);
            }).catch(err => {
                console.error("\n" + err);
            });

            promises.push(promise);
        }

        await Promise.allSettled(promises);

        if (page.isClosed() === false)
            await page.close();
        await context.close();

        return proxyList;
    }
}