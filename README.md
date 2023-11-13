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

Refer here for the full list of [customisation options](https://docs.spritz.finance/docs/embeddable-widget)

```js
import SpritzSDK from '@spritz-finance/widget';

let spritz = new SpritzSDK({
    integrationKey: '<your-integration-key>', // required
    environment: '<environment: STAGING|PRODUCTION>', // required
    provider: window.ethereum.provider // optional, an ethers provider. Will bridge your app's web3 provider into the Spritz app
    height: '800px', // optional
    width: '100%' //optional
});

spritz.init();

// To get all the events
spritz.on(spritz.ALL_EVENTS, (data) => {
  console.log(data);
});
```
