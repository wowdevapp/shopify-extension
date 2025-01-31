/* function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

document.addEventListener('DOMContentLoaded', function () {
  // Access the settings
  const advertiser = window.advertiser;
  const offer = window.offer;
  console.log('Advertiser ID:', advertiser);
  console.log('Offer ID:', offer);

  const trackingConsentCookie = getCookie('_tracking_consent');
  if (trackingConsentCookie) {
    const decodedCookie = decodeURIComponent(trackingConsentCookie);
    try {
      const consentData = JSON.parse(decodedCookie);
      console.log('Parsed consent data:', consentData);

      // Check if the user has accepted cookies for specific purposes
      if (consentData.purposes) {
        const { a, p, m } = consentData.purposes; // a = analytics, p = personalization, m = marketing
        if (a && p && m) {
          (function (w, d, s, l, g, i) {
            w[l] = w[l] || []; w[l].push({ 'tag.start': new Date().getTime(), event: 'tag.js', id: i, ad: g });
            var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'cibleclic_pt' ? '&l=' + l : ''; j.async = true;
            j.src = 'https://' + i + '.userly.net/cl.js?id=' + i + '&ad=' + g + dl; f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'cibleclic_pta', advertiser, offer);
        } else {
          console.log('User has not accepted all cookies.');
        }
      } else {
        console.log('No consent purposes found in the cookie.');
      }
    } catch (error) {
      console.error('Error parsing _tracking_consent cookie:', error);
    }
  } else {
    console.log('_tracking_consent cookie not found.');
  }

});

 */
