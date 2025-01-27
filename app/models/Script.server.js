// models/Script.server.js
export default function validateSettings(data) {
  console.log(data.advertiser_id, "data ==========");
  const errors = {};

  if (!data.advertiser_id) {
    errors.advertiser_id = "Advertiser ID is required";
  }
  if (!data.offer_id) {
    errors.offer_id = "Offer ID is required";
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
