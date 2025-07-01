
import { Link, useLocation } from "react-router-dom";
import { User, Plus, List, Settings, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const UserNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logout realizado com sucesso!" });
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    {
      to: "/",
      icon: Home,
      label: "Início",
      description: "Página inicial"
    },
    {
      to: "/minhas-listas",
      icon: List,
      label: "Minhas Listas",
      description: "Gerenciar suas listas de presentes"
    },
    {
      to: "/criar-lista",
      icon: Plus,
      label: "Nova Lista",
      description: "Criar uma nova lista de presentes"
    },
    {
      to: "/configuracoes",
      icon: Settings,
      label: "Configurações",
      description: "Configurações da conta"
    }
  ];

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold text-purple-600 tracking-tight">
              Gifts
              <span className="text-pink-500">2</span>
            </span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:text-purple-600 hover:bg-gray-50"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu Desktop */}
          <div className="hidden md:flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut size={16} />
              Sair
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <User size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t bg-gray-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.to)
                    ? "bg-purple-100 text-purple-700"
                    : "text-gray-700 hover:text-purple-600 hover:bg-white"
                }`}
              >
                <item.icon size={18} />
                <div>
                  <div>{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
            <div className="border-t pt-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full gap-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut size={16} />
                Sair da conta
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavigation;
