
import { useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Edit, Trash2, PlusCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

// Mock data: listas de presente do anfitrião
const mockLists = [
  {
    id: "00000000-0000-0000-0000-000000000001",
    title: "Chá de Casa Nova",
    description: "Itens essenciais para o novo lar",
    created_at: "2024-03-01",
  },
  {
    id: "00000000-0000-0000-0000-000000000002",
    title: "Chá de Bebê da Ana",
    description: "Presentes para a chegada da Ana",
    created_at: "2024-03-10",
  },
];

function MyListsPage() {
  const [lists, setLists] = useState(mockLists);

  const handleCopy = (listId: string) => {
    const url = window.location.origin + "/lista/" + listId;
    navigator.clipboard.writeText(url);
    toast({ title: "Link copiado!", description: "O link da lista foi copiado para a área de transferência." });
  };

  const handleDelete = (listId: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta lista?")) {
      setLists(lists.filter(l => l.id !== listId));
      toast({ title: "Lista excluída", description: "A lista foi excluída com sucesso." });
    }
  };

  const handleEdit = (listId: string) => {
    toast({ title: "Funcionalidade em breve!", description: "Em breve será possível editar a lista." });
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-purple-800">Minhas listas</h1>
        <Link to="/criar-lista">
          <Button variant="default" className="gap-2"><PlusCircle size={20} />Nova lista</Button>
        </Link>
      </div>
      {lists.length === 0 ? (
        <div className="text-center text-gray-600">
          Você ainda não criou nenhuma lista. <Link to="/criar-lista" className="text-purple-600 underline">Criar agora</Link>
        </div>
      ) : (
        <ul className="space-y-5">
          {lists.map(list =>
            <li key={list.id} className="border rounded-xl bg-purple-50 p-5 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm">
              <div>
                <Link to={`/lista/${list.id}`} className="font-bold text-lg text-purple-800 hover:underline">{list.title}</Link>
                <p className="text-gray-600 text-sm">{list.description}</p>
                <span className="text-xs text-gray-400">Criada em {new Date(list.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Button variant="ghost" onClick={() => handleCopy(list.id)} title="Copiar link">
                  <Copy size={18} />
                </Button>
                <Button variant="ghost" onClick={() => handleEdit(list.id)} title="Editar lista">
                  <Edit size={18} />
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(list.id)} title="Excluir lista">
                  <Trash2 size={18} />
                </Button>
                <Link to={`/lista/${list.id}`}>
                  <Button variant="secondary" className="gap-1" title="Ver lista">
                    <Share size={16} />Acessar
                  </Button>
                </Link>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
export default MyListsPage;
