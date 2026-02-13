<template>
  <a-scrollbar
    :style="{ height: heights - 80 + 'px' }"
    style="overflow-y: auto"
  >
    <a-collapse :default-active-key="['1']" accordion>
      <a-collapse-item key="1">
        <template #header>
          <a-space>
            <h3>配置状态</h3>
            <icon-stop style="color: red; margin-left: 10px" />
            <span style="color: red"
              >启用该功能会改变已克隆站点的内容，请慎重操作!!!</span
            >
          </a-space>
        </template>
        <a-space
          style="
            background-color: var(--color-menu-light-bg);
            padding: 10px;
            width: calc(100% - 20px);
          "
        >
          <span>开关状态：</span>
          <a-switch v-model="mdoel.enable" type="round" size="small" />
          <a-button
            status="success"
            size="mini"
            style="margin: 0px 20px 0px 20px"
            @click="onSynchronous"
            >一键同步</a-button
          >
          <a-alert type="warning">
            <p>一键同步文件到服务器包含（视频 图片 用户名）</p>
          </a-alert>
        </a-space>
      </a-collapse-item>
      <a-collapse-item key="2">
        <template #header>
          <a-space>
            <h3>缓存配置</h3>
            <span
              >首页和列表的单位是：分钟，详情是天，在缓存有效期内，不改变页面内容</span
            >
          </a-space>
        </template>

        <a-space
          size="large"
          style="
            background-color: var(--color-menu-light-bg);
            padding: 18px 10px 10px 10px;
            width: calc(100% - 20px);
            align-items: start;
          "
        >
          <a-form
            ref="formRef"
            :rules="rules"
            :model="mdoel"
            layout="inline"
            style="width: 320px"
          >
            <a-form-item field="index_cache" label="首页缓存">
              <a-input-number
                v-model="mdoel.index_cache"
                :style="{ width: '200px' }"
                placeholder="请输入"
                hide-button
                allow-clear
              >
                <template #append>分钟</template>
              </a-input-number>
            </a-form-item>
            <a-form-item field="list_cache" label="列表缓存">
              <a-input-number
                v-model="mdoel.list_cache"
                :style="{ width: '200px' }"
                placeholder="请输入"
                hide-button
                allow-clear
              >
                <template #append>分钟</template>
              </a-input-number>
            </a-form-item>
            <a-form-item field="detail_cache" label="详情缓存">
              <a-input-number
                v-model="mdoel.detail_cache"
                :style="{ width: '200px' }"
                placeholder="请输入"
                hide-button
                allow-clear
              >
                <template #append>天</template>
              </a-input-number>
            </a-form-item>
          </a-form>
          <a-alert type="warning" style="margin-bottom: 10px">
            <p>
              当启用泛目录功能时，请按照以下规则配置：<br />
              下面需求的前提都是配置状态是开启的时候<br />
              首页缓存：缓存时间为0，表示首页不走页面缓存，首页模板为空，表示首页不走自定义模板。<br />
              列表页：缓存时间为0，表示如果访问的栏目名称和导航配置里面URL名称的关键词一样并且绑定的列表页模板输出的页面不走缓存。<br /><br />
              详情页：缓存时间为0，表示如果访问的栏目名称和导航配置里面URL名称的关键词一样并且绑定的详情页输出的页面不走缓存。<br /><br />
              当正确配置后，缓存有效期内，每次访问该页面，都看到一样的内容，超过缓存有效期，将会重新生成该页面内容！并且如果任意输入栏目名称或者详情页名称我们会根据你配置的列表页和详情页模板自动生成对应的页面并且数据随机给你返回页面内容。<br /><br />
              如果以前配置过首页模板后面删了以最后一次页面模板渲染的结果为准。<br />
            </p>
          </a-alert>
        </a-space>
      </a-collapse-item>
      <a-collapse-item key="3">
        <template #extra>
          <a-button
            type="primary"
            size="mini"
            status="success"
            @click="openEdit(false, null)"
          >
            <template #icon>
              <icon-plus />
            </template>
            添加配置
          </a-button>
        </template>
        <template #header>
          <a-space>
            <h3>导航配置</h3>
            <span>每个站点最多配置5个导航栏目</span>
          </a-space>
        </template>
        <div
          style="
            background-color: var(--color-menu-light-bg);
            padding: 10px;
            width: calc(100% - 20px);
          "
        >
          <a-table
            :columns="columns"
            :data="mdoel.navigation"
            :pagination="false"
          >
            <template #index_name="{ record }">
              <a-input
                v-model="record.index_name"
                @input="convertToPinyin(record)"
              />
            </template>
            <template #url="{ record }">
              <a-input v-model="record.url" />
            </template>
            <template #client_template_name="{ record }">
              <a-select
                :options="mdoel.model_name"
                v-model="record.client_template_name"
                allow-clear
              />
            </template>
            <template #detail_template_name="{ record }">
              <a-select
                :options="mdoel.model_name"
                v-model="record.detail_template_name"
                allow-clear
              />
            </template>
            <template #optional="{ record }">
              <a-space>
                <a-button
                  type="text"
                  @click="openEdit(true, record)"
                  style="width: 60px"
                >
                  <template #icon> <icon-edit /> </template>编辑
                </a-button>
                <a-popconfirm
                  content="您确定要删除拦截规则！！！"
                  type="error"
                  @ok="openDel(record.key)"
                >
                  <a-button type="text" style="width: 60px; color: red">
                    <template #icon> <icon-delete /> </template>删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table>
        </div>
      </a-collapse-item>
      <a-collapse-item key="4">
        <template #header>
          <a-space>
            <h3>模板配置</h3>
            <span>必须默认配置列表，详情页</span>
          </a-space>
        </template>

        <div
          style="
            background-color: var(--color-menu-light-bg);
            padding: 10px;
            width: calc(100% - 20px);
          "
        >
          <a-space style="margin-bottom: 10px">
            <a-select
              v-model="modelValue"
              :options="mdoel.model_name"
              placeholder="请选择"
              allow-clear
              @change="onTap"
              style="width: 320px"
            ></a-select>

            <!-- <a-button status="success" @click="openFormWork(false)">
              <template #icon>
                <icon-plus />
              </template>添加模板
            </a-button>-->
            <a-button status="warning" @click="openFormWork">
              <template #icon> <icon-edit /> </template>编辑模板
            </a-button>
            <a-button status="danger" @click="delTmp(modelValue)">
              <template #icon> <icon-delete /> </template>删除模板
            </a-button>
          </a-space>
          <a-spin :loading="loading" tip="加载中..." style="width: 100%">
            <div style="height: 400px">
              <code-view
                :fontSize="15"
                language="html"
                v-model="content"
              ></code-view>
            </div>
          </a-spin>
        </div>
      </a-collapse-item>

      <a-collapse-item key="6">
        <template #header>
          <a-space>
            <h3>批量上传</h3>
          </a-space>
        </template>
        <a-upload
          draggable
          :headers="{ 'x-token': user.token }"
          :action="`${prefixUrl}/websites/lexiconTmp?hostId=${
            host.id
          }&domain=${domain}&forceCover=${true}&file_type=${this.isType}`"
          :multiple="true"
          accept=".txt,.html,.zip"
        />
        <a-alert style="margin-bottom: 10px">
          <p style="font-size: 13px">批量上传规则：</p>
          <p style="font-size: 13px">
            1、词库上传的文件名只能是：word.txt，内容是要做的seo关键词，一行一个词，建议关键词500个起步，效果好
          </p>
          <p style="font-size: 13px">
            2、句子文件名必须为：sentence.txt，用于随机生成文章正文，可以是采集的小说、新闻、作文等，一行一句话（不限制长短，建议一句话是30-70个字）
          </p>
          <p style="font-size: 13px">
            3、模板样式文件，文件名称不限，只能上传zip格式的压缩包，会自动解压到站点根目录
          </p>
          <p style="font-size: 13px">
            4、模板文件，建议按照习惯，必须提供3个基础模板：首页.html
            列表页.html 详情页.html 如需要其它模板，上传后通过导航配置选择绑定
          </p>
        </a-alert>
      </a-collapse-item>
    </a-collapse>

    <a-button
      style="margin-top: 10px"
      type="primary"
      size="mini"
      @click="postMode()"
      :loading="filLoading"
      >保存配置</a-button
    >
  </a-scrollbar>
  <a-modal
    :visible="isEdit"
    width="700px"
    :title="type ? '编辑导航配置' : '新增导航配置'"
    draggable
    :mask-closable="false"
    @cancel="cancelEdit"
    @ok="okEdit"
  >
    <a-form ref="formRef" :rules="rules" :model="form">
      <a-form-item field="index_name" label="导航名称">
        <a-input
          allow-clear
          v-model="form.index_name"
          placeholder="请输入导航名称..."
          @input="convertToPinyin(form)"
        />
      </a-form-item>
      <a-form-item field="url" label="URL名称">
        <a-input
          v-model="form.url"
          placeholder="请输入URL名称..."
          allow-clear
        />
      </a-form-item>
      <a-form-item field="client_template_name" label="关联模板">
        <a-select
          v-model="form.client_template_name"
          :options="mdoel.model_name"
          placeholder="请选择关联模板，没有关联模板请去模板配置添加！！！"
          allow-clear
        ></a-select>
      </a-form-item>
      <a-form-item field="detail_template_name" label="关联详情模板">
        <a-select
          v-model="form.detail_template_name"
          :options="mdoel.model_name"
          placeholder="请选择关联模板，没有关联模板请去模板配置添加！！！"
          allow-clear
        ></a-select>
      </a-form-item>
    </a-form>
  </a-modal>

  <a-modal
    :visible="isFormwork"
    draggable
    :mask-closable="false"
    :footer="false"
    @cancel="cancelForm"
    title-align="start"
    :width="!isFold ? '1000px' : '1600px'"
  >
    <template #title>
      <a-space>
        <div>编辑模板配置</div>
        <span style="color: red">{{ domain }}</span>
      </a-space>
    </template>
    <a-spin :loading="FLoading" tip="加载中...">
      <a-space :style="{ width: !isFold ? '960px' : '1560px' }">
        <a-tabs
          v-model:active-key="indexModel"
          type="card-gutter"
          @change="(e) => onTapTabs(e, false)"
          :editable="true"
          @add="handleAdd"
          show-add-button
          style="width: 960px"
          auto-switch
        >
          <template #extra>
            <span>模板配置说明</span>
            <icon-menu-unfold
              v-if="!isFold"
              style="font-size: 18px"
              @click="
                () => {
                  this.isFold = true;
                }
              "
            />
            <icon-menu-fold
              v-else
              style="font-size: 18px"
              @click="
                () => {
                  this.isFold = false;
                }
              "
            />
          </template>
          <a-tab-pane
            v-for="(value, index) of modelName"
            :key="index"
            :closable="value.type"
          >
            <template #title>
              <icon-exclamation-circle-fill
                v-if="onEditModel(value)"
                style="color: gold"
              />
              {{ value.name }}
            </template>
            <a-space direction="vertical">
              <div
                style="
                  width: 100%;
                  display: flex;
                  justify-content: space-between;
                  margin-right: 10px;
                "
              >
                <a-space>
                  <a-button
                    type="primary"
                    status="success"
                    size="mini"
                    @click="onSubForm(value)"
                    >保存修改</a-button
                  >
                  <a-tooltip content="刷新重新加载" position="right">
                    <a-button
                      size="mini"
                      type="primary"
                      status="success"
                      shape="circle"
                      @click="onTapTabs(index, true)"
                    >
                      <icon-refresh />
                    </a-button>
                  </a-tooltip>
                </a-space>
                <a-button type="primary" size="mini" @click="openUrl"
                  >专业编辑器</a-button
                >
              </div>

              <div style="height: 565px; width: 960px">
                <code-view
                  :fontSize="15"
                  language="html"
                  v-model="value.newContent"
                ></code-view>
              </div>
            </a-space>
          </a-tab-pane>
        </a-tabs>
        <a-scrollbar
          v-if="isFold"
          style="
            width: 580px;
            height: 620px;
            overflow: auto;
            border: 1px solid #b1b1b1;
            padding: 10px;
          "
        >
          <div style="width: 560px">
            <a-collapse :default-active-key="['1']">
              <a-collapse-item header="首页和列表页" key="1">
                <a-typography-text>
                  可循环的列表内容，默认长度是：300个（列表的使用方法参考下方）<br />
                  page.list = [{<br />
                  url: "",
                  //默认提供的URL，也可以自定义生成【参考下方--自定义URL】<br />
                  title: "", 列表标题<br />
                  cover: "", 封面图，如果配置图片数据<br />
                  video: "", 视频，如果配置视频数据<br />
                  desc: "", 列表摘要，如果配置句子数据<br />
                  pub_time: "", 发布时间（YYYY-MM-DD
                  HH:ii:ss），也可以使用下方语法自己配置日期显示方式<br />
                  author: "", 作者名称<br />
                  }]
                </a-typography-text>
              </a-collapse-item>
              <a-collapse-item header="详情页" key="2">
                <a-typography-text>
                  page.title 文章标题<br />
                  page.content 文章正文。如需文章摘要，使用模板函数自行截取<br />
                  page.cover 文章配图<br />
                  page.author 文章作者<br />
                  page.pub_time 文章发布时间<br />
                  page.video 文章视频<br />
                </a-typography-text>
              </a-collapse-item>
              <a-collapse-item header="SEO配置" key="3">
                <a-typography-text>
                  内页标题，按照建站时给的内页TKD（TKD格式）生成内容<br />
                  seo.title //内页标题<br />
                  seo.keyword //内页内容<br />
                  seo.description //内页描述<br />
                  一键复制内页TKD代码，覆盖页面存在的对应代码：<br />
                </a-typography-text>
                <a-typography-text type="warning" copyable>
                  {{ Modelmap.htmlCode1 }}<br />
                  {{ Modelmap.htmlCode2 }}<br />
                  {{ Modelmap.htmlCode3 }}
                </a-typography-text>
                <a-typography-text
                  ><br />
                  其它SEO辅助代码：<br />
                </a-typography-text>
                <a-typography-text type="warning" copyable>
                  {{ Modelmap.htmlCode4 }}
                </a-typography-text>
              </a-collapse-item>
              <a-collapse-item header="模板基本变量" key="4">
                <a-typography-text type="warning" copyable>
                  http.url = 'http://qq.com/test/h.htm'
                </a-typography-text>
                <a-typography-text>
                  // 当前页面的完整URL 字符串
                </a-typography-text>
                <a-typography-text type="warning" copyable>
                  http.host = 'http://qq.com'
                </a-typography-text>
                <a-typography-text>
                  // 当前页面的主机名（host） 字符串<br />
                </a-typography-text>
                <a-typography-text>
                  <br />随机字符串种子<br />
                  page.seed_number = '0123456789'<br />
                  page.seed_letter =
                  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'<br />
                  page.seed_string =
                  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'<br />
                  <br />站点导航信息<br />
                  page.nav_name="当前导航的URL中文"<br />
                  page.nav_url="当前导航的URL英文"<br />
                  page.nav_list = [{ 'name' : '', 'url': '' }]
                  自定义的导航列表<br />
                </a-typography-text>
              </a-collapse-item>
              <a-collapse-item header="模板的基本语法" key="5">
                <a-typography-text>
                  在页面显示变量的内容，如显示 seo 标题<br />
                  {{ Modelmap.htmlCode5 }}<br />
                  循环列表——普通循环：这种语法，每次输出的内容都是一样的，只适合循环导航<br />
                  {% for item in page.nav_list %}<br />
                  {{ Modelmap.htmlCode6 }}<br />
                  {{ Modelmap.htmlCode7 }}<br />
                  {% endfor %}<br />
                  循环列表——随机列表：从列表中 随机
                  取出8个元素用于页面显示（推荐）<br />
                  {% for item in page.list | rand_array: 8 %}<br />
                  {{ Modelmap.htmlCode6 }}<br />
                  {{ Modelmap.htmlCode9 }}<br />
                  {{ Modelmap.htmlCode10 }}<br />
                  {% endfor %}<br /><br />
                  循环列表——指定位置和长度：从列表 第3个 开始读取列表，长度是 20
                  <br />
                  {% for item in page.list limit:20 offset:2 %}<br />
                  {{ Modelmap.htmlCode6 }}<br />
                  {{ Modelmap.htmlCode8 }}<br />
                  {{ Modelmap.htmlCode9 }}<br />
                  {% endfor %}<br />
                  在页面自定义一个公共变量，如变量名称：new_seed<br />
                  {% assign new_seed = '0123456789,.@#$%^asdfghjkljer' %}<br />
                  # 生成随机数，格式：种子选项 | rand_string:
                  最小长度，最大长度<br />
                  {{ Modelmap.htmlCode10 }}<br />
                  {{ Modelmap.htmlCode11 }}<br />
                  {{ Modelmap.htmlCode12 }}<br />
                  {{ Modelmap.htmlCode13 }}<br />
                  {% raw %}<br />
                  {{ Modelmap.htmlCode14 }}<br />
                  {% endraw %}<br />
                  # 字符串拼接<br />
                  {{ Modelmap.htmlCode15 }}<br />
                  格式化日期，now是内置变量，需要使用 英文双引号包裹<br />
                  {{ Modelmap.htmlCode16 }}<br />
                </a-typography-text>
              </a-collapse-item>
            </a-collapse>
          </div>
        </a-scrollbar>
      </a-space>
    </a-spin>
  </a-modal>

  <a-modal
    v-model:visible="addVisible"
    @ok="handleOk"
    @cancel="handleCancel"
    title="新增模板配置"
  >
    <a-space direction="vertical" style="width: 100%">
      <a-alert type="warning" style="margin-bottom: 10px">
        <p>添加模板后需要您在编辑页面，修改模板内容后保存修改。</p>
      </a-alert>
      <a-form-item label="模板名称" required>
        <a-space style="width: 100%">
          <a-input
            allow-clear
            v-model="expert.tmp_name"
            placeholder="请输入模板名称..."
            style="width: 320px"
          />
        </a-space>
      </a-form-item>
    </a-space>
  </a-modal>
</template>

<script>
import { reactive, ref } from "vue";
import CodeView from "@/components/CodeView.vue";
import { useUsersStore } from "@/store/user.js";
import { pinyin } from "pinyin-pro";
import { storeToRefs } from "pinia";
import {
  getExpertMode,
  postExpertMode,
  getEexpertModeTmp,
  putEexpertModeTmp,
  postEexpertModeTmp,
  delEexpertModeTmp,
  postWgetDownloadTxt,
} from "@/api/site/index.js";
import { Modal } from "@arco-design/web-vue";
export default {
  components: {
    CodeView,
  },
  props: {
    heights: 0,
    webSiteId: 0,
    domain: "",
  },
  setup() {
    const rules = {
      index_cache: [
        {
          required: true,
          message: "请输入首页缓存",
        },
        {
          validator: (value, cb) => {
            if (value < 0 || value === null) {
              cb("详情缓存的值必须大于等于0");
            } else {
              cb();
            }
          },
        },
      ],
      list_cache: [
        {
          required: true,
          message: "请输入列表缓存",
        },
        {
          validator: (value, cb) => {
            if (value < 0 || value === null) {
              cb("详情缓存的值必须大于等于0");
            } else {
              cb();
            }
          },
        },
      ],
      detail_cache: [
        {
          required: true,
          message: "请输入详情缓存",
        },
        {
          validator: (value, cb) => {
            if (value < 0 || value === null) {
              cb("详情缓存的值必须大于等于0");
            } else {
              cb();
            }
          },
        },
      ],
      url: [
        {
          required: true,
          message: "请输入URL名称",
        },
      ],
      index_name: [
        {
          required: true,
          message: "请输入昵称",
        },
      ],
      client_template_name: [
        {
          required: true,
          message: "请选择关联模板",
        },
      ],
      detail_template_name: [
        {
          required: true,
          message: "请选择关联详情页模板",
        },
      ],
    };

    const store = useUsersStore();
    const { user, host } = storeToRefs(store);
    const columns = [
      {
        title: "导航名称",
        dataIndex: "index_name",
        width: 150,
        slotName: "index_name",
      },
      {
        title: "URL名称",
        width: 150,
        slotName: "url",
      },
      {
        title: "关联模板",
        dataIndex: "client_template_name",
        width: 150,
        slotName: "client_template_name",
      },
      {
        title: "关联详情页模板",
        dataIndex: "detail_template_name",
        width: 150,
        slotName: "detail_template_name",
      },
      {
        title: "操作",
        slotName: "optional",
        width: 120,
      },
    ];
    const form = ref({
      index_name: "",
      url: "",
      client_template_name: "",
      detail_template_name: "",
    });
    const mdoel = ref({
      enable: false,
      index_cache: 30,
      list_cache: 60,
      detail_cache: 60,
      navigation: [],
      model_name: [],
      files_name: { word: 0, img: 0, video: 0, sentence: 0 },
    });
    const expert = ref({
      tmp_name: "",
      content: "",
    });
    return {
      user,
      host,
      columns,
      form,
      rules,
      isEdit: ref(false),
      uploadStatus: ref(false),
      type: ref(false),
      loading: ref(false),
      mdoel,
      isType: ref(1),
      modelValue: ref(""),
      prefixUrl: ref(import.meta.env.VITE_APP_API_BASE_URL),
      content: ref(""),
      ///模板配置
      isFormwork: ref(false),
      FLoading: ref(false),
      FContent: ref(""),
      files: ref([]),
      filLoading: ref(false),
      lexiconName: ref([]),
      isFold: ref(false),
      addVisible: ref(false),
      expert,
      modelName: ref([]),
      indexModel: ref(0),
      Modelmap: {
        htmlCode1: "<title>{{ seo.title }}</title>",
        htmlCode2: '<meta name="keywords" content="{{ seo.keyword }}">',
        htmlCode3: '<meta name="description" content="{{ seo.description }}">',
        htmlCode4: '<meta name="author" content="{品牌名}">',
        htmlCode5: "{{ seo.title }}",
        htmlCode6: "{{item.url}}",
        htmlCode7: "{{item.name}}",
        htmlCode8: "{{item.title}}",
        htmlCode9: '{{ item.pub_time | date: "%Y-%m-%d" }}    格式化日期',
        htmlCode10: '{{ "0123456789" | rand_string: 3,8 }}',
        htmlCode11:
          "{{ new_seed | rand_string: 3,8 }} 生成随机字符串(备注：new_seed 是上面自定义赋值的字符串变量)",
        htmlCode12:
          "{{ page.seed_string | rand_string: 3,8 }} # 如果模板出现和模板引擎冲突的格式，使用{% raw %}跳过这段处理",
        htmlCode13:
          "如果遇到页面需要使用 {{}} 这样的排版，请使用以下语法包含，避免程序产生误解",
        htmlCode14:
          "In Handlebars, {{ this }} will be HTML-escaped, but {{ that }} will not.",
        htmlCode15: "{{ page.seed_letter | append: page.seed_number }}",
        htmlCode16: '{{ "now" | date: "%Y-%m-%d %H:%M" }} 使用当前时间格式化',
      },
    };
  },
  mounted() {
    this.mdoel.navigation.forEach((e, index) => {
      e["key"] = index + 1;
    });
    this.getData();
  },
  methods: {
    async getData() {
      this.modelName = [];
      const response = await getExpertMode({
        website_id: this.webSiteId,
        domain: this.domain,
      });
      if (response.code === 0) {
        this.mdoel = response.data;
      }
      if (this.mdoel.navigation === null) {
        this.mdoel.navigation = [];
      }
      this.mdoel.navigation.forEach((e, index) => {
        e["key"] = index + 1;
      });
      this.files = [];
      for (const key in this.mdoel.files_name) {
        this.isFiles(this.mdoel.files_name[key], this.iskey(key));
      }
      if (this.mdoel.model_name.length > 0) {
        this.mdoel.model_name.forEach((e) => {
          this.modelName.push({
            name: e,
            newContent: "",
            oldContent: "",
            type: false,
          });
        });
      }
    },
    isFiles(id, type) {
      if (id > 0) {
        this.files.push({ file_id: id, file_type: type });
      }
    },
    iskey(key) {
      switch (key) {
        case "word":
          return 1;
        case "img":
          return 2;
        case "video":
          return 3;
        case "sentence":
          return 4;
      }
    },
    isID(id) {
      switch (id) {
        case 1:
          return "word";
        case 2:
          return "img";
        case 3:
          return "video";
        case 4:
          return "sentence";
      }
    },
    async postMode() {
      let type = true;
      let list = [];
      if (this.mdoel.enable) {
        if (this.files.length > 0 || 1) {
          this.files.forEach((e) => {
            if (e.file_type === 1 || e.file_type === 4) {
              list.push(e);
            }
          });
        } else {
          this.$message.error(
            "当前你的配置状态是开启状态，词库和句子都需要您上传"
          );
          type = false;
        }
        if (list.length != 2 || 1) {
          this.$message.error(
            "当前你的配置状态是开启状态，词库和句子都需要您上传"
          );
          type = false;
        }
      }

      if (type) {
        const response = await postExpertMode({
          enable: this.mdoel.enable,
          website_id: this.webSiteId,
          domain: this.domain,
          index_cache: this.mdoel.index_cache, //首页缓存
          list_cache: this.mdoel.list_cache, //列表缓存
          detail_cache: this.mdoel.detail_cache, //详情缓存
          navigation: this.mdoel.navigation,
          files: this.files,
        });

        if (response.code === 0) {
          this.$message.success("保存成功");
        }
      }
    },
    beforeUpload(file) {
      const list = file.name.split(".");
      if (file.size / 1024 / 1024 > 10) {
        this.$message.error("您上传的文件大于10MB");
      } else if (list[list.length - 1] !== "txt") {
        this.$message.error("请上传后缀为.txt的文件，例如：词库.txt");
      } else {
        this.filLoading = true;
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: "beforeUpload",
            content: `确认上传 ${file.name}`,
            onOk: () => resolve(true),
            onCancel: () => reject("cancel"),
          });
        });
      }
    },
    convertToPinyin(model) {
      const value = pinyin(model.index_name, { toneType: "none" });
      model.url = value.replace(/\s+/g, "");
    },
    openEdit(type, model) {
      this.type = type;
      this.form = {
        url: "",
        index_name: "",
        client_template_name: "",
        client_template_detail_name: "",
      };
      if (type) {
        this.form = model;
      }
      this.isEdit = true;
    },
    cancelEdit() {
      this.isEdit = false;
    },
    okEdit() {
      if (!this.type) {
        if (this.mdoel.navigation.length < 5) {
          this.form["key"] = this.mdoel.navigation.length + 1;
          this.mdoel.navigation.push(this.form);
        } else {
          this.$notification.error({
            title: "警告",
            content: "导航配置最多只能添加5条",
            closable: true,
            style: { width: "500px" },
            duration: 2000,
          });
        }
      }
      this.mdoel.navigation.forEach((e, index) => {
        e.key = index + 1;
      });
      this.isEdit = false;
    },
    openDel(id) {
      this.mdoel.navigation = this.mdoel.navigation.filter(
        (item) => item.key !== id
      );
    },
    isUpload(model) {
      let type = true;
      switch (this.isType) {
        case 1:
          type = model.word >= 0 ? true : false;
          break;
        case 2:
          type = model.img >= 0 ? true : false;
          break;
        case 3:
          type = model.video >= 0 ? true : false;
          break;
        case 4:
          type = model.sentence >= 0 ? true : false;
          break;
      }
      return type;
    },
    uploadSuccess(e) {
      if (e.response.code === 7) {
        this.$message.error(e.response.msg);
      } else {
        let type = true;
        this.files.forEach((a) => {
          if (a.file_type === this.isType) {
            a.file_id = e.response.data.id;
            type = false;
          }
        });
        if (type) {
          this.files.push({
            file_id: e.response.data.id,
            file_type: this.isType,
          });
        }

        this.mdoel.files_name[this.isID(this.isType)] = e.response.data.id;
        this.filLoading = false;
        this.$message.success("上传成功");
      }
    },
    uploadError() {
      this.filLoading = false;
      this.$message.error("上传失败");
    },

    async onTap(e) {
      this.loading = true;
      const context = await this.getTmp(e);
      this.content = context;
      this.loading = false;
    },

    async getTmp(e) {
      const response = await getEexpertModeTmp({
        tmp_name: e,
        domain: this.domain,
      });
      if (response.code === 0) {
        return response.data.content;
      } else {
        this.$message.error("当前模板没有配置，需要您修改后进行保存");
        return "";
      }
    },
    async delTmp(value) {
      const response = await delEexpertModeTmp({
        tmp_name: value,
        domain: this.domain,
      });
      if (response.code === 0) {
        this.$message.success(response.msg);
        this.modelValue = null;
        let indexToRemove = this.mdoel.model_name.indexOf(value);
        if (indexToRemove !== -1) {
          this.mdoel.model_name.splice(indexToRemove, 1);
          this.modelName.splice(indexToRemove, 1);
        }
      }
    },
    ///模板配置
    async openFormWork() {
      this.indexModel = 0;
      this.isFormwork = true;
      if (this.modelName.length > 0) {
        this.FLoading = true;
        const content = await this.getTmp(this.modelName[0].name);
        this.modelName[0].newContent = content;
        this.modelName[0].oldContent = content;

        this.FLoading = false;
      }
    },
    async onTapTabs(e, type) {
      let iftype = false;
      if (type) {
        iftype = true;
      } else {
        if (
          this.modelName[e].newContent.length === 0 &&
          this.modelName[e].type === false
        ) {
          iftype = true;
        }
      }
      if (iftype) {
        this.FLoading = true;
        const content = await this.getTmp(this.modelName[e].name);
        this.modelName[e].newContent = content;
        this.modelName[e].oldContent = content;
        this.FLoading = false;
      }
    },
    cancelForm() {
      // let type = false;
      // this.modelName.forEach((e) => {
      //   if (e.newContent != e.oldContent) {
      //     type = true;
      //   } else if (e.type) {
      //     if (e.oldContent.length === 0) {
      //       type = true;
      //     }
      //   }
      // });
      // if (type) {

      // }
      this.isFormwork = false;
      this.getData();
    },
    // async okForm() {
    //   if (!this.isModel) {
    //     if (this.expert.tmp_name.length === 0) {
    //       this.$message.warning("请输入模板昵称");
    //     } else if (this.expert.content.length === 0) {
    //       this.$message.warning("请输入模板内容");
    //     } else {
    //       const response = await postEexpertModeTmp({
    //         host_id: this.host.id,
    //         domain: this.domain,
    //         tmp_name: this.expert.tmp_name,
    //         content: this.expert.content,
    //       });
    //       if (response.code === 0) {
    //         this.isFormwork = false;
    //         this.getData();
    //         this.$message.success("添加模板成功");
    //       }
    //     }
    //   }
    // },
    async onSubForm(value) {
      const response = await putEexpertModeTmp({
        host_id: this.host.id,
        domain: this.domain,
        tmp_name: value.name,
        content: value.newContent,
      });
      if (response.code === 0) {
        value.oldContent = value.newContent;
        value.type = false;
        this.$message.success("修改模板成功");
      }
    },

    handleAdd() {
      if (this.modelName.length === 5) {
        this.$notification.warning({
          title: "禁止添加",
          content: "模板配置最大支持添加5条，当前您已有5条",
          closable: true,
          style: { width: "500px" },
          duration: 3000,
        });
      } else {
        this.addVisible = true;
      }
    },
    handleOk() {
      if (this.expert.tmp_name === "") {
        this.$message.error("请输入模板名称");
      } else {
        let type = true;
        this.modelName.forEach((e) => {
          if (e.name === this.expert.tmp_name) {
            this.$message.error("当前存在此模板！！！");
            type = false;
          }
        });
        if (type) {
          this.modelName.push({
            name: this.expert.tmp_name,
            newContent: "",
            oldContent: "",
            type: true,
          });
          this.addVisible = false;
          this.expert.tmp_name = "";
        }
      }
    },
    handleCancel() {
      this.expert.tmp_name = "";
      this.addVisible = false;
    },

    onEditModel(value) {
      let type = false;

      if (value.newContent != value.oldContent) {
        type = true;
      } else if (value.type) {
        if (value.oldContent.length === 0) {
          type = true;
        }
      }
      return type;
    },
    async onSynchronous() {
      const response = await postWgetDownloadTxt(this.host.id);
      if (response.code === 0) {
        this.$message.success(response.msg);
      }
    },
    openUrl() {
      window.open("https://code.visualstudio.com/");
    },
  },
  watch: {
    webSiteId: {
      handler: "getData",
      deep: true,
    },
  },
};
</script>