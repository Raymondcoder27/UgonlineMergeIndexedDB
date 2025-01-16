import { createStore, get, set, del, keys, clear } from "idb-keyval";

// Create a custom store for billing
export const billingStore = createStore("billing-database", "billing-store");

export const billingDb = {
  async get<T>(key: number): Promise<T | undefined> {
    try {
      return await get<T>(key, billingStore);
    } catch (error) {
      console.error(`Error getting key ${key} from billing database:`, error);
      return undefined;
    }
  },
  async set<T>(key: number, value: T): Promise<void> {
    try {
      await set(key, value, billingStore);
    } catch (error) {
      console.error(`Error setting key ${key} in billing database:`, error);
    }
  },
  async del(key: number): Promise<void> {
    try {
      await del(key, billingStore);
    } catch (error) {
      console.error(`Error deleting key ${key} from billing database:`, error);
    }
  },
  async getAll<T>(): Promise<T[]> {
    try {
      const allKeys = await keys(billingStore);
      const allValues = await Promise.all(allKeys.map(key => get<T>(key, billingStore)));
      return allValues.filter(value => value !== undefined) as T[];
    } catch (error) {
      console.error("Error getting all data from billing database:", error);
      return [];
    }
  },
  async clear(): Promise<void> {
    try {
      await clear(billingStore);
    } catch (error) {
      console.error("Error clearing billing database:", error);
    }
  },
};
