import { Browser } from "playwright-core";
import { Proxy, AnonymityLevel, Protocol } from "../proxyProvider";
import ISource from "./iSource";

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

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) {
        this.url = "https://checkerproxy.net/api/archive/" + new Date().toJSON().slice(0, 10);
    }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const page = await this.browser.newPage(this.pageOptions);

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
                    let types!: Protocol[];
                    switch (proxy.type) {
                        case 1:
                            types = [Protocol.http];
                            break;
                        case 2:
                            types = [Protocol.https];
                            break;
                        case 4:
                            types = [Protocol.socks5];
                            break;
                        case 5:
                            types = [Protocol.http, Protocol.https];
                            break;
                        case 7:
                            types = [Protocol.http, Protocol.https, Protocol.socks5];
                            break;
                        default:
                            types = [Protocol.unknown];
                            break;
                    }
                    let kind!: AnonymityLevel;
                    switch (proxy.kind) {
                        case 0:
                            kind = AnonymityLevel.transparent;
                            break;
                        case 2:
                            kind = AnonymityLevel.anonymous;
                            break;
                        case 3:
                            kind = AnonymityLevel.anonymous;
                            break;
                        default:
                            kind = AnonymityLevel.unknown;
                            break;
                    }

                    proxyList.push({ ip: ipPort[0], port: ipPort[1], protocols: types, sourceSite: this.sourceSite, anonymityLevel: kind, country: proxy.addr_geo_iso, city: proxy.addr_geo_city, lastTested: proxy.updated_at }); // check this later whether equivalent
                }
            }
            else
                console.error("Response status is not 200 -> " + response.status());
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
        });

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
}