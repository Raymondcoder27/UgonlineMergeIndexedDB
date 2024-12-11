import { defineStore } from "pinia";
import { reactive } from "vue";
// Pinia store
import { watchEffect } from "vue";




export interface TotalBalance {
  prev: number;
  current: number;
}

export const useBalance = defineStore("balance", () => {
  // Reactive state for total balance
  const totalBalance = reactive<TotalBalance>({
    prev: 300000000, // Initial previous balance
    current: 300000000, // Initial current balance
  });

  watchEffect(() => {
    console.log("Total balance changed:", totalBalance);
  });

  // Simulate fetching the balance from an API
  // async function fetchTotalBalance() {
  //   // Simulate fetching data (replace with actual API call)
  //   const fetchedBalance = {
  //     prev: totalBalance.current, // Setting previous balance to the current value
  //     current: 400000000, // Example of updating balance to a new value
  //   };
    
  //   // Update totalBalance reactive state
  //   totalBalance.prev = fetchedBalance.prev;
  //   totalBalance.current = fetchedBalance.current;
  // }


  // Increase the total balance and update "prev"
  function increaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current += amount;
  }

  // Decrease the total balance and update "prev"
  function decreaseTotalBalance(amount: number) {
    totalBalance.prev = totalBalance.current;
    totalBalance.current -= amount;
  }

    // Pinia Store (balance store)
async function fetchTotalBalance() {
  console.log("Fetching balance...");
  const fetchedBalance = {
    prev: totalBalance.prev, // Setting previous balance to the current value
    current: totalBalance.current, // Example of updating balance to a new value
  };

  console.log("Fetched balance:", fetchedBalance); // Debugging
  totalBalance.prev = fetchedBalance.prev;
  totalBalance.current = fetchedBalance.current;
  console.log("Updated balance in store:", totalBalance); // Debugging
}

  return {
    totalBalance,
    fetchTotalBalance,
    increaseTotalBalance,
    decreaseTotalBalance,
  };
});
