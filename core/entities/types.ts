export type WithId<T> = T & {id: string};
export type PossiblyWithId<T> = T & {
  id?: string,
};
