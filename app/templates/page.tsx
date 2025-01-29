import { TEMPLATES } from "@/lib/templates";
import TemplateList from "@/components/templates/template-list";


export default function TemplatesPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-7xl">
      <div className="mb-8 space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Email Templates
        </h1>
        <p className="text-gray-500 text-base sm:text-lg">
          Choose from our collection of professional email templates
        </p>
      </div>
      <TemplateList templates={TEMPLATES} />
    </div>
  );
}