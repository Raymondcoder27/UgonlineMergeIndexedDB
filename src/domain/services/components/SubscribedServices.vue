 
  <script setup lang="ts">
import type { Ref } from "vue";
import { ref } from "vue";
import { useServicesStore } from "@/domain/services/stores";

// const { subscribedServices, unsubscribe, open } = useSubscribedServices();

const store = useServicesStore();

// const subscribedServices: Ref<any[]> = ref([]); // Will be passed as a prop
// const unsubscribe = (serviceId: string) => {
//   // Add unsubscribe logic or emit an event
// };

const unsubscribe = (serviceId: string) => {
  store.unsubscribeFromService(serviceId); // Calls the store action to update the state
};

const open = (service: any) => {
  // Add navigation logic to open service details
};
</script>
  
  
  <template>
  <!-- <div class="flex flex-col justify-between mt-3 text-left"> -->
  <div>
    <div
      class="mt-3 mx-2 px-2 bg-white rounded-md flex items-center justify-between border border-gray-50 focus:ring-2 focus:ring-red-500"
    >
      <input
        type="text"
        placeholder="Search Subscribed Services"
        class="text-sm border-none outline-none bg-white"
      />
      <i class="fas fa-search py-2 cursor-pointer text-gray-500 text-lg"></i>
    </div>
    <hr class="mt-3 text-gray-100" />
    <!-- </div> -->

    <!-- Scrollable container for the list -->
    <div class="max-h-[70vh] overflow-y-auto mt-3 mx-2">
      <div
        v-for="(subscribedService, id) in store.subscribedServices"
        :key="id"
        class="list-none flex justify-between mx-3 py-2"
      >
        <span
          class="hover:underline cursor-pointer font-semibold text-gray-700"
          @click="open(subscribedService)"
        >
          {{ subscribedService.name }}
        </span>

        <!-- Unsubscribe button -->
        <button
          class="text-xs rounded-md p-1 font-semibold text-black-600 bg-gray-100 border border-gray-200 hover:text-red-700 hover:bg-red-300"
          @click="unsubscribe(subscribedService.id)"
        >
          Unsubscribe
        </button>
      </div>
    </div>
  </div>
</template>
 