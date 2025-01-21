import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "@/branchmanagerdomain/finances/db/db";
import type {
  Transaction,
  FloatLedger,
  BackofficeUser,
  TillOperator,
  FloatAllocation,
  FloatRequest,
} from "@/branchmanagerdomain/finances/types";
import type { AllocateFloat } from "@/types";

export const useBilling = defineStore("billing", () => {
  // State variables
  const transactions = ref<Transaction[]>([]);
  const floatLedgers = ref<FloatLedger[]>([]);
  const backofficeUsers = ref<BackofficeUser[]>([]);
  const tillOperators = ref<TillOperator[]>([]);
  const floatAllocations = ref<FloatAllocation[]>([]);
  const floatRequests = ref<FloatRequest[]>([]);
  const totalAmount = ref(600); // Test value
  const totalBalance = ref(3000); // Test value
  const tillOperatorFloatBalance = ref(0);

  // Generic fetch function
  async function fetchData<T>(key: string, state: Ref<T[]>) {
    try {
      const data = await db.getAll<T>();
      state.value = data;
    } catch (error) {
      console.error(`Error fetching ${key} from IndexedDB:`, error);
    }
  }

  // Fetch methods
  async function fetchTransactions() {
    await fetchData("transactions", transactions);
  }
  async function fetchFloatLedgers() {
    await fetchData("floatLedgers", floatLedgers);
  }
  async function fetchBackofficeUsers() {
    await fetchData("backofficeUsers", backofficeUsers);
  }
  async function fetchTillOperators() {
    await fetchData("tillOperators", tillOperators);
  }
  async function fetchFloatAllocations() {
    await fetchData("floatAllocations", floatAllocations);
  }
  async function fetchFloatRequests() {
    await fetchData("floatRequests", floatRequests);
  }

  // Generic save function
  async function saveData<T>(key: string, state: Ref<T[]>, item: T) {
    try {
      await db.set((item as any).id, item);
      state.value.push(item);
    } catch (error) {
      console.error(`Error saving ${key} to IndexedDB:`, error);
    }
  }

  // Save methods
  async function saveTransaction(transaction: Transaction) {
    await saveData("transaction", transactions, transaction);
  }
  async function saveFloatLedger(floatLedger: FloatLedger) {
    await saveData("floatLedger", floatLedgers, floatLedger);
  }
  async function saveFloatRequest(floatRequest: FloatRequest) {
    await saveData("floatRequest", floatRequests, floatRequest);
  }
  async function saveFloatAllocation(floatAllocation: FloatAllocation) {
    await saveData("floatAllocation", floatAllocations, floatAllocation);
  }

  // Approve or reject float request
  async function updateFloatRequestStatus(requestId: number, status: string) {
    const floatRequest = floatRequests.value.find((req) => req.id === requestId);
    if (floatRequest) {
      floatRequest.status = status;
      await db.set(requestId, floatRequest);
    } else {
      console.warn(`Float request with ID ${requestId} not found.`);
    }
  }

  async function approveFloatRequest(requestId: number) {
    await updateFloatRequestStatus(requestId, "approved");
  }

  async function rejectFloatRequest(requestId: number) {
    await updateFloatRequestStatus(requestId, "rejected");
  }

  // Allocate float
  async function allocateFloat(payload: AllocateFloat) {
    const floatAllocation: FloatAllocation = {
      id: floatAllocations.value.length + 1,
      dateAssigned: new Date().toISOString(),
      amount: payload.amount,
      status: "Allocated",
      till: payload.tillId,
    };
    await saveFloatAllocation(floatAllocation);
  }

  // Adjust float ledger
  async function adjustFloatLedger(payload: AllocateFloat) {
    const floatLedger: FloatLedger = {
      id: floatLedgers.value.length + 1,
      date: new Date().toISOString(),
      description: payload.tillId,
      amount: -payload.amount,
    };
    await saveFloatLedger(floatLedger);
  }

  // Initialize store
  async function initializeStore() {
    await fetchTransactions();
    await fetchFloatLedgers();
    await fetchBackofficeUsers();
    await fetchTillOperators();
    await fetchFloatAllocations();
    await fetchFloatRequests();
  }

  // Return state and actions
  return {
    // State
    transactions,
    floatLedgers,
    backofficeUsers,
    tillOperators,
    floatAllocations,
    floatRequests,
    totalAmount,
    totalBalance,
    tillOperatorFloatBalance,

    // Actions
    fetchTransactions,
    fetchFloatLedgers,
    fetchBackofficeUsers,
    fetchTillOperators,
    fetchFloatAllocations,
    fetchFloatRequests,
    saveTransaction,
    saveFloatLedger,
    saveFloatRequest,
    saveFloatAllocation,
    approveFloatRequest,
    rejectFloatRequest,
    allocateFloat,
    adjustFloatLedger,
    initializeStore,
  };
});
