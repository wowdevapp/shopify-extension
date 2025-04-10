import { register } from "@shopify/web-pixels-extension";

register(({ analytics, browser, init, settings }) => {
  // Bootstrap and insert pixel script tag here

  const advertiser = settings.advertiser;
  const offer = settings.offer;
  let uuid;
  let uuidtmp;
  let nccem;
  let nccrt;
  let uuid_d;

  // Get localStorage item using Promise
  browser.localStorage.getItem('us_dt')
    .then(usDataString => {
      if (usDataString) {
        try {
          const usData = JSON.parse(usDataString);
          uuid = usData.uuid;
          uuidtmp = usData.uuid_tmp;
          uuid_d = usData.uuid && usData.uuid.d;
          nccem = usData && usData.ncc_em && usData.ncc_em.ncc_em;
          nccrt = usData && usData.ncc_rt && usData.ncc_rt.ncc_rt;
        } catch (error) {
          console.error('Error parsing us_dt from localStorage:', error);
        }
      }
    })
    .catch(error => {
      console.error('Error retrieving from localStorage:', error);
    });

  // Sample subscribe to page view
  //checkout_completed
  analytics.subscribe('checkout_completed', (event) => {
    const checkout = event.data.checkout;
    if (!checkout) return;  // Guard clause

    const { order, totalPrice, lineItems } = checkout;
    const u = uuid.uuid || '';  // Use optional chaining with default
    const ut = uuidtmp.uuid_tmp || '';
    const ud = uuid_d || '';
    const list_product = lineItems.map(item => item.id);
    const list_quantity = lineItems.map(item => item.quantity);
    const list_price = lineItems.map(item => item.variant.price.amount);
    const pool = nccem ? nccem : nccrt ? nccrt : '';


    // Use URL constructor for cleaner URL building
    const baseUrl = `https://${offer}.userly.net`;
    const path = 'trk/trk_email_shopify.php';
    const url = new URL(path, baseUrl);
    // Add query parameters
    url.searchParams.append('uuid', u);
    url.searchParams.append('uuid_d', ud);
    url.searchParams.append('uuidtmp', ut);
    url.searchParams.append('transaction_id', order.id);
    url.searchParams.append('amount', totalPrice.amount);
    url.searchParams.append('list_product', list_product);
    url.searchParams.append('list_quantity', list_quantity);
    url.searchParams.append('list_price', list_price);
    url.searchParams.append('pool', pool);
    url.searchParams.append('offer_id', offer);
    url.searchParams.append('advertiser_id', advertiser);
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
