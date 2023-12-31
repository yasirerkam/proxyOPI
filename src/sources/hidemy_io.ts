import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageHideMyIo from "./pages/pageHideMyIo";
import { PageOptions } from "../sourceManager";

export default class HideMyIo implements ISource {

    readonly sourceSite = "hidemy.io";
    readonly numberOfPages = 200;

    constructor(public browser: Browser, public pageOptions?: PageOptions) { }

    async getProxyList(): Promise<Proxy[]> {
        const proxyList: Proxy[] = [];

        for (let i = 0; i < this.numberOfPages; i++) {
            try {
                const context = await this.browser.newContext({
                    userAgent: this.pageOptions?.["User-Agent"],
                    extraHTTPHeaders: {
                        "referer": "https://hidemy.io/en/proxy-list/?start=64#list",
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "accept-language": "en,en-US;q=0.9,tr-TR;q=0.8,tr;q=0.7",
                        "cache-control": "no-cache",
                        "pragma": "no-cache",
                        "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                        "sec-fetch-dest": "document",
                        "sec-fetch-mode": "navigate",
                        "sec-fetch-site": "none",
                        "sec-fetch-user": "?1",
                        "upgrade-insecure-requests": "1"
                    },
                });
                context.setDefaultNavigationTimeout(60000);
                let url = `https://hidemy.io/en/proxy-list/?start=${i * 64}#list`;
                const pageHideMyIo = await PageHideMyIo.constructAsync(context, url, this.sourceSite);
                await pageHideMyIo?.getProxies().then(proxies => {
                    proxyList.push(...proxies);
                });
            } catch (err) {
                console.error(err);
                break;
            }
        }

        return proxyList;
    }
} 