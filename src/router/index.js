import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: "/",
        redirect: "/home",
        meta:{
            index: 0
        }
    }, {
        path: "/login",
        name: "Login",
        component: () => import("@/views/login.vue"),
        meta:{
            index: 1
        }
    }, {
        name: "Home",
        path: "/home",
        component: () => import("@/views/home.vue"),
        meta:{
            index: 2
        }
    }]

export default createRouter({
    history: createWebHistory(),
    routes
})