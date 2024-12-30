<script setup lang="ts">
import { useServicesStore } from "@/domain/services/stores";
import ServiceCards from "@/domain/services/components/ServiceCards.vue";
import SubscribedServices from "@/domain/services/components/SubscribedServices.vue";

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

    <div class="w-1/3 ml-3 bg-white text-xs rounded-md text-center mb-2 h-[84vh]">
      <!-- Subscribed Services Area -->
      <SubscribedServices
        :subscribedServices="store.subscribedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      />
      <div class="flex text-xs mt-auto">
      <div class="w-full border-t border-b border-gray-50">
        <div class="flex gap-2 items-center">
          <!-- Previous Button -->
          <button
            class="px-1 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
            class="px-1 py-0.5 text-red-600 rounded-md hover:bg-red-700 hover:text-white focus:outline-none focus:ring focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{
              'opacity-50 cursor-not-allowed': subscribedServices.length < limit,
            }"
            :disabled="subscribedServices.length < limit"
            @click="next"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>

          <!-- Jump to Page -->
          <label>Page</label>
          <input
            type="number"
            placeholder="Page"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-12"
            v-model.number="pageInput"
            @change="jumpToPage"
          />

          <!-- Adjust Page Size -->
          <label>Page Size</label>
          <input
            type="number"
            placeholder="Page Size"
            class="form-element-lean bg-primary-50 font-bold text-center mx-1 w-12"
            v-model.number="limit"
            @change="changePageSize"
          />

          <!-- Total Records -->
          <span
            class="my-auto mx-2 bg-primary-50 px-3 py-1 rounded text-primary"
          >
            Total Records: {{ totalRecords }}
          </span>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

