export interface Prompt {
  id: string
  title: string
  content: string
  description?: string
  folderId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
  folder?: Folder
}

export interface Folder {
  id: string
  name: string
  userId: string
  parentFolderId?: string
  createdAt: Date
  prompts?: Prompt[]
  children?: Folder[]
}

export interface Tag {
  id: string
  name: string
  color: string
  userId: string
}

export interface PromptVersion {
  id: string
  promptId: string
  content: string
  createdAt: Date
  source: 'manual' | 'optimization'
}
