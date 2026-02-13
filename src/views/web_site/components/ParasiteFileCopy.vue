<template>
  <div class="filemanager">
    <div class="background">
       <div class="menus">
        <div class="back_btn" @click="refresh">
          <icon-refresh />
        </div>
        <div class="back_btn" @click="backToRoot">
          <icon-home />
        </div>
        <div class="directory">
          <div class="edit" v-if="editMode">
            <a-input
              size="large"
              v-model="path"
              style="height: 100%"
              ref="pathInput"
              @blur="
                () => {
                  this.editMode = false;
                  this.$forceUpdate();
                }
              "
              @keydown="fastSearch"
            />
          </div>
          <div class="path" @click="changeEditMode" v-else>
            <div
              class="item"
              v-for="(item, index) in path.split('/')"
              :key="index"
            >
              <span class="text" @click="jumpPath($event, index)">
                <icon-home v-if="index === 0" />
                <span v-else>{{ item }}</span>
              </span>
              <span
                class="right"
                v-if="path !== '/' && index < path.split('/').length - 1"
              >
                <icon-right></icon-right>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="files">
        <div class="content" v-if="files">
          <a-table
            :scroll="{ y: '98%', x: '100px' }"
            :pagination="false"
            :columns="columns"
            :data="files"
            :scrollbar="files.length > 0"
            stripe
            hoverable
            :loading="loading"
            show-header
            :row-selection="rowSelection"
            v-model:selectedKeys="selectedKeys"
          >
            <template #name="{ record }">
              <a-dropdown trigger="contextMenu" alignPoint>
               
                <div
                  style="
                    margin-left: 5px;
                    cursor: pointer;
                    vertical-align: middle;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 100%;
                  "
                  @click="enterPath(record)"
                  v-if="record.isDir"
                >
                  <icon-font type="icon-weibiaoti-_huabanfuben" :size="18" />
                  {{ record.name }}
                </div>
                <a-tooltip v-else :content="record.name" position="top">
                  <div
                    style="
                      margin-left: 5px;
                      cursor: pointer;
                      vertical-align: middle;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      overflow: hidden;
                      width: 100%;
                    "
                    @dblclick="openfile(record)"
                  >
                    <icon-font :type="iconType(record.extension)" :size="18" />
                    {{ record.name }}
                  </div>
                </a-tooltip>
              </a-dropdown>
            </template>
            
          </a-table>
        </div>
        <div class="page">
          <a-pagination
            :total="page.total"
            v-model:page-size="page.size"
            show-total
            show-jumper
            show-page-size
            @change="pageChange"
            @page-size-change="pageSizeChange"
          />
        </div>
      </div>
    </div>
    <!-- 文件权限设置弹窗 -->
    <!-- <a-modal
      v-model:visible="visiable.auth"
      @ok="confirmAuth"
      draggable
      width="500px"
    >
      <template #title>设置 {{ authFile.name }} 权限</template>
      <file-auth v-model="authFile.mode" v-model:sub="authFile.sub"></file-auth>
    </a-modal> -->
    <!-- 重命名设置 -->
    <!-- <a-modal
      v-model:visible="visiable.rename"
      title="文件名修改"
      @ok="confirmRename"
    >
      <a-input
        v-model="renameParams.name"
        placeholder="请输入更改的文件名"
        allow-clear
      >
        <template #prefix>
          <icon-file />
        </template>
      </a-input>
    </a-modal> -->
    <!-- 新建文件 -->
    <!-- <a-modal
      v-model:visible="visiable.createFile"
      title="新建文件"
      @ok="confirmCreateFile"
    >
      <a-input
        v-model="createdParams.filename"
        placeholder="请输入新建文件名"
        allow-clear
      >
        <template #prefix>
          <icon-file />
        </template>
      </a-input>
    </a-modal> -->
    <!-- 新建文件夹 -->
    <!-- <a-modal
      v-model:visible="visiable.createFolder"
      title="新建文件夹"
      @ok="confirmCreateFolder"
    >
      <a-input
        v-model="createdParams.foldername"
        placeholder="请输入新建文件夹名称"
        allow-clear
      >
        <template #prefix>
          <icon-folder-add />
        </template>
      </a-input>
    </a-modal> -->
    <!-- 编辑插件 -->
    <!-- <a-modal
      v-model:visible="visiable.edited"
      :title="istitle()"
      width="auto"
      draggable
      okText="保存"
      @ok="saveEditCode(true, listCode[active_key])"
      @cancel="
        () => {
          this.visiable.edited = false;
          this.listCode = [];
          this.expanded_keys = [];
          this.indexKey = 0;
          this.selected_keys = [];
        }
      "
      :on-before-cancel="editorClose"
    >
      <div class="container">
        <a-spin :loading="keylodding" tip="加载中...">
          <div class="leftItme">
            <div
              style="
                border: 1px solid var(--color-fill-4);
                padding: 4px;
                width: calc(100% - 8px);
              "
            >
              <a-space>
                <p style="width: 40px">目录:</p>
                <a-typography-text>{{ path }}</a-typography-text>
              </a-space>
            </div>

           

            <a-scrollbar
              type="track"
              style="height: 670px; width: 300px; overflow: auto"
            >
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
                      :style="{
                        color: isColor(node.key),
                        backgroundColor: indexKey == node.key ? '#fad013' : '',
                      }"
                    >
                      {{ node.title }}
                    </div>
                  </a-tooltip>
                </template>
                <template #icon="e">
                  <icon-font
                    v-if="e.node.isDir"
                    type="icon-weibiaoti-_huabanfuben"
                    :size="18"
                  />
                  <icon-font
                    v-else
                    :type="iconType(e.node.extension)"
                    :size="18"
                  />
                </template>
              </a-tree>
            </a-scrollbar>
          </div>
        </a-spin>

        <div class="rightItme">
          <a-spin
            style="width: 730px; height: 100%"
            :loading="loadingEdit"
            tip="加载中..."
          >
            <a-tabs
              v-model:active-key="active_key"
              type="card"
              :editable="true"
              @delete="handleDelete"
              @change="onChange"
              auto-switch
              justify
            >
              <a-tab-pane
                v-for="(model, index) of listCode"
                :key="index"
                :title="model.name"
              >
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 15px;
                    width: 500px;
                    margin-left: 20px;
                  "
                >
                  <a-button type="primary" @click="saveEditCode(false, model)"
                    >保存</a-button
                  >
                  <a-button
                    type="primary"
                    status="warning"
                    @click="
                      $refs.codeview[index].actionToTrigger('actions.find')
                    "
                    >查找/替换</a-button
                  >
                  <a-button
                    type="dashed"
                    @click="
                      $refs.codeview[index].actionToTrigger(
                        'editor.action.formatDocument'
                      )
                    "
                    >格式化</a-button
                  >
                  <a-button
                    type="primary"
                    @click="
                      $refs.codeview[index].actionToTrigger(
                        'editor.action.gotoLine'
                      )
                    "
                    status="success"
                    >跳转行</a-button
                  >
                  <a-button
                    type="primary"
                    @click="reloadCode(model)"
                    status="danger"
                    >刷新(重新加载)</a-button
                  >
                </div>
                <div style="height: 650px; width: 730px" v-if="isCode">
                  <code-view
                    v-if="isImg(model.language)"
                    ref="codeview"
                    v-model="model.value"
                    :theme="1"
                    :fontSize="20"
                    :language="model.language"
                    @save="(e) => saveEditCode(e, model)"
                  ></code-view>
                  <div
                    v-else
                    style="
                      width: 710px;
                      height: 600px;
                      margin: 10px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <img :src="isImgs(model.value)" alt="图片" />
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </a-spin>
        </div>
      </div>
    </a-modal> -->
    <!-- SSH插件 -->
    <!-- <a-modal
      v-model:visible="visiable.ssh"
      :title="'终端'"
      width="auto"
      hide-cancel
      draggable
    >
      <div style="width: 1200px; height: 600px">
        <ssh-view
          :webGL="true"
          :wsurl="ssh.wsurl"
          :workdir="path"
          v-if="visiable.ssh"
        ></ssh-view>
      </div>
    </a-modal> -->
    <!-- 上传文件 -->
    <!-- <a-modal
      v-model:visible="visiable.upload"
      :title="'文件上传'"
      width="auto"
      hide-cancel
      okText="完成"
      draggable
      :esc-to-close="false"
      :mask-closable="false"
    >
      <div style="width: 889px; overflow: hidden">
        <a-upload
          draggable
          :action="baseUrl + '/files/upload/' + host.id"
          :headers="{ 'x-token': user.token }"
          :data="{ path: path }"
          @success="uploadSuccess"
          @error="uploadError"
        ></a-upload>
      </div>
    </a-modal> -->
    <!-- 压缩文件 -->
    <!-- <a-modal
      v-model:visible="visiable.compress"
      title="文件压缩"
      width="auto"
      draggable
      @ok="confirmCompress"
    >
      <div style="width: 600px; overflow: hidden">
        <a-form :model="compress" :layout="'horizontal'">
          <a-form-item field="name" label="文件名">
            <a-input
              v-model="compress.filename"
              placeholder="请输入需要保存的文件名"
              allow-clear
            >
              <template #append>{{ compress.format }}</template>
            </a-input>
          </a-form-item>
          <a-form-item field="path" label="保存目录">
            <a-input v-model="savepath" placeholder="请输入保存目录" />
            <a-button
              type="primary"
              style="margin-left: 15px"
              @click="selectDir"
              >选择保存目录</a-button
            >
          </a-form-item>
         
          <a-form-item field="replace">
            <a-checkbox v-model="compress.replace">覆盖原有压缩文件</a-checkbox>
          </a-form-item>
        </a-form>
      </div>
    </a-modal> -->
    <!-- 远程下载 -->
    <!-- <a-modal
      v-model:visible="visiable.remoteDownload"
      :title="'选择保存目录'"
      width="auto"
      okText="确定"
      draggable
      :esc-to-close="false"
      :mask-closable="false"
      @ok="downloadFile"
    >
      <div style="width: 500px; overflow: hidden">
        <a-form :model="remote" :layout="'horizontal'">
          <a-form-item field="replace" label="下载地址">
            <a-input v-model="remote.url" placeholder="远程下载地址" />
          </a-form-item>
          <a-form-item field="name" label="文件名">
            <a-input
              v-model="remote.name"
              placeholder="请输入需要保存的文件名"
            />
          </a-form-item>
          <a-form-item field="path" label="保存目录">
            <a-input v-model="savepath" placeholder="请输入保存目录" />
            <a-button
              type="primary"
              style="margin-left: 15px"
              @click="selectDir"
              >选择保存目录</a-button
            >
          </a-form-item>
        </a-form>
      </div>
    </a-modal> -->
    <!-- 选择保存目录 -->
    <!-- <a-modal
      v-model:visible="visiable.savefile"
      :title="'选择保存目录'"
      width="auto"
      okText="确定"
      draggable
      :esc-to-close="false"
      :mask-closable="false"
      @ok="savepath = cachePath"
    >
      <div style="width: 889px; overflow: hidden">
        <save-file
          v-if="visiable.savefile"
          v-model="cachePath"
          :hostId="host.id"
          :showFile="showFile"
        ></save-file>
      </div>
    </a-modal> -->

    <!-- <a-modal
      v-model:visible="isensure"
      draggable
      :esc-to-close="false"
      :mask-closable="false"
      @ok="okEnsure"
      @cancel="canenlEnsure"
    >
      <template #title>
        <a-space>
          <icon-exclamation-circle-fill
            style="color: orange; font-size: 18px"
          />
          <span>警告提示！！！</span>
        </a-space>
      </template>
      <span style="color: var(--color-text-1)">{{ warningText }}</span>
    </a-modal> -->
  </div>
