<template>
  <!-- <web-ssh :wegGL="true"></web-ssh> -->
  <!-- <code-view 
      v-model="code"
      :theme="1"
      :language="'nginx'"
  ></code-view>-->
  <div class="content">
    <div class="title">
      <div class="host_list">
        <host-list :hostList="hostList" @updateHost="updateHost"></host-list>
      </div>
      <div class="child_menu">
        <a-menu mode="horizontal" :default-selected-keys="['1']">
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">站点管理</a-menu-item>
          <a-menu-item key="3">效果分析</a-menu-item>
          <a-menu-item key="4">克隆配置</a-menu-item>
        </a-menu>
      </div>
      <div style="width: 320px;">
        <a-input :style="{width:'320px'}" placeholder="搜索:站点、服务器" :size="size" allow-clear />
      </div>
      <div class="options">
        <div class="icon">
          <a-tooltip content="消息盒子" position="bottom">
            <icon-message />
          </a-tooltip>
        </div>
        <div class="icon">
          <a-tooltip content="任务队列" position="bottom">
            <icon-settings />
          </a-tooltip>
        </div>
        <div class="user">
          <div class="user_icon" :style="{backgroundImage:`url(${userIcon})`}"></div>
          <h4>超级管理员</h4>
        </div>
      </div>
    </div>
    <div class="work_space">
      <div class="menu" :style="{width: width}">
        <a-menu
          showCollapseButton
          :collapsed-width="58"
          :style="{ height: '100%' }"
          @collapse="(collapse)=>this.width=collapse?'58px':'200px'"
          @menu-item-click="jumpPage"
        >
          <a-menu-item key="0">
            <template #icon>
              <icon-thunderbolt size="25" />
            </template>
            闪电侠
          </a-menu-item>
          <a-menu-item key="1">
            <template #icon>
              <icon-safe size="25" />
            </template>
            钢铁侠
          </a-menu-item>
          <a-menu-item key="2">
            <template #icon>
              <icon-computer size="25" />
            </template>
            站长统计
          </a-menu-item>
          <a-menu-item key="3">
            <template #icon>
              <icon-folder-add size="25" />
            </template>
            文件管理
          </a-menu-item>
          <a-menu-item key="4">
            <template #icon>
              <icon-lock size="25" />
            </template>
            证书管理
          </a-menu-item>
          <a-menu-item key="5">
            <template #icon>
              <icon-command size="25" />
            </template>
            WebSSH
          </a-menu-item>
        </a-menu>
      </div>
      <div class="work_staging" :style="{width: `calc(100% - ${width})`}">
        <KeepAlive>
          <router-view></router-view>
        </KeepAlive>
      </div>
    </div>
  </div>
</template>

<script>
// import WebSsh from "@/components/SSH.vue"
// import CodeView from "@/components/CodeView.vue"
import { reactive, ref } from "vue";
import HostList from "@/views/home/components/HostList.vue";
import userIcon from "@/assets/home/user_default.png";

export default {
  name: "Login",
  components: {
    HostList,
    // CodeView
    // WebSsh
  },
  setup() {
    return {
      hostList: reactive([
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
        {
          id: 1,
          name: "123客户机1",
          host: "192.168.50.71",
          status: 0,
        },
        {
          id: 2,
          name: "789客户机2",
          host: "192.168.50.72",
          status: 1,
        },
        {
          id: 3,
          name: "测试客户机3",
          host: "192.168.60.73",
          status: 2,
        },
        {
          id: 4,
          name: "测试客户机4",
          host: "192.168.40.74",
          status: 0,
        },
        {
          id: 5,
          name: "测试客户机5",
          host: "192.168.20.75",
          status: 1,
        },
        {
          id: 6,
          name: "测试客户机6",
          host: "192.168.30.76",
          status: 2,
        },
      ]),

      width: ref("200px"),
      userIcon: ref(userIcon),
    };
  },
  methods: {
    updateHost(host) {
      console.log(host);
    },
    jumpPage(key) {
      let path = "";
      switch (Number(key)) {
        case 0:
          path = "/home/extract";
          break;
        case 5:
          path = "/home/ssh";
          break;
      }
      this.$router.push(path);
    },
  },
  mounted() {},
  watch: {
    code(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: 60px;
    background-color: var(--color-menu-light-bg);
    display: flex;
    align-items: center;
    position: relative;

    .host_list {
      width: 200px;
      min-width: 100px;
      height: 100%;
    }

    .child_menu {
      width: 700px;
    }

    .options {
      position: absolute;
      right: 20px;
      width: calc(100% - 200px - 1700px);
      height: 100%;
      display: flex;
      justify-content: right;
      align-items: center;

      .user {
        width: 110px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .user_icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-size: 100% 100%;
        }

        h4 {
          width: 72px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          cursor: pointer;
          color: white;
        }
      }

      .icon {
        color: white;
        font-size: 24px;
        cursor: pointer;
        margin-right: 20px;
        transition: color 0.4s;

        &:hover {
          color: #3c7eff;
        }
      }
    }
  }

  .work_space {
    width: 100%;
    height: calc(100% - 60px);
    display: flex;
    justify-content: space-between;

    .menu {
      height: 100%;
      overflow: hidden;
      background-color: var(--color-menu-light-bg);
      transition: width 0.3s;
      background-repeat: no-repeat;
    }

    .work_staging {
      height: 100%;
      transition: all 0.3s;
    }
  }
}
</style>