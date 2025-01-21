import { defineStore } from "pinia";
import { ref } from "vue";
import moment from "moment";
import { billingDb } from "@/tilloperatordomain/db/db"; // Your IndexedDB utility
import type { Transaction, FloatLedger, FloatRequest, RequestFloat } from "@/tilloperatordomain/ledger/types";

export const useBilling = defineStore("billing", () => {
  // State variables
  const transactions = ref<Transaction[]>([]);
  const totalAmount = ref(600); // Set a test value
  const totalBalance = ref(3000); // Set a test value
  const floatLedgers = ref<FloatLedger[]>([]);
  const floatRequests = ref<FloatRequest[]>([]);

  // Fetch transactions from IndexedDB
  async function fetchTransactions(filter: any) {
    try {
      const storedTransactions = await billingDb.getAll<Transaction>(); // Get all transactions from IndexedDB
      const filteredData = storedTransactions.filter(transaction => {
        return (!filter.filter[0].operand || transaction.description.includes(filter.filter[0].operand)) &&
          (!filter.filter[1].operand || transaction.amount > Number(filter.filter[1].operand)) &&
          (!filter.filter[2].operand || transaction.balance > Number(filter.filter[2].operand)) &&
          (!filter.fromDate || moment(transaction.date).isAfter(moment(filter.fromDate))) &&
          (!filter.toDate || moment(transaction.date).isBefore(moment(filter.toDate)));
      });

      transactions.value = filteredData;
      console.log("Filtered transactions:", filteredData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }

  // Fetch float ledgers from IndexedDB
  // async function fetchFloatLedgers(filter: any) {
  //   try {
  //     const storedFloatLedgers = await billingDb.getAll<FloatLedger>(); // Get all float ledgers from IndexedDB
  //     const filteredData = storedFloatLedgers.filter(item => {
  //       // Apply filters...
  //     });

  //     const limitedData = filteredData.slice(0, filter.limit || storedFloatLedgers.length);
  //     floatLedgers.value = limitedData;
  //     console.log("Filtered float ledgers:", limitedData);
  //     return limitedData;
  //   } catch (error) {
  //     console.error("Error fetching float ledgers:", error);
  //   }
  // }

  async function fetchFloatLedgers() {
    try {
      const storedFloatLedgers = await billingDb.getAll<FloatLedger>(); // Get all float ledgers from IndexedDB
      // const filteredData = storedFloatLedgers.filter(item => {
      //   // Apply filters...
      // });

      // const limitedData = filteredData.slice(0, filter.limit || storedFloatLedgers.length);
      // floatLedgers.value = limitedData;
      floatLedgers.value = storedFloatLedgers;
      console.log("Filtered float ledgers:", storedFloatLedgers);
      return storedFloatLedgers;
    } catch (error) {
      console.error("Error fetching float ledgers:", error);
    }
  }

  // Request float and save it to IndexedDB
  async function requestFloat(payload: RequestFloat) {
    try {
      const newRequest: FloatRequest = {
        id: floatRequests.value.length + 1,
        requestDate: new Date().toISOString(),
        amount: payload.amount,
        status: payload.status,
        till: "Till 1",
        // branchId: payload.branchId, // Adjust as needed
      };

      await billingDb.set(newRequest.id, newRequest); // Save to IndexedDB
      floatRequests.value.push(newRequest);

      console.log("Request saved to IndexedDB", newRequest);
    } catch (error) {
      console.error("Error saving float request:", error);
    }
  }

  // Adjust float ledger and update IndexedDB
  async function adjustFloatLedger(payload: RequestFloat) {
    try {
      const newLedger: FloatLedger = {
        id: floatLedgers.value.length + 1,
        date: new Date().toISOString(),
        description: payload.description,
        amount: payload.amount,
        balance: totalBalance.value + payload.amount,
        // status: "pending", // Adjust as needed
        status: "pending",
        createdAt: new Date().toISOString(),
        till: "Till 1",
      };

      await billingDb.set(newLedger.id, newLedger); // Save to IndexedDB
      floatLedgers.value.push(newLedger);

      console.log("Float ledger adjusted and saved to IndexedDB", newLedger);
    } catch (error) {
      console.error("Error adjusting float ledger:", error);
    }
  }

  // Add transactions to IndexedDB and store
  async function addTransaction(newTransaction: Omit<Transaction, "id">) {
    try {
      const id = transactions.value.length ? transactions.value[transactions.value.length - 1].id + 1 : 1;
      const transactionWithId: Transaction = { ...newTransaction, id };
      await billingDb.set(transactionWithId.id, transactionWithId);
      transactions.value.push(transactionWithId);

      console.log("Transaction added to IndexedDB", transactionWithId);
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  }

  return {
    transactions,
    totalAmount,
    totalBalance,
    floatLedgers,
    floatRequests,
    fetchTransactions,
    fetchFloatLedgers,
    requestFloat,
    adjustFloatLedger,
    addTransaction,
  };
});
