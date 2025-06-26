export interface User {
  id: string;
  email: string;
}

export type PartialUser = {
  [K in keyof User]?: User[K];
};
