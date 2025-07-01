
import { useState, useEffect } from "react";
import { Search, Gift, List, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SearchResult {
  type: 'list' | 'gift';
  id: string;
  title: string;
  description?: string;
  listId?: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Buscar listas
        const { data: lists, error: listsError } = await supabase
          .from("gift_lists")
          .select("id, title, description")
          .or(`title.ilike.%${query}%, description.ilike.%${query}%`)
          .eq("owner_id", user.id)
          .limit(5);

        // Buscar presentes
        const { data: gifts, error: giftsError } = await supabase
          .from("gift_items")
          .select(`
            id, 
            name, 
            description, 
            list_id,
            gift_lists!inner(owner_id)
          `)
          .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
          .eq("gift_lists.owner_id", user.id)
          .limit(5);

        if (listsError || giftsError) throw listsError || giftsError;

        const searchResults: SearchResult[] = [
          ...(lists || []).map(list => ({
            type: 'list' as const,
            id: list.id,
            title: list.title,
            description: list.description
          })),
          ...(gifts || []).map(gift => ({
            type: 'gift' as const,
            id: gift.id,
            title: gift.name,
            description: gift.description,
            listId: gift.list_id
          }))
        ];

        setResults(searchResults);
      } catch (error) {
        console.error("Erro na pesquisa:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleClose = () => {
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Search size={16} />
          <span className="hidden sm:inline">Pesquisar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search size={20} />
            Pesquisa Global
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Buscar listas e presentes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setQuery("")}
              >
                <X size={14} />
              </Button>
            )}
          </div>

          {loading && (
            <div className="text-center text-sm text-gray-500 py-4">
              Pesquisando...
            </div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div className="text-center text-sm text-gray-500 py-4">
              Nenhum resultado encontrado
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.type === 'list' ? `/lista/${result.id}` : `/lista/${result.listId}`}
                  onClick={handleClose}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {result.type === 'list' ? (
                    <List size={16} className="text-purple-600" />
                  ) : (
                    <Gift size={16} className="text-pink-600" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
