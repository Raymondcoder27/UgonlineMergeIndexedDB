import { defineStore } from "pinia";
import { reactive } from "vue";
// Pinia store
import { watchEffect } from "vue";
import {useBilling} from "@/branchmanagerdomain/finances/stores";



export interface TotalBalance {
  prevBalance: number;
  currentBalance: number;
}

export const useBalance = defineStore("balance", () => {
  // Reactive state for total balance
  const totalBalance = reactive<TotalBalance>({
    prevBalance: 45000000, // Initial previous balance
    currentBalance: 45000000, // Initial current balance
  });

  const billingStore = useBilling();

  watchEffect(() => {
    console.log("Total balance changed:", totalBalance);
  });

  // Simulate fetching the balance from an API
  // async function fetchTotalBalance() {
  //   // Simulate fetching data (replace with actual API call)
  //   const fetchedBalance = {
  //     prevBalance: totalBalance.current, // Setting previous balance to the current value
  //     currentBalance: 400000000, // Example of updating balance to a new value
  //   };
    
  //   // Update totalBalance reactive state
  //   totalBalance.prev = fetchedBalance.prev;
  //   totalBalance.current = fetchedBalance.current;
  // }


  // Increase the total balance and update "prev"
  function increaseTotalBalance(amount: number) {
    totalBalance.prevBalance = totalBalance.currentBalance;
    totalBalance.currentBalance += amount;
  }

  // Decrease the total balance and update "prev"
  function decreaseTotalBalance(amount: number) {
    totalBalance.prevBalance = totalBalance.currentBalance;
    totalBalance.currentBalance -= amount;
  }

  // pass in the requestId
// const approveFloatRequest = (requestId: any) => {
//   store.approveFloatRequest(requestId);
//   store.fetchFloatRequests();
//   console.log(`float request with id ${requestId} approved`);
// };

// const rejectFloatRequest = (requestId: any) => {
//   store.rejectFloatRequest(requestId);
//   store.fetchFloatRequests();
//   console.log(`float request with id ${requestId} rejected`);
// };

// async function approveFloatRequest(requestId: any) {
//   console.log("Approving float request with id:", requestId);
//   // Simulate API call
//   // const response = await fetch(`/api/float-requests/${requestId}/approve`, {
//   //   method: "POST",
//   // });
//   // const data = await response.json();

//   //use the float request in local storage
//   //find the float request in local storage by id
//   const localStorageFloatRequest = localStorage.getItem("floatRequestToBranchManagerLocalStorage");
  

//   if (!localStorageFloatRequest) {
//     console.error("Float request not found in local storage");
//     return;
//   }
//   const floatRequest = JSON.parse(localStorageFloatRequest);
//   // console.log("Float request approved:", data);
//   totalBalance.prevBalance = totalBalance.currentBalance;
//   totalBalance.currentBalance -= floatRequest.amount; // Example of updating balance
// // }

//   // use request in floatledgers array id to figure out amount 
//   // const floatRequest = billingStore.floatRequests.find(
//   //   (request) => request.id === requestId
//   // );
//   // if (!floatRequest) {
//   //   console.error("Float request not found");
//   //   return;
//   // }
//   // console.log("Float request approved:", data);
//   // totalBalance.prevBalance = totalBalance.currentBalance;
//   // totalBalance.currentBalance -= floatRequest.amount; // Example of updating balance
// }


async function approveFloatRequest(requestId: any) {
  console.log("Approving float request with id:", requestId);

  // Retrieve the stored float requests from local storage
  const localStorageFloatRequests = localStorage.getItem("floatRequestToBranchManagerLocalStorage");

  if (!localStorageFloatRequests) {
    console.error("Float requests not found in local storage");
    return;
  }

  // Parse the stored data
  const floatRequests = JSON.parse(localStorageFloatRequests);

  // Check if the stored data is an array
  if (!Array.isArray(floatRequests)) {
    console.error("Stored float requests data is not an array");
    return;
  }

  // Find the specific float request by requestId
  const floatRequest = floatRequests.find((request: any) => request.id === requestId);

  if (!floatRequest) {
    console.error(`Float request with id ${requestId} not found`);
    return;
  }

  // Example of updating the balance using the located float request
  totalBalance.prevBalance = totalBalance.currentBalance;
  totalBalance.currentBalance -= floatRequest.amount; // Deduct the amount from the balance

  console.log(`Float request with id ${requestId} approved`);
  console.log("Updated balance:", totalBalance);

  // (Optional) Update the local storage if necessary
  // For example, mark the request as "approved"
  floatRequest.status = "approved";

  // Update the local storage with the modified data
  localStorage.setItem("floatRequestToBranchManagerLocalStorage", JSON.stringify(floatRequests));
}




    // Pinia Store (balance store)
async function fetchTotalBalance() {
  console.log("Fetching balance...");
  const fetchedBalance = {
    prevBalance: totalBalance.prevBalance, // Setting previous balance to the current value
    currentBalance: totalBalance.currentBalance, // Example of updating balance to a new value
  };

  console.log("Fetched balance:", fetchedBalance); // Debugging
  totalBalance.prevBalance = fetchedBalance.prevBalance;
  totalBalance.currentBalance = fetchedBalance.currentBalance;
  console.log("Updated balance in store:", totalBalance); // Debugging
}

  return {
    totalBalance,
    approveFloatRequest,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance,
  };
});
