
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<Mode>("signin");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Se já autenticado, redireciona para a página principal
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/");
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    let result;
    if (mode === "signin") {
      result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) {
        setErrorMsg("Email ou senha inválidos.");
      } else {
        toast({ title: "Login realizado com sucesso!" });
        navigate("/");
      }
    } else {
      result = await supabase.auth.signUp({ email, password });
      if (result.error) {
        setErrorMsg("Não foi possível cadastrar: " + result.error.message);
      } else {
        toast({ title: "Cadastro realizado!", description: "Faça login com seu email." });
        setMode("signin");
      }
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <form
        className="rounded-xl bg-white p-10 w-[350px] shadow-lg flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-extrabold text-purple-700 mb-2">
          {mode === "signin" ? "Entrar" : "Criar conta"}
        </h2>
        <Input
          type="email"
          required
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
        />
        <Input
          type="password"
          required
          placeholder="Senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
        />
        {errorMsg && <span className="text-sm text-destructive">{errorMsg}</span>}
        <Button type="submit" disabled={loading}>
          {loading ? "Enviando..." : mode === "signin" ? "Entrar" : "Cadastrar"}
        </Button>
        <div className="text-sm text-center">
          {mode === "signin" ? (
            <>
              Não tem conta?{" "}
              <button type="button" onClick={() => setMode("signup")} className="text-purple-600 hover:underline">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{" "}
              <button type="button" onClick={() => setMode("signin")} className="text-purple-600 hover:underline">
                Entrar
              </button>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
