<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue";
import AppModal from "@/components/AppModal.vue";
import { useBilling } from "@/domain/billing/stores";
import { useDebounceFn } from "@vueuse/core";
import moment from "moment";
import type { IGoFilter } from "@/types";
import TransactionDetails from "@/domain/billing/components/TransactionDetails.vue";
import { useNotificationsStore } from "@/stores/notifications";

const notify = useNotificationsStore();

const billingStore = useBilling();

// State
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

// Filter setup for transactions
const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "date", // Sorting by date for transactions
      order: "ASC",
    },
  ],
  filter: [
    { field: "branchName", operand: "", operator: "CONTAINS" },
    { field: "manager", operand: "", operator: "CONTAINS" },
    { field: "status", operand: "", operator: "CONTAINS" },
  ],
});

// Fetch transactions
const fetch = () => {
  filter.limit = limit.value;
  filter.page = page.value;
  billingStore.fetchTransactions(filter);
};

// Debounced filter update
const updateFilter = useDebounceFn(() => fetch(), 300, { maxWait: 5000 });

// Date conversion utility
// const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// Pagination
const next = () => {
  page.value += 1;
  fetch();
};

const previous = () => {
  page.value -= 1;
  fetch();
};

// Modal control
const openTransaction = (transaction: any) => {
  // Logic to open modal with transaction details
  modalOpen.value = true;
};

const close = () => {
  modalOpen.value = false;
};

const transactionDetailsModalOpen: Ref<boolean> = ref(false);

function transactionDetails(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  transactionDetailsModalOpen.value = true;
}

// Watchers
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) fetch(); // Re-fetch transactions when modal closes
  }
);

// Ref to track if content was copied
const copied = ref(false);

const copyToClipboard = async (trackingNumber: string) => {
  try {
    // You can replace this with any string you want to copy
    // const textToCopy = "Text to copy to clipboard";

    // Using the Clipboard API
    await navigator.clipboard.writeText(trackingNumber);

    // Show "Copied!" for 2 seconds
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
    notify.success("Copied to clipboard");
  } catch (error) {
    console.error("Failed to copy text: ", error);
  }
};

watch(() => filter, updateFilter, { deep: true });

// Initialize fetch on mounted
// onMounted(() => fetch());
onMounted(() => {
  fetch();
  billingStore.fetchFloatAllocations(); // Fetch transactions when the component mounts
  // billingStore.fetchFloatLedgers(); // Fetch float ledgers
  billingStore.fetchTransactions;
});
</script>


