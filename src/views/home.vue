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
        <a-tooltip content="点击弹出&关闭服务器列表" position="right" v-model:popup-visible="isPopover">
          <host-list @updateHost="updateHost"></host-list>
        </a-tooltip>
      </div>
      <div class="child_menu">
        <div v-for="(model,index) of menuList" :key="index">
          <a-menu
            mode="horizontal"
            :selected-keys="[$route.meta?.cm?.toString()]"
            @menu-item-click="(e)=>SubPage(e,model)"
            v-if="$route.meta.pm === model.sort"
          >
            <a-menu-item
              v-for="(value) of model.children"
              :key="(value.sort).toString()"
            >{{value.name}}</a-menu-item>
          </a-menu>
        </div>
      </div>

      <div style="width: 280px;margin-left: auto;margin-right: 20px;">
        <a-auto-complete
          :loading="loading"
          v-model="search"
          :data="searchList"
          @search="handleSearch"
          @select="onSelect"
          :style="{width:'280px'}"
          placeholder="搜索:站点、服务器"
          allow-clear
        />
        <!-- <a-input v-model="search" :style="{ width: '320px' }" placeholder="搜索:站点、服务器" /> -->
      </div>
      <div class="options">
        <div class="icon" @click="changeDark">
          <a-tooltip :content="userStore.darkMode ? '明亮模式' : '暗夜模式'" position="bottom">
            <icon-sun-fill v-if="userStore.darkMode" />
            <icon-moon-fill v-else />
          </a-tooltip>
        </div>
        <div class="icon" @click="handleClick">
          <a-tooltip content="消息盒子" position="bottom">
            <icon-message />
          </a-tooltip>
          <div class="msg_cell" v-if="new_msg>0">{{ new_msg }}</div>
        </div>
        <!-- <MessageList :visible="visible" v-model:visible="visible"></MessageList> -->
        <div class="icon" @click="onMandates">
          <a-tooltip content="任务队列" position="bottom">
            <icon-settings />
          </a-tooltip>
        </div>
        <div class="icon">
          <a-popconfirm content="您确定要退出登录！！！" type="error" @ok="onLogoutOk">
            <a-tooltip content="退出登录" position="bottom">
              <icon-export />
            </a-tooltip>
          </a-popconfirm>
        </div>

        <!-- <div class="user">
          <div class="user_icon" :style="{ backgroundImage: `url(${userIcon})` }"></div>
          <h4>{{ userStore.user.user.userName }}</h4>
        </div>-->
      </div>
    </div>
    <div class="work_space">
      <a-tooltip
        content="点击这个按钮弹出菜单"
        position="rb"
        v-model:popup-visible="collspaceToolTip"
        :trigger="'contextMenu'"
      >
        <div
          class="menu"
          :style="{ width: width }"
          @mouseover="CancelCollspaced"
          @mouseout="AutoCollspaced"
        >
          <a-menu
            showCollapseButton
            :collapsed-width="58"
            :style="{ height: '100%' }"
            :selected-keys="[$route.meta?.pm?.toString()]"
            @collapse="(collapse) => (this.width = collapse ? '58px' : '200px')"
            @menu-item-click="jumpPage"
            v-model:collapsed="collapsed"
          >
            <a-menu-item v-for="(value,index) of menuList" :key="(menuList[index].sort).toString()">
              <template #icon>
                <component :is="value.icon" size="25" />
              </template>
              <span v-if="menuList[index].sort===8">{{ userStore.user.user.userName }}</span>
              <span v-else>{{ value.name }}</span>
            </a-menu-item>
            <div class="user"></div>
          </a-menu>
        </div>
      </a-tooltip>
      <div
        v-if="$route.meta?.pm!==0"
        class="work_staging"
        :style="{ width: `calc(100% - ${width})` }"
      >
        <router-view />
      </div>
      <div v-else class="work_staging" :style="{ width: `calc(100% - ${width})` }">
        <LeadPage />
      </div>
      <div v-for="(_, index) in paramsArr" :key="index">
        <SendMsg v-model:params="paramsArr[index]"></SendMsg>
      </div>
    </div>
  </div>
  <a-modal
    :visible="visible"
    title="订阅消息"
    :width="1200"
    draggable
    :mask-closable="false"
    @cancel="()=>{visible = false}"
    @ok="()=>{visible = false}"
  >
    <MessageList></MessageList>
  </a-modal>
  <a-modal
    :visible="isMandates"
    title="任务管理器"
    :width="1400"
    draggable
    :mask-closable="false"
    @cancel="()=>{isMandates = false}"
    @ok="()=>{isMandates = false}"
  >
    <MandatesView v-if="isMandates"></MandatesView>
  </a-modal>
