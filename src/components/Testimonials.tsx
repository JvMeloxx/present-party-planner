
const TESTIMONIALS = [
  {
    name: "Maria Alcântara",
    event: "Chá de Panela",
    text: "Organizei minha lista em minutos! As amigas amaram a facilidade e todas conseguiram reservar presentes sem complicação! Recomendo demais.",
    avatar: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=facearea&w=96&h=96"
  },
  {
    name: "Eduarda Gomes",
    event: "Chá de Bebê",
    text: "O Gifts2 fez meu chá de bebê ser super organizado. Os convidados visualizaram tudo pelo celular — prático e lindo!",
    avatar: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=facearea&w=96&h=96"
  },
  {
    name: "Rodrigo Silva",
    event: "Chá de Casa Nova",
    text: "Achei fantástico poder editar os itens do jeito que eu queria e exportar a lista em PDF. Salvou meu evento!",
    avatar: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=facearea&w=96&h=96"
  }
];

const Testimonials = () => (
  <section id="depoimentos" className="py-16 bg-gradient-to-b from-white via-purple-50 to-purple-100">
    <div className="max-w-3xl mx-auto px-4">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-10">Depoimentos</h2>
      <div className="grid gap-8 md:grid-cols-3">
        {TESTIMONIALS.map((t, idx) => (
          <div key={idx} className="bg-white h-full rounded-xl shadow-lg p-6 flex flex-col items-center animate-fade-in">
            <img src={t.avatar} alt={t.name} className="w-20 h-20 rounded-full shadow-md mb-4 object-cover" />
            <p className="text-gray-700 text-base text-center italic mb-2">"{t.text}"</p>
            <div className="flex flex-col items-center mt-auto">
              <span className="text-purple-700 font-semibold">{t.name}</span>
              <span className="text-gray-400 text-xs">{t.event}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
