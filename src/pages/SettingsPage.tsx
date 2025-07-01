
import { useState, useEffect } from "react";
import { User, Mail, Bell, Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Link } from "react-router-dom";

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

  const breadcrumbItems = [
    { label: "Configurações" }
  ];

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800 flex items-center gap-3">
            <User size={32} />
            Configurações
          </h1>
          <p className="text-gray-600 mt-2">Gerencie suas informações pessoais e preferências</p>
        </div>
        
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="space-y-8">
            {/* Perfil */}
            <div className="border-b pb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User size={20} />
                Perfil
              </h2>
              
              <div className="space-y-4 max-w-md">
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
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Reservas de presentes</p>
                    <p className="text-sm text-gray-600">Receber email quando alguém reservar um presente</p>
                  </div>
                  <Button variant="outline" disabled>
                    Em breve
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
            
            {/* Informações da Conta */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Shield size={20} />
                Informações da Conta
              </h2>
              
              {user && (
                <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <p><strong>Cadastrado em:</strong> {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Último login:</strong> {new Date(user.last_sign_in_at).toLocaleDateString('pt-BR')}</p>
                  <p><strong>ID da conta:</strong> {user.id}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
