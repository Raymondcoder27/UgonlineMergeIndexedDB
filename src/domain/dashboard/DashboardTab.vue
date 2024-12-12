<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import FloatLedgers from "@/domain/billing/FloatLedgers.vue";
import FloatManagement from "@/domain/billing/FloatManagement.vue";
import Transactions from "@/domain/billing/Transactions.vue";
import FloatRequests from "@/domain/billing/FloatRequests.vue";
import { useBalance } from "@/domain/balance/stores";

import HomeTab from "@/domain/dashboard/components/HomeTab.vue";
import UserStatistics from "@/domain/analytics/views/UserStatistics.vue";
import ProviderStatistics from "@/domain/analytics/views/ProviderStatistics.vue";
import ServicesStatistics from "@/domain/analytics/views/ServicesStatistics.vue";
import RevenueStatistics from "@/domain/analytics/views/RevenueStatistics.vue";
// Call the fetch function on mounted
onMounted(async () => {
  await balanceStore.fetchTotalBalance();
  // console.log("Balance after fetching:", balanceStore.totalBalance); // Debugging
  // forceUpdate.value += 1; // Trigger re-render
  console.log("Balance after fetching:", balanceStore.totalBalance);
});

const balanceStore = useBalance();

balanceStore.fetchTotalBalance();

const totalBalance = balanceStore.totalBalance;

const activeTab: Ref<string> = ref("hometab");

function select(tab: string) {
  activeTab.value = tab;
}
</script>

<template>
  <div class="flex flex-col w-full shadow-lg bg-white rounded p-2 h-full">
    <div class="flex pt-5">
      <div
        :class="activeTab == 'hometab' ? 'w-2/12 tab-active' : 'w-2/12 tab'"
        @click="select('hometab')"
      >
        Services
      </div>
      <div
        :class="activeTab == 'branches' ? 'w-1/12 tab-active' : 'w-1/12 tab'"
        @click="select('branches')"
      >
        Branches
      </div>
      <div
        :class="activeTab == 'tills' ? 'w-2/12 tab-active' : 'w-2/12 tab'"
        @click="select('tills')"
      >
        Tills
      </div>
      <div
        :class="activeTab == 'accounts' ? 'w-2/12 tab-active' : 'w-2/12 tab'"
        @click="select('accounts')"
      >
        Accounts
      </div>
      <div
        :class="activeTab == 'finances' ? 'w-2/12 tab-active' : 'w-2/12 tab'"
        @click="select('finances')"
      >
        Finances
      </div>
      <div
        :class="activeTab == 'users' ? 'tab-active' : 'tab'"
        @click="select('users')"
      >
        <div class="w-full py-1">
          <label class="p-3">Users</label>
          <i
            class="fa-solid fa-chart-area float-right px-2 py-1"
            v-if="activeTab == 'users'"
          ></i>
        </div>
      </div>

      <div :class="(activeTab == 'providers') ? 'tab-active' : 'tab'" @click="select('providers')">
          <div class="w-full py-1 my-auto">
            <label class="p-3">Providers</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'providers'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'services') ? 'tab-active' : 'tab'" @click="select('services')">
          <div class="w-full py-1">
            <label class="p-3">Services Registry</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'services'"></i>
          </div>
        </div>
        <div :class="(activeTab == 'revenue') ? 'tab-active' : 'tab'" @click="select('revenue')">
          <div class="w-full py-1">
            <label class="p-3">Revenue</label>
            <i class="fa-solid fa-chart-area float-right px-2 py-1" v-if="activeTab == 'revenue'"></i>
          </div>
        </div>
    </div>
    <div class="flex flex-grow">
      <div class="w-full">
        <!-- <BackofficeAccounts v-if="activeTab == 'backoffice'" />
        <UserAccounts v-if="activeTab == 'users'" /> -->
        <HomeTab v-if="activeTab == 'hometab'" />
        <UserStatistics v-if="activeTab == 'users'" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/forms.css";
@import "@/assets/styles/button.css";
@import "@/assets/styles/table.css";
@import "@/assets/styles/widgets.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}

.tab {
  @apply cursor-pointer p-2 border-b border-gray-300 text-sm text-center;
}

.tab-active {
  @apply cursor-pointer p-2 border-b-4 border-primary-700 text-sm text-center;
}
</style>
