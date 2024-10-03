import { createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const Top = () => import("@/components/page/Top.vue");

const routes = [
  {
    path: "/",
    name: "top",
    component: Top,
  },
  {
    path: "/home",
    name: "home",
    component: Top,
  },
  {
    path: "/:cacheAll(.*)*",
    redirect: { name: "top" },
  },
];

const router = createRouter({
  mode: 'history',
  history: createWebHistory(),
  //createWebHashHistory(),
  routes,
  force: true,
  linkExactActiveClass: "text-yellow-500",
});

export default router;
