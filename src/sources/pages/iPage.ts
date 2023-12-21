import { Proxy } from "../../proxyProvider";

export default interface IPage {
    getProxies(): Promise<Proxy[]>;
}
