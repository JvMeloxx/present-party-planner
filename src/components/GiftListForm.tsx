
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "lucide-react";

type GiftListFormProps = {
  onSubmit: (data: {
    title: string;
    description: string;
    isPublic: boolean;
    eventDate: string;
  }) => Promise<void>;
  loading: boolean;
  initialData?: {
    title?: string;
    description?: string;
    isPublic?: boolean;
    eventDate?: string;
  };
  submitLabel?: string;
};

export function GiftListForm({ 
  onSubmit, 
  loading, 
  initialData = {},
  submitLabel = "Criar lista"
}: GiftListFormProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [isPublic, setIsPublic] = useState(initialData.isPublic ?? true);
  const [eventDate, setEventDate] = useState(initialData.eventDate || "");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Title validation
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      newErrors.title = "Nome da lista é obrigatório";
    } else if (trimmedTitle.length > 200) {
      newErrors.title = "Nome muito longo (máximo 200 caracteres)";
    } else if (/<script|javascript:|data:/i.test(trimmedTitle)) {
      newErrors.title = "Nome contém caracteres não permitidos";
    }

    // Description validation
    if (description.length > 1000) {
      newErrors.description = "Descrição muito longa (máximo 1000 caracteres)";
    } else if (/<script|javascript:|data:/i.test(description)) {
      newErrors.description = "Descrição contém caracteres não permitidos";
    }

    // Event date validation
    if (eventDate) {
      const selectedDate = new Date(eventDate);
      const today = new Date();
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() + 10);
      
      if (selectedDate < today) {
        newErrors.eventDate = "Data do evento não pode ser no passado";
      } else if (selectedDate > maxDate) {
        newErrors.eventDate = "Data do evento muito distante no futuro";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit({
      title: title.trim(),
      description: description.trim(),
      isPublic,
      eventDate
    });
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (errors.title) {
      setErrors(prev => ({ ...prev, title: "" }));
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    if (errors.description) {
      setErrors(prev => ({ ...prev, description: "" }));
    }
  };

  const handleEventDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventDate(e.target.value);
    if (errors.eventDate) {
      setErrors(prev => ({ ...prev, eventDate: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div>
        <label htmlFor="title" className="block font-semibold text-gray-700 mb-1">
          Nome da lista <span className="text-pink-600">*</span>
        </label>
        <Input
          id="title"
          placeholder="Chá de Bebê da Ana"
          value={title}
          onChange={handleTitleChange}
          required
          className={`text-base ${errors.title ? "border-red-500" : ""}`}
          disabled={loading}
          maxLength={200}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            {errors.title}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block font-semibold text-gray-700 mb-1">
          Descrição (opcional)
        </label>
        <Textarea
          id="description"
          placeholder="Ex: O evento será no dia 14/08, confira a lista e participe!"
          value={description}
          onChange={handleDescriptionChange}
          className={`text-base ${errors.description ? "border-red-500" : ""}`}
          disabled={loading}
          maxLength={1000}
        />
        {errors.description && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            {errors.description}
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          {description.length}/1000 caracteres
        </p>
      </div>

      <div>
        <label htmlFor="event-date" className="block font-semibold text-gray-700 mb-1">
          Data do evento <span className="text-xs text-gray-400">(opcional)</span>
        </label>
        <div className="relative flex items-center">
          <Input
            id="event-date"
            type="date"
            value={eventDate}
            onChange={handleEventDateChange}
            className={`text-base pr-10 ${errors.eventDate ? "border-red-500" : ""}`}
            disabled={loading}
          />
          <Calendar className="absolute right-2 text-gray-400" size={20} />
        </div>
        {errors.eventDate && (
          <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
            <span>⚠️</span>
            {errors.eventDate}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="isPublic"
          checked={isPublic}
          onCheckedChange={val => setIsPublic(!!val)}
          disabled={loading}
        />
        <label htmlFor="isPublic" className="text-gray-700 cursor-pointer">
          Deixar minha lista pública para quem tiver o link
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full mt-2" 
        disabled={loading || Object.keys(errors).length > 0}
      >
        {loading ? "Processando..." : submitLabel}
      </Button>
    </form>
  );
}
