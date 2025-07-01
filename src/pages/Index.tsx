
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Layout from "@/components/Layout";
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import { AuthenticatedHome } from "@/components/AuthenticatedHome";

// Imagem: celebração de presentes
const heroImage =
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=900&q=80";

const dummyListId = "00000000-0000-0000-0000-000000000001";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <span className="text-gray-600">Carregando...</span>
      </div>
    );
  }

  // Se estiver autenticado, mostrar dashboard
  if (isAuthenticated) {
    return (
      <AuthenticatedLayout>
        <div className="max-w-6xl mx-auto py-6 px-4">
          <AuthenticatedHome />
        </div>
      </AuthenticatedLayout>
    );
  }

  // Se não estiver autenticado, mostrar landing page
  return (
    <Layout>
      {/* Banner principal */}
      <section className="bg-gradient-to-br from-purple-100 to-white py-12 sm:py-16 px-4 mx-4 sm:mx-8 rounded-xl shadow-sm mb-8">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10">
          <div className="flex-1 text-center lg:text-left lg:pr-10">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
              Organize sua lista de presentes&nbsp;
              <span className="text-purple-600">para qualquer ocasião</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0 animate-fade-in delay-100">
              Gerencie, personalize e compartilhe suas listas para chá de panela, casa nova, bebê e muito mais. Zero complicação para você e seus convidados!
            </p>
            <a
              href="/auth"
              className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:scale-105 shadow-lg text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-all duration-200 animate-scale-in"
            >
              Criar conta grátis
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={heroImage}
              alt="Celebração de presentes"
              className="w-full max-w-sm lg:max-w-md rounded-2xl object-cover shadow-xl border-4 border-white"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* Exemplos de listas */}
      <section id="exemplos" className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">Exemplos de Listas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg text-purple-700 mb-2">Chá de Panela</h3>
              <ul className="list-disc list-inside text-gray-600 text-base pl-2 space-y-1">
                <li>Jogo de panelas antiaderente</li>
                <li>Kit utensílios de cozinha</li>
                <li>Panela elétrica de arroz</li>
                <li>Avental divertido</li>
              </ul>
            </div>
            <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform">
              <h3 className="font-bold text-lg text-pink-700 mb-2">Chá de Bebê</h3>
              <ul className="list-disc list-inside text-gray-600 text-base pl-2 space-y-1">
                <li>Fraldas descartáveis</li>
                <li>Babá eletrônica</li>
                <li>Manta de algodão</li>
                <li>Kit higiene bebê</li>
              </ul>
            </div>
            <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform sm:col-span-2 lg:col-span-1">
              <h3 className="font-bold text-lg text-orange-700 mb-2">Chá de Casa Nova</h3>
              <ul className="list-disc list-inside text-gray-600 text-base pl-2 space-y-1 mb-4">
                <li>Kit copos de vidro</li>
                <li>Aparelho de jantar</li>
                <li>Quadros decorativos</li>
                <li>Toalha de mesa</li>
              </ul>
              <a
                href={`/lista/${dummyListId}`}
                className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:scale-105 shadow-lg text-white px-4 sm:px-6 py-2 rounded-full font-semibold text-sm sm:text-base transition-all duration-200"
              >
                Ver página de lista real
              </a>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
    </Layout>
  );
};

export default Index;
