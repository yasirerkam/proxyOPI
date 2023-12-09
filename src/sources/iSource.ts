import { Browser } from "playwright-core";
import { Proxy } from "../../index";

export default interface ISource {
    readonly url: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
}