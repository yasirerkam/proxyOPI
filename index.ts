import ProxyProvider from './src/proxyProvider';

export default class ProxyOPI {

    static async asyncInit(options: any, pathProxyList: string, timeout: number = 8 * 60 * 60 * 1000) {
        // this.options = { protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] };
        await ProxyProvider.asyncInit(options, pathProxyList, timeout);
    }

    static async getProxyList(newly: boolean = false) {
        if (newly)
            return await ProxyProvider.getNewProxyList();
        else
            return await ProxyProvider.getProxyList();
    }
}

async function test() {
    await ProxyOPI.asyncInit({ protocols: ['https'], anonymityLevels: ['elite', 'anonymous'] }, "./proxyList.json", 4 * 60 * 60 * 1000);
    const proxyList = await ProxyOPI.getProxyList(true);
    // console.log("\nProxy list is:\n", proxyList);
}

(async () => {
    await test().catch(err => {
        console.error(err);
    });
})();

