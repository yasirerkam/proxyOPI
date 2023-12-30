import ProxyProvider from './src/proxyProvider';

export default class ProxyOPI {

    private constructor() { }

    static async initAsync(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000) {
        // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
        await ProxyProvider.initAsync(options, pathProxyList, timeout);
    }

    static async getProxyListAsync(newly: boolean = false) {
        if (newly)
            return await ProxyProvider.getNewProxyListAsync();
        else
            return await ProxyProvider.getProxyListAsync();
    }
}

async function test() {
    await ProxyOPI.initAsync({ protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] }, "./data/proxyList.json", 4 * 60 * 60 * 1000);
    const proxyList = await ProxyOPI.getProxyListAsync(false);
    // console.log("\nProxy list is:\n", proxyList);
}

(async () => {
    await test().catch(err => {
        console.error(err);
    });
})();

