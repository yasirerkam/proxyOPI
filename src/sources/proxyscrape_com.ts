import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../types.js";
import ISource from "./iSource.js";

export default class ProxyScrapeCom implements ISource {

    readonly sourceSite = "proxyscrape.com";
    // https://docs.proxyscrape.com/#9aa2f904-9b9a-435b-9688-2c4d59413560

    constructor(public browser: Browser, private browserContextOptions?: any) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        for (let protocol of [Protocol.http, Protocol.https, Protocol.socks5, Protocol.socks4]) {
            let ssl: string = "all";
            let protocolStr: string = protocol;
            if (protocol === Protocol.https) {
                protocolStr = "http";
                ssl = "yes";
            }
            else if (protocol === Protocol.http) ssl = "no";

            // for (const anonymityLevel of [AnonymityLevel.transparent, AnonymityLevel.anonymous, AnonymityLevel.elite]) {
            const url: string = `https://api.proxyscrape.com/`;

            const context = await this.browser.newContext(this.browserContextOptions);
            context.setDefaultNavigationTimeout(60000);
            const page = await context.newPage();

            await page.request.get(url, {
                params: {
                    request: "getproxies",
                    protocol: protocolStr,
                    anonymity: "all",
                    ssl: ssl,
                    timeout: 10000
                }
            }).then(async response => {
                if (response.status() === 200) {
                    const proxies = (await response.text()).trim().split("\r\n");
                    for (let i = 0; i < proxies.length; i++) {
                        const ipPort = proxies[i].trim().split(":");

                        proxyList.push({ ip: ipPort[0], port: ipPort[1], protocols: [protocol], sourceSite: this.sourceSite, anonymityLevel: AnonymityLevel.unknown }); // check this later whether equivalent
                    }
                }
                else
                    console.error(`\nURL -> ${url}\nResponse status is not 200 -> ${response.status()}`);
            }, err => {
                console.error("\n" + err);
            }).catch(err => {
                console.error("\n" + err);
                page.screenshot({ path: `data/screenshots/${url}.png` });
            });

            if (page.isClosed() === false)
                await page.close();
            await context.close();
            // }
        }

        return proxyList;
    }
} 