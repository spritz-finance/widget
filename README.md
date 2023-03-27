# Spritz Widget

A JavaScript library for defi apps to have their users spend crypto easily with Spritz

## Installation

```sh
# Using yarn
$ yarn add @spritz-finance/widget

# Using npm
$ npm install @spritz-finance/widget
```

## Example usage

Refer here for the full list of [customisation options](https://docs.spritz.com/docs/query-parameters)

```js
import spritzSDK from '@spritz/widget';

let spritz = new spritzSDK({
    apiKey: '<your-api-key>', // required
    environment: '<environment: STAGING/PRODUCTION>', // required
    provider: window.ethereum.provider // optional, an ethers provider. Will bridge your app's web3 provider into the Spritz app
    widgetHeight: '800px', // optional
    widgetWidth: '100%' //optional
}, provider);

spritz.init();

// To get all the events
spritz.on(spritz.ALL_EVENTS, (data) => {
  console.log(data);
});