</template>
  
  <script>
import { GetHostList } from "@/api/hosts";

import { formatYMDHNS } from "@/utils/uitilities.js";
import { storeToRefs } from "pinia";
import { useUsersStore } from "@/store/user.js";
import {
  GetFileList,
  GetDirctorySize,
  SetFileMode,
  RenameFileName,
  CreateDirctory,
  DeleteDirctoryAndFile,
  ReadFile,
  SaveFile as SaveFileApi,
  RemoveBatchFile,
  GetDownloadFile,
  DecompressFile,
  CompressFile,
  MoveFile,
  FileDownload,
  TestFile,
} from "@/api/file/index.js";
import { ref, reactive } from "vue";

import CodeView from "@/components/CodeView.vue";
import SshView from "@/components/SSH.vue";

import SaveFile from "./components/savefile.vue";
import FileAuth from "./components/authority.vue";

import { Icon } from "@arco-design/web-vue";
import axios from "axios";
const IconFont = Icon.addFromIconFontCn({
  src:
    import.meta.env.MODE === "development"
      ? "/public/iconfont.js"
      : `/iconfont.js?version=${import.meta.env.VITE_APP_VERSION}`,
});

export default {
  name: "filemanager",
  components: { FileAuth, CodeView, SshView, SaveFile, IconFont },
  setup() {
    const { user } = storeToRefs(useUsersStore());
    const columns = [
      {
        title: "名称",
        slotName: "name",
        tooltip: true,
        ellipsis: true,
        width: 300,
      },
      // {
      //   title: "权限",
      //   slotName: "mode",
      //   width: 200,
      // },
      // {
      //   title: "大小",
      //   slotName: "size",
      //   width: 200,
      // },
      // {
      //   title: "修改时间",
      //   slotName: "modTime",
      //   width: 250,
      // },
      // ,
      // {
      //   title: "操作",
      //   slotName: "operation",
      //   fixed: "right",
      //   align: "ceneter",
      //   width: 300,
      // },
    ];
    const treeData = ref([]);

    return {
      scpFrom:ref({
        remoteHostId:0,
        localFile:"",
        remoteFile:"",
        hostId:0
      }),
      hostList: ref([]),
      warningText: ref(""),
      user,
      baseUrl: ref(import.meta.env.VITE_APP_API_BASE_URL),
      showFile: ref(false),
      search: reactive({
        timeout: null, // 防抖定时器
        text: "",
        containSub: false,
      }),
      path: ref("/"),
      cachePath: ref("/"),
      savepath: ref("/"),
      columns,
      editMode: ref(false),
      files: reactive([]),
      rowSelection: reactive({
        onlyCurrent: true,
        showCheckedAll: true,
      }),
      selectedKeys: ref([]),
      page: reactive({
        current: 1,
        total: 0,
        size: 20,
      }),
      loading: ref(false),
      loadingEdit: ref(false),
      controller: null,
      formAble: reactive({
        copy: false,
        paste: false,
        compress: false,
        auth: false,
        delete: false,
        replace: false,
        download: false,
        move: false,
        copyed: false,
      }),
      visiable: reactive({
        auth: false,
        rename: false,
        edited: false,
        ssh: false,
        upload: false,
        compress: false,
        savefile: false,
        remoteDownload: false,
      }),
      authFile: reactive({
        // 权限参数
        name: "",
        path: "",
        mode: "0000",
        isDir: false,
        sub: true,
      }),
      renameParams: reactive({
        // 重命名参数
        path: "",
        name: "",
      }),
      createdParams: reactive({
        // 创建参数
        filename: "",
        foldername: "",
      }),
      code: reactive({
        // 代码编辑器参数
        value: "",
        language: "",
        saved: true,
        name: "",
        path: "",
      }),
      ssh: reactive({
        // ssh 参数
        wsurl: "",
      }),
      compress: reactive({
        // 文件压缩参数
        filename: "",
        format: "zip",
        replace: false,
      }),
      move: reactive({
        // 文件转移参数
        type: "",
        files: [],
      }),
      remote: reactive({
        // 远程下载参数
        url: "",
        name: "",
      }),
      fileview: [".tar.gz", ".zip", ".gz", ".bz2", ".xz", ".tar"],
      isensure: ref(false),
      dropdownVisible: ref(false),
      listCode: ref([]),
      treeData,
      keyList: ref([]),
      selected_keys: ref([]),
      expanded_keys: ref([]),
      keylodding: ref(false),
      active_key: ref(0),
      indexKey: ref(""),
      isCode: ref(false),
      userStore: useUsersStore(),
      viewport: ref(true), ///开启直连
      request: ref(import.meta.env.VITE_APP_API_BASE_URL),
    };
  },
  mounted() {
    this.GetHostList();
    // this.getWebSitePath()re
  },
  methods: {
    async onHost(id) {
      console.log(id, "====");
      // this.GetHostList();
      this.host.id = id;
      // await this.refresh();
    },
    async GetHostList(info) {
      this.hostList = [];
      const result = await GetHostList(null, 1, 1000);

      if (result.code === 0) {
        this.hostList = result.data.items;
      }
    },
    direct(type) {
      if (type) {
        this.request =
          "http://" + this.userStore.host.addr + ":8080" + "/api/v1";
      } else {
        this.request = import.meta.env.VITE_APP_API_BASE_URL;
      }
      this.refresh();
      this.viewport = !type;
    },
    handleRightClick() {
      this.dropdownVisible = true;
    },
    computFileSize(size) {
      const KB = 1 << 10,
        MB = 1 << 20,
        GB = 1 << 30;
      if (size < KB) {
        return `${size} B`;
      } else if (size < MB) {
        return `${(size / KB).toFixed(2)} KB`;
      } else if (size < GB) {
        return `${(size / MB).toFixed(2)} MB`;
      } else {
        return `${(size / GB).toFixed(2)} GB`;
      }
    },
    copyPath(text) {
      // 创建一个新的<textarea>元素
      let textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      // 选中<textarea>中的文本
      textarea.select();
      // 执行复制操作
      document.execCommand("copy");
      // 移除<textarea>元素
      document.body.removeChild(textarea);
      this.$message.success("已复制到剪切板");
    },
    backPath() {
      // 回退一个路径
      if (this.path === "/") {
        return;
      }
      this.page.current = 1;
      const path = this.path.split("/");
      path.pop();
      this.path = path.length > 1 ? path.join("/") : "/";
      this.refresh();
    },
    async refresh() {
      this.selectedKeys = [];
      // 刷新当前路径
      await this.getFileList();
    },
    backToRoot() {
      // 回到根目录
      this.path = "/";
      this.page.current = 1;
      this.refresh();
    },
    async computDirSize(item) {
      // 计算文件夹大小
      this.loading = true;
      const response = await GetDirctorySize(
        this.request,
        this.host.id,
        item.path
      );
      if (response.code === 7) {
        this.$message.error("获取文件夹大小错误: ", response.msg);
        this.loading = false;
        return;
      }
      item.computed = true;
      item.size = response.data.size;
      this.loading = false;
    },
    enterPath(item) {
      // 进入文件夹
      this.path =
        this.path === "/" ? "/" + item.name : this.path + "/" + item.name;
      
        this.$emit('update-path', this.path);


      this.refresh();
    },
    async openfile(item) {
      // 打开文件
      try {
        this.code.saved = true;
        const res = await ReadFile(this.request, this.host.id, item.path);
        if (res.code === 7) {
          this.$message.error(`读取文件失败: ${res.msg}`);
          return;
        }
        this.code.value = res.data;
        this.code.language = item.extension;
        switch (item.extension) {
          case ".yaml":
          case ".yml":
            this.code.language = "yaml";
            break;
          case ".json":
            this.code.language = "json";
            break;
          case ".xml":
            this.code.language = "xml";
            break;
          case ".js":
          case ".ts":
            this.code.language = "javascript";
            break;
          case ".html":
            this.code.language = "html";
            break;
          case ".css":
          case ".less":
          case ".sass":
            this.code.language = "css";
            break;
          case ".php":
            this.code.language = "php";
            break;
          case ".conf":
            this.code.language = "nginx";
            break;
          default:
            this.code.language = "";
            break;
        }
        this.code.name = item.name;
        this.code.path = item.path;
        this.visiable.edited = true;
        console.log(11111);
        await this.getEditFileList(
          "0",
          {
            path: this.path,
            id: this.host.id,
            containSub: this.search.containSub,
            text: this.search.text,
            isensure: this.isensure,
          },
          true
        );
        console.log(22222);
        this.treeData;
        if (this.treeData.length > 0) {
          this.treeData.forEach((e, index) => {
            if (item.name === e.title) {
              this.listCode.push({
                key: e.key,
                name: this.code.name,
                value: this.code.value,
                language: this.code.language,
                saved: true,
                path: this.code.path,
              });
              this.active_key = this.listCode.length - 1;
              this.selected_keys.push(e.key);
              this.indexKey = e.key;
            }
          });
          this.isCode = true;
        }
        console.log(3333);
      } catch (e) {
        this.$message.error(`读取文件失败: ${e}`);
      }
    },
    async getfile(item) {
      // 打开文件
      try {
        this.loadingEdit = true;
        const res = await ReadFile(this.request, this.host.id, item.path);
        if (res.code === 7) {
          this.$message.error(`读取文件失败: ${res.msg}`);
          return;
        }
        this.code.value = res.data;
        this.code.language = item.extension;
        switch (item.extension) {
          case ".yaml":
          case ".yml":
            this.code.language = "yaml";
            break;
          case ".json":
            this.code.language = "json";
            break;
          case ".xml":
            this.code.language = "xml";
            break;
          case ".js":
          case ".ts":
            this.code.language = "javascript";
            break;
          case ".html":
            this.code.language = "html";
            break;
          case ".css":
          case ".less":
          case ".sass":
            this.code.language = "css";
            break;
          case ".php":
            this.code.language = "php";
            break;
          case ".conf":
            this.code.language = "nginx";
            break;
          case ".jpg":
            this.code.language = ".jpg";
            break;
          case ".png":
            this.code.language = ".png";
            break;
          case ".gif":
            this.code.language = ".gif";
            break;
          default:
            this.code.language = "";
            break;
        }
        this.code.name = item.name;
        this.code.path = item.path;
        this.loadingEdit = false;
        return this.code;
      } catch (e) {
        this.loadingEdit = false;
        this.$message.error(`读取文件失败: ${e}`);
      }
    },
    searchFile() {
      // 搜索文件
      clearTimeout(this.search.timeout);
      this.search.timeout = setTimeout(() => {
        this.refresh();
      }, 500);
    },
    async getFileList() {
      // console.log("-----", this.loading);
      // console.log("====--0-0-:",this.host.id);
      // console.log("---:",this.host.id ==0);
      // console.log("222:",this.host.id==null);
      try {
        if (this.loading || this.host.id ==0 || this.host.id==null) {
          return;
        }
        this.loading = true;
        const resp = GetFileList(
          this.request,
          this.path,
          this.host.id,
          this.page.current,
          this.search.containSub,
          this.search.text,
          this.page.size,
          this.isensure
        );
        let result = null;
        this.controller = resp.controller;
        result = await resp.request;
        if (result.code === 7) {
          this.$message.error(result.msg);
          this.isensure = true; //确认继续弹窗
          this.warningText = result.msg;
          this.loading = false;
          return;
        }
        this.files.splice(0, this.files.length);
        if (result.data.items) {
          this.files.push(...result.data.items.filter((i) => i.isDir));
          this.files.map((i) => {
            i.computed = false;
            return i;
          });
          this.files.push(...result.data.items.filter((i) => !i.isDir));
          this.files.map((item, index) => {
            item.key = index;
            return item;
          });
          this.page.total = result.data.itemTotal;
        }
        this.loading = false;
        this.controller = null;
        return result;
      } catch (e) {
        this.loading = false;
      }
    },

    ///目录
    canenlEnsure() {
      this.path = "/";
      this.isensure = false;
    },
    async okEnsure() {
      if (this.warningText === "该目录为系统运行目录，如果不熟悉，请停止访问") {
        await this.refresh();
      }
      this.isensure = false;
    },
    fastSearch(e) {
      if (e.keyCode === 13) {
        this.$refs.pathInput.blur();
        this.path = this.path.trim().length === 0 ? "/" : this.path;
        this.refresh();
      }
    },
    changeEditMode() {
      this.editMode = true;
      this.$forceUpdate();
      setTimeout(() => {
        this.$refs.pathInput.focus();
      });
    },
    jumpPath(e, idx) {
      e.stopPropagation();
      this.path =
        idx > 0
          ? this.path
              .split("/")
              .slice(0, idx + 1)
              .join("/")
          : "/";
      this.refresh();
    },
    // 分页回调
    pageChange(current) {
      this.page.current = current;
      this.refresh();
    },
    pageSizeChange(pageSize) {
      this.page.size = pageSize;
      this.refresh();
    },
    updateFileAuth(record) {
      // 修改文件权限
      this.authFile.name = record.name;
      this.authFile.mode = record.mode;
      this.authFile.path = record.path;
      this.authFile.isDir = record.isDir;
      this.authFile.sub = false;
      this.visiable.auth = true;
    },
    confirmAuth() {
      // 确认修改文件权限
      SetFileMode(
        this.request,
        this.host.id,
        this.authFile.path,
        this.authFile.isDir,
        parseInt(this.authFile.mode, 8),
        this.authFile.sub
      )
        .then((res) => {
          if (res.code === 7) {
            this.$message.error("修改文件权限失败:" + res.msg);
            return;
          }
          this.$message.success(res.msg);
          this.refresh();
        })
        .catch((err) => {
          console.log("---:", err);
          this.$message.error("修改文件权限失败1:" + err);
        });
    },
    rename(path) {
      // 文件重命名
      this.renameParams.path = path;
      this.renameParams.name = path.split("/").pop();
      this.visiable.rename = true;
    },
    confirmRename() {
      const result = this.renameParams.path.split("/").slice(0, -1);
      result.push(this.renameParams.name);
      RenameFileName(this.request,this.host.id, result.join("/"), this.renameParams.path)
        .then((res) => {
          if (res.code === 7) {
            this.$message.error(`文件名更新失败: ${res.msg}`);
            return;
          }
          this.$message.success("文件名更新成功");
          this.refresh();
        })
        .catch((err) => {
          this.$message.error(`文件名更新失败: ${err}`);
        });
    },
    async testFile() {
      try {
        const res = await TestFile(this.request, this.host.id, this.path);
        if (res.code === 7) {
          return false;
        }
        return res.data;
      } catch (e) {
        return false;
      }
    },
    async confirmCreateFile() {
      if (!(await this.testFile(this.path))) {
        this.$message.error("该路径不存在，操作无效");
        return;
      }
      CreateDirctory(
        this.request,
        this.host.id,
        this.path + "/" + this.createdParams.filename,
        this.createdParams.filename,
        false
      )
        .then((res) => {
          if (res.code === 7) {
            this.$message.error(`新建文件失败: ${res.msg}`);
            return;
          }
          this.createdParams.filename = "";
          this.$message.success("新建文件完成");
          this.refresh();
        })
        .catch((err) => {
          this.$message.error(`新建文件失败: ${err}`);
        });
    },
    async confirmCreateFolder() {
      if (!(await this.testFile(this.path))) {
        this.$message.error("该路径不存在，操作无效");
        return;
      }
      CreateDirctory(
        this.request,
        this.host.id,
        this.path + "/" + this.createdParams.foldername,
        this.createdParams.foldername,
        true
      )
        .then((res) => {
          if (res.code === 7) {
            this.$message.error(`新建文件夹失败: ${res.msg}`);
            return;
          }
          this.createdParams.foldername = "";
          this.$message.success("新建文件夹完成");
          this.refresh();
        })
        .catch((err) => {
          this.$message.error(`新建文件夹失败: ${err}`);
        });
    },
    async remove(path, isDir, single = false) {
      // 删除目录和文件夹, single 指示是否是批量删除
      const that = this;
      this.$modal.confirm({
        title: "删除确认",
        content: "删除操作不可恢复，您确定要删除吗?",
        alignCenter: true,
        titleAlign: "center",
        escToClose: true,
        width: "auto",
        async onOk() {
          try {
            let res = null;
            if (single) {
              // 单个删除
              res = await DeleteDirctoryAndFile(
                this.request,
                that.host.id,
                isDir,
                path
              );
            } else {
              // 批量删除
              const files = [];
              that.selectedKeys.forEach((i) => {
                files.push(that.files[i].path);
              });
              res = await RemoveBatchFile(this.request, that.host.id, files);
            }
            if (res.code === 7) {
              that.$message.error(`删除失败: ${res.msg}`);
              return;
            } else if (!single) {
              that.selectedKeys.splice(0, that.selectedKeys.length);
            }
            that.$message.success(res.msg);
            that.refresh();
          } catch (e) {
            that.$message.error(`删除失败: ${e}`);
          }
        },
      });
    },
    async saveEditCode(close, model) {
      model.saved = true;
      this.$refs.codeview[this.active_key]?.actionToTrigger(
        "editor.action.formatDocument"
      );
      try {
        this.loadingEdit = true;
        const res = await SaveFileApi(
          this.request,
          this.host.id,
          model.path,
          model.value
        );
        if (res.code === 7) {
          this.$message.error("文件内容保存失败: ", res.msg);
          return;
        } else {
          this.$message.success("文件保存成功");
        }
        this.loadingEdit = false;
      } catch (e) {
        this.loadingEdit = false;
        this.$message.error(`文件内容保存失败: ${e}`);
      }
      if (close) {
        this.visiable.edited = !close;
        this.refresh();
      }
    },
    editorClose() {
      const that = this;
      if (this.listCode.length > 0) {
        if (this.listCode[this.active_key].saved) {
          this.refresh();
          return true;
        } else {
          this.$modal.confirm({
            title: "提示",
            content: "您编辑的内容还没有保存，是否需要保存?",
            alignCenter: true,
            titleAlign: "center",
            escToClose: true,
            width: "auto",
            okText: "保存",
            cancelText: "丢弃",
            async onOk() {
              await that.saveEditCode(true, this.listCode[this.active_key]);
              that.code.value = "";
            },
            onCancel() {
              that.code.value = "";
              that.visiable.edited = false;
            },
          });
          return false;
        }
      } else {
        return true;
      }
    },
    async startSSH() {
      if (!(await this.testFile())) {
        this.$message.error("该目录不存在，操作无效");
        return;
      }
      this.ssh.wsurl =
        import.meta.env.MODE === "development"
          ? import.meta.env.VITE_APP_WS_BASE_URL +
            `/terminals?hostId=${this.host.id}`
          : `${
              window.location.protocol.indexOf("https") > -1 ? "wss" : "ws"
            }://${window.location.host}${
              import.meta.env.VITE_APP_API_BASE_URL
            }/terminals?hostId=${this.host.id}`;
      this.visiable.ssh = true;
    },
    downloadFromUrl(url, filename) {
      // 通过a连接下载文件
      const fileLink = window.document.createElement("a");

      fileLink.href = url;
      fileLink.download = filename;
      window.document.body.appendChild(fileLink);
      fileLink.click();
      fileLink.remove();
    },
    async download(item) {
      if (item.isDir) {
        this.$message.error("文件夹无法下载...");
        return;
      }
      try {
        const res = await GetDownloadFile(
          this.request,
          this.host.id,
          item.path
        );
        if (res.code === 7) {
          this.$message.error(`获取文件下载地址失败: ${res.msg}`);
          return;
        }
        this.$message.success("获取文件下载地址成功,即将开始下载...");
        this.downloadFromUrl(res.data, item.name);
      } catch (e) {
        this.$message.error(`获取文件下载地址失败: ${e}`);
      }
    },
    async decompress(record) {
      // 解压文件
      try {
        const res = await DecompressFile(
          this.request,
          this.host.id,
          this.path,
          record.path,
          record.extension.slice(
            record.extension.indexOf(".") > -1
              ? record.extension.indexOf(".") + 1
              : 0
          )
        );
        if (res.code === 7) {
          this.$message.error(`解压失败:${res.msg}`);
          return;
        }
        this.$message.success("解压成功");
        this.refresh();
      } catch (e) {
        this.$message.error(`解压失败:${e}`);
      }
    },
    uploadSuccess(resp) {
      const res = resp.response;
      if (res.code === 7) {
        this.$message.error("文件上传失败:" + res.msg);
        return;
      }
      this.$message.success("文件上传成功");
    },
    uploadError(err) {
      this.$message.error("文件上传失败:" + err);
    },
    compressFile() {
      // 打开压缩文件显示框
      this.savepath = this.path;
      this.visiable.compress = true;
    },
    selectDir() {
      this.showFile = false;
      this.visiable.savefile = true;
    },
    async confirmCompress() {
      if (this.compress.filename.trim().length === 0) {
        this.$message.error("请正确写入文件名");
        return;
      } else if (this.savepath.trim().length === 0) {
        this.$message.error("请填写正确的保存路径");
        return;
      }
      const files = [];
      this.selectedKeys.forEach((i) => {
        files.push(this.files[i].path);
      });
      const resp = await CompressFile(
        this.request,
        this.host.id,
        files,
        this.compress.format,
        this.savepath,
        this.compress.filename + "." + this.compress.format,
        this.compress.replace
      );
      if (resp.code === 7) {
        this.$message.error("文件压缩失败: " + resp.msg);
        return;
      }
      this.$message.success(resp.msg);
      this.refresh();
      this.selectedKeys.splice(0, this.selectedKeys.length);
    },
    moveFile(type) {
      this.move.type = type;
      this.move.files = [];
      this.selectedKeys.forEach((i) => {
        this.move.files.push(this.files[i].path);
      });
      this.formAble.paste = true;
      this.$message.success("文件选取成功");
    },
    async pasteFile() {
      try {
        const res = await MoveFile(
          this.request,
          this.host.id,
          this.path,
          this.move.files,
          this.move.type
        );
        if (res.code === 7) {
          this.$message.error("文件转移失败:" + res.msg);
          return;
        }
        this.$message.success("文件转移成功");
        this.formAble.paste = false;
        this.move.type = "";
        this.move.files = [];
        this.refresh();
      } catch (e) {
        this.$message.error("文件转移失败:" + e);
      }
    },
    async downloadFile() {
      try {
        const resp = await FileDownload(
          this.request,
          this.host.id,
          this.remote.url,
          this.savepath,
          this.remote.name
        );
        if (resp.code === 7) {
          this.$message.error("创建下载任务失败:" + e);
          return;
        }
        this.$message.success("远程下载任务已提交");
        this.refresh();
      } catch (e) {
        this.$message.error("创建远程下载任务失败:" + e);
      }
    },
    async reloadCode(model) {
      const that = this;
      if (model.saved) {
        try {
          this.loadingEdit = true;
          const res = await ReadFile(this.request, this.host.id, model.path);
          if (res.code === 7) {
            this.$message.error("重载失败:" + res.msg);
            return;
          }
          this.listCode.forEach((e) => {
            if (e.path === model.path) {
              e.value = res.data;
            }
          });
          this.loadingEdit = false;
        } catch (e) {
          this.loadingEdit = false;
          this.$message.error("重载失败:" + e);
        }
        return true;
      } else {
        this.$modal.confirm({
          title: "提示",
          content: "您编辑的内容还没有保存，是否需要保存?",
          alignCenter: true,
          titleAlign: "center",
          escToClose: true,
          width: "auto",
          okText: "保存",
          cancelText: "丢弃",
          async onOk() {
            await that.saveEditCode(true, model);
            await that.reloadCode(model);
          },
          async onCancel() {
            model.saved = true;
            await that.reloadCode(model);
          },
        });
        return false;
      }
    },
    async opTest(name) {
      if (await this.testFile(this.path)) {
        this.visiable[name] = true;
        this.savepath = this.path;
      } else {
        this.$message.error("该目录不存在，操作无效");
      }
    },
    ///判断图标类型
    iconType(extension) {
      let type = "icon-wenbenwenjian";
      switch (extension) {
        case ".jpg":
          type = "icon-jpg";
          break;
        case ".png":
          type = "icon-png";
          break;
        case ".gif":
          type = "icon-GIF";
          break;
        case ".conf":
          type = "icon-CONF";
          break;
        case ".yml":
        case ".yaml":
          type = "icon-YML";
          break;
        case ".mp3":
          type = "icon-MP";
          break;
        case ".seo":
          type = "icon-Seo";
          break;
        case ".css":
          type = "icon-CSS";
          break;
        case ".js":
        case ".ts":
          type = "icon-JS";
          break;
        case ".php":
          type = "icon-PHP";
          break;
        case ".webp":
          type = "icon-webp";
          break;
        case ".m3u8":
          type = "icon-m3u8zhuanmp4";
          break;
        case ".mp4":
          type = "icon-mp4";
          break;
        case ".conf":
          type = "icon-Nginx1";
          break;
        case ".svg":
          type = "icon-SVG";
          break;
        case ".html":
          type = "icon-HTML";
          break;
        case ".csv":
          type = "icon-CSV";
          break;
        case ".eps":
          type = "icon-EPS";
          break;
        case ".txt":
          type = "icon-TXT";
          break;
        case ".jar":
          type = "icon-JAR";
          break;
        case ".aac":
          type = "icon-AAC";
          break;
        case ".pdf":
          type = "icon-PDF";
          break;
        case ".xls":
          type = "icon-XLS";
          break;

        case ".avi":
          type = "icon-AVI";
          break;
        case ".doc":
          type = "icon-DOC";
          break;

        case ".ppt":
          type = "icon-PPT";
          break;
        case ".mov":
          type = "icon-MOV";
          break;
        case ".flv":
          type = "icon-FLV";
          break;
        case ".psd":
          type = "icon-PSD";
          break;
        case ".ttf":
          type = "icon-TTF";
          break;
        case ".sql":
          type = "icon-SQL";
          break;
        case ".mov":
          type = "icon-MOV";
          break;
        case ".xml":
          type = "icon-xml";
          break;
        case ".json":
          type = "icon-JSON";
          break;
        case ".gz":
        case ".zip":
        case ".rar":
        case ".7z":
        case ".tar":
        case ".bz2":
        case ".xz":
        case ".lzma":
        case ".tar.gz":
          type = "icon-yasuobao";
          break;
      }
      return type;
    },
    async getEditFileList(key, data, type) {
      let files = [];
      this.keylodding = true;
      const resp = GetFileList(
        this.request,
        data.path,
        data.id,
        1,
        data.containSub,
        data.text,
        2000,
        data.isensure
      );
      let result = null;
      this.controller = resp.controller;
      result = await resp.request;
      if (result.code === 7) {
        this.$message.error(result.msg);
        return;
      }
      files.splice(0, files.length);
      if (result.data.items) {
        files.push(...result.data.items.filter((i) => i.isDir));
        files.map((i) => {
          i.computed = false;
          return i;
        });
        files.push(...result.data.items.filter((i) => !i.isDir));
        files.map((item, index) => {
          item.key = index;
          return item;
        });
        this.editFiles(key, files, type);
      }
      this.controller = null;
      this.keylodding = false;
      return result;
    },
    ///编辑文件格式
    editFiles(key, list, type) {
      if (type) {
        let lists = [];
        list.forEach((e, index) => {
          if (e.isDir) {
            lists.push({
              key: `${key}-${index}`,
              title: e.name,
              isDir: e.isDir,
              extension: e.extension,
              path: e.path,
              children: [],
            });
          } else {
            lists.push({
              key: `${key}-${index}`,
              title: e.name,
              isDir: e.isDir,
              path: e.path,
              extension: e.extension,
            });
          }
        });
        this.treeData = lists;
      } else {
        this.listren(this.treeData, list, key);
      }
    },

    listren(listkey, list, key) {
      let istype = false;
      let childrens = [];
      listkey.forEach((a) => {
        if (a.key === key) {
          let lists = [];
          list.forEach((e, index) => {
            if (e.isDir) {
              lists.push({
                key: `${key}-${index}`,
                title: e.name,
                isDir: e.isDir,
                extension: e.extension,
                path: e.path,
                children: [],
              });
            } else {
              lists.push({
                key: `${key}-${index}`,
                title: e.name,
                isDir: e.isDir,
                path: e.path,
                extension: e.extension,
              });
            }
          });
          a.children = lists;
          istype = true;
        } else {
          if (typeof a.children != "undefined") {
            const type = key.includes(a.key);
            if (type) {
              childrens = a.children;
            }
          }
        }
      });
      if (!istype) {
        if (typeof childrens != "undefined") {
          this.listren(childrens, list, key);
        }
      }
    },

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
      this.listCode.splice(Number(key), 1);
      if (this.indexKey === this.selected_keys[key]) {
        this.indexKey = "";
      }
      this.selected_keys.splice(Number(key), 1);
    },
    async onSelect(key, model) {
      if (!model.node.isDir) {
        this.loadingEdit = true;
        this.indexKey = model.node.key;
        let type = true;
        this.isCode = false;
        if (this.listCode.length > 0) {
          this.listCode.forEach((e, index) => {
            if (model.node.key === e.key) {
              this.isCode = false;
              this.active_key = index;
              type = false;
              this.loadingEdit = false;
            }
          });
        }
        if (type) {
          const value = await this.getfile(model.node);
          this.listCode.push({
            key: model.node.key,
            name: model.node.title,
            value: value.value,
            language: value.language,
            saved: true,
            path: value.path,
          });
          this.active_key = this.listCode.length - 1;
          this.selected_keys.push(model.node.key);
        }
        this.isCode = true;
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
          if (model.node.children.length === 0) {
            this.getEditFileList(
              model.node.key,
              {
                path: model.node.path,
                id: this.host.id,
                containSub: this.search.containSub,
                text: this.search.text,
                isensure: this.isensure,
              },
              false
            );
          }

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
      this.isCode = false;
      this.active_key = e;
      this.indexKey = this.selected_keys[e];
      this.isCode = true;
    },
    istitle() {
      let name = "文件编辑";
      if (this.listCode.length > 0) {
        if (this.active_key > this.listCode.length - 1) {
          this.active_key = this.listCode.length - 1;
        }
        name =
          this.listCode[this.active_key].path +
          (this.listCode[this.active_key].saved ? "" : "\t*");
      }

      return name;
    },
    isImg(value) {
      switch (value) {
        case ".jpg":
          return false;
        case ".png":
          return false;
        case ".gif":
          return false;
      }
      return true;
    },
    onTime(time) {
      return formatYMDHNS(time);
    },
    isImgs(value) {
      // 将二进制数据转换为 Blob 对象
      const blob = new Blob([value], { type: "image/png" });

      // 创建 FileReader 对象
      const reader = new FileReader();

      // 读取 Blob 数据为 base64 编码
      reader.readAsDataURL(blob);

      // 监听 FileReader 加载完成事件
      reader.onload = () => {
        // 将 base64 编码的数据赋值给 imageData
        return reader.result;
      };
    },
  },
  created() {
    if (history.state.path) {
      this.path = history.state.path;
    }
    console.log("8888888:",this.host);
    if(this.host.id != "" || this.host.id != 0){
      this.refresh();
    }

  },
  props: {
    host: {
      type: Array,
      required: true
    }
  },
  watch: {
    host: {
      immediate: true,
      deep: true,
       handler(newVal, oldVal) {
        this.scpFrom.hostId = this.host.hostId;
        this.scpFrom.localFile = this.host.localFile;
      
        // this.controller?.abort();
        // this.loading = false;
        // console.log("--32131----:",newVal,"======",oldVal);
        // console.log("====:",this.host.id);
        // if (val.id != this.host.id) {
           this.getFileList();
        // }
      },
    },
    "code.value": function (val, old) {
      if (old.length === 0 || val.length === 0) {
        return;
      }
      // this.listCode[this.indexCode].saved = false;
    },
    selectedKeys: {
      deep: true,
      handler(val) {
        this.formAble.copy = val.length > 0;
        this.formAble.compress = val.length > 0;
        this.formAble.auth = val.length > 0;
        this.formAble.delete = val.length > 0;
        this.formAble.replace = val.length > 0;
        this.formAble.download = val.length > 0;
        this.formAble.move = val.length > 0;
        if (val.length > 0) {
        }
      },
    },
  },
};
</script>
  
  
  <style lang="scss" scoped>
