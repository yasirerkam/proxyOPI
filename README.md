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
</p>

> free proxy api

### 🏠 [Homepage](https://github.com/yasirerkam/proxyOPI#readme)

## Install

```sh
npm i @yasir.erkam/proxyopi
```

## Usage

```Typescript
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