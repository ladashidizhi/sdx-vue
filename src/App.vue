<template>
  <transition 
    :name="transitionName" 
    :duration="550" 
    appear 
    mode="out-in"> 
    <router-view></router-view>
  </transition>
</template>

<script>
import { ref } from 'vue';

export default {
  setup(){
    const transitionName = ref('fade-left')
    return { transitionName }
  },
  mounted(){
    window.document.body.setAttribute('arco-theme', 'dark')
  },
  watch: {//使用watch 监听$router的变化
    $route(to, from) {
     //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if(to.meta.index > from.meta.index || !from.meta.index){
        this.transitionName = 'fade-right'
      //设置动画名称
      }else{
        this.transitionName = 'fade-left'
      }
    }
  }
}
</script>

<style lang="scss">
*{
  margin: 0;
  padding: 0;
}

html, body, #content {
  width: 100%;
  height: 100%;
}

#content{
  overflow: hidden;
}

#nprogress .bar {
  background: linear-gradient(to right, #d31146, rgb(255, 150, 38)) !important; //进度条颜色
}

.fade-left-enter-active,
.fade-left-leave-active,
.fade-right-enter-active,
.fade-right-leave-active {
  transition: all 0.5s ease;
}

.fade-right-enter-from,
.fade-right-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.fade-left-enter-from,
.fade-left-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

.arco-message-list{
  left:0;
}


body[arco-theme='dark']{
  --color-menu-dark-bg: red !important;
  --color-menu-light-bg: #293348 !important;
}

</style>