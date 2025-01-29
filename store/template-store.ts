import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import {templateComponents } from '@/templates';

interface TemplateState {
  selectedTemplate: string | null;
  setSelectedTemplate: (template: string | null) => void;
  getTemplate: () => any | null;
}

export const useTemplateStore = create<TemplateState>()(
  persist(
    (set, get) => ({
      selectedTemplate: null,
      setSelectedTemplate: (template) => {
        set({ selectedTemplate: template });
        if (template) {
          Cookies.set('selectedTemplate', template, { expires: 7 });
        } else {
          Cookies.remove('selectedTemplate');
        }
      },
      getTemplate: () => {
        const template = get().selectedTemplate;
        if (template && template in templateComponents) {
          return templateComponents[template];
        }
        return null;
      },
    }),
    {
      name: 'template-storage',
    }
  )
);