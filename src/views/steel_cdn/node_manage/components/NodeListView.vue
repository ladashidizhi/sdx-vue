<template>
  <div class="container">
    <div class="leftItme">
      <a-space direction="vertical" style="margin-top: 10px;">
        <a-typography-text style="margin-left: 15px;">目录：{{path}}</a-typography-text>
        <a-button-group size="mini">
          <a-button style="width: 75px;">
            <template #icon>
              <icon-reply />
            </template>
            上一级
          </a-button>
          <a-button style="width: 75px;">
            <template #icon>
              <icon-refresh />
            </template>刷新
          </a-button>
          <a-button style="width: 75px;">
            <template #icon>
              <icon-plus />
            </template>新建
          </a-button>
          <a-button style="width: 75px;">
            <template #icon>
              <icon-search />
            </template>搜索
          </a-button>
        </a-button-group>
      </a-space>
      <a-scrollbar type="track" style="height:730px;width:300px;overflow: auto;">
        <a-tree
          :data="treeData"
          block-node
          @select="onSelect"
          :default-expand-all="false"
          v-model:expanded-keys="expanded_keys"
          class="treeItem"
        >
          <template #title="node">
            <a-tooltip :content="node.title" position="top">
              <div
                @dblclick="openfile(record)"
                :style="{color:isColor(node.key),backgroundColor:(indexKey==node.key)?'#fad013':''}"
              >{{node.title}}</div>
            </a-tooltip>
          </template>
          <template #icon="node">
            <icon-font v-if="!(node.isLeaf)" type="icon-weibiaoti-_huabanfuben" :size="18" />
            <icon-font v-else type="icon-HTML" :size="18" />
          </template>
        </a-tree>
      </a-scrollbar>
    </div>

    <div class="rightItme">
      <a-tabs
        v-model:active-key="active_key"
        type="card"
        :editable="true"
        @add="handleAdd"
        @delete="handleDelete"
        @change="onChange"
        auto-switch
        justify
      >
        <a-tab-pane v-for="(item,index) of data" :key="index" :title="item.title">
          <div style="height:100%;">
            <code-view ref="codeview" :theme="1" :fontSize="20"></code-view>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import CodeView from "@/components/CodeView.vue";
import { Icon } from "@arco-design/web-vue";
import { useUsersStore } from "@/store/user.js";

const IconFont = Icon.addFromIconFontCn({
  src:
    import.meta.env.MODE === "development"
      ? "/public/iconfont.js"
      : `/iconfont.js?version=${import.meta.env.VITE_APP_VERSION}`,
});
let count = 5;

export default {
  components: { CodeView, IconFont },
  setup() {
    const treeData = [
      {
        title: "download",
        key: "0-0",
        children: [
          {
            title: "chao",
            key: "0-0-0",
            children: [],
          },
          {
            title: "sha",
            key: "0-0-1",
            children: [
              {
                title: "bi",
                key: "0-0-1-0",
              },
            ],
          },
        ],
      },
      {
        title: "static",
        key: "0-1",
        children: [
          {
            title: "nijiama",
            key: "0-1-0",
            children: [
              {
                title: "shabi",
                key: "0-1-0-0",
              },
              {
                title:
                  "dashabisdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdf",
                key: "0-1-0-1",
              },
            ],
          },
          {
            title: "laibi",
            key: "0-1-1",
            children: [
              {
                title: "chao",
                key: "0-1-1-0",
              },
              {
                title: "ni",
                key: "0-1-1-2",
              },
            ],
          },
        ],
      },
      {
        title: "niff",
        key: "0-2",
      },
      {
        title: "nidd",
        key: "0-3",
      },
      {
        title: "niaa",
        key: "0-4",
      },
      {
        title: "niss",
        key: "0-5",
      },
      {
        title: "nibb",
        key: "0-6",
      },
      {
        title: "nibb",
        key: "0-7",
      },
      {
        title: "nibb",
        key: "0-8",
      },
      {
        title: "nibb",
        key: "0-9",
      },
      {
        title: "nibb",
        key: "0-10",
      },
      {
        title: "nibb",
        key: "0-11",
      },
      {
        title: "nibb",
        key: "0-12",
      },
      {
        title: "nibb",
        key: "0-13",
      },
    ];
    const data = ref([]);

    const handleAdd = () => {
      const number = count++;
      data.value = data.value.concat({
        key: `${number}`,
        title: `New Tab ${number}`,
        content: `Content of New Tab Panel ${number}`,
      });
    };

    return {
      data,
      handleAdd,
      treeData,
      path: ref("/www/www/root"),
      keyList: ref([]),
      selected_keys: ref([]),
      expanded_keys: ref([]),
      active_key: ref(0),
      indexKey: ref(""),
      userStore: useUsersStore(),
    };
  },
  methods: {
    isColor(key) {
      let name = "#000";
      if (this.userStore.darkMode) {
        name = "#ffffff";
      }
      this.selected_keys.forEach((e) => {
        if (e === key) {
          name = "#0059ff";
        }
      });
      return name;
    },
    handleDelete(key) {
      this.data.splice(Number(key), 1);
      console.log(
        this.indexKey === this.selected_keys[key],
        this.indexKey,
        this.selected_keys[key]
      );
      if (this.indexKey === this.selected_keys[key]) {
        this.indexKey = "";
      }
      this.selected_keys.splice(Number(key), 1);
    },
    onSelect(key, model) {
      if (typeof model.node.children === "undefined") {
        this.indexKey = model.node.key;
        let type = true;
        if (this.data.length > 0) {
          this.data.forEach((e, index) => {
            if (model.node.key === e.key) {
              this.active_key = index;
              type = false;
            }
          });
        }
        if (type) {
          this.data.push({
            key: model.node.key,
            title: model.node.title,
            content: "Content of Tab Panel 4",
          });
          this.active_key = this.data.length - 1;
          this.selected_keys.push(model.node.key);
        }
      } else {
        let type = true;
        if (this.expanded_keys.length > 0) {
          this.expanded_keys.forEach((e) => {
            if (e === model.node.key) {
              type = false;
            }
          });
        }
        if (type) {
          this.expanded_keys.push(model.node.key);
        } else {
          let index = this.expanded_keys.indexOf(model.node.key);
          if (index !== -1) {
            this.expanded_keys.splice(index, 1);
          }
        }
      }
    },
    onChange(e) {
      this.active_key = e;
      this.indexKey = this.selected_keys[e];
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  .leftItme {
    width: 300px;
  }
  .rightItme {
    width: calc(100% - 300px);
  }
}
.treeItem {
  width: 280px;
  cursor: pointer;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>