<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { onMounted, ref, reactive, watch } from "vue";
import { useSubmissions } from "@/agentdomain/submissions/stores"; // Import the appropriate store
import { useDebounceFn } from "@vueuse/core";
import TransactionDetails from "@/agentdomain/submissions/components/TransactionDetails.vue";
import { useNotificationsStore } from "@/stores/notifications";

const notify = useNotificationsStore()
// import type {
//   Submission,
//   FloatLedger,
//   FloatRequest,
//   FloatManagement,
// } from "./types";
// Import billing types
import moment from "moment/moment";

const store = useSubmissions(); // Assuming you have a billing store that handles transactions, float ledgers, etc.
const modalOpen = ref(false);
const page = ref(1);
const limit = ref(15);

const transactionDetailsModalOpen: Ref<boolean> = ref(false);

function transactionDetails(id: string) {
  // Logic to open the modal or start the process
  // console.log(`Assigning manager for branch: ${branch.name}`);
  // Example: modalOpen.value = true;
  transactionDetailsModalOpen.value = true;
}

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
  fetchSubmissions();
});

function fetchSubmissions() {
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

  store.fetchSubmissions(filter); // Fetch transactions based on filter
}

// Function to handle submission draft
function submissionDraft(name: string) {
  // Logic to check if submission is a draft
  return name === "DRAFT";
}

// Function to handle submission repay
function submissionRepay(name: string) {
  // Logic to check if submission is a repay
  return name === "REPAY";
}

function next() {
  page.value += 1;
  fetchSubmissions();
}

function previous() {
  page.value -= 1;
  fetchSubmissions();
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
    fetchSubmissions();
  },
  300,
  { maxWait: 5000 }
);

// Date conversion utility
const convertDate = (date: string) => moment(date).format("DD-MM-YYYY");

