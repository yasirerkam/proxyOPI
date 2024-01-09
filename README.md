# Proxy OPI

## TypeScript example
```	Typescript
import { ProxyOPI, Proxy, ProxyList, Protocol } from "@yasir.erkam/proxyopi";

const proxyOPI = await ProxyOPI.getInstanceAsync("./path/to/proxyList.json");
const proxyList = await proxyOPI.getProxyListAsync();

const list = proxyList.list.filter((proxy: Proxy) => proxy.protocols[0] === Protocol.http || proxy.protocols[0] === Protocol.https);
console.log(list);

```	