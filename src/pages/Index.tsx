
import LandingHeader from "@/components/LandingHeader";
import LandingFooter from "@/components/LandingFooter";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";

// Imagem: celebração de presentes
const heroImage =
  "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=900&q=80";

const Index = () => {
  return (
    <div className="w-full bg-gray-50 min-h-screen">
      <LandingHeader />
      <main className="pt-24">
        {/* Banner principal */}
        <section className="bg-gradient-to-br from-purple-100 to-white py-16 px-4 flex flex-col md:flex-row items-center justify-between gap-10 max-w-7xl mx-auto rounded-xl shadow-sm">
          <div className="flex-1 md:pr-10 mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-4 animate-fade-in" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
              Organize sua lista de presentes&nbsp;
              <span className="text-purple-600">para qualquer ocasião</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-xl animate-fade-in delay-100">
              Gerencie, personalize e compartilhe suas listas para chá de panela, casa nova, bebê e muito mais. Zero complicação para você e seus convidados!
            </p>
            <a
              href="#"
              className="inline-block bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 hover:scale-105 shadow-lg text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 animate-scale-in"
            >
              Crie sua lista agora
            </a>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src={heroImage}
              alt="Celebração de presentes"
              className="w-[350px] h-[280px] rounded-2xl object-cover shadow-xl border-4 border-white"
              loading="lazy"
            />
          </div>
        </section>

        <HowItWorks />

        {/* Exemplos de listas */}
        <section id="exemplos" className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-8 text-center">Exemplos de Listas</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-purple-50 border-2 border-purple-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform">
                <h3 className="font-bold text-lg text-purple-700 mb-2">Chá de Panela</h3>
                <ul className="list-disc list-inside text-gray-600 text-base pl-2">
                  <li>Jogo de panelas antiaderente</li>
                  <li>Kit utensílios de cozinha</li>
                  <li>Panela elétrica de arroz</li>
                  <li>Avental divertido</li>
                </ul>
              </div>
              <div className="bg-pink-50 border-2 border-pink-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform">
                <h3 className="font-bold text-lg text-pink-700 mb-2">Chá de Bebê</h3>
                <ul className="list-disc list-inside text-gray-600 text-base pl-2">
                  <li>Fraldas descartáveis</li>
                  <li>Babá eletrônica</li>
                  <li>Manta de algodão</li>
                  <li>Kit higiene bebê</li>
                </ul>
              </div>
              <div className="bg-orange-50 border-2 border-orange-100 rounded-xl p-6 animate-fade-in shadow-md hover:scale-105 transition-transform">
                <h3 className="font-bold text-lg text-orange-700 mb-2">Chá de Casa Nova</h3>
                <ul className="list-disc list-inside text-gray-600 text-base pl-2">
                  <li>Kit copos de vidro</li>
                  <li>Aparelho de jantar</li>
                  <li>Quadros decorativos</li>
                  <li>Toalha de mesa</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <Testimonials />
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;
