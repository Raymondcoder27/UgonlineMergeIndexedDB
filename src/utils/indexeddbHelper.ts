export default class IndexedDBHelper {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;
  
    constructor(dbName: string, storeName: string) {
      this.dbName = dbName;
      this.storeName = storeName;
    }
  
    async init(): Promise<void> {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(this.storeName)) {
            db.createObjectStore(this.storeName, { keyPath: "id", autoIncrement: true });
          }
        };
        request.onsuccess = () => {
          this.db = request.result;
          resolve();
        };
        request.onerror = (event) => {
          reject(event);
        };
      });
    }
  
    async add(record: any): Promise<number> {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("Database is not initialized");
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.add(record);
  
        request.onsuccess = () => {
          resolve(request.result as number);
        };
        request.onerror = (event) => {
          reject(event);
        };
      });
    }
  
    async getAll(): Promise<any[]> {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("Database is not initialized");
        const transaction = this.db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.getAll();
  
        request.onsuccess = () => {
          resolve(request.result);
        };
        request.onerror = (event) => {
          reject(event);
        };
      });
    }
  
    async delete(id: number): Promise<void> {
      return new Promise((resolve, reject) => {
        if (!this.db) return reject("Database is not initialized");
        const transaction = this.db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(id);
  
        request.onsuccess = () => resolve();
        request.onerror = (event) => reject(event);
      });
    }
  }
  