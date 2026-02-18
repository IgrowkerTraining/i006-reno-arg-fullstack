import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, className = '' }) => {
  return (
    <div className={`min-h-screen  text-neutro-1 selection:bg-indigo-500/30 ${className}`}>
      {children}
    </div>
  );
};

export default Layout;
