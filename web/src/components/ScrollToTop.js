import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * This component automatically scrolls the window to the top (0, 0)
 * every time the user navigates to a new route. It uses the `useLocation`
 * hook to detect changes in the URL's pathname.
 */
const ScrollToTop = () => {
  // Extracts the `pathname` from the current location object.
  const { pathname } = useLocation();

  // This effect will run every time the `pathname` changes.
  useEffect(() => {
    // This is the browser's native method to scroll to the top of the page.
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this effect runs on navigation.

  // This component does not render any visible UI.
  return null;
};

export default ScrollToTop;