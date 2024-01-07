import { Browser } from "playwright-core";
import { Proxy } from "../types.js";

export default interface ISource {
    readonly sourceSite: string;
    browser: Browser;
    getProxyList(): Promise<Proxy[]>;
    pageOptions?: {};
}