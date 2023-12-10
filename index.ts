import ProxyProvider from './src/proxyProvider';

export type Proxy = { ip: string, port: string, protocols: [string], anonymityLevel?: string, lastTested?: string, country?: string, city?: string, isp?: string, speed?: string, uptime?: string, responseTime?: string, verified?: string, };
type ProxyList = { dateTime: number, list: Proxy[] };

export default class ProxyOPI {

    static async asyncInit(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000) {
        // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
        await ProxyProvider.asyncInit(options, pathProxyList, timeout);
    }

    static async getProxyList() {
        return await ProxyProvider.getProxyList();
    }
}

async function test() {
    await ProxyOPI.asyncInit({ protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] }, "./proxyList.json", 4 * 60 * 60 * 1000);
    const proxyList = await ProxyOPI.getProxyList();
    // console.log("\nProxy list is:\n", proxyList);
}

test();