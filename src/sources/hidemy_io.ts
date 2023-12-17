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
                await this.getProxyListFromPage(i).then(proxies => {
                    proxyList.push(...proxies);
                });
            } catch (err) {
                console.error(err);
                break;
            }
        }

        return proxyList;
    }

    async getProxyListFromPage(startNumber: number): Promise<Proxy[]> {
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

        const page = await context.newPage();

        let url = `https://hidemy.io/en/proxy-list/?start=${startNumber * 64}#list`;

        const status = await page.goto(url).catch(err => {
            console.error(err);
        });
        console.log(status?.status());
        await page.screenshot({ path: `data/screenshots/${this.sourceSite}_${startNumber}.png` });
        const pageProxyListOrg = new PageHideMyIo(page, this.sourceSite);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        await context.close();

        return proxyList;
    }
} 