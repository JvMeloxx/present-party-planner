import { Link, useLocation } from "react-router-dom";

const LandingHeader = () => {
  const location = useLocation();

  return (
    <header className="w-full flex justify-between items-center py-4 px-6 bg-white shadow-sm fixed top-0 left-0 z-30">
      <div className="flex items-center gap-3">
        <span className="text-2xl font-extrabold text-purple-600 tracking-tight select-none" style={{ fontFamily: "Poppins, Arial, sans-serif" }}>
          Gifts
          <span className="text-pink-500">2</span>
        </span>
      </div>
      <nav className="hidden md:flex gap-8">
        <a href="#como-funciona" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Como funciona</a>
        <a href="#exemplos" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Exemplos</a>
        <a href="#depoimentos" className="text-gray-700 text-base hover:text-purple-500 font-medium transition-colors">Depoimentos</a>
        <Link
          to="/minhas-listas"
          className={`text-gray-700 text-base hover:text-purple-700 font-bold transition-colors px-2 py-1 rounded-md ${location.pathname.startsWith("/minhas-listas") ? "bg-purple-100 text-purple-700 font-extrabold" : ""}`}
        >
          Minhas listas
        </Link>
      </nav>
      <div>
        <Link to="#" className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-5 rounded-full font-semibold text-base shadow-md transition-colors animate-scale-in">
          Login / Cadastro
        </Link>
      </div>
    </header>
  );
};

export default LandingHeader;
