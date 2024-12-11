<script setup lang="ts">
import AppModal from "@/components/AppModal.vue";
import { useBilling } from "@/domain/billing/stores";
import { onMounted, type Ref, ref, reactive, watch } from "vue";
import AllocateFloat from "@/domain/billing/components/AllocateFloat.vue";
import { useDebounceFn } from "@vueuse/core";
import type { IGoFilter } from "@/types";
import moment from "moment";
import type {
  IResendVerificationPayload,
  TAccountVerificationType,
} from "./types";

const billingStore = useBilling();

const modalOpen: Ref<boolean> = ref(false);
const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(15);

// filter
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

onMounted(() => {
  fetch();
  billingStore.fetchFloatAllocations(); // Fetch transactions when the component mounts
  // billingStore.fetchFloatLedgers(); // Fetch float ledgers
});

function fetch() {
  filter.limit = limit.value;
  filter.page = page.value;
  billingStore.fetchBackofficeUsers(filter);
}

function open() {
  modalOpen.value = true;
}

function close() {
  modalOpen.value = false;
}

const reVerifyForm: IResendVerificationPayload = reactive({
  purpose: "",
  username: "",
});

const resend = (purpose: TAccountVerificationType, username: string) => {
  if (username.length === 0) return;
  reVerifyForm.purpose = purpose;
  reVerifyForm.username = username;
  billingStore.resendAccountVerification(reVerifyForm);
};

const updateFilter = useDebounceFn(
  () => {
    fetch();
  },
  300,
  { maxWait: 5000 }
);

// function convertDate(date: string) {
//   return moment(date).format("DD-MM-YYYY");
// }

function convertDateTime(date: string) {
  return moment(date).format("DD-MM-YYYY HH:mm:ss");
}

function next() {
  page.value += 1;
  fetch();
}

function previous() {
  page.value -= 1;
  fetch();
}

// watch state of the modal
watch(
  () => modalOpen.value,
  (isOpen: boolean) => {
    if (!isOpen) {
      fetch();
    }
  }
);

// watch for changes in the filter object
watch(
  () => filter,
  () => updateFilter(),
  { deep: true }
);
</script>

<template>
  <!-- <h2>Transactions</h2>
    <ul>
      <li v-for="transaction in billingStore.transactions" :key="transaction.id">
        {{ transaction.description }} - {{ transaction.amount }}
      </li>
    </ul> -->
  <div class="w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex space-x-2 my-1 pt-1 pb-3">
      <div class="flex-grow">
        <div
          class="flex justify-between bg-gray-10 border border-gray-200 rounded px-2 py-3"
        >
          <div class="flex">
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
            <div class="flex">
              <div class="flex items-center mr-2">
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
              <div class="flex items-center mr-2">
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
         <div class="">
          <button
            @click="modalOpen = true"
            class="button btn-sm"
            type="button"
          >
            <i class="px-1 fa-solid fa-plus"></i> Allocate Float
          </button>
         </div>
        </div>
      </div>
    </div>

    <div class="flex my-1">
      <table class="table">
        <thead>
          <tr class="header-tr">
            <!-- <th class="t-header">#</th> -->
            <!-- <th class="t-header" width="30%">Names</th> -->
            <th class="t-header">Branch</th>
            <th class="t-header">Amount(UGX)</th>
            <th class="text-left">Status</th>
            <th class="text-right">Date of Allocation</th>
            <!-- <th class="t-header">Actions</th> -->
            <th class="t-header"></th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(assignment, idx) in billingStore.floatAllocations"
            :key="idx"
          >
            <!-- <td>{{ idx + 1 }}</td> -->
            <!-- <td>
              <label class="font-bold py-1">{{
                manager.fullName
              }}</label>
            </td> -->
            <td class="text-left">{{ assignment.branch }}</td>
            <td class="text-left">{{ assignment.amount.toLocaleString() }}</td>
            <!-- <td class="text-left text-center">{{ assignment.status }}</td> -->
            <!-- use v-if, v-else-if and v-else to allocate depending on whether it was allocated, pending or failed -->
            <td class="text-left">
              <!-- First Case: float request approved -->
              <div v-if="assignment.status === 'pending'">
                <!-- <td> -->
                <!-- <label> -->
                <span
                  class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-gray-600 bg-gray-50 border border-gray-200 hover:text-gray-700 hover:bg-green-200"
                  @click="open(assignment)"
                  >Pending</span
                >
                <!-- </label> -->
                <!-- </td> -->
              </div>

              <!-- Second Case: Manager directly assigned to branch -->
              <div v-else-if="assignment.status === 'failed'">
                <!-- <td> -->
                <label>
                  <span
                    class="text-xs cursor-pointer rounded-md px-1 py-0.5 font-semibold text-red-600 bg-red-100 border border-red-200 hover:text-red-700 hover:bg-red-200"
                    @click="open(assignment)"
                    >Failed</span
                  >
                </label>
                <!-- </td> -->
              </div>

              <!-- Third Case: Fallback, no manager assigned -->
              <div v-else>
                <!-- <td> -->
                <span
                  class="text-xs rounded-md px-1 py-0.5 font-semibold text-blue-600 bg-blue-100 border border-blue-200 hover:text-blue-700 hover:bg-blue-200"
                  >Allocated</span
                >
              </div>
            </td>
            <td class="text-right">
              {{ convertDateTime(assignment.createdAt) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex">
      <div class="w-full">
        <div
          class="flex"
          v-if="limit == billingStore.backOfficeUsers?.length || page > 1"
        >
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
            v-if="
              limit == billingStore.backOfficeUsers?.length - 1 ||
              limit > billingStore.backOfficeUsers?.length
            "
            class="pagination-button-inert"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button v-else class="pagination-button" @click="next">
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Modal -->
  <AppModal v-model="modalOpen" xl2>
    <AllocateFloat @floatAllocated="close" @cancel="close" />
  </AppModal>
  <!-- /Modal -->
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";
</style>