// Watch for changes in the modal state
watch(
  () => modalOpen.value,
  (isOpen) => {
    if (!isOpen) {
      // Handle modal close if needed
    }
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

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
</script>


<template>
  <div class="">
    <!-- Header -->
    <div class="max-w-7xl mx-auto bg-white p-2">
      <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div class="grid grid-cols-6 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3">
          <input v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[0].operand"
            class="filter-element e-input" type="text" placeholder="Search by Tracking Number" />
            <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[1].operand"
            class="filter-element e-input" type="text" placeholder="Filter by Status">
            <option value="" disabled selected>Filter by Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
          <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Drop down provider">
            <option value="" disabled selected>Filter by Provider</option>
            <option value="NIRA">NIRA</option>
            <option value="URSB">URSB</option>
            <!-- <option value="UMEME">UMEME</option> -->
            <option value="NARO">Posta Uganda</option>
          </select>
            <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Search by Service">
            <option value="" disabled selected>Filter by Service</option>
            <option value="companyNameReservation">Company Name Reservation</option>
            <option value="companyRegistration">Company Registration</option>
            <option value="companyNameSearch">Company Name Search</option>
            <option value="companyNameChange">Company Name Change</option>
          </select>
          <!-- <select class="filter-element e-select">
            <option :value="null">- Select Status -</option>
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select> -->
          <div class="block">
            <label for="date-from" class="mr-2 text-sm text-gray-600"
              >From:</label
            >
            <input
              type="date"
              id="date-from"
              class="e-input filter-element"
              v-model="filter.fromDate"
            />
          </div>
          <div class="block">
            <label for="date-to" class="mr-2 text-sm text-gray-600">To:</label>
            <input
              type="date"
              id="date-to"
              class="e-input filter-element"
              v-model="filter.toDate"
            />
          </div>
        </div>
        
      </div>
    </div>
      <!-- <div class="flex items-center justify-end border-b pb-4 mb-4 mt-3">
        <div>
          <label for="date-range" class="mr-2 text-sm text-gray-600 justify-end">Date Range:</label>
          <input
            type="date"
            id="date-range"
            class="border rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div> -->
      <!-- Table -->
      <!-- Table -->
      <!-- <span v-if="copied">Copied!</span> -->

      <div class="flex my-1">
        <table class="table tr">
          <thead>
            <tr class="text-left">
              <!-- <th>#</th> -->
              <th>Tracking Number</th>
              <th>Service</th>
              <th>Provider</th>
              <!-- <th>Till</th> -->
              <!-- <th>Transaction Type</th> -->
              <th>Fee</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              class="text-left"
              v-for="(transaction, idx) in store.submissions"
              :key="idx"
              :class="transaction.status === 'BLOCKED' ? 'blocked' : ''"
            >
              <!-- <td>{{ idx + 1 }}</td> -->
              <td
                class="rounded-md font-semibold text-red-700"
              >
              <span @click="transactionDetails(transaction.id)" class="hover:underline">
                {{ transaction.trackingNumber }}

              </span>
                <!-- make it copy to clipboard -->
                <i @click="copyToClipboard(transaction.trackingNumber)" class="fa-regular fa-copy mx-1 ml-4 hover:text-gray-800"></i>
              </td>
              <td>{{ transaction.service }}</td>
              <td class="text-left">{{ transaction.provider }}</td>
              <!-- <td>{{ transaction.till }}</td> -->
              <!-- <td class="text-left">{{ transaction.transactionType }}</td> -->
              <td class="text-left">{{ transaction.fee.toLocaleString()}}</td>
              <td class="text-left">
                <!-- <div class="" v-if="submissionDraft(transaction.name)"> -->
                <!-- use transaction.status = draft -->
                <div class="" v-if="transaction.status === 'draft'">
                  <button
                    class="bg-gray-100 rounded-md font-semibold text-gray-600 px-1 py-0.5 border border-gray-300"
                    @click="submitDraft(transaction)"
                  >
                    Draft
                  </button>
                </div>
                <!-- <div class="" v-else-if="submissionRepay(transaction.name)"> -->
                <!-- use transaction.status = repay -->
                <div class="" v-if="transaction.status === 'repay'">
                  <button
                    class="bg-green-100 rounded-md font-semibold text-green-700 px-1 py-0.5 hover:underline border border-green-200"
                    @click="repay(transaction)"
                  >
                    Repay
                  </button>
                </div>
                <div class="" v-if="transaction.status === 'submitted'">
                  <span
                    class="bg-blue-100 rounded-md font-semibold text-blue-700 px-1 py-0.5 border border-blue-300"
                    @click="confirm(transaction)"
                  >
                    Submitted
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'processing'">
                  <span
                    class="bg-yellow-100 rounded-md font-semibold text-yellow-700 px-1 py-0.5 border border-yellow-300"
                    @click="confirm(transaction)"
                  >
                    Processing
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'queried'">
                  <span
                    class="bg-amber-200 rounded-md font-semibold text-amber-700 px-1 py-0.5 border border-amber-500"
                    @click="confirm(transaction)"
                  >
                    Queried
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'rejected'">
                  <span
                    class="bg-red-100 rounded-md font-semibold text-red-700 px-1 py-0.5 border border-red-300"
                    @click="confirm(transaction)"
                  >
                    Rejected
                  </span>
                </div>
              </td>
              <td class="text-left">{{ convertDate(transaction.date) }}</td>
              <!-- <td class="text-left"> -->
              <!-- <td class="text-black-700 text-center">
              <div v-if="getManagerByBranch(branch.name)">
                <label>
                  {{ getManagerByBranch(branch.name).firstName }}
                  {{ getManagerByBranch(branch.name).lastName }}
                </label>
              </div>

              <div v-else-if="branch.manager">
                <label>
                  {{ branch.manager.firstName }} {{ branch.manager.lastName }}
                </label>
              </div>

              <div v-else>
                <button
                  class="bg-red-200 rounded-md font-semibold text-red-700 p-1 hover:underline"
                  @click="allocateManager(branch)"
                >
                  Assign Manager
                </button>
              </div>
            </td> -->
              <!-- actions -->
              <!-- use the same v-if, v-else-if and v-else to make scenarios for draft, repay, or confirmed -->
              <td class="text-left">
                <!-- <div class="" v-if="submissionDraft(transaction.name)"> -->
                <!-- use transaction.status = draft -->
                <div class="" v-if="transaction.status === 'draft'">
                  <button
                    class="bg-gray-500 rounded-md font-semibold text-white px-1 py-0.5 hover:bg-gray-600"
                    @click="submitDraft(transaction)"
                  >
                  <!-- appropriate icon -->
                   <i class="fa fa-play"></i>
                    Resume
                  </button>
                </div>
                <!-- <div class="" v-else-if="submissionRepay(transaction.name)"> -->
                <!-- use transaction.status = repay -->
                <div class="" v-else-if="transaction.status === 'repay'">
                  <button
                    class="bg-green-100 rounded-md font-semibold text-green-700 px-1 py-0.5 hover:underline border border-green-200"
                    @click="repay(transaction)"
                  >
                    Repay
                  </button>
                </div>
                <div class="" v-if="transaction.status === 'rejected'">
                  <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-0.5"
                    @click="confirm(transaction)"
                  >
                  <i class="fa fa-redo"></i>
                    Resubmit
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'submitted'">
                  <span
                    class="bg-green-500 rounded-md font-semibold text-white px-1 py-0.5"
                    @click="confirm(transaction)"
                  >
                  <i class="fa fa-eye"></i>
                    View Details
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'processing'">
                  <span
                    class="bg-blue-600 rounded-md font-semibold text-white px-1 py-0.5"
                    @click="confirm(transaction)"
                  >
                    Resubmit
                  </span>
                </div>
                <div class="" v-if="transaction.status === 'queried'">
                  <span
                    class="bg-amber-700 rounded-md font-semibold text-white px-1 py-0.5"
                    @click="confirm(transaction)"
                  >
                  <i class="fa fa-eye"></i>
                    View Query
                  </span>
                </div>
              </td>

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
    </div>

    <!-- Modal -->
    <AppModal v-model="modalOpen" xl2>
      <!-- Your modal content goes here -->
    </AppModal>

    <!-- Tracking Number Modal to show transaction details -->
    <AppModal v-model="transactionDetailsModalOpen" xl2>
      <TransactionDetails @transactionViewed="close" @cancel="close" />
    </AppModal>
  </div>
</template>



<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
