import { Browser } from "playwright-core";
import { AnonymityLevel, Protocol, Proxy } from "../proxyProvider";
import ISource from "./iSource";

export default class ProxyScrapeCom implements ISource {

    readonly sourceSite = "proxyscrape.com";

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

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

            const context = await this.browser.newContext({ extraHTTPHeaders: this.pageOptions });
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
                    console.error("Response status is not 200 -> " + response.status());
            }, err => {
                console.error(err);
            }).catch(err => {
                console.error(err);
            });

            await context.close();
            // }
        }

        return proxyList;
    }
} 