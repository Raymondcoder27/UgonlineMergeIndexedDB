<script setup lang="ts">
import { onMounted, ref, type Ref } from "vue";
import FloatLedgers from "@/domain/billing/FloatLedgers.vue";
import FloatManagement from "@/domain/billing/FloatManagement.vue";
import Transactions from "@/domain/billing/Transactions.vue";
import FloatRequests from "@/domain/billing/FloatRequests.vue";
import { useBalance } from "@/domain/balance/stores";

import HomeTab from "@/dashboard/components/HomeTab.vue";
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
    <div class="flex">
      <div class="w-full py-1">
        <i
          class="bg-primary-700 border border-primary-800 text-white p-2 rounded-full fa-solid fa-money-bill"
        ></i>
        <label class="text-lg mx-1">Finances</label>
      </div>
      <div class="">
        <span
          class="bg-gray-50 mt-5 mr-3 text-gray-800 font-semibold rounded-md px-1 py-0.5 text-md"
          >{{ totalBalance.current.toLocaleString() }}/=</span
        >
      </div>
    </div>
    <div class="flex pt-5">
      <div
        :class="
          activeTab == 'hometab' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('hometab')"
      >
        Float Allocation
      </div>
      <div
        :class="
          activeTab == 'transactions' ? 'w-1/12 tab-active' : 'w-1/12 tab'
        "
        @click="select('transactions')"
      >
        Transactions
      </div>
      <div
        :class="
          activeTab == 'floatledgers' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('floatledgers')"
      >
        Float Ledger
      </div>
      <div
        :class="
          activeTab == 'floatrequests' ? 'w-2/12 tab-active' : 'w-2/12 tab'
        "
        @click="select('floatrequests')"
      >
        Float Requests
      </div>
    </div>
    <div class="flex flex-grow">
      <div class="w-full">
        <!-- <BackofficeAccounts v-if="activeTab == 'backoffice'" />
        <UserAccounts v-if="activeTab == 'users'" /> -->
        <HomeTab v-if="activeTab == 'hometab'" />
        <FloatManagement v-if="activeTab == 'floatmanagement'" />
        <FloatLedgers v-if="activeTab == 'floatledgers'" />
        <FloatRequests v-if="activeTab == 'floatrequests'" />
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
