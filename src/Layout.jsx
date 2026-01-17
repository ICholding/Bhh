import React from 'react';

export default function Layout({ children, currentPageName }) {
  // Pages that should have no wrapper (full-screen experiences)
  const fullScreenPages = ['Splash', 'Landing', 'Register', 'Auth'];
  
  if (fullScreenPages.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}