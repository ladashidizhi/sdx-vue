<template>
  <div class="hosts">
    <div class="item" @click="collapse=!collapse">
      <h3>{{ hostInfo.addr }}</h3>
      <h2
        :style="{'color': ['','#67C23A', '#E6A23C', '#F56C6C'][hostInfo.hostStatus]}"
      >{{ hostInfo.name }}</h2>
	  <span class="icon-arrow">
		  <icon-down v-if="collapse" />
		  <icon-up v-else />
	  </span>
    </div>
    <div
      class="list"
      :style="{width: windowWidth+'px', height: (collapse ? 0 : widthHeight / 2)+'px', opacity: collapse ? 0 : 1, zIndex: collapse ? 0:1000}"
    >
      <div class="list_content">
        <div class="form">
          <a-input :style="{width:'500px'}" placeholder="请输入主机IP" allow-clear v-model="hostName" />
          <span class="icon" @click.stop="collapse=true">
            <icon-close />
          </span>
        </div>
        <a-scrollbar style="height:100%;overflow: auto;margin-top: 20px;">
          <div class="hosts_addr" v-if="(searching ? hostFindResult : hostList).length > 0">
            <div
              class="host_item"
              v-for="item,index in (searching ? hostFindResult : hostList)"
              :key="index"
              :title="item.name+'\n'+item.host"
              @click="updateHost(item, index)"
              :style="{'background-color': (selectIndex === index ? '#5aaafb' : '')}"
            >
              <h3>{{ item.addr }}</h3>
              <h2>{{ item.name }}</h2>
              <div class="icon" :style="getStyle(item.host_status)"></div>
            </div>
          </div>
          <a-empty v-else />
        </a-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { GetHostList } from "@/api/hosts";
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/store/user.js";

export default {
  setup() {
    const { host } = storeToRefs(useUsersStore());
    const { hostId } = storeToRefs(useUsersStore());
    const { webSiteHostId } = storeToRefs(useUsersStore());
    const hostInfo = ref({
      id: host.value.id,
      name: host.value.name,
      addr: host.value.addr,
      status: 0,
      hostStatus: host.value.hostStatus,
    });

    let windowWidth = ref(window.document.documentElement.offsetWidth),
      widthHeight = window.document.documentElement.offsetHeight;
    widthHeight = widthHeight < 900 ? ref(934) : ref(widthHeight);
    return {
      host,
      hostList: ref([]),
      searching: ref(false),
      hostName: ref(""),
      hostFindResult: reactive([]),
      hostInfo,
      windowWidth,
      widthHeight,
      collapse: ref(true),
      selectIndex: ref(-1),
      eventId: null,
      hostId,
      webSiteHostId,
      eventHsotAdd: null,
    };
  },
  methods: {
    async hostPage(page = 1, pageSize = 200) {
      const result = await GetHostList(null, page, pageSize);
      this.hostList.map((i) => {
        i.host_status = 0;
        return i;
      });
      this.hostList = result.data.items;
    },
    search() {
      if (this.hostName.length === 0) {
        this.$message.error("请输入正确的主机IP");
        return;
      }
    },
    getStyle(status) {
      switch (status) {
        case 0:
          return {};
        case 1:
          return {
            "background-color": "#67C23A",
            "box-shadow": "0 0 20px #67C23A",
          };
        case 2:
          return {
            "background-color": "#E6A23C",
            "box-shadow": "0 0 20px #E6A23C",
          };
        case 3:
          return {
            "background-color": "#F56C6C",
            "box-shadow": "0 0 20px #F56C6C",
          };
      }
    },
    updateHost(item, idx) {
      let type = false;
      if (this.hostInfo.id !== item.id) {
        type = true;
      }
      this.hostInfo.id = item.id;
      this.hostInfo.name = item.name;
      this.hostInfo.addr = item.addr;
      this.hostInfo.hostStatus = item.host_status;
      this.selectIndex = idx;
      this.$emit("updateHost", item);
      this.hostId = item.id;
      if (type) {
        this.collapse = !this.collapse;
        this.$notification.warning({
          title: "已切换到新主机",
          content: `${item.name} - ${item.addr}`,
          closable: true,
          style: { width: "500px" },
          duration: 3000,
        });
        type = false;
      }
    },
    statusChanger(fn, data) {
      this.hostList.forEach((i) => {
        if (i.id === data.id) {
          i.host_status = data.status;
        }
      });
      return fn(data);
    },
    shHost(item, idx) {
      this.webSiteHostId = 0;
      if (this.hostInfo.id !== item.id) {
        this.$notification.warning({
          title: "已切换到新主机",
          content: `${item.name} - ${item.addr}`,
          closable: true,
          style: { width: "500px" },
          duration: 3000,
        });
      }

      this.hostInfo.id = item.id;
      this.hostInfo.name = item.name;
      this.hostInfo.addr = item.addr;
      this.hostInfo.hostStatus = item.host_status;
      this.selectIndex = idx;
      this.$emit("updateHost", item);
    },
    async onwatch(id) {
      this.hostList = [];
      await this.hostPage();
      this.hostList.forEach((e, index) => {
        if (e.id === id) {
          this.shHost(e, index);
        }
      });
    },
  },
  async created() {
    await this.hostPage();
    if (this.host.id) {
      this.$emit("updateHost", this.host);
    } else if (this.hostList.length > 0) {
      this.hostInfo.id = this.hostList[0].id;
      this.hostInfo.name = this.hostList[0].name;
      this.hostInfo.addr = this.hostList[0].addr;
      this.hostInfo.hostStatus = this.hostList[0].host_status;
      this.$emit("updateHost", this.hostList[0]);
    }
    // 注册Host Status 更新事件
    this.eventId = this.$event.addEventListener(
      "ws_host_status",
      this.statusChanger
    );
  },
  mounted() {
    this.eventHsotAdd = this.$event.addEventListener("host_add", () => {
      this.hostList = [];
      this.hostPage();
    });
    window.addEventListener("resize", () => {
      this.windowWidth = window.document.documentElement.offsetWidth;
      this.widthHeight = window.document.documentElement.offsetHeight;
      this.widthHeight = this.widthHeight < 900 ? 934 : this.widthHeight;
    });
  },
  unmounted() {
    this.$event.removeEventListener(this.eventId);
    this.$event.removeEventListener(this.eventId);
  },
  watch: {
    hostName(val) {
      this.searching = val.length > 0;
      this.hostFindResult.splice(0, this.hostFindResult.length);
      this.hostList.forEach((item) => {
        if (item.addr.indexOf(val) > -1 || item.name.indexOf(val) > -1) {
          this.hostFindResult.push(reactive(item));
        }
      });
    },
    webSiteHostId: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val > 0) {
          this.onwatch(val);
        }
      },
    },
  },
};
</script>


