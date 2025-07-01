
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { User, Settings, LogOut, Plus, List, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const AppHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-purple-600 tracking-tight">
              Gifts
              <span className="text-pink-500">2</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#como-funciona" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Como funciona
            </a>
            <a href="#exemplos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Exemplos
            </a>
            <a href="#depoimentos" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
              Depoimentos
            </a>
            {session && (
              <Link
                to="/minhas-listas"
                className={`text-gray-700 hover:text-purple-600 font-medium transition-colors px-3 py-2 rounded-md ${
                  isActive("/minhas-listas") ? "bg-purple-100 text-purple-700 font-bold" : ""
                }`}
              >
                Minhas listas
              </Link>
            )}
          </nav>

          {/* Desktop User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {!session ? (
              <Link to="/auth">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                  Login / Cadastro
                </Button>
              </Link>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/criar-lista">
                  <Button size="sm" className="gap-2">
                    <Plus size={16} />
                    Nova Lista
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <User size={16} />
                      Conta
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/minhas-listas" className="flex items-center gap-2">
                        <List size={16} />
                        Minhas Listas
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/configuracoes" className="flex items-center gap-2">
                        <Settings size={16} />
                        Configurações
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600">
                      <LogOut size={16} />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#como-funciona" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
                Como funciona
              </a>
              <a href="#exemplos" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
                Exemplos
              </a>
              <a href="#depoimentos" className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium">
                Depoimentos
              </a>
              {session && (
                <Link
                  to="/minhas-listas"
                  className={`block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium ${
                    isActive("/minhas-listas") ? "bg-purple-100 text-purple-700 font-bold" : ""
                  }`}
                >
                  Minhas listas
                </Link>
              )}
              <div className="border-t pt-2 mt-2">
                {!session ? (
                  <Link to="/auth" className="block px-3 py-2">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                      Login / Cadastro
                    </Button>
                  </Link>
                ) : (
                  <div className="space-y-2 px-3">
                    <Link to="/criar-lista" className="block">
                      <Button size="sm" className="w-full gap-2">
                        <Plus size={16} />
                        Nova Lista
                      </Button>
                    </Link>
                    <Link to="/configuracoes" className="block">
                      <Button variant="ghost" size="sm" className="w-full gap-2 justify-start">
                        <Settings size={16} />
                        Configurações
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full gap-2 justify-start text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut size={16} />
                      Sair
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
