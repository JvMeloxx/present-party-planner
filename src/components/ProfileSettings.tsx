
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Mail, Phone, MapPin } from "lucide-react";

export function ProfileSettings() {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    email: '',
    full_name: '',
    phone: '',
    bio: '',
    location: ''
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setProfile(prev => ({
          ...prev,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          bio: user.user_metadata?.bio || '',
          location: user.user_metadata?.location || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.full_name,
          phone: profile.phone,
          bio: profile.bio,
          location: profile.location
        }
      });

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error("Erro ao atualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={20} className="text-purple-600" />
          Informações do Perfil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail size={16} />
              Email
            </Label>
            <Input
              id="email"
              value={profile.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
          </div>

          <div>
            <Label htmlFor="full_name">Nome Completo</Label>
            <Input
              id="full_name"
              value={profile.full_name}
              onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone size={16} />
              Telefone
            </Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(11) 99999-9999"
            />
          </div>

          <div>
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin size={16} />
              Localização
            </Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
              placeholder="Sua cidade, estado"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Biografia</Label>
          <Textarea
            id="bio"
            value={profile.bio}
            onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Conte um pouco sobre você..."
            rows={3}
          />
        </div>

        <Button 
          onClick={handleUpdateProfile} 
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </CardContent>
    </Card>
  );
}
