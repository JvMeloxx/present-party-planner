
import { useState } from "react";
import { Search, Filter, SortAsc, SortDesc } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface GiftFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: 'all' | 'available' | 'reserved';
  onFilterChange: (filter: 'all' | 'available' | 'reserved') => void;
  sort: 'name' | 'date' | 'status';
  onSortChange: (sort: 'name' | 'date' | 'status') => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  totalItems: number;
  filteredItems: number;
}

const GiftFilters = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
  categories,
  selectedCategory,
  onCategoryChange,
  totalItems,
  filteredItems
}: GiftFiltersProps) => {
  const getFilterLabel = (filterValue: string) => {
    switch (filterValue) {
      case 'all': return 'Todos';
      case 'available': return 'Disponíveis';
      case 'reserved': return 'Reservados';
      default: return 'Todos';
    }
  };

  const getSortLabel = (sortValue: string) => {
    switch (sortValue) {
      case 'name': return 'Nome';
      case 'date': return 'Data';
      case 'status': return 'Status';
      default: return 'Nome';
    }
  };

  const hasActiveFilters = searchTerm || filter !== 'all' || selectedCategory || sort !== 'name';
  const showingFiltered = filteredItems !== totalItems;

  return (
    <div className="bg-white rounded-lg border p-4 mb-6 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          type="text"
          placeholder="Buscar presentes..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Categorias:</p>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === '' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onCategoryChange('')}
              className="h-7 text-xs"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className="h-7 text-xs"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Filters and Sort */}
      <div className="flex flex-wrap items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} />
              {getFilterLabel(filter)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Filtrar por status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onFilterChange('all')}>
              Todos os presentes
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('available')}>
              Disponíveis
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onFilterChange('reserved')}>
              Reservados
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              {sort === 'name' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              {getSortLabel(sort)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Ordenar por</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onSortChange('name')}>
              Nome (A-Z)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('date')}>
              Data (Mais recente)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onSortChange('status')}>
              Status (Reservados primeiro)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
              onCategoryChange('');
              onSortChange('name');
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Results count */}
      {showingFiltered && (
        <div className="text-sm text-gray-600">
          Mostrando {filteredItems} de {totalItems} presentes
          {hasActiveFilters && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Filtros ativos
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default GiftFilters;
