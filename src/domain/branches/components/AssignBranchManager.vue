<script setup lang="ts">
import { onMounted, reactive, ref, computed, defineProps, type Ref } from "vue";
import { useBranchStore } from "@/domain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";
import type { ApiError } from "@/types";
import { defineEmits } from "vue";
import { useAccounts } from "@/domain/accounts/stores";

const branchStore = useBranchStore();
const store = useAccounts();
const loading: Ref<boolean> = ref(false);
const notify = useNotificationsStore();

// type BranchForm = {
//   branchId: string;
//   name: string;
// };

// Define props
const { branchId } = defineProps({
  branchId: {
    type: String,
    required: true,
  },
});


const emit = defineEmits(["cancel", "managerAssigned"]);

onMounted(() => {
  loading.value = true;
  store.fetchBackofficeAccounts();
  branchStore.fetchBranches().finally(() => (loading.value = false));

});

function submit(userId: string) {
  let payload = {
    // userId: form.userId,
    userId: userId,
    branchId: branchId,
  };
  loading.value = true;
  store.assignManager(payload.userId, payload.branchId);
  // store.assignManager(userId); 
  // notify.success(`User successfully ${payload.userId} assigned to branch`);
  notify.success(`User successfully assigned to branch`);
  emit("managerAssigned");
  loading.value = false;
}


// Search and filter functionality
const searchQuery = ref("");
const filteredManagers = computed(() => {
  if (!searchQuery.value.trim()) {
    return branchStore.managers; // Assuming managers are loaded into branchStore
  }
  return branchStore.managers.filter((manager) =>
    `${manager.firstName} ${manager.lastName}`
      .toLowerCase()
      .includes(searchQuery.value.trim().toLowerCase())
  );
});
</script>

<template>
  <!-- <div class="bg-white py-5">
    <p class="text-xl font-bold">Assign Manager</p>
    <p class="text-sm text-gray-500">
        The individual responsible for overseeing branch operations, managing staff, and ensuring smooth service delivery to agents and the public.
    </p>

    <form @submit.prevent="submit" class="pt-5">
        <select
          v-model="form.managerId"
          class="noFocus form-element e-input w-full"
        >
          <option :value="null">-- Select Manager --</option>
          <option
            v-for="(account, idx) in store.backofficeAccounts"
            :key="idx"
            :value="account.managerId"
          >
            {{ account.firstName }} {{ account.lastName }}
          </option>
        </select>
        <div class="flex my-2 py-5">
        <div class="w-6/12 px-1">
          <button class="button-outline" type="button" @click="emit('cancel')">
            <i class="fa-solid fa-ban"></i> Cancel
          </button>
        </div>
        <div class="w-6/12 px-1">
          <button class="button" type="submit">
            <i class="fa-solid fa-hand-pointer"></i> Submit
          </button>
        </div>
      </div>
    </form>
  </div> -->


  <div class="bg-white p-6 rounded-lg">
    <p class="text-xl font-bold mb-2">Assign Manager</p>
    <p class="text-sm text-gray-500 mb-4">
      Select a manager from the table to assign them to a branch.
    </p>

    <!-- Search Box -->
    <div class="mb-4">
      <input
        type="text"
        v-model="searchQuery"
        class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
        placeholder="Search managers by name..."
      />
    </div>

    <!-- Manager Table -->
    <div class="overflow-x-auto my-1">
      <table class="table min-w-full bg-white border border-gray-200 rounded-lg">
        <thead>
          <tr class="header-tr border-b">
            <th class="px-4 py-2 text-left text-sm font-medium">Name</th>
            <th class="px-4 py-2 text-left text-sm font-medium">Email</th>
            <th class="px-4 py-2 text-left text-sm font-medium">Phone</th>
            <th class="px-4 py-2 text-center text-sm font-medium"></th>
          </tr>
        </thead>
        <tbody>
          <!-- Loading Indicator -->
          <tr v-if="loading">
            <td colspan="4" class="px-4 py-4 text-center">
              <div class="animate-pulse bg-blue-300 h-4 w-full rounded"></div>
            </td>
          </tr>

          <!-- Managers List -->
          <!-- <tr
            v-for="manager in filteredManagers"
            :key="manager.id"
            class="border-b hover:bg-gray-50"
          > -->
          <!-- <tr
            v-for="manager in store.backofficeAccounts"
            :key="manager.id"
            class="text-xs body-tr border-b"
          > -->
          <tr
            v-for="(user) in store.backofficeAccounts"
            :key="user.id"
            class="text-xs body-tr border-b"
          >
            <td class="px-4 py-2">
              {{ user.firstName }} {{ user.lastName }}
            </td>
            <td class="px-4 py-2">{{ user.email }}</td>
            <td class="px-4 py-2">{{ user.phone }}</td>
            <td class="px-4 py-2 text-center">
              <button
                @click="submit(user.id)"
                :disabled="loading"
                class="button btn-sm disabled:bg-gray-300"
              >
              <i class="px-1 fa-solid fa-plus"></i> Assign
              </button>
            </td>
          </tr>

          <!-- No Results Found -->
          <!-- <tr v-if="!filteredManagers.length && !loading">
            <td colspan="4" class="px-4 py-4 text-center text-gray-500">
              No managers found
            </td>
          </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
@import "@/assets/styles/button.css";
@import "@/assets/styles/forms.css";
@import "@/assets/styles/ring.css";
@import "@/assets/styles/ripple.css";

.cell {
  @apply w-6/12 px-1 my-2;
}

.cell-full {
  @apply w-full px-1 my-2;
}
</style>
