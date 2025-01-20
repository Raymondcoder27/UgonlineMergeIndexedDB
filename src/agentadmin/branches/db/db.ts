import { createStore, get, set, del, keys, clear } from "idb-keyval";

// Create a custom store for branches
export const branchesStore = createStore("agentadmin-branch-database", "branches-store");

export const db = {
  async get<T>(key: number): Promise<T | undefined> {
    try {
      return await get<T>(key, branchesStore);
    } catch (error) {
      console.error(`Error getting key ${key} from IndexedDB:`, error);
      return undefined;
    }
  },
  async set<T>(key: number, value: T): Promise<void> {
    try {
      await set(key, value, branchesStore);
    } catch (error) {
      console.error(`Error setting key ${key} in IndexedDB:`, error);
    }
  },
  async del(key: number): Promise<void> {
    try {
      await del(key, branchesStore);
    } catch (error) {
      console.error(`Error deleting key ${key} from IndexedDB:`, error);
    }
  },
  async getAll<T>(): Promise<T[]> {
    try {
      const allKeys = await keys(branchesStore);
      const allValues = await Promise.all(allKeys.map(key => get<T>(key, branchesStore)));
      return allValues.filter(value => value !== undefined) as T[];
    } catch (error) {
      console.error("Error getting all data from IndexedDB:", error);
      return [];
    }
  },
  async clear(): Promise<void> {
    try {
      await clear(branchesStore);
    } catch (error) {
      console.error("Error clearing IndexedDB:", error);
    }
  },
};
