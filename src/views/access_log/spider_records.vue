<template>
  <a-scrollbar class="content-wrapper" style="height: calc(100vh - 80px); overflow-y: auto; overflow-x: hidden;">
    <div class="content-container">
      <a-spin :loading="loading" tip="加载中..." style="width:100%">
        <a-space direction="vertical" class="content-space">
          <!-- 筛选条件 -->
          <a-card style="margin-bottom: 16px;">
            <a-form :model="filterForm" layout="inline">
              <a-form-item label="主机">
                <a-select
                  v-model="filterForm.host_id"
                  :options="hostList"
                  :field-names="fieldNames"
                  placeholder="请选择主机（0表示所有主机）"
                  allow-clear
                  style="width: 200px"
                >
                  <template #option="{ data }">
                    <span>{{ data.name }} (ID: {{ data.id }})</span>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item label="域名">
                <a-input v-model="filterForm.domain" placeholder="支持模糊查询" style="width: 200px" allow-clear />
              </a-form-item>
              <a-form-item label="蜘蛛类型">
                <a-select
                  v-model="filterForm.spider_name"
                  :options="spiderList"
                  placeholder="请选择蜘蛛类型"
                  allow-clear
                  style="width: 150px"
                />
              </a-form-item>
              <a-form-item label="蜘蛛IP">
                <a-input v-model="filterForm.ip" placeholder="支持模糊查询" style="width: 180px" allow-clear />
              </a-form-item>
              <a-form-item label="开始时间">
                <a-date-picker
                  v-model="filterForm.start_time"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 200px"
                />
              </a-form-item>
              <a-form-item label="结束时间">
                <a-date-picker
                  v-model="filterForm.end_time"
                  show-time
                  format="YYYY-MM-DD HH:mm:ss"
                  style="width: 200px"
                />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="fetchData">查询</a-button>
                <a-button style="margin-left: 10px" @click="resetFilter">重置</a-button>
              </a-form-item>
            </a-form>
          </a-card>

          <!-- 数据列表 -->
          <a-card>
            <a-empty v-if="!loading && dataSource.length === 0" description="没有数据" />
            <a-table
              v-else
              :columns="columns"
              :data="dataSource"
              :pagination="false"
              :loading="loading"
              :scroll="{ x: 1200 }"
            >
              <template #spider_name="{ record }">
                <a-space v-if="record.is_spider">
                  <svg class="ali-icon" aria-hidden="true" v-if="getSpiderIcon(record.spider_name)">
                    <use :xlink:href="getSpiderIcon(record.spider_name)" />
                  </svg>
                  <span style="color: crimson">{{ record.spider_name || '未知蜘蛛' }}</span>
                </a-space>
                <span v-else>-</span>
              </template>
              <template #path="{ record }">
                <a-tooltip :content="record.path">
                  <span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: inline-block;">
                    {{ record.path || '/' }}
                  </span>
                </a-tooltip>
              </template>
            </a-table>

            <!-- 分页 -->
            <a-pagination
              v-if="pagination.total > 0"
              v-model:current="pagination.page"
              v-model:page-size="pagination.pageSize"
              :total="pagination.total"
              show-total
              show-page-size
              style="margin-top: 16px; display: flex; justify-content: right"
              @change="pageChange"
              @page-size-change="pageSizeChange"
            />
          </a-card>
        </a-space>
      </a-spin>
    </div>
    </a-scrollbar>
</template>

<script>
import { ref, onMounted } from 'vue'
import { getAccessLogList } from '@/api/access_log'
import { GetHostList } from '@/api/hosts'
import { useUsersStore } from '@/store/user.js'
import { Message } from '@arco-design/web-vue'
import dayjs from 'dayjs'

