
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

interface GiftSearchProps {
  onSearch: (term: string) => void;
  onFilter: (filter: 'all' | 'available' | 'reserved') => void;
  onSort: (sort: 'name' | 'date' | 'status') => void;
  currentFilter: 'all' | 'available' | 'reserved';
  currentSort: 'name' | 'date' | 'status';
}

export function GiftSearch({ 
  onSearch, 
  onFilter, 
  onSort, 
  currentFilter, 
  currentSort 
}: GiftSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearch(value);
  };

  const filterLabels = {
    all: 'Todos',
    available: 'Disponíveis',
    reserved: 'Reservados'
  };

  const sortLabels = {
    name: 'Nome',
    date: 'Data',
    status: 'Status'
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Buscar presentes..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="flex gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              {filterLabels[currentFilter]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onFilter('all')}>
              Todos os presentes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter('available')}>
              Apenas disponíveis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilter('reserved')}>
              Apenas reservados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SortAsc size={16} />
              {sortLabels[currentSort]}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onSort('name')}>
              Ordenar por nome
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort('date')}>
              Ordenar por data
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSort('status')}>
              Ordenar por status
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
