/* global globalThis */
import {
  reactExtension
} from "@shopify/ui-extensions-react/checkout";

const transformCartData = (cartLines) => {

  const listproducts = [];
  const listprices = [];
  const listquantity = [];
  let totalPrice = 0;

  // Process each cart line
  cartLines.forEach(line => {
    const price = line.cost?.totalAmount.amount || 0;
    listprices.push(parseFloat(price));

    listquantity.push(line.quantity);
    const variantId = line.merchandise?.product.id?.split('/').pop() || '';
    if (variantId) {
      listproducts.push(variantId);
    }

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


function Attribution() {


  console.log("come here:", 'come here');
  /* const {advertiser, offer} = useSettings();
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
  const isAllowed = useExtensionCapabilities('network_access'); */











/* useEffect(() => {
  console.log("come here:", 'come here');
  const trackingData = {
    page: 'transaction',
    listproducts: tagsdata?.listproducts || '',
    listprices: tagsdata?.listprices || '',
    listquantity: tagsdata?.listquantity || '',
    price: tagsdata?.price || '',
    transactionid: order?.id?.split('/').pop() || '',
  };
  console.log("Tracking data:", trackingData);
  const sendTrack = (advertiser, offer) => {
    if (!advertiser || !offer) return;
    const trackingUrl = `https://${advertiser}.userly.net/cl.js?id=${advertiser}&ad=${offer}&l=${trackingData}`;
    fetch(trackingUrl)
  };
  sendTrack(advertiser, offer);
}, [offer, advertiser, tagsdata?.listproducts, tagsdata?.listprices, tagsdata?.listquantity, tagsdata?.price, order?.id]); */


  return null;

}
