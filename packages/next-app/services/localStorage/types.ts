export interface LocalStorageRepository<T> {
  save: (value: T) => Promise<T>;
  load: () => Promise<T>;
}
