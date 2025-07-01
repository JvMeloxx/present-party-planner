
import AuthenticatedLayout from "@/components/AuthenticatedLayout";
import Breadcrumbs from "@/components/Breadcrumbs";
import GiftListForm from "@/components/GiftListForm";

export default function CreateGiftListPage() {
  const breadcrumbItems = [
    { label: "Minhas listas", href: "/minhas-listas" },
    { label: "Nova lista" }
  ];

  return (
    <AuthenticatedLayout showFooter={false}>
      <div className="max-w-4xl mx-auto py-6 px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-purple-800">Criar Nova Lista</h1>
          <p className="text-gray-600 mt-2">Crie uma lista de presentes personalizada para sua ocasião especial</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <GiftListForm />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
