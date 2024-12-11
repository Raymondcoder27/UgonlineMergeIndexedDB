<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch, computed } from "vue";
import { useBilling } from "@/domain/billing/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import type {
  Transaction,
  FloatLedger,
  FloatRequest,
  FloatManagement,
} from "./types"; // Import billing types
import moment from "moment/moment";
import { useBalance } from "@/domain/balance/stores"; // Import the balance store

const balanceStore = useBalance(); // Initialize the balance store

balanceStore.fetchTotalBalance(); // Decrease balance by 100

const store = useBilling(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Billing-specific filter
const filter = reactive({
  limit: 100,
  offset: 0,
  page: 1,
  sort: [
    {
      field: "date",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "description",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "amount",
      operand: "",
      operator: "GREATER_THAN",
    },
    {
      field: "balance",
      operand: "",
      operator: "GREATER_THAN",
    },
  ],
  fromDate: "", // Add fromDate
  toDate: "", // Add toDate
});

// Fetch billing data (transactions, float ledgers)
onMounted(() => {
  fetchTransactions();
  store.fetchFloatLedgers(); // Fetch float ledgers
  // balanceStore.fetchTotalBalance(); // Fetch total balance
  // balanceStore.increaseTotalBalance(); // Increase balance by 100
});

// function decreaseBalance() {
//   balanceStore.decreaseTotalBalance(5000000); // Decrease by 5 million
// }

// Dynamically compute the balances for each transaction
// const computedTransactions = computed(() => {
//   // Ensure there is a valid starting balance and transactions
//   if (store.floatLedgers.length === 0) {
//     return [];
//   }

//   // Start with the balance before any transactions
//   let runningBalance = balanceStore.totalBalance.current;

//   // Reverse the transactions to process them chronologically
//   const transactionsWithBalances = store.floatLedgers
//   .slice()
//   .reverse()
//   .map((transaction) => {
//     if (transaction.description === "Recharge") {
//       // Set balance directly for recharge transactions
//       runningBalance = transaction.amount;
//     } else {
//       // Adjust balance correctly for other transactions
//       runningBalance += transaction.amount;
//     }

//     return {
//       ...transaction,
//       balance: runningBalance,
//     };
//   })
//   .reverse(); // Reverse back to display in the original order
//  // Reverse back to display in the original order

//   return transactionsWithBalances;
// });

const computedTransactions = computed(() => {
  if (store.floatLedgers.length === 0) {
    return [];
  }

  // Start with the balance from the store
  let runningBalance = 0;

  // Process transactions chronologically
  return store.floatLedgers.map((transaction) => {
    // Adjust the running balance based on transaction amount
    runningBalance += transaction.amount;

    return {
      ...transaction,
      balance: runningBalance, // Attach the calculated balance
    };
  });
});


function fetchTransactions() {
  filter.limit = limit.value;
  filter.page = page.value;

  // Add date filter if both dates are provided
  if (filter.fromDate && filter.toDate) {
    filter.filter.push({
      field: "date",
      operator: "BETWEEN",
      operand: [filter.fromDate, filter.toDate],
    });
  }

  store.fetchTransactions(filter); // Fetch transactions based on filter
}

function next() {
  page.value += 1;
  fetchTransactions();
}

function previous() {
  page.value -= 1;
  fetchTransactions();
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Debounced filter update function
const updateFilter = useDebounceFn(
  () => {
    fetchTransactions();
  },
  300,
  { maxWait: 5000 }
);

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
  }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

// watch(
//   () => balanceStore.totalBalance,
//   (newVal) => {
//     console.log("Balance updated:", newVal);
//   },
//   { deep: true }
// );

watch(
  () => balanceStore.totalBalance,
  (newValue) => {
    console.log("Total balance updated:", newValue);
  },
  { deep: true }
);

watch(
  () => store.floatLedgers,
  (newLedgers) => {
    console.log("Float ledgers updated:", newLedgers);
  }
);

watch(
  computedTransactions,
  (transactions) => {
    console.log("Computed transactions:", transactions);
  },
  { deep: true }
);
</script>


<template>
  <div class="">
    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white">
      <div class="flex space-x-2 my-1 pt-1 pb-3">
        <div class="flex-grow">
          <div
            class="flex justify-between gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3"
          >
            <select
              v-if="filter.filter !== undefined"
              input-type="text"
              v-model="filter.filter[2].operand"
              class="filter-element e-input"
              type="text"
              placeholder="Drop down provider"
            >
              <option value="" disabled selected>Filter by Description</option>
              <option value="recharge">Recharge</option>
              <option value="floatAllocation">Float Allocation</option>
              <!-- <option value="UMEME">UMEME</option> -->
            </select>
            <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
            <div class="flex">
              <div class="block">
                <label for="date-from" class="mr-2 text-sm text-gray-600"
                  >From:</label
                >
                <input
                  type="date"
                  id="date-from"
                  class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="filter.fromDate"
                />
              </div>
              <div class="block">
                <label for="date-to" class="mr-2 text-sm text-gray-600"
                  >To:</label
                >
                <input
                  type="date"
                  id="date-to"
                  class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  v-model="filter.toDate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <!-- Table -->
      <div class="flex my-1">
        <table class="table w-full">
          <thead>
            <tr class="header-tr">
              <th class="t-header">#</th>
              <th class="t-header">Date</th>
              <th class="t-header">Description</th>
              <th class="text-right t-header">Amount</th>
              <th class="text-right t-header">Balance</th>
            </tr>
          </thead>
          <thead v-if="loading">
            <tr>
              <th colspan="12" style="padding: 0">
                <div
                  class="w-full bg-primary-300 h-1 p-0 m-0 animate-pulse"
                ></div>
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- <tr
              v-for="(transaction) in store.floatLedgers"
              :key="transaction.id"
              class="body-tr"
            > -->

            <tr
              v-for="transaction in computedTransactions"
              :key="transaction.id"
              class="body-tr"
            >
              <td class="text-left">
                <label class="cursor-pointer hover:text-primary-700 mx-2">
                  <span class="hover:underline">{{ transaction.id }}</span>
                </label>
              </td>
              <!-- <td class="text-left">{{ idx + 1 }}</td> -->

              <td class="text-left">
                <span class="text-xs">{{
                  convertDateTime(transaction.createdAt)
                }}</span>
              </td>
              <td class="text-left">
                <label class="cursor-pointer hover:text-primary-700 mx-2">
                  <span class="hover:underline">{{
                    transaction.description
                  }}</span>
                </label>
              </td>

              <!-- <td>
                <span
                class="text-left bg-blue-200 text-blue-600 rounded-sm font-semibold px-2 py-1"
                :class="{ 'bg-red-300 text-red-600  rounded-md px-2': transaction.amount < 0 }">{{ transaction.description }}</span>
              </td> -->
              <!-- <td class="text-left text-green-600">
                <span>{{ transaction.amount }}</span>
              </td> -->
              <!-- v-bind for red incase negative transaction and green incase positive transaction -->
              <td
                class="text-left text-green-600"
                :class="{ 'text-red-600': transaction.amount < 0 }"
              >
                <span>{{ transaction.amount.toLocaleString() }}</span>
              </td>
              <td class="text-left text-gray-800">
                <!-- <button @click="decreaseBalance">Decrease Balance</button> -->
                <!-- <span>{{ balanceStore.totalBalance.current }}</span> -->
                <span>{{ transaction.balance.toLocaleString() }}</span>
              </td>
            </tr>
          </tbody>
          <!-- <tfoot>
            <tr class="bg-gray-50">
              <td colspan="3" class="text-left font-bold text-gray-600">
                Totals:
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalAmount }}
              </td>
              <td class="text-left font-bold text-gray-800">
                {{ store.totalBalance }}
              </td>
            </tr>
          </tfoot> -->
        </table>
      </div>
    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
