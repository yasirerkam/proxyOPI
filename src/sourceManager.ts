import { chromium, Browser } from "playwright-core";
import { Proxy } from "./proxyProvider";
import ISource from "./sources/iSource";
import ProxyListOrg from "./sources/proxy-list_org";
import CheckerProxyNet from "./sources/checkerproxy_net";
import CoolProxyNet from "./sources/cool-proxy_net";

export default class SourceManager {
    sources!: ISource[];

    private constructor(public browser: Browser) {
        this.sources = [
            new CoolProxyNet(this.browser),
            new CheckerProxyNet(this.browser),
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