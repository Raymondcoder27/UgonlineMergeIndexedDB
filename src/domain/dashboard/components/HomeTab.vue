<div class="grid grid-cols-4 gap-3 py-2">
    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">79</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalServiceSubscriptions }}</p>
        <!-- <p class="text-xl font-bold py-2">{{ servicesStore.servicesSubscribed?.length || 0 }}</p> -->
        <p class="text-xs">Service Subscriptions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBranches }}</p>

        <p class="text-xs">Branches</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">3</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ accountStore.branchManagers.length }}</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBranchManagers }}</p>
        <p class="text-xs">Branch Managers</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">17</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBackOfficeAccounts }}</p>
        <p class="text-xs">BackOffice Accounts</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2" style="font-size: 30px;">17</p>
        <!-- <p class="text-xl font-bold py-2">{{ store.tills }}</p> -->
        <p class="text-xs">Tills</p>
      </div>
    </div>

    <!-- <div class="w-full">
      <div class="w-12/12 count">
        <p class="text-xl font-bold py-2">17</p>
        <p class="text-xs">Agents</p>
      </div>
    </div> -->

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">4</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.floatRequests.length }}</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ pendingFloatRequests }}</p>
        <p class="text-xs">Pending Float Requests</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">123</p> -->
        <!-- <p class="text-xl font-bold py-2">{{ billingStore.serviceTransactions.length }}</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalTransactions }}</p>
        <p class="text-xs">Service Transactions</p>
      </div>
    </div>

    <div class="w-full">
      <div class="w-12/12 count">
        <!-- <p class="text-xl font-bold py-2">130,400,000/=</p> -->
        <!-- <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBalance.current}}/=</p> -->
        <p class="text-xl font-bold py-2" style="font-size: 30px;">{{ totalBalance.current.toLocaleString() }}/=</p>
        
        <p class="text-xs">Balance</p>
      </div>
    </div>
  </div>