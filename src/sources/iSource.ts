import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";

export default interface ISource {
    readonly sourceName: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
    pageOptions: {} | undefined;
}