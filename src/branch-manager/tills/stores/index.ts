import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import api from "@/config/api";
import type { Till } from "@/branch-manager/tills/types"; // Assuming you have a Till type
import type { AssignManager } from "@/types";

export const useBranchStore = defineStore("useBranch", () => {

  // Dummy data for testing purposes
  const dummyTills: Branch[] = [
    { id: 1, name: "Till 1", location: "Location 1", manager: "", status: "Active" },
    { id: 2, name: "Till 2", location: "Location 2", manager: "", status: "Inactive" },
    { id: 3, name: "Till 3", location: "Location 3", manager: "", status: "Active" },
    { id: 4, name: "Till 4", location: "Location 4", manager: "", status: "Inactive" },
    { id: 5, name: "Till 5", location: "Location 5", manager: "", status: "Active" },
    { id: 6, name: "Till 6", location: "Location 6", manager: "", status: "Inactive" },
    { id: 7, name: "Till 7", location: "Location 7", manager: "", status: "Active" },
    { id: 8, name: "Till 8", location: "Location 8", manager: "", status: "Inactive" },
    { id: 9, name: "Till 9", location: "Location 9", manager: "", status: "Active" },
    { id: 10, name: "Till 10", location: "Location 10", manager: "", status: "Inactive" },
    { id: 11, name: "Till 11", location: "Location 11", manager: "", status: "Active" },
  ];

  // Add new Till to the store
  // const addTill= (newTill: Branch) => {
  //   tills.value.push(newTill);
  // };

  // const addTill= (newTill: Branch) => {
  //   tills.value.push(newTill); // Directly add the Till to the array
  // };

  // const allocateManager = (payload: AllocateManager) => {
  //   managerAllocations.value.push({
  //     id: managerAllocations.value.length + 1,
  //     dateAssigned: new Date().toISOString(),
  //     branch: payload.branchId,
  //     manager: payload.managerId,
  //     status: "Assigned"
  //   });

  // state variables
  const tills: Ref<Till[] | undefined> = ref(dummyTills);
  const branch: Ref<Till | undefined> = ref();
  const isLoading: Ref<boolean> = ref(false);
  const managerAssignments: Ref<AssignManager[]> = ref([]);

  const addTill= (newTill: Branch) => {
    tills.value?.push({
      id: tills.value?.length + 1,
      name: newTill.name,
      location: newTill.location,
      status: newTill.status,
    })

    // allocate Till manager
    // const manager = branchManagers.value.find((manager) => manager.id === newTill.managerId);
    // if (manager) {
    //   manager.Till = newTill.id;
    // }
  }

  // const allocateManager = (payload: AllocateManager) => {
  //   const branchToUpdate = tills.value?.find(till = > branch.id === payload.branchId);
  //   if (branchToUpdate) {
  //     branchToUpdate.manager = payload.managerId;
  //   } else {
  //     console.warn(`Till with ID ${payload.branchId} not found.`);
  //   }
  // };

  const assignManager = (payload: AssignManager) => {
    const branchToUpdate = tills.value?.find(till = > branch.id === payload.branchId);
    if (branchToUpdate) {
      branchToUpdate.manager = payload.managerId;
    } else {
      console.warn(`Till with ID ${payload.branchId} not found.`);
    }
  };
  
  // push new assigned manager managerAccounts array
  // const assignManager = (payload: AssignManager) => {
  //   managerAssignments.value.push({
  //     branchId: payload.branchId,
  //     managerId: payload.managerId,
  //   });
  // }

  //update managerAccounts array with this new manager
  // const assignManager = (payload: AssignManager) => {
  //   managerAccounts


   // Delete Till from the store
  //  const deleteTill = (branchId: string) => {
  //   tills.value = tills.value?.filter((branch) => branch.id !== branchId); // Remove the Till by ID
  // };


  const deleteTill = (branchId: string) => {
    tills.value = tills.value?.filter((b) => b.id !== branchId); 
  }

  // const service = subscribedServices.value?.find((s) => s.id === serviceId);
  // if (service) {
  //   service.status = "listed";
  //   services.value?.push(service);
  //   subscribedServices.value = subscribedServices.value?.filter((s) => s.id !== serviceId);
  // }

  
  
  
  

  async function fetchTills(filter: any) {
    // isLoading.value = true;
    // try {
      // Uncomment the following line to fetch data from the API once ready
      // const { data } = await api.get(`/tills?page=${page}&limit=${limit}`);
      
      // For now, use the dummy data for testing
      tills.value = dummyTills; // Use dummy data for testing

      // Uncomment below to assign the API data when it's available
      // tills.value = data;
    // } catch (error) {
      // console.error(error);
      // throw error;
    // } finally {
      // isLoading.value = false;
    // }
  }

  return {
    tills,
    branch,
    managerAssignments,
    fetchTills,
    assignManager,
    addBranch,
    deleteBranch,
  };
});
