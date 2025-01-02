<script setup lang="ts">
import { ref, reactive, defineEmits, onMounted, watch } from "vue";
import { useBranchStore } from "@/domain/branches/stores";
import { useNotificationsStore } from "@/stores/notifications";

const branchStore = useBranchStore();
const notify = useNotificationsStore();

const loading: Ref<boolean> = ref(false);
const selectedBranchId: Ref<string> = ref("");  // ID of the branch to be edited
const branch: Ref<any> = reactive({
  id: "",
  name: "",
  location: "",
  manager: "",
  status: "",
});

const emit = defineEmits(["cancel"]);

// Fetch the branch data from the store
onMounted(async () => {
  loading.value = true;
  
  // Fetch the list of branches
  await branchStore.fetchBranches({});
  
  // Assuming that a selected branch ID is passed to the component (e.g., from a parent component or route)
  const branchId = selectedBranchId.value;  // Set this to the appropriate value
  
  // Get the branch to edit
  const selectedBranch = branchStore.branches.value?.find(b => b.id === Number(branchId));
  if (selectedBranch) {
    branch.value = { ...selectedBranch };  // Clone the branch to avoid mutating the store directly
  }

  loading.value = false;
});

// Handle form submission to save the updated branch
function submit() {
  const payload = {
    id: branch.value.id,
    name: branch.value.name,
    location: branch.value.location,
    manager: branch.value.manager,
    status: branch.value.status,
  };

  // Simulate saving the edited branch (assuming it updates the store)
  // You can implement the actual API call for updating a branch here
  branchStore.addBranch(payload);  // If you were adding a new branch or you can update it via another method
  loading.value = false;

  // Show success notification
  notify.success("Branch edited successfully");
}

// Handle the cancel action
function cancel() {
  emit("cancel");
}

// Edit or update logic for branch attributes (if needed)
function updateField(field: string, value: string) {
  branch.value[field] = value;
}

</script>

<template>
  <div v-if="loading" class="loading">Loading...</div>
  
  <div v-else>
    <h2>Edit Branch</h2>

    <form @submit.prevent="submit">
      <div>
        <label for="name">Branch Name</label>
        <input
          v-model="branch.name"
          type="text"
          id="name"
          required
        />
      </div>

      <div>
        <label for="location">Location</label>
        <input
          v-model="branch.location"
          type="text"
          id="location"
          required
        />
      </div>

      <div>
        <label for="manager">Manager</label>
        <input
          v-model="branch.manager"
          type="text"
          id="manager"
        />
      </div>

      <div>
        <label for="status">Status</label>
        <select v-model="branch.status" id="status" required>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div class="buttons">
        <button type="submit">Save Changes</button>
        <button @click="cancel" type="button">Cancel</button>
      </div>
    </form>
  </div>
</template>



<!-- <template>
  <div class="bg-white py-5">
    <p class="text-xl font-bold"> Edit Branch</p>
    <p class="text-sm text-gray-500" v-if="form.name"> <b>{{form.name}}</b> is public good consumed and/or paid for.</p>
    <form @submit.prevent="submit" class="pt-5">
      <div v-for="(account, idx) in store.managerAccounts" :key="idx">
        <div class="flex">
          <div class="cell-full">
            <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Name</label>
            <input type="text" v-model="form.name" class="noFocus form-element e-input w-full"
                   required />
            {{branch.name}}
          </div>
        </div>

        <div class="flex">
          <div class="cell-full">
            <label class="block uppercase text-neutral-600 text-xs font-bold mb-1">Branch Manager</label>
            <select v-model="form.providerId" class="noFocus form-element e-input w-full">
              <option v-for="(provider, idx) in providerStore.providers" :key="idx" :value="provider.id">{{provider.name}}</option>
            </select>
            {{ account.firstName }} {{ account.lastName }}
          </div>
        </div>
 


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
    </div>
    </form>
  </div>
</template> -->

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