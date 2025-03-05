import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // Bootstrap and insert pixel script tag here
  analytics.subscribe('checkout_completed', (event) => {
    console.log('Checkout completed', event);
  });
});