export default {
  name: 'SpiderRecords',
  setup() {
    const userStore = useUsersStore()
    const loading = ref(false)
    const dataSource = ref([])
    const hostList = ref([])
    const fieldNames = { value: 'id', label: 'name' }
    
    const filterForm = ref({
      host_id: 0,
      domain: '',
      spider_name: '',
      ip: '',
      start_time: null,
      end_time: null,
    })

    const pagination = ref({
      page: 1,
      pageSize: 20,
      total: 0,
    })

    const spiderList = [
      { value: 'baidu', label: '百度' },
      { value: 'yandex', label: 'Yandex' },
      { value: 'bing', label: '必应' },
      { value: 'sogou', label: '搜狗' },
      { value: 'google', label: '谷歌' },
      { value: '360', label: '360' },
      { value: 'sm', label: '神马' },
      { value: '其它', label: '其它' },
    ]

    const columns = [
      {
        title: '抓取时间',
        dataIndex: 'created_at',
        width: 180,
        fixed: 'left',
      },
      {
        title: '蜘蛛类型',
        slotName: 'spider_name',
        width: 120,
      },
      {
        title: '域名',
        dataIndex: 'domain',
        width: 200,
      },
      {
        title: '页面路径',
        slotName: 'path',
        width: 350,
      },
      {
        title: '蜘蛛IP',
        dataIndex: 'ip',
        width: 140,
      },
      {
        title: '请求方法',
        dataIndex: 'method',
        width: 100,
      },
      {
        title: '状态码',
        dataIndex: 'code',
        width: 100,
      },
      {
        title: 'User-Agent',
        dataIndex: 'agent',
        width: 300,
        ellipsis: true,
        tooltip: true,
      },
    ]

    // 获取蜘蛛图标
    const getSpiderIcon = (spiderName) => {
      if (!spiderName) return ''
      const iconMap = {
        google: '#icon-guge',
        baidum: '#icon-baidu',
        baidu: '#icon-baidu',
        yandex: '#icon-yandex-logo',
        bing: '#icon-biying',
        sogou: '#icon-sougoushuru',
        '360': '#icon-a-3601',
        sm: '#icon-shenmasousuo',
      }
      return iconMap[spiderName] || '#icon-chonghai-zhizhu'
    }

    // 获取主机列表
    const fetchHostList = async () => {
      try {
        const result = await GetHostList(null, 1, 400)
        if (result.code === 0) {
          const userInfo = userStore.user && userStore.user.user ? userStore.user.user : userStore.user
          const isAdmin = userInfo && (userInfo.id === 1 || userInfo.authorityId === 888)
          
          if (isAdmin) {
            hostList.value = [{ id: 0, name: '所有主机' }, ...(result.data.items || [])]
          } else {
            if (result.data.items && result.data.items.length > 0) {
              hostList.value = result.data.items
              if (filterForm.value.host_id === 0) {
                filterForm.value.host_id = result.data.items[0].id
              }
            } else {
              hostList.value = []
              Message.warning('您没有可访问的主机')
            }
          }
        } else {
          Message.error(result.msg || '获取主机列表失败')
        }
      } catch (error) {
        Message.error(error.msg || '获取主机列表失败')
      }
    }

    // 获取数据
    const fetchData = async () => {
      loading.value = true
      try {
        const params = {
          page: pagination.value.page,
          pageSize: pagination.value.pageSize,
          host_id: filterForm.value.host_id || 0,
          domain: filterForm.value.domain || '',
          spider_name: filterForm.value.spider_name || '',
          ip: filterForm.value.ip || '',
          start_time: filterForm.value.start_time
            ? dayjs(filterForm.value.start_time).format('YYYY-MM-DD HH:mm:ss')
            : '',
          end_time: filterForm.value.end_time
            ? dayjs(filterForm.value.end_time).format('YYYY-MM-DD HH:mm:ss')
            : '',
          is_spider: true, // 只查询蜘蛛记录
        }

        const response = await getAccessLogList(params)
        if (response.code === 0) {
          dataSource.value = response.data.list || []
          pagination.value.total = response.data.total || 0
        } else {
          Message.error(response.msg || '获取数据失败')
        }
      } catch (error) {
        Message.error(error.msg || '获取数据失败')
      } finally {
        loading.value = false
      }
    }

    // 重置筛选
    const resetFilter = () => {
      filterForm.value = {
        host_id: filterForm.value.host_id, // 保留主机ID
        domain: '',
        spider_name: '',
        ip: '',
        start_time: null,
        end_time: null,
      }
      pagination.value.page = 1
      fetchData()
    }

    // 分页变化
    const pageChange = (page) => {
      pagination.value.page = page
      fetchData()
    }

    // 页面大小变化
    const pageSizeChange = (pageSize) => {
      pagination.value.pageSize = pageSize
      pagination.value.page = 1
      fetchData()
    }

    onMounted(() => {
      fetchHostList()
      fetchData()
    })

    return {
      loading,
      dataSource,
      hostList,
      fieldNames,
      filterForm,
      pagination,
      spiderList,
      columns,
      getSpiderIcon,
      fetchData,
      resetFilter,
      pageChange,
      pageSizeChange,
    }
  },
}
</script>

<style scoped>
.content-wrapper {
  box-sizing: border-box;
  overflow-x: hidden; /* 防止横向滚动 */
  width: 100%;
  max-width: 100%;
}

.content-wrapper :deep(.a-scrollbar) {
  overflow-x: hidden; /* 防止横向滚动 */
  width: 100%;
  max-width: 100%;
}

.content-container {
  width: calc(100% - 20px); /* 减去左右 margin */
  max-width: calc(100% - 20px);
  box-sizing: border-box;
  background-color: var(--color-menu-light-bg);
  border-radius: 5px;
  padding: 10px;
  margin: 10px;
}

.content-space {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 确保所有子元素都不会超出 */
.content-space :deep(*) {
  max-width: 100%;
  box-sizing: border-box;
}

/* 确保 a-row 的 gutter 正常工作，但限制最大宽度 */
.content-space :deep(.arco-row) {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

/* 确保 a-col 宽度正确计算，保持 Arco Design 的默认 gutter 行为 */
.content-space :deep(.arco-col) {
  box-sizing: border-box;
}

/* 确保卡片和表格不会超出 */
.content-space :deep(.arco-card),
.content-space :deep(.arco-table) {
  max-width: 100%;
  box-sizing: border-box;
}

.ali-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}
</style>

