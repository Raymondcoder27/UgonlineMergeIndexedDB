import { defineStore } from "pinia";
import { ref, reactive } from "vue";

export interface TotalBalance {
  prev: number;
  current: number;
}

export const useBalance = defineStore("balance", () => {
  // Initial dummy data for total balance

  const totalBalance = reactive<TotalBalance>({
    prev: 0,
    current: 15405000, // Initial balance
  });

  // Fetch the total balance (dummy data for now)
  // async function fetchTotalBalance() {
  //   // Simulate API call
  //   totalBalance.value = { ...dummyTotalBalance };
  // }

  // Increase the total balance and update the "prev" value
  // async function increaseTotalBalance(amount: number) {
  //   totalBalance.value = {
  //     prev: totalBalance.value.current,
  //     current: totalBalance.value.current + amount,
  //   };
  // }

  // Increase balance
// async function increaseTotalBalance(amount: number) {
//   totalBalance.value.prev = totalBalance.value.current;
//   totalBalance.value.current += amount; // Mutating individual properties
// }


  // Decrease the total balance and update the "prev" value
  // async function decreaseTotalBalance(amount: number) {
  //   totalBalance.value = {
  //     prev: totalBalance.value.current,
  //     current: totalBalance.value.current - amount,
  //   };
  // }

  // async function decreaseTotalBalance(amount: number) {
  //   console.log("Previous:", totalBalance.value.prev, "Current:", totalBalance.value.current);
  //   totalBalance.value = {
  //     prev: totalBalance.value.current,
  //     current: totalBalance.value.current - amount,
  //   };
  //   console.log("Updated:", totalBalance.value);
  // }

  // dummyTotalBalance.current = totalBalance.value.current;

  // totalBalance.value = { ...dummyTotalBalance };

    // Increase the total balance and update the "prev" value
    async function increaseTotalBalance(amount: number) {
      totalBalance.prev = totalBalance.current;
      totalBalance.current += amount;
    }
  
    // Decrease the total balance and update the "prev" value
    async function decreaseTotalBalance(amount: number) {
      totalBalance.prev = totalBalance.current;
      totalBalance.current -= amount;
    }

   // Fetch the total balance (Simulate API call)
  //  async function fetchTotalBalance() {
  //   // Simulate fetching updated balance data
  //   const fetchedBalance = {
  //     prev: totalBalance.prev,
  //     current: totalBalance.current, // Example fetched balance
  //   };
  //   Object.assign(totalBalance, fetchedBalance);
  // }

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
