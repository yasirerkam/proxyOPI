import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";

type ProxyCPN = {
    id?: number,
    local_id?: number,
    report_id?: string,
    addr: string,
    type?: number,
    kind?: number,
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
    readonly sourceName: string = "checkerproxy.net";

    constructor(public browser: Browser) {
        this.url = "https://checkerproxy.net/api/archive/" + new Date().toJSON().slice(0, 10);
    }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const page = await this.browser.newPage();
        page.setDefaultNavigationTimeout(90000);

        await page.goto(this.url);
        await page.request.get(this.url, {
            headers: {
                "accept": "*/*",
                "accept-language": "en,en-US;q=0.9,tr-TR;q=0.8,tr;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua": "\"Chromium\";v=\"118\", \"Google Chrome\";v=\"118\", \"Not=A?Brand\";v=\"99\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": this.url,
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).then(async response => {
            if (response.status() === 200) {
                const proxies: ProxyCPN[] = await response.json();
                for (let i = 0; i < proxies.length; i++) {
                    const proxy = proxies[i];
                    const ipPort = proxy.addr?.split(":");
                    proxyList.push({ ip: ipPort[0], port: ipPort[1], protocols: [proxy.type === 0 ? "https" : "http"], sourceSite: this.sourceName, anonymityLevel: proxy.kind === 0 ? "transparent" : "anonymous", country: proxy.addr_geo_iso, city: proxy.addr_geo_city, lastTested: proxy.updated_at });
                }
            }
            else
                console.error("Response status is not 200 -> " + response.status());
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
        });

        return proxyList;
    }
}