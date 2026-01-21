import React from 'react';

export default function Layout({ children, currentPageName }) {
  React.useEffect(() => {
    // Lock to portrait orientation on supported devices
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('portrait').catch(() => {});
    }
  }, []);
  // Pages that should have no wrapper (full-screen experiences)
  const fullScreenPages = ['Splash', 'Landing', 'Register', 'Auth'];
  
  if (fullScreenPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ maxWidth: '480px', margin: '0 auto' }}>
      {children}
    </div>
  );
}