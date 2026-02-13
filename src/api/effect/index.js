import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// SEO概览
export async function postOverview(data) {
  try {
    const request = await Request.post('/seo/overview/list', {
      startTime: data.startTime,
      endTime: data.endTime,
      page: data.page,
      pageSize: data.pageSize,
      hostID: data.hostID,
    })
    if (request.code === 7) {
      Message.error(e.msg)
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
// SEO概览-chart
export async function postOverviewChart(data) {
  try {
    const request = await Request.post('/seo/overview/chart', {
      startTime: data.startTime,
      endTime: data.endTime,
      hostID: data.hostID,
    })
    if (request.code === 7) {
      Message.error(request.msg)
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
// SEO概览详情
export async function postSeoDetail(data) {
  try {
    const request = await Request.post('/seo/overview/detail', {
      startTime: data.startTime,
      endTime: data.endTime,
      WebsiteID: data.websiteId,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
// 蜘蛛抓取效果
export async function postSeoSpider(data) {
  try {
    const request = await Request.post('/seo/spider', {
      startTime: data.startTime,
      endTime: data.endTime,
      websiteID: data.websiteID,
      page: data.page,
      pageSize: data.pageSize,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
// 建站历史
export async function postSeoHistory(webSiteId) {
  try {
    const request = await Request.get(`/seo/history/${webSiteId}`)
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

///竞争研判
export async function postWord(word) {
  try {
    const request = await Request.post('/seo/challenge', {
      word: word,
    })
    if (request.code === 7) {
      throw request
    } else {
      Message.success(request.msg)
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}
