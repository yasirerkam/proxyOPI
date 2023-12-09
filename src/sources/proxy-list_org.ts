import { Browser } from "playwright-core";
import { Proxy } from "../../index";
import ISource from "./iSource";
import PageProxyListOrg from "./pages/pageProxyListOrg";

export default class ProxyListOrg implements ISource {

    readonly url = "https://proxy-list.org/english/index.php";

    constructor(public browser: Browser) { }

    async getProxyList(): Promise<Proxy[]> {
        const page = await this.browser.newPage();

        await page.goto(this.url);
        const pageProxyListOrg = new PageProxyListOrg(page);
        const proxies = await pageProxyListOrg.getProxies();

        const proxyList: Proxy[] = [];
        proxyList.push(...proxies);

        await page.close();

        return proxyList;
    }
} 