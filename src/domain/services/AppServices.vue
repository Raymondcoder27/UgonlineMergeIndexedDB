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
    <div class="block w-2/3">
      <!-- Service Cards Area -->
      <ServiceCards :services="store.services" @subscribe="subscribe" />
    </div>

    <div class="w-1/3 ml-3 bg-white text-xs rounded-md text-center mb-2 h-[86vh]">
      <!-- Subscribed Services Area -->
      <SubscribedServices
        :subscribedServices="store.subscribedServices"
        @unsubscribe="unsubscribeFromService"
        @open="open"
      />
    </div>
  </div>
</template>

