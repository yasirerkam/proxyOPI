import { Proxy } from "../../types.js";

export default interface IPage {
    getProxies(): Promise<Proxy[]>;
}
