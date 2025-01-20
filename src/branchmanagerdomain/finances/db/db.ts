import { createStore, get, set, del, keys, clear } from "idb-keyval";

// Create a custom IndexedDB store for the billing module
const billingStore = createStore("branchmanager-billing-database", "billing-store");

// Database abstraction for CRUD operations
export const db = {
    /**
     * Get a single item from the database by its key
     * @param key The key of the item to retrieve
     * @returns The value associated with the key, or undefined if not found
     */
    async get<T>(key: number): Promise<T | undefined> {
        try {
            return await get<T>(key, billingStore);
        } catch (error) {
            console.error(`Error getting key ${key} from IndexedDB:`, error);
            return undefined;
        }
    },

    

    /**
     * Save or update a single item in the database
     * @param key The key of the item to save
     * @param value The value to associate with the key
     */
    async set<T>(key: number, value: T): Promise<void> {
        try {
            await set(key, value, billingStore);
        } catch (error) {
            console.error(`Error setting key ${key} in IndexedDB:`, error);
        }
    },

    /**
     * Delete a single item from the database by its key
     * @param key The key of the item to delete
     */
    async del(key: number): Promise<void> {
        try {
            await del(key, billingStore);
        } catch (error) {
            console.error(`Error deleting key ${key} from IndexedDB:`, error);
        }
    },

    /**
     * Retrieve all items from the database
     * @returns An array of all values in the database
     */
    async getAll<T>(): Promise<T[]> {
        try {
            const allKeys = await keys(billingStore); // Retrieve all keys
            const allValues = await Promise.all(
                allKeys.map((key) => get<T>(key, billingStore))
            ); // Retrieve all values
            return allValues.filter((value): value is T => value !== undefined); // Filter out undefined values
        } catch (error) {
            console.error("Error getting all data from IndexedDB:", error);
            return [];
        }
    },

    /**
     * Clear all items from the database
     */
    async clear(): Promise<void> {
        try {
            await clear(billingStore);
        } catch (error) {
            console.error("Error clearing IndexedDB:", error);
        }
    },
};
