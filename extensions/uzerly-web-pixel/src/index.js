import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // Bootstrap and insert pixel script tag here

  const advertiser = 2255;
  const offer = 943
  let uuid;
  let uuidtmp;
  let nccem;
  let nccrt;

  // Get localStorage item using Promise
  browser.localStorage.getItem('us_dt')
    .then(usDataString => {
      if (usDataString) {
        try {
          const usData = JSON.parse(usDataString);
          uuid = usData.uuid;
          uuidtmp = usData.uuid_tmp
          nccem = usData?.ncc_em?.ncc_em;
          nccrt = usData?.ncc_rt?.ncc_rt;
          console.log('Successfully parsed nccem:', nccem);
          console.log('Successfully parsed uuidtmp:', nccrt);
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

    const list_price = lineItems.map(item => item.variant.price.amount);

    const pool = nccem ? nccem : nccrt ? nccrt : '';

    console.log('list price @@@@@@@@@@@', list_price);

    // Use URL constructor for cleaner URL building
    const baseUrl = `https://${advertiser}.userly.net`;
    const path = '/email_remarketing/view/view.php';
    const url = new URL(path, baseUrl);

    // Add query parameters
    url.searchParams.append('uuid', u);
    url.searchParams.append('uuidtmp', ut);
    url.searchParams.append('transaction_id', order.id);
    url.searchParams.append('amount', totalPrice.amount);
    url.searchParams.append('list_product', list_product);
    url.searchParams.append('list_quantity', list_quantity);
    url.searchParams.append('list_price', list_price);
    url.searchParams.append('pool', pool);
    /*  uuid=cd76 d5af-a6c0-f910-5077- 7216 11ea */

    (async () => {
      try {
        const response = await fetch(url, { method: 'POST' });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        // Optional: process response if needed
      } catch (error) {
        console.error('Failed to send checkout tracking:', error);
      }
    })();
  });
});


/* let uuid;
let uuidtmp;

  // Get localStorage item using Promise
  browser.localStorage.getItem('us_dt')
    .then(usDataString => {
      if (usDataString) {
        try {
          const usData = JSON.parse(usDataString);
          uuid = usData.uuid;
          uuidtmp = usData.uuid_tmp
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

analytics.subscribe('checkout_completed', (event) => {
  try {

    const checkout = event.data.checkout;
    if (!checkout) {
      console.error('No checkout data found in the event');
      return;
    }

    // Safely extract data with error checking
    const { order, totalPrice, lineItems } = checkout;

    if (!order) {
      console.error('No order data found in checkout');
      return;
    }

    if (!lineItems || !Array.isArray(lineItems)) {
      console.error('No line items found or line items is not an array');
      return;
    }


    // Safely get UUID values with fallbacks
    const u = (typeof uuid !== 'undefined' && uuid?.uuid) ? uuid.uuid : '';
    const ut = (typeof uuidtmp !== 'undefined' && uuidtmp?.uuid_tmp) ? uuidtmp.uuid_tmp : '';

    // Safely extract product information
    const list_product = lineItems.map(item => item.id || '');
    const list_quantity = lineItems.map(item => item.quantity || 0);


    // Manual URL construction without using URL constructor
    try {
      const baseUrl = `https://2255.userly.net`;
      const path = '/email_remarketing/view/view.php';
      // Build query string manually
      let queryParams = [];
      // Add query parameters with validation
      if (u) queryParams.push(`uuid=${encodeURIComponent(u)}`);
      if (ut) queryParams.push(`uuidtmp=${encodeURIComponent(ut)}`);
      if (order.id) queryParams.push(`transaction_id=${encodeURIComponent(order.id)}`);
      if (totalPrice && totalPrice.amount) queryParams.push(`amount=${encodeURIComponent(totalPrice.amount)}`);

      // Convert arrays to strings for URL parameters
      if (list_product.length > 0) queryParams.push(`list_product=${encodeURIComponent(list_product.join(','))}`);
      if (list_quantity.length > 0) queryParams.push(`list_quantity=${encodeURIComponent(list_quantity.join(','))}`);

      // Combine all parts into a complete URL
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const url = `${baseUrl}${path}${queryString}`;
      // Make the fetch request with error handling
      fetch(url)
        .then(response => {
          console.log('Fetch response status:', response.status);
          return response.text();
        })
        .then(data => {
          console.log('Fetch response data:', data);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    } catch (urlError) {
      console.error('Error constructing URL:', urlError);
    }
  } catch (e) {
    console.error('Error in checkout_completed event handler:', e);
  }
}); */