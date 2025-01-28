document.addEventListener('DOMContentLoaded', function () {
  // Access the settings
  const advertiser = window.advertiser;
  const offer = window.offer;

  // Now you can use settings.advertiser and settings.offer
  console.log('Advertiser ID:', advertiser);
  console.log('Offer ID:', offer);

  (function (w, d, s, l, g, i) {
    w[l] = w[l] || []; w[l].push({ 'tag.start': new Date().getTime(), event: 'tag.js', id: i, ad: g });
    var f = d.getElementsByTagName(s)[0], j = d.createElement(s), dl = l != 'cibleclic_pt' ? '&l=' + l : ''; j.async = true;
    j.src = 'https://' + i + '.userly.net/cl.js?id=' + i + '&ad=' + g + dl; f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'cibleclic_pta', advertiser, offer);

});

