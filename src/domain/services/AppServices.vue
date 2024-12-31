<script setup lang="ts">
import { useServicesStore } from "@/domain/services/stores";
import ServiceCards from "@/domain/services/components/ServiceCards.vue";
import SubscribedServices from "@/domain/services/components/SubscribedServices.vue";
import { onMounted, ref, type Ref, watch, computed } from "vue";

const page: Ref<number> = ref(1);
const limit: Ref<number> = ref(9);
const subscribedServices: Ref<any[]> = ref([]);
const totalRecords = computed(() => store.subscribedServices.length); // Total subscribedServices
const totalPages = computed(() => Math.ceil(totalRecords.value / limit.value));
const pageInput = ref(1);
const changePageSize = () => {
  page.value = 1;
  fetchSubscribedServices();
};
const jumpToPage = () => {
  if (pageInput.value > totalPages.value) {
    page.value = totalPages.value;
  } else if (pageInput.value < 1) {
    page.value = 1;
  } else {
    page.value = pageInput.value;
  }
  fetchSubscribedServices();
};

const paginatedServices = computed(() => {
  const start = (page.value - 1) * limit.value;
  const end = start + limit.value;
  return store.subscribedServices.slice(start, end); // Adjust according to your page & limit
});

function next() {
  page.value += 1;
  fetchSubscribedServices();
}

function previous() {
  page.value -= 1;
  fetchSubscribedServices();
}

const store = useServicesStore();

const subscribe = (serviceId: string) => {
  // Subscription logic here
};

const unsubscribeFromService = (serviceId: string) => {
  // Unsubscription logic here
};

const open = (service: any) => {
  // Navigation logic here
};
</script>


<template>
  <div class="flex">
    <div class="block w-2/3 h-[80vh]">
      <!-- Service Cards Area -->
      <ServiceCards :services="store.services" @subscribe="subscribe" />
    </div>

    <div
      class="w-1/3 ml-3 bg-white text-xs rounded-md text-center mb-2 h-[84vh] flex flex-col"
    >
      <!-- Subscribed Services Area -->
      <!-- <SubscribedServices
        :subscribedServices="store.subscribedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      /> -->
      <SubscribedServices
        :subscribedServices="paginatedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      />
      <div class="flex text-xs mt-auto my-3">
        <!-- <div class="w-full border-t border-b border-gray-50"> -->
        <div class="w-full border-gray-50">
          <div class="flex gap-2 items-center">
            <!-- Previous Button -->
            <button
              class="px-0.5 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{ 'opacity-50 cursor-not-allowed': page <= 1 }"
              :disabled="page <= 1"
              @click="previous"
            >
              <i class="fa-solid fa-arrow-left"></i>
            </button>

            <!-- Current Page / Total Pages -->
            <div class="py-1">
              <span class="px-2 py-1 bg-primary rounded text-white">{{
                page
              }}</span>
              <label class="mx-1 text-gray-400">/</label>
              <span class="px-2 py-1 bg-primary-50 rounded text-primary-600">
                {{ totalPages }}
              </span>
            </div>
            <button
              class="px-0.5 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
              :class="{
                'opacity-50 cursor-not-allowed':
                  subscribedServices.length < limit,
              }"
              :disabled="subscribedServices.length < limit"
              @click="next"
            >
              <i class="fa-solid fa-arrow-right"></i>
            </button>

            <!-- Jump to Page -->
            <!-- <label>Page</label>
          <input
            type="number"
            placeholder="Page"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-6"
            v-model.number="pageInput"
            @change="jumpToPage"
          /> -->

            <!-- Adjust Page Size -->
            <!-- <label>Page Size</label>
          <input
            type="number"
            placeholder="Page Size"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-6"
            v-model.number="limit"
            @change="changePageSize"
          />

          Total Records
          <span
            class="my-auto mx-2 bg-primary-50 px-3 py-1 rounded text-primary"
          >
            Total Services: {{ totalRecords }}
          </span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

