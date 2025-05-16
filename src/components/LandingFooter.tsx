
const LandingFooter = () => (
  <footer className="w-full mt-20 py-8 bg-gray-100 flex flex-col md:flex-row items-center justify-between px-8 border-t border-gray-200">
    <div className="flex items-center gap-2 text-gray-400 text-sm font-semibold">
      © {new Date().getFullYear()} Gifts2. Todos os direitos reservados.
    </div>
    <div className="flex space-x-4 mt-3 md:mt-0">
      <a href="#" className="hover:text-purple-500 text-gray-500 text-sm transition-colors">Contato</a>
      <a href="#" className="hover:text-purple-500 text-gray-500 text-sm transition-colors">Instagram</a>
      <a href="#" className="hover:text-purple-500 text-gray-500 text-sm transition-colors">Política de Privacidade</a>
    </div>
  </footer>
);

export default LandingFooter;
