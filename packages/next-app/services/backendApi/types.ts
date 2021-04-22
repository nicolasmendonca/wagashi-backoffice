import { WithId } from '@wagashi-backoffice/core/dist/utils/types';

export interface BackendApiRepository<T> {
  save: (value: T) => Promise<WithId<T>>;
  load: () => Promise<Array<WithId<T>>>;
  delete: (id: string) => Promise<Array<WithId<T>>>
}