<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow"></div>
      <div class="flex-grow">
        <div
          class="grid grid-cols-6 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3"
        >
          <input
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[0].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Search by Tracking Number"
          />
          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[1].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Filter by Status"
          >
            <option value="" disabled selected>Filter by Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>

          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[2].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Drop down provider"
          >
            <option value="" disabled selected>Filter by Provider</option>
            <option value="NIRA">NIRA</option>
            <option value="URSB">URSB</option>
            <!-- <option value="UMEME">UMEME</option> -->
            <option value="NARO">Posta Uganda</option>
          </select>
          <select
            v-if="filter.filter !== undefined"
            input-type="text"
            v-model="filter.filter[2].operand"
            class="filter-element e-input"
            type="text"
            placeholder="Search by Service"
          >
            <option value="" disabled selected>Filter by Service</option>
            <option value="companyNameReservation">
              Company Name Reservation
            </option>
            <option value="companyRegistration">Company Registration</option>
            <option value="companyNameSearch">Company Name Search</option>
            <option value="companyNameChange">Company Name Change</option>
          </select>
          <!-- <button @click="modalOpen = true" class="button btn-sm my-auto" type="button">
            <i class="px-1 fa-solid fa-plus"></i> Add Account
          </button> -->
          <div class="flex space-x-2">
            <div class="flex items-center">
              <label for="date-from" class="mr-1 text-sm text-gray-600"
                >From:</label
              >
              <input
                type="date"
                id="date-from"
                class="border rounded-md py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="filter.fromDate"
              />
            </div>
            <div class="flex items-center">
              <label for="date-to" class="mr-1 text-sm text-gray-600"
                >To:</label
              >
              <input
                type="date"
                id="date-to"
                class="border rounded-md py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                v-model="filter.toDate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex my-1">
      <table class="table tr">
        <thead>
          <tr class="text-left">
            <th>#</th>
            <th>Tracking Number</th>
            <th>Service</th>
            <th>Provider</th>
            <th>Till</th>
            <!-- <th>Transaction Type</th> -->
            <th>Fee</th>
            <th>Status</th>
            <th>Date</th>
            <!-- <th>Actions</th> -->
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-left"
            v-for="(transaction, idx) in billingStore.transactions"
            :key="idx"
            :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
          >
            <td class="text-left">
              <label class="cursor-pointer hover:text-primary-700 mx-2">
                <span class="hover:underline">{{ transaction.id }}</span>
              </label>
            </td>
            <!-- <td>{{ idx + 1 }}</td> -->
            <td class="rounded-md font-semibold text-red-700">
              <span
                class="hover:underline"
                @click="transactionDetails(transaction.id)"
                >{{ transaction.trackingNumber }}</span
              >
              <i
                @click="copyToClipboard(transaction.trackingNumber)"
                class="fa-regular ml-4 fa-copy mx-1 hover:text-gray-800"
              ></i>
            </td>
            <td>{{ transaction.service }}</td>
            <td class="text-left">{{ transaction.provider }}</td>
            <td>{{ transaction.till }}</td>
            <!-- <td class="text-left">{{ transaction.transactionType }}</td> -->
            <td class="text-left">{{ transaction.fee.toLocaleString() }}</td>
            <!-- <td class="text-left">
              <span
                class="bg-green-100 text-green-600 p-1 border border-green-200 rounded-md"
              >
                {{ transaction.status }}
              </span>
            </td> -->
            <td class="text-left">
              <!-- First Case: float request approved -->
              <div v-if="transaction.status === 'pending'">
                <!-- <td> -->
                <!-- <label> -->
                <span
                  class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:text-gray-700 hover:bg-green-200"
                  @click="open(transaction)"
                  >Pending</span
                >
                <!-- </label> -->
                <!-- </td> -->
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="transaction.status === 'failed'">
                <!-- <td> -->
                <label>
                  <span
                    class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="open(transaction)"
                    >Failed</span
                  >
                </label>
                <!-- </td> -->
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <!-- <td> -->
                <span
                  class="text-xs rounded-md px-1 py-0.5 font-semibold text-green-600 bg-green-100 border border-green-200 hover:text-green-700 hover:bg-green-200"
                  >Success</span
                >
              </div>
            </td>
            <td class="text-left">{{ convertDateTime(transaction.date) }}</td>
            <!-- <td class="text-left"> -->
            <!-- <button @click="openTransaction(transaction)">Edit</button> -->
            <!-- actions -->

            <!-- </td> -->

            <!-- <td class="text-left">
              <i
                class="fa-solid fa-eye p-1 mx-1 text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700"
                @click="open(transaction)"
              ></i>
              <i
                class="fa-solid fa-pen p-1 mx-1 text-green-600 bg-green-100 border border-green-200 hover:text-green-700"
                @click="edit(transaction)"
              ></i>
              <i
                class="fa-solid fa-trash p-1 mx-1 text-red-600 bg-red-100 border border-red-200 hover:text-red-700"
                @click="deleteBranch(transaction)"
              ></i>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex">
      <button v-if="page > 1" @click="previousPage">Previous</button>
      <span>{{ page }}</span>
      <button v-if="billingStore.transactions.length === limit" @click="nextPage">Next</button>
    </div> -->
  </div>

  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <CreateAccount @cancel="close" />
  </AppModal>
  <!-- /Modal -->

  <!-- Tracking Number Modal to show transaction details -->
  <AppModal v-model="transactionDetailsModalOpen" xl2>
    <TransactionDetails @transactionViewed="close" @cancel="close" />
  </AppModal>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
