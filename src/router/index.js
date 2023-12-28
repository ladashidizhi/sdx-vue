import { createRouter, createWebHistory } from 'vue-router'

const result = []
const modules = import.meta.glob('./**/*.js', { eager: true })
for(let name in modules){
    result.push(...modules[name].default)
}

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
        children:result,
        meta:{
            index: 2
        }
    }]

export default createRouter({
    history: createWebHistory(),
    routes
})