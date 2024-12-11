<script setup lang="ts">
import { useBilling } from "@/domain/billing/stores";
import { onMounted, ref, reactive, watch } from "vue";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";
// import { request } from "http";
// import { useDebounce } from "@vueuse/core";
import moment from "moment/moment";

const store = useBilling();
const page = ref(1);
const limit = ref(10);

const filter: IGoFilter = reactive({
  limit: 100,
  offset: 0,
  page: 0,
  sort: [
    {
      field: "firstname",
      order: "ASC",
    },
  ],
  filter: [
    {
      field: "firstname",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "username",
      operand: "",
      operator: "CONTAINS",
    },
    {
      field: "phone",
      operand: "",
      operator: "CONTAINS",
    },
  ],
});

const next = () => {
  if (store.transactions.length >= store.limit) {
    page.value += 1;
    store.fetchTransactions();
  }
};

const previous = () => {
  if (page.value > 1) {
    page.value -= 1;
    store.fetchTransactions();
  }
};

// Debounced filter update function
const updateFilter = useDebounceFn(
  () => {
    fetchTransactions();
  },
  300,
  { maxWait: 5000 }
);

// Watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

// pass in the requestId
const approveFloatRequest = (requestId: any) => {
  store.approveFloatRequest(requestId);
  store.fetchFloatRequests();
  console.log(`float request with id ${requestId} approved`);
};

const rejectFloatRequest = (requestId: any) => {
  store.rejectFloatRequest(requestId);
  store.fetchFloatRequests();
  console.log(`float request with id ${requestId} rejected`);
};

onMounted(() => {
  store.fetchFloatRequests();
});
</script>

<template>
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div class="grid grid-cols-5 gap-2 bg-gray-10 border border-gray-200 rounded px-2 py-3">
            <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Search by Service">
            <option value="" disabled selected>Filter by Branch</option>
            <option value="Branch 1">Branch 1</option>
            <option value="Branch 2">Branch 2</option>
            <option value="Branch 3">Branch 3</option>
          </select>
          <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[2].operand"
            class="filter-element e-input" type="text" placeholder="Drop down provider">
            <option value="" disabled selected>Filter by Amount</option>
            <option value="NIRA"> &lt 10,000,000 </option>
            <option value="URSB"> &lt 10,000,000 >= </option>
            <!-- <option value="UMEME">UMEME</option> -->
            <option value="NARO"> > 10,000,000 </option>
          </select>
          <select v-if="filter.filter !== undefined" input-type="text" v-model="filter.filter[1].operand"
            class="filter-element e-input" type="text" placeholder="Filter by Status">
            <option value="" disabled selected>Filter by Status</option>
            <option value="PENDING">PENDING</option>
            <option value="COMPLETED">APPROVED</option>
            <option value="BLOCKED">REJECTED</option>
          </select>
          <div class="flex items-center">
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
          <div class="flex items-center">
            <label for="date-to" class="mr-2 text-sm text-gray-600">To:</label>
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
    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <!-- <th class="text-left">#</th> -->
            <th class="text-left">Date</th>
            <!-- <th class="text-left">Name</th> -->
            <th class="text-left">Branch</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            class="text-right"
            v-for="(request, id) in store.floatRequests"
            :key="id"
          >
            <!-- <td>{{ idx + 1 }}</td> -->
            <!-- <td class="text-left">{{  convertDateTime(request.date) }}</td> -->
            <td class="text-left">{{ request.date }}</td>
            <!-- convertDateTime(request.createdAt) -->
            <td class="text-left">{{ request.branch }}</td>
            <td class="text-left">{{ request.amount.toLocaleString() }}</td>
            <td class="text-left">{{ request.status }}</td>
            <td class="text-right">
              <!-- First Case: float request approved -->
              <div v-if="request.status === 'approved'">
                <!-- <td> -->
                <!-- <label> -->
                <span
                  class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-green-600 bg-green-100 border border-green-200 hover:text-green-700 hover:bg-green-200"
                  @click="open(request)"
                  >Approved</span
                >
                <!-- </label> -->
                <!-- </td> -->
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="request.status === 'rejected'">
                <!-- <td> -->
                <label>
                  <span
                    class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="open(request)"
                    >Rejected</span
                  >
                </label>
                <!-- </td> -->
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <!-- <td> -->
                <span
                  class="text-xs rounded-md px-1 py-0.5 font-semibold text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 hover:bg-blue-200"
                  @click="approveFloatRequest(request.id)"
                  >Approve</span
                >

                <span
                  class="text-xs rounded-md px-1 py-0.5 ml-1 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                  @click="rejectFloatRequest(request.id)"
                  >Reject</span
                >
                <!-- </td> -->
              </div>
            </td>

            <!-- <td class="text-center">
              <span class="text-xs rounded-md p-1 font-semibold text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 hover:bg-blue-200"
                @click="open(transaction)">Approve</span>

              <span class="text-xs rounded-md p-1 mr-2 ml-3 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"             
                @click="open(transaction)">Reject</span>
            </td> -->
          </tr>
        </tbody>
      </table>
    </div>

    <!-- <div class="flex">
      <div class="w-full">
        <div class="flex">
          <button v-if="page > 1" class="pagination-button" @click="previous">
            <i class="fa-solid fa-arrow-left"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-left"></i>
          </button>

          <div class="w-1/12 text-center my-auto">
            <label class="rounded text-white bg-primary-700 px-3 py-1">{{
              page
            }}</label>
          </div>

          <button
            v-if="store.transactions.length === store.limit"
            class="pagination-button"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button-inert">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
