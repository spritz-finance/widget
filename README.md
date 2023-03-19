# Spritz Widget

A JavaScript library for decentralised applications to onboard their global user base with fiat currency.

## Installation
asdf
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
  apiKey: '<your-api-key>', // (Required)
  environment: '<environment: STAGING/PRODUCTION>', // (Required)
  // .....
  // For the full list of customisation options check the link above
});

spritz.init();

// To get all the events
spritz.on(spritz.ALL_EVENTS, (data) => {
  console.log(data);
});

// This will trigger when the user closed the widget
spritz.on(spritz.EVENTS.spritz_WIDGET_CLOSE, (orderData) => {
  spritz.close();
});

// This will trigger when the user marks payment is made
spritz.on(spritz.EVENTS.spritz_ORDER_SUCCESSFUL, (orderData) => {
  console.log(orderData);
  spritz.close();
});
```
