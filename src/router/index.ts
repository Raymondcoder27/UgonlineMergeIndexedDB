import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";
import MainLayout from "@/layouts/MainLayout.vue";
import AppDashboard from "../domain/dashboard/AppDashboard.vue";
import AppEntities from "../domain/entities/AppEntities.vue";
import AppAgents from "../domain/agents/AppAgents.vue";
import AppGateway from "../domain/gateway/AppGateway.vue";
import Finances from "@/domain/finances/Finances.vue";
import Services from "@/domain/services/AppServices.vue";
import ServicesDetails from "@/domain/servicesdetails/ServicesDetails.vue";
import Accounts from "@/domain/accounts/Accounts.vue";
import Branches from "../domain/branches/AppBranches.vue";
import DataAnalytics from "@/domain/analytics/DataAnalytics.vue";
import Settings from "@/domain/settings/Settings.vue";
import { routes as authRoutes } from "@/domain/auth/routes";
import { useAuth } from "@/domain/auth/composables";
import moment from "moment";
import DashboardTab from "@/domain/dashboard/DashboardTab.vue";


// Import the branch manager domain components
import BranchManagerLayout from "@/layouts/BranchManagerLayout.vue";
import BranchManagerAppServices from "@/branch-manager/services/AppServices.vue";
import BranchManagerAppEntities from "@/branch-manager/entities/AppEntities.vue";
import BranchManagerAppAgents from "@/branch-manager/agents/AppAgents.vue";
// import BranchManagerBranches from "@/branch-manager/tills/Tills.vue";
import BranchManagerSettings from "@/branch-manager/settings/Settings.vue";
// import BranchManagerLedger from "@/branch-manager/ledger/Ledger.vue";
import BranchManagerServicesDetails from "@/branch-manager/servicesdetails/ServicesDetails.vue";
import BranchManagerAppGateway from "@/branch-manager/gateway/AppGateway.vue";
import BranchManagerAppFinances from "@/branch-manager/finances/Finances.vue";
import BranchManagerTills from "@/branch-manager/tills/Tills.vue";
import BranchManagerAccounts from "@/branch-manager/accounts/Accounts.vue";
import BranchManagerDataAnalytics from "@/branch-manager/analytics/DataAnalytics.vue";
import BranchManagerDashboardTab from "@/branch-manager/dashboard/DashboardTab.vue"
// import BranchManagerSubmissions from "@/branch-manager/submissions/Submissions.vue";
// import BranchManagerAppServicesDetails from "@/branch-manager/apiservices/views/ServiceDetails.vue";


// Import the agent domain components
import FormComposer from "@/agentdomain/composer/FormComposer.vue";
import FormPreview from "@/agentdomain/composer/FormPreview.vue";
import ComposerLayout from "@/layouts/ComposerLayout.vue";
import AgentLayout from "@/layouts/AgentLayout.vue";
import AgentAppServices from "@/agentdomain/services/AppServices.vue";
import AgentAppServicesDetails from "@/agentdomain/apiservices/views/ServiceDetails.vue";
import AgentAppEntities from "@/agentdomain/entities/AppEntities.vue";
import AgentAppAgents from "@/agentdomain/agents/AppAgents.vue";
import AgentBranches from "@/agentdomain/branches/AppBranches.vue";
import AgentSettings from "@/agentdomain/settings/Settings.vue";
import AgentLedger from "@/agentdomain/ledger/Ledger.vue";
import AgentSubmissions from "@/agentdomain/submissions/Submissions.vue";
import AgentServicesDetails from "@/agentdomain/servicesdetails/ServicesDetails.vue";
import AgentAppGateway from "@/agentdomain/gateway/AppGateway.vue";
import AgentAppFinances from "@/agentdomain/finances/AppFinances.vue";
// import ApiServices from "@/agentdomain/apiservices/Services.vue";
import ApiServices from "@/agentdomain/apiservices/Services2.vue";
import ApiSubmissions from "@/agentdomain/apisubmissions/ServiceApplications.vue";


