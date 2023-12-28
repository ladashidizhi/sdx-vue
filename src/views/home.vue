<template>
   <!-- <web-ssh :wegGL="true"></web-ssh> -->
    <!-- <code-view 
      v-model="code"
      :theme="1"
      :language="'nginx'"
    ></code-view> -->
  <div class="content">
    <div class="title">
      <div class="host_list">
        <host-list :hostList="hostList" @updateHost="updateHost"></host-list>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue'
// import WebSsh from "@/components/SSH.vue"
// import CodeView from "@/components/CodeView.vue"
import HostList from '@/views/home/components/HostList.vue'

export default {
    name: "Login",
    components:{
      HostList,
      // CodeView
        // WebSsh
    },
    setup(){
      return {
        hostList: reactive([
          {
            id: 1,
            name: "123客户机1",
            host: "192.168.50.71",
            status: 0
          },
          {
            id: 2,
            name: "789客户机2",
            host: "192.168.50.72",
            status: 1
          },
          {
            id: 3,
            name: "测试客户机3",
            host: "192.168.60.73",
            status: 2
          },
          {
            id: 4,
            name: "测试客户机4",
            host: "192.168.40.74",
            status: 0
          },
          {
            id: 5,
            name: "测试客户机5",
            host: "192.168.20.75",
            status: 1
          },
          {
            id: 6,
            name: "测试客户机6",
            host: "192.168.30.76",
            status: 2
          }
        ])
      }
    },
    methods:{
      updateHost(host){
        console.log(host)
      }
    },
    mounted(){
    },
    watch:{
      code(val){
        console.log(val)
      }
    }
}
</script>

<style lang="scss" scoped>
.content{ 
    width: 100%;
    height: 100%;
    border: 1px solid red;

    .title{
      width: 100%;
      height: 60px;
      border: 1px solid red;
      background-color: #5aaafb;

      .host_list{
        width: 20%;
        min-width: 100px;
        border: 1px solid red;
        height: 100%;
      }
    }
}
</style>