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


export default class SourceManager {
    private static instance: SourceManager;
    sources?: ISource[];
    browser?: Browser;
    browserContextOptions?: any;

    private constructor() {
        try {
            this.browserContextOptions = JsonFileOps.readJson("data/browserContextOptions.json");
        } catch (err) {
            console.log("\nError in reading browserContextOptions.json:\n", err);
            this.browserContextOptions = undefined;
        }
    }

    static async getInstanceAsync(): Promise<SourceManager> {
        if (this.instance === undefined || this.instance === null) {
            this.instance = new SourceManager();
        }

        return this.instance;
    }

    async getProxyList(): Promise<Proxy[]> {
        let proxyList: Proxy[] = [];
        let promises: Promise<void>[] = [];
        this.browser = await chromium.launch({ headless: true });

        this.sources = [
            new ProxyScrapeCom(this.browser, this.browserContextOptions),
            new ProxyNovaCom(this.browser, this.browserContextOptions),
            new HideIpMe(this.browser, this.browserContextOptions),
            new ProxyDailyCom(this.browser, this.browserContextOptions),
            new PremProxyCom(this.browser, this.browserContextOptions),
            new OpenproxySpace(this.browser, this.browserContextOptions),
            new MyProxyCom(this.browser, this.browserContextOptions),
            new FreeProxyListNet(this.browser, this.browserContextOptions),
            new FreeProxyCz(this.browser, this.browserContextOptions),
            new CoolProxyNet(this.browser, this.browserContextOptions),
            new CheckerProxyNet(this.browser, this.browserContextOptions),
            new ProxyListOrg(this.browser, this.browserContextOptions),
            // new HideMyIo(this.browser, this.browserContextOptions), // TODO: cloudflare will be taken care of 
        ];

        for (const source of this.sources) {
            const promise = source.getProxyList().then(proxies => {
                proxyList = proxyList.concat(proxies);
            });
            promises.push(promise);
        }
        await Promise.allSettled(promises);
        await this.browser.close();
        this.browser = undefined;

        return proxyList;
    }

}