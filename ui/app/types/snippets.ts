export interface Snippet {
  id: string;
  text: string;
    summary: string;
    createdAt?: string | Date;
}

export type PartialSnippet = {
  [K in keyof Snippet]?: Snippet[K];
};
