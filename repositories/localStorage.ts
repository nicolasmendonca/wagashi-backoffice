const localStoragePrefix = 'wagashi-backoffice';
export const generateLocalStorageKey = (key: string) => `${localStoragePrefix}--${key}`;

interface LocalStorageRepository {
  save: (value: string) => void;
  load: () => string;
}

export const createLocalStorageRepository = (key: string): LocalStorageRepository => {
  const LOCAL_STORAGE_KEY = generateLocalStorageKey(key);
  return {
    save: (value: string) => localStorage.setItem(LOCAL_STORAGE_KEY, value),
    load: () => localStorage.getItem(LOCAL_STORAGE_KEY),
  };
};
