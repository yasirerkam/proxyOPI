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
    private static instance: SourceManager;
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
            new ProxyScrapeCom(this.browser),
            new ProxyNovaCom(this.browser),
            new HideIpMe(this.browser),
            new ProxyDailyCom(this.browser),
            new PremProxyCom(this.browser),
            new OpenproxySpace(this.browser),
            new MyProxyCom(this.browser),
            new FreeProxyListNet(this.browser),
            new FreeProxyCz(this.browser),
            new CoolProxyNet(this.browser),
            new CheckerProxyNet(this.browser),
            new ProxyListOrg(this.browser),
            // new HideMyIo(this.browser), // TODO: cloudflare will be taken care of 
        ];
    }

    static async getInstanceAsync(): Promise<SourceManager> {
        if (this.instance === undefined || this.instance === null) {
            const browser = await chromium.launch({ headless: true });
            this.instance = new SourceManager(browser);
        }

        return this.instance;
    }

    async getProxyList(): Promise<Proxy[]> {
        let proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];

        for (const source of this.sources) {
            const promise = source.getProxyList().then(proxies => {
                proxyList = proxyList.concat(proxies);
            });
            promises.push(promise);
        }
        await Promise.allSettled(promises);

        return proxyList;
    }

}