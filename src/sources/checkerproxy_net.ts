import { Browser } from "playwright-core";
import { Proxy, AnonymityLevel, Protocol } from "../proxyProvider.js";
import ISource from "./iSource.js";

type ProxyCheckerPN = {
    id?: number,
    local_id?: number,
    report_id?: string,
    addr: string,
    type?: number, // 1: http, 2: https, 4: socks5, 5: http/https, 7: ALL ACTIVE,
    kind?: number, // 0: transparent, 2: anonymous, 3: ALL KINDS
    timeout?: number,
    cookie?: boolean,
    referer?: boolean,
    post?: boolean,
    ip?: string,
    addr_geo_iso?: string,
    addr_geo_country?: string,
    addr_geo_city?: string,
    ip_geo_iso?: string,
    ip_geo_country?: string,
    ip_geo_city?: string,
    created_at?: string,
    updated_at?: string,
    skip?: boolean,
    from_cache?: boolean
};

export default class CheckerProxyNet implements ISource {

    url: string = "";
    readonly sourceSite: string = "checkerproxy.net";

    constructor(public browser: Browser, private browserContextOptions?: any) {
        this.url = "https://checkerproxy.net/api/archive/" + new Date().toJSON().slice(0, 10);
    }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const context = await this.browser.newContext(this.browserContextOptions);
        context.setDefaultNavigationTimeout(60000);
        const page = await context.newPage();

        // await page.goto(this.url);
        await page.request.get(this.url, {
            headers: {
                "accept": "*/*",
                "accept-language": "en,en-US;q=0.9,tr-TR;q=0.8,tr;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": this.url,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).then(async response => {
            if (response.status() === 200) {
                const proxies: ProxyCheckerPN[] = await response.json();
                for (let i = 0; i < proxies.length; i++) {
                    const proxy = proxies[i];
                    const ipPort = proxy.addr?.split(":");
                    let types: Protocol[] = this.transformProtocol(proxy.type ?? 0);
                    let kind: AnonymityLevel = this.transformAnonymityLevel(proxy.kind ?? 0);

                    proxyList.push({ ip: ipPort[0], port: ipPort[1], protocols: types, sourceSite: this.sourceSite, anonymityLevel: kind, country: proxy.addr_geo_iso, city: proxy.addr_geo_city, lastTested: proxy.updated_at }); // check this later whether equivalent
                }
            }
            else
                console.error(`\nURL -> ${this.url}\nResponse status is not 200 -> ${response.status()}\n${await response.text()}`);
        }, err => {
            console.error("\n" + err);
        }).catch(err => {
            console.error("\n" + err);
        });

        if (page.isClosed() === false)
            await page.close();
        await context.close();

        return proxyList;
    }

    transformProtocol(type: number): Protocol[] {
        switch (type) {
            case 1:
                return [Protocol.http];
            case 2:
                return [Protocol.https];
            case 4:
                return [Protocol.socks5];
            case 5:
                return [Protocol.http, Protocol.https];
            case 7:
                return [Protocol.http, Protocol.https, Protocol.socks5];
            default:
                return [Protocol.unknown];
        }
    }

    transformAnonymityLevel(kind: number): AnonymityLevel {
        switch (kind) {
            case 0:
                return AnonymityLevel.transparent;
            case 2:
                return AnonymityLevel.anonymous;
            case 3:
                return AnonymityLevel.anonymous;
            default:
                return AnonymityLevel.unknown;
        }
    }
}