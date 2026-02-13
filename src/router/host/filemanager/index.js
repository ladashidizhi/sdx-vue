export default [
    {
        path: "/home/filemanager",
        name: "filemanager",
        component: ()=>import("@/views/filemanager/index.vue"),
        meta: {
            cm: 3,
            pm: 4,
          },
    }
]