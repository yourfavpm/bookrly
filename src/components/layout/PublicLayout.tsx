import React from 'react';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-white text-text-primary">
      {/* Main Content Area - Layout only provides the background and base styles */}
      {/* The PublicWebsite component handles its own navigation and footer for maximum customization */}
      <main className="w-full">
        {children}
      </main>
    </div>
  );
};
