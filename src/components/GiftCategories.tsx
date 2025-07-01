
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GiftCategoriesProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
  readonly?: boolean;
}

const SUGGESTED_CATEGORIES = [
  "Cozinha", "Casa", "Bebê", "Eletrônicos", "Decoração", 
  "Roupas", "Livros", "Brinquedos", "Beleza", "Esportes"
];

const GiftCategories = ({ categories, onCategoriesChange, readonly = false }: GiftCategoriesProps) => {
  const [newCategory, setNewCategory] = useState("");
  const [showInput, setShowInput] = useState(false);

  const addCategory = (category: string) => {
    const trimmedCategory = category.trim();
    if (trimmedCategory && !categories.includes(trimmedCategory)) {
      onCategoriesChange([...categories, trimmedCategory]);
    }
    setNewCategory("");
    setShowInput(false);
  };

  const removeCategory = (categoryToRemove: string) => {
    onCategoriesChange(categories.filter(cat => cat !== categoryToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCategory(newCategory);
    } else if (e.key === 'Escape') {
      setNewCategory("");
      setShowInput(false);
    }
  };

  if (readonly) {
    return (
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="secondary" className="text-xs flex items-center gap-1">
            {category}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-red-100"
              onClick={() => removeCategory(category)}
            >
              <X size={12} />
            </Button>
          </Badge>
        ))}
        
        {!showInput ? (
          <Button
            variant="outline"
            size="sm"
            className="h-6 text-xs"
            onClick={() => setShowInput(true)}
          >
            <Plus size={12} className="mr-1" />
            Categoria
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Nome da categoria"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyDown={handleKeyPress}
              className="h-6 text-xs w-32"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => {
                setNewCategory("");
                setShowInput(false);
              }}
            >
              <X size={12} />
            </Button>
          </div>
        )}
      </div>
      
      {showInput && (
        <div className="space-y-2">
          <p className="text-xs text-gray-500">Sugestões:</p>
          <div className="flex flex-wrap gap-1">
            {SUGGESTED_CATEGORIES
              .filter(cat => !categories.includes(cat))
              .map((category) => (
                <Button
                  key={category}
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs"
                  onClick={() => addCategory(category)}
                >
                  {category}
                </Button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GiftCategories;
