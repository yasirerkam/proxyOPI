import { chromium, Browser } from "playwright-core";
import { Proxy } from "../index";
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

        for (const source of this.sources) {
            const proxies = await source.getProxyList();
            proxyList.push(...proxies);
        }

        return proxyList;
    }

}