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


// Import the agent domain components
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
import ApiServices from "@/agentdomain/apiservices/Services.vue";

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
    path: "/agent",
    name: "app-home2",
    component: AgentLayout,
    meta: { requiresAuth: true },
    redirect: "/agent/services",
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
      { name: "api-services", path: "/agent/api-services", component: ApiServices },
      { name: "service-details", path: "/service/:id", component: AgentAppServicesDetails },
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
