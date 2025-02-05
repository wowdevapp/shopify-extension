/* global globalThis */
import {
  reactExtension, useApi,
  useCartLines, useSubscription,
  useSettings, useCustomerPrivacy,
  useExtensionCapabilities
} from "@shopify/ui-extensions-react/checkout";
import { useEffect } from "react";

const transformCartData = (cartLines) => {
  // Extract the transaction ID from the first line item

  // Initialize arrays for products, prices, and quantities
  const listproducts = [];
  const listprices = [];
  const listquantity = [];
  let totalPrice = 0;

  // Process each cart line
  cartLines.forEach(line => {
    // Get the price from cost.amount
    const price = line.cost?.totalAmount.amount || 0;
    listprices.push(parseFloat(price));

    // Add quantity
    listquantity.push(line.quantity);

    // Extract product variant ID from merchandise.id
    // Taking only the numeric part after the last '/'
    const variantId = line.merchandise?.product.id?.split('/').pop() || '';
    if (variantId) {
      listproducts.push(variantId);
    }

    // Calculate total price
    totalPrice += parseFloat(price) * line.quantity;
  });

  // Return formatted object
  return {
    listproducts,
    listprices,
    listquantity,
    price: totalPrice.toFixed(2)
  };
};
const thankYouBlock = reactExtension("purchase.thank-you.block.render", () => <Attribution />);
export { thankYouBlock };

/* const sendTrack = (advertiser, offer) => {
  (function (w, d, s, l, g, i) {
    w[l] = w[l] || [];
    w[l].push({
      'tag.start': new Date().getTime(),
      event: 'tag.js',
      id: i,
      ad: g
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'cibleclic_pt' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://' + i + '.userly.net/cl.js?id=' + i + '&ad=' + g + dl;
    f.parentNode.insertBefore(j, f);
  })(globalThis, document, 'script', 'cibleclic_pta', advertiser, offer);
}; */

function Attribution() {
  const {advertiser, offer} = useSettings();
  const cartLines = useCartLines();
  const {orderConfirmation} = useApi();
  const order = useSubscription(orderConfirmation);

  const {
    visitorConsent: {
      analytics,
      marketing,
      preferences,
      saleOfData,
    },
  } = useCustomerPrivacy();

  const tagsdata = transformCartData(cartLines);
  const isAllowed = useExtensionCapabilities('network_access');

  console.log('new script' , new Date());
  console.log('isAllowed', isAllowed);

  // Use useEffect to set window object
  useEffect(() => {
    // Define tracking data
    const trackingData = {
      page: 'transaction',
      listproducts: tagsdata?.listproducts || '',
      listprices: tagsdata?.listprices || '',
      listquantity: tagsdata?.listquantity || '',
      price: tagsdata?.price || '',
      transactionid: order?.id?.split('/').pop() || '',
      email: 'test' || ''
    };

    // Make it globally accessible
    var cibleclic_pt = [trackingData];

    globalThis.cibleclic_pt = cibleclic_pt;


    // Optional: Add a debug helper
    var getTrackingData = () => {
      return {
        cibleclic_pt:cibleclic_pt,
        tagsdata,
        order: order?.id,
        consent: {
          analytics,
          marketing,
          preferences,
          saleOfData
        }
      };
    };
  }, [tagsdata, order, analytics, marketing, preferences, saleOfData]);

  // Load tracking script if consent is granted
  useEffect(() => {

    if (offer && advertiser) {
      console.log('loading script');
      fetch(`https://${offer}.userly.net/cl.js?id=${offer}&ad=${advertiser}&l=cibleclic_pta`,{
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*'
        }
      }).then((response) => {
        return response.text();
      }).catch((error) => {
        console.error('Error loading tracking script:', error);
      });
    }
  }, [analytics, marketing, preferences, advertiser, offer]);

  return null;
}
