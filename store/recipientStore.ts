import { create } from 'zustand'

interface Recipient {
  [key: string]: any
}

interface RecipientStore {
  selectedRecipients: any[]
  availableFields: string[]
  emails: string[]
  setSelectedRecipients: (recipients: any[]) => void
  setAvailableFields: (fields: string[]) => void
  setEmails: (emails: string[]) => void
  clearAll: () => void
}

export const useRecipientStore = create<RecipientStore>((set) => ({
  selectedRecipients: [],
  availableFields: [],
  emails: [],
  setSelectedRecipients: (recipients) => set({ selectedRecipients: recipients }),
  setAvailableFields: (fields) => set({ availableFields: fields }),
  setEmails: (emails) => set({ emails }),
  clearAll: () => set({ selectedRecipients: [], availableFields: [], emails: [] })
}))