import { useEffect } from 'react';

const useTrackingScript = (advertiser, offer) => {
  useEffect(() => {
    // Create a cleanup function to remove the script if component unmounts
    let scriptElement = null;

    // Define the tracking function
    const loadTrackingScript = () => {
      try {
        // Initialize the tracking array if it doesn't exist
        window.cibleclic_pta = window.cibleclic_pta || [];

        // Push initial tracking data
        window.cibleclic_pta.push({
          'tag.start': new Date().getTime(),
          event: 'tag.js',
          id: offer,
          ad: advertiser
        });

        // Create the script element
        scriptElement = document.createElement('script');
        scriptElement.async = true;

        // Build the script URL
        const dl = 'cibleclic_pta' !== 'cibleclic_pt' ? '&l=cibleclic_pta' : '';
        scriptElement.src = `https://${offer}.userly.net/cl.js?id=${offer}&ad=${advertiser}${dl}`;

        // Insert the script into the DOM
        const firstScript = document.getElementsByTagName('script')[0];
        firstScript.parentNode.insertBefore(scriptElement, firstScript);
      } catch (error) {
        console.error('Error loading tracking script:', error);
      }
    };

    // Load the script
    loadTrackingScript();

    // Cleanup function to remove script when component unmounts
    return () => {
      if (scriptElement && scriptElement.parentNode) {
        scriptElement.parentNode.removeChild(scriptElement);
      }
      // Clean up the global tracking array
      if (window.cibleclic_pta) {
        delete window.cibleclic_pta;
      }
    };
  }, [advertiser, offer]); // Dependencies array includes advertiser and offer
};

export default useTrackingScript;
