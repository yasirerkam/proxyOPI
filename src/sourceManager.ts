import { chromium, Browser } from "playwright-core";
import { Proxy } from "./proxyProvider";
import ISource from "./sources/iSource";
import ProxyListOrg from "./sources/proxy-list_org";

export default class SourceManager {
    sources!: ISource[];

    private constructor(public browser: Browser) {
        this.sources = [
            new ProxyListOrg(this.browser),
        ];
    }

    static async asyncConstruct() {
        const browser = await chromium.launch();

        return new SourceManager(browser);
    }

    async getProxyList(): Promise<Proxy[]> {
        let proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const source of this.sources) {
            const promise = source.getProxyList().then(proxies => {
                proxyList.push(...proxies);
            });
            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }

}