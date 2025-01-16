import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import { db } from "@/utils/db"; // Adjust the path to your IndexedDB utility
import type { Branch } from "@/domain/branches/types";
import type { AssignManager } from "@/types";

export const useBranchStore = defineStore("useBranch", () => {
  const branches: Ref<Branch[]> = ref([]);
  const branch: Ref<Branch | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);
  const managerAssignments: Ref<AssignManager[]> = ref([]);

  // Fetch branches from IndexedDB
  const fetchBranches = async (): Promise<void> => {
    isLoading.value = true;
    try {
      const storedBranches = await db.getAll<Branch>();
      branches.value = storedBranches || [];
    } catch (error) {
      console.error("Error fetching branches:", error);
    } finally {
      isLoading.value = false;
    }
  };

  // Add a new branch to IndexedDB and the store
  const addBranch = async (newBranch: Omit<Branch, "id">): Promise<void> => {
    try {
      const id = branches.value.length ? branches.value[branches.value.length - 1].id + 1 : 1;
      const branchWithId: Branch = { ...newBranch, id };
      await db.set(id, branchWithId);
      branches.value.push(branchWithId);
    } catch (error) {
      console.error("Error adding branch:", error);
    }
  };

  // Assign a manager to a branch and update in IndexedDB
  const assignManager = async (payload: AssignManager): Promise<void> => {
    try {
      const branchToUpdate = branches.value.find(branch => branch.id === payload.branchId);
      if (branchToUpdate) {
        branchToUpdate.manager = payload.managerId;
        await db.set(branchToUpdate.id, branchToUpdate); // Update in IndexedDB
      } else {
        console.warn(`Branch with ID ${payload.branchId} not found.`);
      }
    } catch (error) {
      console.error("Error assigning manager:", error);
    }
  };

  // Delete a branch from IndexedDB and the store
  const deleteBranch = async (branchId: number): Promise<void> => {
    try {
      await db.del(branchId); // Remove from IndexedDB
      branches.value = branches.value.filter(branch => branch.id !== branchId);
    } catch (error) {
      console.error("Error deleting branch:", error);
    }
  };

  return {
    branches,
    branch,
    managerAssignments,
    fetchBranches,
    addBranch,
    assignManager,
    deleteBranch,
  };
});
