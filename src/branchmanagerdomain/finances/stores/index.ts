import { defineStore } from "pinia";
import { ref } from "vue";
import { billingDb } from "@/tilloperatordomain/db/db"; // Import the correct database
import type { Transaction, FloatLedger, BackofficeUser, TillOperator, FloatAllocation, FloatRequest } from "@/branchmanagerdomain/finances/types";

export const useBilling = defineStore("billing", () => {
  // State variables
  const transactions = ref<Transaction[]>([]);
  const totalAmount = ref(600); // Test value
  const totalBalance = ref(3000); // Test value
  const floatLedgers = ref<FloatLedger[]>([]);
  const backofficeUsers = ref<BackofficeUser[]>([]);
  const tillOperators = ref<TillOperator[]>([]);
  const floatAllocations = ref<FloatAllocation[]>([]);
  const floatRequests = ref<FloatRequest[]>([]);
  const tillOperatorFloatBalance = ref(0);

  // Fetch data and populate state variables
  async function fetchTransactions() {
    try {
      const storedTransactions = await billingDb.getAll<Transaction>();
      transactions.value = storedTransactions;
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  async function fetchFloatLedgers() {
    try {
      const storedLedgers = await billingDb.getAll<FloatLedger>();
      floatLedgers.value = storedLedgers;
    } catch (error) {
      console.error("Error fetching float ledgers:", error);
    }
  }

  async function fetchBackofficeUsers() {
    try {
      const storedUsers = await billingDb.getAll<BackofficeUser>();
      backofficeUsers.value = storedUsers;
    } catch (error) {
      console.error("Error fetching backoffice users:", error);
    }
  }

  async function fetchTillOperators() {
    try {
      const storedOperators = await billingDb.getAll<TillOperator>();
      tillOperators.value = storedOperators;
    } catch (error) {
      console.error("Error fetching till operators:", error);
    }
  }

  async function fetchFloatAllocations() {
    try {
      const storedAllocations = await billingDb.getAll<FloatAllocation>();
      floatAllocations.value = storedAllocations;
    } catch (error) {
      console.error("Error fetching float allocations:", error);
    }
  }

  async function fetchFloatRequests() {
    try {
      const storedRequests = await billingDb.getAll<FloatRequest>();
      floatRequests.value = storedRequests;
    } catch (error) {
      console.error("Error fetching float requests:", error);
    }
  }

  // Save individual data items
  async function saveTransaction(transaction: Transaction) {
    try {
      await billingDb.set(transaction.id, transaction);
      transactions.value.push(transaction);
    } catch (error) {
      console.error("Error saving transaction:", error);
    }
  }

  async function saveFloatLedger(floatLedger: FloatLedger) {
    try {
      await billingDb.set(floatLedger.id, floatLedger);
      floatLedgers.value.push(floatLedger);
    } catch (error) {
      console.error("Error saving float ledger:", error);
    }
  }

  async function saveFloatRequest(floatRequest: FloatRequest) {
    try {
      await billingDb.set(floatRequest.id, floatRequest);
      floatRequests.value.push(floatRequest);
    } catch (error) {
      console.error("Error saving float request:", error);
    }
  }

  async function saveFloatAllocation(floatAllocation: FloatAllocation) {
    try {
      await billingDb.set(floatAllocation.id, floatAllocation);
      floatAllocations.value.push(floatAllocation);
    } catch (error) {
      console.error("Error saving float allocation:", error);
    }
  }

  // Manage float requests from branch manager
  async function manageFloatRequestsFromBranchManager() {
    try {
      const requests = await billingDb.getAll<FloatRequest>();
      if (requests.length === 0) {
        console.log("No float requests found.");
        return;
      }
      for (const request of requests) {
        if (request && request.id) {
          request.status = "processed"; // Example modification
          await billingDb.set(request.id, request);
          console.log(`Updated float request with ID: ${request.id}`);
        }
      }
    } catch (error) {
      console.error("Error managing float requests:", error);
    }
  }

  // Approve a float request
  async function approveFloatRequest(requestId: number) {
    try {
      const request = await billingDb.get<FloatRequest>(requestId);
      if (!request) {
        console.error(`Request with ID ${requestId} not found.`);
        return;
      }
      request.status = "approved";
      await billingDb.set(requestId, request);
      console.log(`Float request with ID ${requestId} approved.`);
    } catch (error) {
      console.error("Error approving float request:", error);
    }
  }

  // Reject a float request
  async function rejectFloatRequest(requestId: number) {
    try {
      const request = await billingDb.get<FloatRequest>(requestId);
      if (!request) {
        console.error(`Request with ID ${requestId} not found.`);
        return;
      }
      request.status = "rejected";
      await billingDb.set(requestId, request);
      console.log(`Float request with ID ${requestId} rejected.`);
    } catch (error) {
      console.error("Error rejecting float request:", error);
    }
  }

  // Initialize store data
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
    manageFloatRequestsFromBranchManager,
    approveFloatRequest,
    rejectFloatRequest,
    initializeStore,
  };
});
