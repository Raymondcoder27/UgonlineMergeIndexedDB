<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import FloatLedgers from "@/domain/billing/FloatLedgers.vue";
import FloatManagement from "@/domain/billing/FloatAllocation.vue";
import Transactions from "@/domain/billing/Transactions.vue";
import FloatRequests from "@/domain/billing/FloatRequests.vue";
import { useBalance } from "@/domain/balance/stores";

import HomeTab from "@/domain/dashboard/components/HomeTab.vue";
import UserStatistics from "@/domain/analytics/views/UserStatistics.vue";
import ProviderStatistics from "@/domain/analytics/views/ProviderStatistics.vue";
import ServicesStatistics from "@/domain/analytics/views/ServicesStatistics.vue";
import RevenueStatistics from "@/domain/analytics/views/RevenueStatistics.vue";
// Call the fetch function on mounted
const balanceStore = useBalance();

balanceStore.fetchTotalBalance();



const totalBalance = balanceStore.totalBalance;

const activeTab: Ref<string> = ref("services");

function select(tab: string) {
  activeTab.value = tab;
}

onMounted(async () => {
  await balanceStore.fetchTotalBalance();
  // console.log("Balance after fetching:", balanceStore.totalBalance); // Debugging
  // forceUpdate.value += 1; // Trigger re-render
  console.log("Balance after fetching:", balanceStore.totalBalance);
});
</script>
<template>
    <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
      <!-- Tabs -->
      <div class="flex border-b">
        <!-- Services Tab -->
        <div
          :class="activeTab == 'services' ? 'tab-active' : 'tab'"
          @click="select('services')"
          class="cursor-pointer flex items-center justify-center flex-grow text-sm hover:bg-gray-100"
        >
          <!-- <i class="fa-solid fa-concierge-bell mr-2"></i> -->
          <i class="fa-solid fa-cogs mr-2"></i>
          <span>Services</span>
          <p class="text-xl font-bold mt-1">23</p>
        </div>
  
        <!-- Branches Tab -->
        <div
          :class="activeTab == 'branches' ? 'tab-active' : 'tab'"
          @click="select('branches')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-building mr-2"></i>
          <span>Branches</span>
          <p class="text-xl font-bold mt-1">4</p>
        </div>
  
        <!-- Tills Tab -->
        <!-- <div
          :class="activeTab == 'tills' ? 'tab-active' : 'tab'"
          @click="select('tills')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-cash-register mr-2"></i>
          <span>Tills</span>
          <p class="text-xl font-bold mt-1">19</p>
        </div> -->
  
        <!-- Users Tab -->
        <div
          :class="activeTab == 'users' ? 'tab-active' : 'tab'"
          @click="select('users')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-users mr-2"></i>
          <span>Users</span>
          <p class="text-xl font-bold mt-1">2</p>
        </div>
  
        <!-- Providers Tab -->
        <!-- <div
          :class="activeTab == 'providers' ? 'tab-active' : 'tab'"
          @click="select('providers')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-handshake mr-2"></i>
          <span>Providers</span>
          <p class="text-xl font-bold mt-1">3</p>
        </div> -->
  
        <!-- Revenue Tab -->
        <div
          :class="activeTab == 'revenue' ? 'tab-active' : 'tab'"
          @click="select('revenue')"
          class="cursor-pointer flex items-center justify-center flex-grow p-2 text-sm hover:bg-gray-100"
        >
          <i class="fa-solid fa-coins mr-2"></i>
          <span>Finances</span>
          <!-- <p class="text-xl font-bold mt-1">41</p> -->
        </div>
      </div>
  
      <!-- Tab Content -->
      <div class="flex flex-grow overflow-y-auto">
        <div class="w-full h-full">
          <HomeTab v-if="activeTab == 'hometab'" />
          <UserStatistics v-if="activeTab == 'users'" />
          <ProviderStatistics v-if="activeTab == 'providers'" />
          <ServicesStatistics v-if="activeTab == 'services'"/>
          <RevenueStatistics v-if="activeTab == 'revenue'" />
        </div>
      </div>
    </div>
  </template>

<style scoped>
.tab-active{
  @apply flex border-2 border-primary-700 cursor-pointer bg-primary text-white font-bold rounded-t-md;
}

.tab{
  @apply flex border border-gray-50 cursor-pointer;
}

.tab:hover{
  @apply bg-primary text-white;
}
</style>