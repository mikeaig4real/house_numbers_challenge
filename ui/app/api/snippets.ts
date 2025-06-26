import api from '../utils/axios';
import { SnippetType } from '../types';

export async function getSnippets() {
  const res = await api.get<SnippetType.Snippet[]>('/snippets');
  return res.data;
}

export async function getSnippetById(id: string) {
  const res = await api.get<SnippetType.Snippet | null>(`/snippets/${id}`);
  return res.data;
}

export async function createSnippet(text: string) {
  const res = await api.post<SnippetType.Snippet>('/snippets', { text });
  return res.data;
}
