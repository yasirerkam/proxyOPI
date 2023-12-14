import { Browser } from "playwright-core";
import { Proxy } from "../proxyProvider";

export default interface ISource {
    readonly sourceSite: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
    pageOptions: {} | undefined;
}