type WithId<T> = T & {
  id: string;
};

export interface BackendApiRepository<T> {
  save: (value: T) => Promise<WithId<T>>;
  load: () => Promise<Array<WithId<T>>>;
  delete: (ingredientIds: string[]) => Promise<Array<WithId<T>>>;
  update: (id: string, value: WithId<T>) => Promise<WithId<T>>;
}
