export interface PersistenceRepository<T> {
  save: (value: T) => Promise<T>;
  load: () => Promise<T>;
}
