import { Browser } from "playwright-core";
import { Proxy, AnonymityLevel, Protocol } from "../proxyProvider";
import ISource from "./iSource";

// all http proxies
type ProxyCoolPN = {
    "update_time"?: number,
    "country_code"?: string,
    "working_average"?: number,
    "score"?: number,
    "country_name"?: string,
    "port": number,
    "response_time_average"?: number,
    "ip": string,
    "anonymous"?: number,
    "download_speed_average"?: number
};

export default class CoolProxyNet implements ISource {

    readonly url: string = "https://www.cool-proxy.net/proxies.json";
    readonly sourceSite: string = "cool-proxy.net";

    constructor(public browser: Browser) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        const context = await this.browser.newContext();
        context.setDefaultNavigationTimeout(60000);
        const page = await context.newPage();

        // await page.goto(this.url);
        await page.request.get(this.url, {
            headers: {
                "accept": "application/json, text/plain, */*",
                "accept-language": "en,en-US;q=0.9,tr-TR;q=0.8,tr;q=0.7",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "Referer": "https://www.cool-proxy.net/",
                "Referrer-Policy": "strict-origin-when-cross-origin"
            }
        }).then(async response => {
            if (response.status() === 200) {
                const proxies: ProxyCoolPN[] = await response.json();
                for (let i = 0; i < proxies.length; i++) {
                    const proxy = proxies[i];
                    proxyList.push({ ip: proxy.ip, port: proxy.port.toString(), protocols: [Protocol.http], sourceSite: this.sourceSite, anonymityLevel: proxy.anonymous == 1 ? AnonymityLevel.anonymous : AnonymityLevel.transparent, country: proxy.country_code, speed: proxy.download_speed_average?.toString(), uptime: proxy.working_average?.toString(), responseTime: proxy.response_time_average?.toString(), verified: proxy.update_time?.toString() }); // check this later whether equivalent
                }
            }
            else
                console.error(`\nURL -> ${this.url}\nResponse status is not 200 -> ${response.status()}`);
        }, err => {
            console.error(err);
        }).catch(err => {
            console.error(err);
        });

        await context.close();

        return proxyList;
    }
}