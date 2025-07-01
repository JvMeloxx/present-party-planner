
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import { ProfileSettings } from "@/components/ProfileSettings";
import { 
  Settings, 
  Bell, 
  Shield, 
  Trash2, 
  Eye,
  Mail,
  Smartphone 
} from "lucide-react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    newReservations: true,
    weeklyDigest: false
  });

  const [privacy, setPrivacy] = useState({
    publicProfile: false,
    showEmail: false,
    allowDuplication: true
  });

  const breadcrumbItems = [
    { label: "Configurações" }
  ];

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
    toast.success("Configurações de notificação atualizadas");
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
    toast.success("Configurações de privacidade atualizadas");
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.")) {
      const confirmText = prompt("Digite 'EXCLUIR' para confirmar:");
      if (confirmText === "EXCLUIR") {
        try {
          // Aqui você implementaria a lógica de exclusão da conta
          toast.error("Funcionalidade de exclusão de conta em desenvolvimento");
        } catch (error) {
          toast.error("Erro ao excluir conta");
        }
      }
    }
  };

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800 flex items-center gap-2">
            <Settings size={32} />
            Configurações
          </h1>
          <p className="text-gray-600 mt-2">Gerencie suas preferências e configurações da conta</p>
        </div>

        <div className="space-y-6">
          {/* Perfil */}
          <ProfileSettings />

          {/* Notificações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell size={20} className="text-purple-600" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <Label htmlFor="email-notifications">Notificações por email</Label>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.email}
                  onCheckedChange={(value) => handleNotificationChange('email', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Smartphone size={16} />
                  <Label htmlFor="push-notifications">Notificações push</Label>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.push}
                  onCheckedChange={(value) => handleNotificationChange('push', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="new-reservations">Novas reservas</Label>
                  <p className="text-sm text-gray-500">Receber notificação quando alguém reservar um presente</p>
                </div>
                <Switch
                  id="new-reservations"
                  checked={notifications.newReservations}
                  onCheckedChange={(value) => handleNotificationChange('newReservations', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weekly-digest">Resumo semanal</Label>
                  <p className="text-sm text-gray-500">Receber um resumo das atividades das suas listas</p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={notifications.weeklyDigest}
                  onCheckedChange={(value) => handleNotificationChange('weeklyDigest', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-purple-600" />
                Privacidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="public-profile">Perfil público</Label>
                  <p className="text-sm text-gray-500">Permitir que outros vejam seu perfil</p>
                </div>
                <Switch
                  id="public-profile"
                  checked={privacy.publicProfile}
                  onCheckedChange={(value) => handlePrivacyChange('publicProfile', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-email">Mostrar email</Label>
                  <p className="text-sm text-gray-500">Exibir seu email nas listas públicas</p>
                </div>
                <Switch
                  id="show-email"
                  checked={privacy.showEmail}
                  onCheckedChange={(value) => handlePrivacyChange('showEmail', value)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="allow-duplication">Permitir duplicação</Label>
                  <p className="text-sm text-gray-500">Permitir que outros dupliquem suas listas públicas</p>
                </div>
                <Switch
                  id="allow-duplication"
                  checked={privacy.allowDuplication}
                  onCheckedChange={(value) => handlePrivacyChange('allowDuplication', value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Zona de Perigo */}
          <Card className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <Trash2 size={20} />
                Zona de Perigo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-red-600 mb-2">Excluir Conta</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Excluir permanentemente sua conta e todos os dados associados. Esta ação não pode ser desfeita.
                  </p>
                  <Button 
                    variant="destructive" 
                    onClick={handleDeleteAccount}
                    className="gap-2"
                  >
                    <Trash2 size={16} />
                    Excluir Conta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
