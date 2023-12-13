import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";
import ISource from "./iSource";
import PageFreeProxyListNet from "./pages/pageFreeProxyListNet";

export default class FreeProxyListNet implements ISource {

    readonly url = "https://free-proxy-list.net";
    readonly sourceName = "proxy-list.org";
    readonly numberOfPages = 10;

    constructor(public browser: Browser, public pageOptions: {} | undefined = undefined) { }

    async getProxyList(): Promise<Proxy[]> {
        const page = await this.browser.newPage(this.pageOptions);
        page.setDefaultNavigationTimeout(90000);

        await page.goto(this.url);
        const pageProxyListOrg = new PageFreeProxyListNet(page);
        const proxyList: Proxy[] = await pageProxyListOrg.getProxies();

        // problem on promise
        // if (page.isClosed() === false)
        //     await page.close();

        return proxyList;
    }
} 