// Merge appRoutes and appRoutes2
const mergedRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: { name: "app-home" },
  },
  {
    path: "/agent-admin",
    name: "app-home",
    component: MainLayout,
    // meta: { requiresAuth: false },
    meta: { requiresAuth: true },
    redirect: "/agent-admin/dashboard",
    children: [
      // { name: "app-dashboard", path: "/agent-admin/dashboard", component: AppDashboard },
      { name: "app-dashboard", path: "/agent-admin/dashboard", component: DashboardTab },
      { name: "app-entities", path: "/agent-admin/entities", component: AppEntities },
      { name: "app-agents", path: "/agent-admin/agents", component: AppAgents },
      { name: "app-services", path: "/agent-admin/services", component: Services },
      { name: "app-branches", path: "/agent-admin/branches", component: Branches },
      { name: "app-accounts", path: "/agent-admin/accounts", component: Accounts },
      { name: "app-configurations", path: "/agent-admin/configurations", component: Settings },
      { name: "app-reports", path: "/agent-admin/data-analytics", component: DataAnalytics },
      { name: "app-services-details", path: "/agent-admin/services-details", component: ServicesDetails },
      { name: "app-billing", path: "/agent-admin/billing", component: Finances },
      { name: "app-gateway", path: "/agent-admin/gateway", component: AppGateway },
    ],
  },
  {
    path: "/branch-manager",
    name: "branch-manager-home",
    component: BranchManagerLayout,
    meta: { requiresAuth: true },
    // redirect: "/agent/services",
    redirect: "/branch-manager/dashboard",
    children: [
      { name: "branch-manager-app-dashboard", path: "/branch-manager/dashboard", component: BranchManagerDashboardTab },
      { name: "branch-manager-app-services", path: "/branch-manager/app-services", component: BranchManagerAppServices },
      { name: "branch-manager-app-entities", path: "/branch-manager/entities", component:BranchManagerAppEntities },
      { name: "branch-manager-app-agents", path: "/branch-manager/agents", component:BranchManagerAppAgents },
      { name: "branch-manager-app-branches", path: "/branch-manager/branches", component:BranchManagerTills },
      { name: "branch-manager-app-configurations", path: "/branch-manager/configurations", component:BranchManagerSettings },
      // { name: "branchmanager-app-ledger", path: "/branch-manager/ledger", component:BranchManagerLedger },
      { name: "branch-manager-app-services-details", path: "/branch-manager/services-details", component:BranchManagerServicesDetails },
      { name: "branch-manager-app-finances", path: "/branch-manager/finances", component:BranchManagerAppFinances },
      { name: "branch-manager-app-gateway", path: "/branch-manager/gateway", component:BranchManagerAppGateway },
      { name: "branch-manager-app-tills", path: "/branch-manager/tills", component:BranchManagerTills },
//       branch-manager-app-reports
// branch-manager-app-accounts
       { name: "branch-manager-app-reports", path: "/branch-manager/data-analytics", component: BranchManagerDataAnalytics },
       { name: "branch-manager-app-accounts", path: "/branch-manager/accounts", component: BranchManagerAccounts },
      // { name: "branchmanager-app-submissions", path: "/branch-manager/submissions", component:BranchManagerSubmissions },
      // { name: "branchmanager-api-app-submissions", path: "/branch-manager/api-submissions", component: ApiSubmissions },
      // { name: "api-services", path: "/branch-manager/api-services", component: ApiServices },
      // { name: "api-service-details", path: "/service/:id", component:BranchManagerAppServicesDetails },
    ],
  },
  {
    path: "/agent",
    name: "app-home2",
    component: AgentLayout,
    meta: { requiresAuth: true },
    // redirect: "/agent/services",
    redirect: "/agent/api-services",
    children: [
      { name: "agent-app-services", path: "/agent/services", component: AgentAppServices },
      { name: "agent-app-entities", path: "/agent/entities", component: AgentAppEntities },
      { name: "agent-app-agents", path: "/agent/agents", component: AgentAppAgents },
      { name: "agent-app-branches", path: "/agent/branches", component: AgentBranches },
      { name: "agent-app-configurations", path: "/agent/configurations", component: AgentSettings },
      { name: "agent-app-ledger", path: "/agent/ledger", component: AgentLedger },
      { name: "agent-app-services-details", path: "/agent/services-details", component: AgentServicesDetails },
      { name: "agent-app-finances", path: "/agent/finances", component: AgentAppFinances },
      { name: "agent-app-gateway", path: "/agent/gateway", component: AgentAppGateway },
      { name: "agent-app-submissions", path: "/agent/submissions", component: AgentSubmissions },
      { name: "agent-api-app-submissions", path: "/agent/api-submissions", component: ApiSubmissions },
      { name: "api-services", path: "/agent/api-services", component: ApiServices },
      { name: "api-service-details", path: "/service/:id", component: AgentAppServicesDetails },
    ],
  },
  {
    name: "service-details",
    path: "/service/:id",
    component: AgentAppServices,
  },
  {
    name: "provider-details",
    path: "/provider/:id",
    component: AgentAppEntities,
  },
  {
    name: "form-composer",
    path: "/composer",
    component: ComposerLayout,
    meta: { requiresAuth: true },
    children: [
      {
        name: "form-builder",
        path: "/composer/service/:id/specification",
        component: FormComposer
      },
      {
        name: "form-previewer",
        path: "/composer/service/preview/:id/specification",
        component: FormPreview
      },
    ]
  },
  ...authRoutes, // Include your auth routes
];

// Create a single router instance with the merged routes
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: mergedRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: "smooth" };
    }
  },
});

// Global route guard
router.beforeEach((to, from, next) => {
  const { credentials, refreshToken } = useAuth();

  if (to.meta.requiresAuth) {
    if (!credentials.value || !refreshToken.value || refreshToken.value.exp < moment().unix()) {
      next({ name: "app-account-sign-in" });
    } else {
      next();
    }
  } else if (to.name === "app-account-sign-in" && credentials.value && refreshToken.value) {
    next({ name: "app-home" });
  } else {
    next();
  }
});

export default router;
