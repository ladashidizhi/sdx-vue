<template>
  <div class="content">
    <!-- <web-ssh :wegGL="true"></web-ssh> -->
    <code-view 
      v-model="code"
      :theme="1"
      :language="'nginx'"
    ></code-view>
  </div>
</template>

<script>
// import WebSsh from "@/components/SSH.vue"
import CodeView from "@/components/CodeView.vue"

export default {
    name: "Login",
    components:{
      CodeView
        // WebSsh
    },
    data(){
      return {
        code: ""
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
}
</style>