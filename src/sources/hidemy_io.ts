import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageHideMyIo from "./pages/pageHideMyIo";

export default class HideMyIo implements ISource {

    readonly sourceSite = "hidemy.io";
    readonly numberOfPages = 200;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

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
        const context = await this.browser.newContext();
        return await context.newPage().then(async page => {
            await page.waitForLoadState("networkidle");
            let url = `https://hidemy.io/en/proxy-list/?start=${startNumber * 64}#list`;

            return await page.goto(url, { waitUntil: "load" }).then(async response => {
                // await page.waitForSelector("//div[@class='table_block']/table/tbody");
                try {
                    await page.waitForTimeout(30000).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
                console.log(response?.status());
                await page.screenshot({ path: 'stealth.png', fullPage: true })
                const pageProxyListOrg = new PageHideMyIo(page, this.sourceSite);
                const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

                await context.close();

                return proxyList;
            }, async reason => {
                console.log(reason);
                await page.screenshot({ path: 'stealth.png', fullPage: true });
                return [];
            }).catch(async err => {
                console.log(err);
                try {
                    await page.waitForTimeout(30000).catch(err => {
                        console.log(err);
                    });
                } catch (error) {
                    console.log(error);
                }
                await page.screenshot({ path: 'stealth.png', fullPage: true });
                return [];
            });
        });
    }
} 