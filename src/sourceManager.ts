import { chromium, Browser } from "playwright-core";
import { Proxy } from "./proxyProvider";
import ISource from "./sources/iSource";
import JsonFileOps from './jsonFileOps';
import HideMyIo from "./sources/hidemy_io";
import ProxyListOrg from "./sources/proxy-list_org";
import CheckerProxyNet from "./sources/checkerproxy_net";
import CoolProxyNet from "./sources/cool-proxy_net";
import FreeProxyCz from "./sources/free-proxy_cz";
import FreeProxyListNet from "./sources/free-proxy-list_net";
import MyProxyCom from "./sources/my-proxy_com";
import OpenproxySpace from "./sources/openproxy_space";
import PremProxyCom from "./sources/premproxy_com";
import ProxyDailyCom from "./sources/proxy-daily_com";
import HideIpMe from "./sources/hideip_me";
import ProxyNovaCom from "./sources/proxynova_com";
import ProxyScrapeCom from "./sources/proxyscrape_com";

export type PageOptions = { "User-Agent": string };

export default class SourceManager {
    sources: ISource[];
    pageOptions?: PageOptions;

    private constructor(public browser: Browser) {
        try {
            this.pageOptions = JsonFileOps.readJson("data/pageOptions.json");
        } catch (err) {
            console.log("\nError in reading pageOptions.json:\n", err);
            this.pageOptions = undefined;
        }

        this.sources = [
            new ProxyScrapeCom(this.browser, this.pageOptions),
            new ProxyNovaCom(this.browser, this.pageOptions),
            new HideIpMe(this.browser, this.pageOptions),
            new ProxyDailyCom(this.browser, this.pageOptions),
            new PremProxyCom(this.browser, this.pageOptions),
            new OpenproxySpace(this.browser, this.pageOptions),
            new MyProxyCom(this.browser, this.pageOptions),
            new FreeProxyListNet(this.browser, this.pageOptions),
            new FreeProxyCz(this.browser, this.pageOptions),
            new CoolProxyNet(this.browser, this.pageOptions),
            new CheckerProxyNet(this.browser, this.pageOptions),
            new ProxyListOrg(this.browser, this.pageOptions),
            // new HideMyIo(this.browser, this.pageOptions), // TODO: cloudflare will be taken care of 
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