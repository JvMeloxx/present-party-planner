
import { Calendar, Edit, Share, User } from "lucide-react";

const STEPS = [
  {
    icon: <User className="w-7 h-7 text-purple-500 mb-1" />,
    title: "Crie sua conta",
    desc: "Cadastro rápido e seguro para começar."
  },
  {
    icon: <Edit className="w-7 h-7 text-pink-500 mb-1" />,
    title: "Personalize sua lista",
    desc: "Escolha o tipo do evento e personalize os presentes."
  },
  {
    icon: <Share className="w-7 h-7 text-red-400 mb-1" />,
    title: "Compartilhe com convidados",
    desc: "Envie o link por WhatsApp, e-mail ou QR code."
  },
  {
    icon: <Calendar className="w-7 h-7 text-purple-400 mb-1" />,
    title: "Acompanhe tudo",
    desc: "Veja quem confirmou presentes e controle sua lista."
  }
];

const HowItWorks = () => (
  <section id="como-funciona" className="py-16 bg-gradient-to-t from-purple-200/50 to-white">
    <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
      <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-4">Como funciona o Gifts2?</h2>
      <p className="text-lg text-gray-600 mb-10 text-center">
        Uma jornada simples para transformar presentes em experiências inesquecíveis.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full animate-fade-in">
        {STEPS.map((step, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg py-8 px-5 flex flex-col items-center transition-transform hover:scale-105 duration-200 group">
            {step.icon}
            <h3 className="font-bold text-lg text-gray-800 mb-2">{step.title}</h3>
            <p className="text-gray-500 text-sm text-center">{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
