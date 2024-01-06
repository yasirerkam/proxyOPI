import { Proxy } from "../../proxyProvider.js";

export default interface IPage {
    getProxies(): Promise<Proxy[]>;
}
