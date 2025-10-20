import { useState, useEffect } from 'react';

const useGoogleMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      // Don't attempt to load if there's no API key.
      // The component using this hook should handle the UI for this case.
      return;
    }

    const scriptId = 'google-maps-script';

    if (document.getElementById(scriptId) || (window as any).google) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError(new Error('Failed to load Google Maps script.'));
      document.getElementById(scriptId)?.remove();
    };

    document.head.appendChild(script);

  }, []);

  return { isLoaded, error };
};

export default useGoogleMaps;
