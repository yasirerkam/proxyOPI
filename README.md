<h1 align="center">Welcome to Proxy OPI 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/@yasir.erkam/proxyopi" target="_blank">
    <img alt="Version" src="https://img.shields.io/npm/v/@yasir.erkam/proxyopi.svg">
  </a>
  <a href="https://github.com/yasirerkam/proxyOPI#readme" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
  <a href="https://github.com/yasirerkam/proxyOPI/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://github.com/yasirerkam/proxyOPI/" target="_blank">
    <img alt="GitHub contributors" src="https://img.shields.io/github/contributors-anon/yasirerkam/proxyOPI">
   </a>
   
   <img alt="NPM Downloads" src="https://img.shields.io/npm/dm/%40yasir.erkam%2Fproxyopi">
</p>

> Free Proxy API

### 🏠 [Homepage](https://github.com/yasirerkam/proxyOPI#readme)

## Sources of Proxies
Fetch free proxies from:
  - https://checkerproxy.net
  - https://www.cool-proxy.net
  - http://free-proxy.cz
  - https://www.us-proxy.org
  - https://www.sslproxies.org
  - https://free-proxy-list.net
  - https://free-proxy-list.net/uk-proxy.html
  - https://free-proxy-list.net/anonymous-proxy.html
  - https://raw.githubusercontent.com/zloi-user/hideip.me
  - https://hidemy.io
  - https://www.my-proxy.com
  - https://openproxy.space
  - https://premproxy.com
  - https://proxy-daily.com
  - https://proxy-list.org
  - https://www.proxynova.com
  - https://proxyscrape.com
  - more...

## Install

```sh
npm i @yasir.erkam/proxyopi
```

## Example

```	Typescript
import { ProxyOPI, Proxy, ProxyList, Protocol } from "@yasir.erkam/proxyopi";

const proxyOPI = await ProxyOPI.getInstanceAsync("./path/to/proxyList.json");
const proxyList = await proxyOPI.getProxyListAsync();

const list = proxyList.list.filter((proxy: Proxy) => proxy.protocols[0] === Protocol.http || proxy.protocols[0] === Protocol.https);
console.log(list);
```	

## Run tests

```sh
npm run test
```

## Author

👤 **Yasir Erkam Özdemir**

* Github: [@yasirerkam](https://github.com/yasirerkam)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/owner/project/issues). You can also take a look at the [contributing guide](https://github.com/yasirerkam/proxyOPI/blob/master/CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
