import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";

export default interface ISource {
    url: string;
    readonly sourceName: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
}