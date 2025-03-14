import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // Bootstrap and insert pixel script tag here

  // Properly get and parse the localStorage item
  let uuid;
  let uuidtmp;

  // Get localStorage item using Promise
  browser.localStorage.getItem('us_dt')
    .then(usDataString => {
      if (usDataString) {
        try {
          const usData = JSON.parse(usDataString);
          uuid = usData.uuid;
          uuidtmp = usData.uuid_tmp
          console.log('Successfully parsed uuid:', uuid);
          console.log('Successfully parsed uuidtmp:', uuidtmp);
        } catch (error) {
          console.error('Error parsing us_dt from localStorage:', error);
          // Log the raw value to see what we're working with
          console.log('Raw value from localStorage:', usDataString);
        }
      } else {
        console.log('No us_dt found in localStorage');
      }
    })
    .catch(error => {
      console.error('Error retrieving from localStorage:', error);
    });

  // Sample subscribe to page view
  //checkout_completed
  analytics.subscribe('checkout_completed', (event) => {
    const { checkout } = event.data;

    if (!checkout) return;  // Guard clause

    const { order, totalPrice, lineItems } = checkout;
    const u = uuid?.uuid || '';  // Use optional chaining with default
    const ut = uuidtmp?.uuid_tmp || '';

    const list_product = lineItems.map(item => item.id);

    const list_quantity = lineItems.map(item => item.quantity);

    // Use URL constructor for cleaner URL building
    const baseUrl = `https://${settings.advertiser}.userly.net`;
    const path = '/email_remarketing/view/view.php';
    const url = new URL(path, baseUrl);

    // Add query parameters
    url.searchParams.append('uuid', u);
    url.searchParams.append('uuidtmp', ut);
    url.searchParams.append('transaction_id', order.id);
    url.searchParams.append('amount', totalPrice.amount);
    url.searchParams.append('list_product', list_product);
    url.searchParams.append('list_quantity', list_quantity);

    (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        // Optional: process response if needed
      } catch (error) {
        console.error('Failed to send checkout tracking:', error);
      }
    })();
  });
});