<style lang="scss" scoped>
.hosts {
  width: 100%;
  height: 100%;
  position: relative;

  .item {
    width: calc(100% - 20px);
    height: calc(100% - 10px);
    margin: 0 auto;
    cursor: pointer;
    line-height: 30px;
	border-bottom: 1px solid var(--app-stroke);
	border-right: 1px solid var(--app-stroke);
	backdrop-filter: blur(10px);
	color: var(--p2);
	padding: 10px 0 0 20px;
	text-align: left;
	line-height: 22px;

    h3 {
      color: var(--color-text-1);
      font-size: 18px;
    }
    
    h2 {
      color: var(--color-text-3);
      font-size: 12px;
      text-align: left;
    }
	
	.icon-arrow {
		position: absolute;
		right: 20px;
		top: 20px;
		font-size: 20px;
	}
  }

  .list {
    z-index: 999;
    overflow: hidden;
    box-sizing: border-box;
    position: absolute;
    top: 100%;
    height: 0px;
    opacity: 0;
    transition: all 0.5s ease-in-out;
	background: linear-gradient(180deg, var(--app-panel), var(--app-panel2));
	border-bottom: 1px solid var(--app-stroke);
	backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));

    .list_content {
      padding: 15px;
		transition: all 0.5s ease-in-out;
		background: linear-gradient(180deg, var(--app-panel), var(--app-panel2));
		backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-sat));
    }

    .form {
      width: 100%;
      display: flex;
      justify-content: space-between;

      .icon {
        cursor: pointer;
        font-size: 20px;
        color: var(--color-theme-TextColor);
        margin-right: 50px;
        transition: all 0.3s;

        &:hover {
          color: rgb(60, 126, 255);
          transform: scale(1.3);
        }
      }
    }

    .hosts_addr {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      max-height: 385px;
      box-sizing: border-box;
      padding: 10px;

      .host_item {
        width: 140px;
        height: 50px;
        box-sizing: border-box;
        margin-right: 24px;
        margin-bottom: 24px;
        cursor: pointer;
        border-radius: 12px;
        transition: all 0.3s;
        position: relative;
		color: var(--app-text) !important;
		border-color: rgba(var(--app-accent), .40) !important;
		background: linear-gradient(180deg, rgba(var(--app-accent), .38), rgba(var(--app-accent), .16)) !important;
		box-shadow: var(--sel-glow) !important;
		filter: saturate(1.18) brightness(1.10);
		padding: 10px 0 0 20px;
		text-align: left;
		line-height: 18px;

        &:hover {
          background-color: #5aaafb;
          transform: scale(1.1);
        }

		h3 {
		  color: var(--color-text-1);
		  font-size: 14px;
		}
		
		h2 {
		  color: var(--color-text-3);
		  font-size: 12px;
		  text-align: left;
		}

        .icon {
          width: 10px;
          height: 10px;
          position: absolute;
          top: 3px;
          right: 5px;
          border-radius: 50%;
          transform: all 0.5s;
        }
      }
    }
  }

  // &:hover{
  //     .list{
  //         height: 300px;
  //         opacity: 1;
  //     }
  // }
}
</style>