.filemanager {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;

  .background {
    width: 100%;
    height: 100%;
    background-color: var(--color-menu-light-bg);
    box-sizing: border-box;
    padding-left: 5px;
    padding-right: 5px;
  }

  .menus {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;

    .back_btn {
      width: 30px;
      height: 30px;
      border: 2px solid var(--color-fill-4);
      border-radius: 50%;
      text-align: center;
      line-height: 30px;
      font-size: 17px;
      cursor: pointer;
      color: var(--color-text-2);
      transition: all 0.5s;
      margin-right: 10px;

      &:hover {
        background-color: rgb(var(--primary-6), 0.3);
        border: 2px solid transparent;
        color: var(--color-text-2);
      }
    }

    .directory {
      width: calc(100% - 130px);
      height: 40px;
      border: 1px solid var(--color-border-2);
      border-radius: 5px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

      .edit {
        height: 100%;
      }

      .path {
        width: 100%;
        line-height: 40px;
        height: 100%;

        .item {
          padding-left: 7px;
          padding-right: 0;
          display: inline-block;
          user-select: none;

          .text {
            cursor: pointer;
            font-size: 14px;
            color: var(--color-text-2);
            vertical-align: middle;
            transition: all 0.5s;
            &:hover {
              color: #20a0ff;
            }
          }

          .right {
            color: var(--color-text-2);
            font-size: 15px;
            margin-left: 5px;
            vertical-align: middle;
          }
        }
      }
    }
  }

  .operator {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;
      .file_new {
        width: 200px;
        display: flex;
        justify-content: space-around;
        align-content: center;
      }

      .local {
        width: 120px;
        margin-left: 20px;
      }

      .danger_op {
        width: 230px;
        margin-left: 20px;
      }

      .op {
        width: 270px;
        margin-left: 20px;
      }
    }

    .right {
      display: flex;
      align-items: center;
      justify-content: right;

      .search {
        width: 300px;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }

  .files {
    width: 100%;
    height: calc(100% - 110px);
    margin-top: 10px;

    .content {
      width: 100%;
      height: calc(100% - 40px);
    }

    .page {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: right;
      padding-right: 20px;
      box-sizing: border-box;
      background: var(--color-bg-2);
    }
  }
}

.container {
  width: 1000px;
  height: 700px;
  display: flex;
  padding: 5px 0px 5px 0px;
  .leftItme {
    width: 260px;

    margin-right: 5px;
  }
  .rightItme {
    width: calc(100% - 265px);
  }
}
.treeItem {
  width: 240px;
  cursor: pointer;
  vertical-align: middle;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
  