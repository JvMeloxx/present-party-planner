
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, User, Mail, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setDisplayName(user.user_metadata?.display_name || "");
      }
    };
    getCurrentUser();
  }, []);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });

      if (error) throw error;

      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso."
      });
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Você precisa estar logado para acessar as configurações.</p>
          <Link to="/auth">
            <Button>Fazer login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50">
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Link to="/" className="inline-flex items-center gap-2 mb-6 text-gray-600 hover:text-purple-600 font-medium transition-colors">
          <ArrowLeft size={20} /> Voltar
        </Link>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <h1 className="text-3xl font-bold text-purple-800 mb-6 flex items-center gap-2">
            <User size={32} />
            Configurações
          </h1>
          
          <div className="space-y-6">
            {/* Perfil */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} />
                Perfil
              </h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    O email não pode ser alterado
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="displayName">Nome de exibição</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Como você gostaria de ser chamado?"
                  />
                </div>
                
                <Button 
                  onClick={handleUpdateProfile}
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {loading ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </div>
            
            {/* Notificações */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Bell size={20} />
                Notificações
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Reservas de presentes</p>
                    <p className="text-sm text-gray-600">Receber email quando alguém reservar um presente</p>
                  </div>
                  <Button variant="outline" disabled>
                    Em breve
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Novos comentários</p>
                    <p className="text-sm text-gray-600">Receber notificações sobre comentários nas suas listas</p>
                  </div>
                  <Button variant="outline" disabled>
                    Em breve
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Conta */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} />
                Conta
              </h2>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  onClick={handleSignOut}
                  className="w-full sm:w-auto"
                >
                  Sair da conta
                </Button>
                
                <div className="text-sm text-gray-500">
                  <p>Cadastrado em: {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  <p>Último login: {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
