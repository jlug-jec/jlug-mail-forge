"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import TemplatePreview from "@/components/templates/template-preview";
import { useTemplateStore } from "@/store/template-store";
import { toast } from "sonner";

interface TemplateListProps {
  templates: any;
}

export default function TemplateList({ templates }: TemplateListProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);

  const filteredTemplates = activeCategory === "all"
    ? Object.entries(templates).reduce(
        (acc, [category, templates]) => [
          ...acc,
          ...(templates as any[]).map((t: any) => ({ ...t, category })),
        ],
        [] as any[]
      )
    : templates[activeCategory as keyof typeof templates].map((t: any) => ({
        ...t,
        category: activeCategory,
      }));

  const setSelectedTemplate = useTemplateStore((state) => state.setSelectedTemplate);

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    window.location.href = "/compose";
    toast.success("Template Selected");
  };

  return (
    <>
      <Tabs defaultValue="all" onValueChange={setActiveCategory}>
        <TabsList className="mb-16 flex flex-wrap gap-2">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          {Object.keys(templates).map((category) => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category.replace("_", " ")}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeCategory}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredTemplates.map((template: any) => (
              <Card
                key={template.id}
                className="group hover:shadow-lg transition-all duration-300 border-gray-100"
              >
                <CardHeader className="space-y-1 p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl">{template.name}</CardTitle>
                  <CardDescription className="text-sm">
                    Professional {template.category.replace("_", " ")} template
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 p-4 sm:p-6">
                  <div className="aspect-video bg-gray-50 rounded-lg overflow-hidden border relative">
                    <div className="w-full h-[200px] md:h-[160px] lg:h-[200px]">
                      <TemplatePreview 
                        templateId={template.id} 
                        mode="card" 
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewTemplate(template.id)}
                      className="gap-2 text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="hidden sm:inline">Preview</span>
                    </Button>
                    {template.id === "stripe-welcome" ? (
                      <Button 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleUseTemplate(template.id)}
                      >
                        Use Template
                      </Button>
                    ) : (
                      <p>Coming Soon</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
        <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-auto bg-white p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">
              {previewTemplate
                ? templates[previewTemplate]?.name
                : "Template"} Preview
            </DialogTitle>
          </DialogHeader>
          <div className="bg-gray-50 p-4 sm:p-6 rounded-lg min-h-[400px] sm:min-h-[600px] relative">
            {previewTemplate && (
              <TemplatePreview 
                templateId={previewTemplate} 
                mode="dialog"
                className="absolute inset-0 w-full h-full" 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}