import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider.js";

export default interface ISource {
    readonly sourceSite: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
    pageOptions?: {};
}