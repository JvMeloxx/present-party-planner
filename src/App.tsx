
import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GiftListPage from "./pages/GiftListPage";
import CreateGiftListPage from "./pages/CreateGiftListPage";
import MyListsPage from "./pages/MyListsPage";
import AuthPage from "./pages/AuthPage";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Listener de auth, para redirecionar/deslogar automaticamente
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
      <div className="flex items-center justify-center h-screen">
        <span className="text-gray-600">Carregando autenticação...</span>
      </div>
    );
  }

  if (!session) {
    return <AuthPage />;
  }
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/" element={<Index />} />
          <Route
            path="/criar-lista"
            element={
              <ProtectedRoute>
                <CreateGiftListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lista/:id"
            element={<GiftListPage />}
          />
          <Route
            path="/minhas-listas"
            element={
              <ProtectedRoute>
                <MyListsPage />
              </ProtectedRoute>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