</template>

<script>
// import {IconRepeat} from '@arco-iconbox/vue-fire-engine/esm/index';
// import WebSsh from "@/components/SSH.vue"
// import CodeView from "@/components/CodeView.vue"

import { reactive, ref } from "vue";
import HostList from "@/views/home/components/HostList.vue";
import userIcon from "@/assets/home/user_default.png";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/store/user.js";
import { GetClientLinkCount } from "@/api/home/index.js";
import MessageList from "@/views/message/components/MessageList.vue";
import MandatesView from "@/views/mandates/index.vue";
import SendMsg from "@/views/message/components/SendMsg.vue";
import FireWall from "@/views/fire_wall/components/FireWall.vue";
import LeadPage from "@/views/lead_page/index.vue";
import { getWebSite } from "@/api/site/index";
import { GetTree } from "@/api/personal/index.js";
export default {
  name: "Login",
  components: {
    HostList,
    MessageList,
    SendMsg,
    FireWall,
    LeadPage,
    MandatesView,
  },
  setup() {
    const visible = ref(false);
    const idMsg = ref(0);

    const notifiType = ref();
    const titleSend = ref(0);
    const contentSend = ref();
    const sendType = ref(0);
    const params = reactive({
      id: 0,
      notifiType: 0,
      sendType: 0,
      contentSend: "",
      titleSend: "",
    });
    const paramsArr = reactive([]);

    const handleSetParamsArr = (ss) => {
      paramsArr.push(JSON.stringify(ss));
    };

    const { search } = storeToRefs(useUsersStore());
    const { webSiteHostId } = storeToRefs(useUsersStore());

    const clearnSetParamsArr = () => {
      // 使用 splice 方法清空数组
      paramsArr.splice(0, paramsArr.length);
    };
    return {
      eventId: null,
      collspaceTimer: null,
      visible,
      isMandates: ref(false),
      width: ref("200px"),
      userIcon: ref(userIcon),
      userStore: useUsersStore(),
      collapsed: ref(false),
      collspaceToolTip: ref(false),
      new_msg: ref(0),
      notifiType,
      titleSend,
      contentSend,
      idMsg,
      search,
      url: ref(""),
      sendType,
      params,
      paramsArr,
      handleSetParamsArr,
      clearnSetParamsArr,
      searchList: ref([]),
      loading: ref(false),
      isPopover: ref(false),
      siteList: ref([]), ///站点列表
      webSiteHostId, ///点击搜索的站点的客户机Id
      menuList: ref([]),
    };
  },
  mounted() {
    this.MenuData();
    this.AutoCollspaced();
    this.fetchBaseData();
  },
  methods: {
    CancelCollspaced() {
      // 取消折叠菜单
      clearTimeout(this.collspaceTimer);
    },
    AutoCollspaced() {
      // 自动折叠菜单
      // this.collspaceTimer = setTimeout(() => {
      //   this.width = "58px";
      //   this.collapsed = true;
      //   this.collspaceToolTip = true;
      //   this.isPopover = true;
      //   setTimeout(() => {
      //     this.collspaceToolTip = false;
      //     this.isPopover = false;
      //   }, 3000);
      // }, 3000);
    },
    ///首页数据初始化
    async fetchBaseData() {
      try {
        const response = await GetClientLinkCount();
        const new_msgs = response.data.total;
        if (new_msgs > 99) {
          this.new_msg = 99;
        }
      } catch (e) {
        this.$message.error(e.msg);
      }
    },
    updateHost(host) {
      this.userStore.$patch((state) => {
        state.host.id = host.id;
        state.host.name = host.name;
        state.host.addr = host.addr;
        state.host.hostStatus = host.host_status;
        state.hasChanged = true;
      });
    },
    ///权限列表
    async MenuData() {
      const response = await GetTree(this.userStore.user.user.id);
      if (response.code === 0) {
        this.menuList = response.data;
        this.menuList = this.menuList.filter((item) => item.id !== 1);
        this.menuList.forEach((e) => {
          // 已移除：站点转移菜单现在由后端数据库统一管理
          // if (e.name === "服务器") {
          //   e.children.push({
          //     activeMenu: null,
          //     alwaysShow: 2,
          //     breadcrumb: 1,
          //     children: [],
          //     component: "",
          //     createdAt: "2024-04-02T16:14:10-04:00",
          //     creator: "admin",
          //     hidden: 2,
          //     icon: "",
          //     id: 26,
          //     name: "站点转移",
          //     noCache: 2,
          //     parentId: 22,
          //     path: "/home/transfer",
          //     redirect: null,
          //     roles: null,
          //     sort: 4,
          //     status: 1,
          //     title: "站点转移",
          //     updatedAt: "2024-04-29T06:21:13-04:00",
          //   });
          // }
          if (e.name === "闪电侠") {
            e.children.unshift({
              activeMenu: null,
              alwaysShow: 2,
              breadcrumb: 1,
              children: [],
              component: "",
              createdAt: "2024-04-02T16:14:10-04:00",
              creator: "admin",
              hidden: 2,
              icon: "",
              id: 26,
              name: "首页",
              noCache: 2,
              parentId: 22,
              path: "/home/extract",
              redirect: null,
              roles: null,
              sort: 1,
              status: 1,
              title: "首页",
              updatedAt: "2024-04-29T06:21:13-04:00",
            });
            e.children.forEach((e, index) => {
              e.sort = index + 1;
            });
          }
        });
        let list = [];
        this.menuList.forEach((e) => {
          if (e.children.length > 0) {
            // 有子菜单时，先添加父菜单路径（用于路由守卫检查）
            if (e.path) {
              list.push(e.path);
            }
            // 然后添加所有子菜单的路径
            e.children.forEach((a) => {
              if (a.path) {
              list.push(a.path);
              }
            });
          } else if (e.path) {
            // 没有子菜单时，添加菜单自身的路径
            list.push(e.path);
          }
        });
        // this.menuList=this.menuList.filter(e => e.name !== "闪电侠");
        this.menuList=this.menuList.filter(e => e.name !== "站长助手");
        
        this.userStore.setPath(list);
      }
    },
    ///导航功能栏，key等于router 里的cm值，所以e.sort值要一一对应cm值 一般不用图标
    ///子集菜单
    SubPage(key, model) {
      let path = "";
      model.children.forEach((e) => {
        if (e.sort === Number(key)) {
          path = e.path;
        }
      });
      this.$router.push({
        path,
      });
    },
    ///侧边功能栏，key等于router 里的pm值，所以e.sort值要一一对应pm值
    jumpPage(key) {
      let path = "";
      this.menuList.forEach((e) => {
        if (Number(key) === e.sort) {
          if (e.children.length > 0) {
            // 如果有子菜单，跳转到第一个子菜单的路径
            path = e.children[0].path;
          } else if (e.path) {
            // 如果没有子菜单，但有 path，直接跳转到菜单的路径
            path = e.path;
          }
        }
      });
      if (path) {
        this.$router.push(path);
      }
    },
    changeDark() {
      this.userStore.$patch({
        darkMode: !this.userStore.darkMode,
        name: "darkMode",
      });
      window.document.body.setAttribute(
        "arco-theme",
        this.userStore.darkMode ? "dark" : "light"
      );
    },
    handleClick() {
      this.visible = true;
    },
    onMandates() {
      this.isMandates = true;
    },
    onLogoutOk() {
      localStorage.clear();
      this.$message.success("账户退出成功");
      window.location.href = "/login";
    },

    handleSearch(value) {
      let timer = null;
      if (value.length > 0) {
        clearTimeout(timer);
        timer = setTimeout(() => {
          // 触发搜索操作
          this.fetchData(value);
        }, 300); // 设置延迟时间为300毫秒
      } else {
        this.searchList = [];
      }
    },
    onSelect(val) {
      this.$router.push("/home/site");
      this.siteList.forEach((e) => {
        if (val === e.domain) {
          this.webSiteHostId = e.webSiteHostId;
        }
      });
    },
    async fetchData(domain) {
      this.loading = true;
      let siteList = [];
      const data = {
        hostId: 0,
        pageSize: 100000,
        page: 1,
        tag: "",
        domain: domain,
      };
      const response = await getWebSite(data);
      if (response.data.items !== null) {
        let list = response.data.items;
        this.siteList = list;
        list.forEach((e) => {
          siteList.push(e.domain);
        });
      } else {
        siteList = [];
        this.siteList = [];
      }
      this.searchList = siteList;
      this.loading = false;
    },
  },
  created() {
    window.document.body.setAttribute(
      "arco-theme",
      this.userStore.darkMode ? "dark" : "light"
    );
    this.eventId = this.$event.addEventListener(
      "ws_message_box",
      (fn, data) => {
        this.clearnSetParamsArr();
        this.params.id = data.id;
        this.params.notifiType = data.important;
        this.params.titleSend = data.important;
        this.params.contentSend = data.content;
        if (data.is_station) {
          this.params.sendType = 1;
          this.handleSetParamsArr(this.params);
        }
        if (data.is_browser) {
          this.params.sendType = 2;
          this.handleSetParamsArr(this.params);
        }
        fn(data);
      }
    );
  },
  beforeUnmount() {
    this.$event.removeEventListener("ws_message_box", this.eventId);
  },
  watch: {
    code(val) {},
  },
};
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  .title {
    width: 100%;
    height: var(--hTop);
       background: radial-gradient(520px 160px at 20% 0%, rgba(var(--app-accent), .14), transparent 55%), linear-gradient(180deg,
    color-mix(in srgb, var(--app-panel2) 78%, transparent 22%),
    color-mix(in srgb, var(--app-panel) 74%, transparent 26%)) !important;
    border-bottom: 1px solid var(--app-stroke);
    backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
    display: flex;
    align-items: center;
    position: relative;
	z-index: 999;

    .host_list {
      width: 200px;
      min-width: 100px;
      position: relative;
      height: 100%;
      // border-right: 1px solid rgba(255, 255, 255, .10);

      .line {
        position: absolute;
        right: 0;
        top: calc(50% - 30%);
        height: 60%;
        width: 1px;
        background-color: var(--color-neutral-3);
      }
    }

    .child_menu {
      width: 700px;
    }

    .options {
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
          color: var(--color-text-2);
        }
      }

      .icon {
        color: var(--color-text-2);
        font-size: 24px;
        cursor: pointer;
        margin-right: 20px;
        transition: color 0.4s;
        position: relative;

        .msg_cell {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background-color: #f56c6c;
          color: white;
          line-height: 16px;
          text-align: center;
          position: absolute;
          font-size: 10px;
          top: 0px;
          right: -4px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          user-select: none;
        }

        &:hover {
          color: #3c7eff;
        }
      }
    }
  }
  .work_space {
    width: 100%;
    height: calc(100% - var(--hTop));
    background: transparent;
    display: flex;
    justify-content: space-between;

    .menu {
      height: 100%;
      overflow: hidden;
      border-right: 1px solid var(--app-stroke);
      backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
      transition: width 0.3s;
      background-repeat: no-repeat;
    }

    .work_staging {
      height: 100%;
      transition: all 0.3s;
      background: transparent;
    }
  }
}
</style>