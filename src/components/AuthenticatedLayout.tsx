
import { ReactNode, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import UserNavigation from './UserNavigation';
import LandingFooter from './LandingFooter';
import AuthPage from '@/pages/AuthPage';
import LoadingSpinner from './LoadingSpinner';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const AuthenticatedLayout = ({ children, showFooter = true }: AuthenticatedLayoutProps) => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => { listener.subscription.unsubscribe(); };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UserNavigation />
      <main className="flex-1 pt-4">
        {children}
      </main>
      {showFooter && <LandingFooter />}
    </div>
  );
};

export default AuthenticatedLayout;
