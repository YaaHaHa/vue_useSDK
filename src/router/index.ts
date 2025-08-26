import { createWebHashHistory, createRouter } from "vue-router";

const routes = [
  { path: "/throwerror", component: () => import("../views/throwError.vue") },
  { path: "/showerror", component: () => import("../views/showError.vue") },
  //   { path: "/about", component: AboutView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
