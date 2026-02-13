<template>
  <transition :name="transitionName" :duration="550" appear mode="out-in">
    <div style="height: 100%;width: 100%;">
      <router-view></router-view>
    </div>
  </transition>
</template>

<script>
import { ref } from "vue";
import { CreateNewWebSocket, buildWebSocketUrl } from "@/utils/websocket";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/store/user";

import Notify from "@wcjiang/notify";

import { SendAuth } from "@/api/websocket";

export default {
  setup() {
    const { user } = storeToRefs(useUsersStore());
    const transitionName = ref("fade-left");
    return { transitionName, ws: null, user, cancel: null };
  },
  methods: {
    onopen(ws) {
      // WebSocket连接成功回调
      this.ws = ws;
      // this.$message.success("已成功连接到服务器...")
      SendAuth(ws, this.user.token);
    },
    onclose(e) {
      // WebSocket连接关闭回调
      // console.log(e);
      // this.$message.error("服务器与浏览器断开连接...")
    },
    onerror() {
      // WebSocket连接出错回调
      // this.$message.error("服务器与浏览器链接出现错误...")
    },
    onreconnect(ws) {
      // WebSocket重连事件
      this.ws = ws;
      // this.$message.success("已成功重新连接到服务器...")
      SendAuth(ws, this.user.token);
    },
    onmessage(e) {
      const data = JSON.parse(e.data);
      switch (data.type) {
        case "auth":
        case "error":
          this.$message.error(data.data);
          break;
        case "close":
          this.cancel();
          this.$message.warning(data.data);
          break;
        default:
          this.$event.emit(data.type, data.data);
      }
    },
  },
  mounted() {
    // const notify = new Notify({
    //   effect: "flash",
    //   interval: 500,
    // });
    // notify.notify({
    //   title: "New notice",
    //   body: "Thunder, it’s raining...",
    //   openurl: "https://jaywcjlove.github.io",
    //   onclick: function () {
    //     console.log("on click");
    //   },
    //   onshow: function () {
    //     console.log("on show");
    //   },
    // });
  },
  watch: {
    user: {
      immediate: true,
      handler(val) {
        if (!val) return;
        const url = buildWebSocketUrl("/ws");
        this.cancel = CreateNewWebSocket(url)(
          this.onopen, // 连接成功函数
          this.onreconnect, // 重连成功函数
          this.onclose, // 连接关闭函数
          this.onmessage, // 接收消息函数
          this.onerror // 连接错误函数
        );
      },
    },
    //使用watch 监听$router的变化
    $route(to, from) {
      if (to.path === "/login" && this.cancel) {
        this.cancel();
      }
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      if (to.meta.index > from.meta.index || !from.meta.index) {
        this.transitionName = "fade-right";
        //设置动画名称
      } else {
        this.transitionName = "fade-left";
      }
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}

html,
body,
#content {
  width: 100%;
  height: 100%;
}

#content {
  overflow: hidden;
}

#nprogress .bar {
  background: linear-gradient(
    to right,
    #d31146,
    rgb(255, 150, 38)
  ) !important; //进度条颜色
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

.arco-message-list {
  left: 0;
}
</style>