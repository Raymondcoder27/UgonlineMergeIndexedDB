import { defineStore } from "pinia";
import { ref } from "vue";
import { db } from "@/branchmanagerdomain/finances/db/db";
import type { Transaction, FloatLedger, BackofficeUser, TillOperator, FloatAllocation, FloatRequest } from "@/branchmanagerdomain/finances/types";
import type { AllocateFloat } from "@/types";

export const useBilling = defineStore("billing", () => {
  // State variables
  const transactions = ref<Transaction[]>([]);
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>([]);
  const backofficeUsers = ref<BackofficeUser[]>([]);
  const tillOperators = ref<TillOperator[]>([]);
  const floatAllocations = ref<FloatAllocation[]>([]);
  const floatRequests = ref<FloatRequest[]>([]);
  const tillOperatorFloatBalance = ref(0);

  // Fetch data and populate state variables
  async function fetchTransactions() {
    try {
      const storedTransactions = await db.getAll<Transaction>();
      transactions.value = storedTransactions;
    } catch (error) {
      console.error("Error fetching transactions from IndexedDB:", error);
    }
  }

  async function fetchFloatLedgers() {
    try {
      const storedLedgers = await db.getAll<FloatLedger>();
      floatLedgers.value = storedLedgers;
    } catch (error) {
      console.error("Error fetching float ledgers from IndexedDB:", error);
    }
  }

  async function fetchBackofficeUsers() {
    try {
      const storedUsers = await db.getAll<BackofficeUser>();
      backofficeUsers.value = storedUsers;
    } catch (error) {
      console.error("Error fetching backoffice users from IndexedDB:", error);
    }
  }

  async function fetchTillOperators() {
    try {
      const storedOperators = await db.getAll<TillOperator>();
      tillOperators.value = storedOperators;
    } catch (error) {
      console.error("Error fetching till operators from IndexedDB:", error);
    }
  }

  async function fetchFloatAllocations() {
    try {
      const storedAllocations = await db.getAll<FloatAllocation>();
      floatAllocations.value = storedAllocations;
    } catch (error) {
      console.error("Error fetching float allocations from IndexedDB:", error);
    }
  }

  async function fetchFloatRequests() {
    try {
      const storedRequests = await db.getAll<FloatRequest>();
      floatRequests.value = storedRequests;
    } catch (error) {
      console.error("Error fetching float requests from IndexedDB:", error);
    }
  }

  // Save individual data items
  async function saveTransaction(transaction: Transaction) {
    try {
      await db.set(transaction.id, transaction);
      transactions.value.push(transaction);
    } catch (error) {
      console.error("Error saving transaction to IndexedDB:", error);
    }
  }

  async function saveFloatLedger(floatLedger: FloatLedger) {
    try {
      await db.set(floatLedger.id, floatLedger);
      floatLedgers.value.push(floatLedger);
    } catch (error) {
      console.error("Error saving float ledger to IndexedDB:", error);
    }
  }

  async function saveFloatRequest(floatRequest: FloatRequest) {
    try {
      await db.set(floatRequest.id, floatRequest);
      floatRequests.value.push(floatRequest);
    } catch (error) {
      console.error("Error saving float request to IndexedDB:", error);
    }
  }

  async function saveFloatAllocation(floatAllocation: FloatAllocation) {
    try {
      await db.set(floatAllocation.id, floatAllocation);
      floatAllocations.value.push(floatAllocation);
    } catch (error) {
      console.error("Error saving float allocation to IndexedDB:", error);
    }
  }

  // Approve float request
  // async function approveFloatRequest(requestId: number) {
  //   const floatRequest = floatRequests.value.find((request) => request.id === requestId);
  //   if (floatRequest) {
  //     floatRequest.status = "approved";
  //     await db.set(floatRequest.id, floatRequest); // Update in IndexedDB
  //   }
  //   manageFloatRequestsFromBranchManager();

  // }

//   const approveFloatRequest = await billingDb.get<any>(requestId);
// if (floatRequest) {
//     floatRequest.status = "approved"; // Modify the float request
//     await billingDb.set(requestId, floatRequest); // Save it back
//     console.log(`Float request ${requestId} updated.`);
// }


  // Reject float request
  async function rejectFloatRequest(requestId: number) {
    const floatRequest = floatRequests.value.find((request) => request.id === requestId);
    if (floatRequest) {
      floatRequest.status = "rejected";
      await db.set(floatRequest.id, floatRequest); // Update in IndexedDB
    }
    manageFloatRequestsFromBranchManager();

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


  // Example of reading and writing float requests from tilloperator-billing-database
async function manageFloatRequestsFromBranchManager() {
  try {
      // Retrieve all float requests from tilloperator-billing-database
      const floatRequests = await billingDb.getAll<any>(); // Replace `any` with the actual type if known

      if (floatRequests.length === 0) {
          console.log("No float requests found in tilloperator-billing-database.");
          return;
      }

      console.log(`Found ${floatRequests.length} float requests in tilloperator-billing-database.`);

      // Example: Processing each float request
      for (const request of floatRequests) {
          if (request && request.id) {
              console.log(`Processing float request with ID: ${request.id}`);
              
              // Example of modifying a float request
              request.status = "processed"; // Modify data as needed
              await billingDb.set(request.id, request); // Update in tilloperator-billing-database

              console.log(`Updated float request with ID: ${request.id}`);
          } else {
              console.warn("Encountered a float request without a valid ID. Skipping...");
          }
      }
  } catch (error) {
      console.error("Error managing float requests from tilloperator-billing-database:", error);
  }
}

// Call the function from branchmanager-billing-database
// manageFloatRequestsFromBranchManager();


  // Initialize data from IndexedDB
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
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    backofficeUsers,
    tillOperators,
    floatAllocations,
    floatRequests,
    tillOperatorFloatBalance,
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
