
import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import LandingFooter from './LandingFooter';

interface LayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const Layout = ({ children, showFooter = true }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <main className="flex-1 pt-4">
        {children}
      </main>
      {showFooter && <LandingFooter />}
    </div>
  );
};

export default Layout;
