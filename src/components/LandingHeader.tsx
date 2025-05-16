
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const LandingHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session);
    });

    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    navigate("/auth");
  };

  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm fixed top-0 left-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-purple-600 tracking-tight select-none" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
          Gifts
          <span className="text-pink-500">2</span>
        </span>
      </div>
      <nav className="hidden md:flex gap-8">
        <a href="#como-funciona" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Como funciona</a>
        <a href="#exemplos" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Exemplos</a>
        <a href="#depoimentos" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Depoimentos</a>
        <Link
          to="/minhas-listas"
          className={`text-gray-700 text-base hover:text-purple-700 font-bold transition-colors px-2 py-1 rounded-md ${location.pathname.startsWith("/minhas-listas") ? "bg-purple-100 text-purple-700 font-extrabold" : ""}`}
        >
          Minhas listas
        </Link>
      </nav>
      <div>
        {!session ? (
          <Link to="/auth" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-full font-semibold text-base shadow-md transition-colors animate-scale-in">
            Login / Cadastro
          </Link>
        ) : (
          <Button variant="ghost" onClick={handleLogout} className="text-purple-700 hover:bg-purple-100 font-semibold">
            Sair
          </Button>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
