import { Request } from '../request'
import { Message } from '@arco-design/web-vue'
// 添加采集
export async function GetOverviewFlow(uuid) {
  try {
    const request = await Request.get(`/websites/overview/flow?uuid=${uuid}`)
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}

export async function GetEveryDayFlow(uuid) {
  const request = await Request.get(
    `/websites/overview/EveryDayFlow?uuid=${uuid}`
  )
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}

///---趋势图----

export async function GetTrendChart(data) {
  const request = await Request.get('/websites/overview/TrendChart', {
    params: {
      uuid: data.uuid,
      typeAline: data.typeAline,
      contrast: data.contrast,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}
///tp10搜索词

export async function GetSearchTerms(data) {
  const request = await Request.get('/websites/overview/GetSearchTerms', {
    params: {
      uuid: data.uuid,
      typeAline: data.typeAline,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}
//Top10来源网站
export async function GetSourceWebsite(data) {
  const request = await Request.get('/websites/overview/GetSourceWebsite', {
    params: {
      uuid: data.uuid,
      typeAline: data.typeAline,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}

///Top10入口页面
export async function GetSearchPage(data) {
  const request = await Request.get('/websites/overview/GetSourcePage', {
    params: {
      uuid: data.uuid,
      typeAline: data.typeAline,
    },
  })
  if (request.code === 7) {
    Message.error(request.msg)
  } else {
    return request
  }
}

///详情
export async function PostEcharts(data) {
  const request = await Request.post('/websites/overview/TrendChartInfo', {
    uuid: data.uuid,
    start_time: data.start_time,
    end_time: data.end_time,
    time_req: data.time_req,
    class_ify: data.class_ify,
    device: data.device,
    visitor: data.visitor,
    rule_Referer: data.rule_Referer,
    size: 50000,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///新老访客
export async function PostNewOldVisitor(data) {
  const request = await Request.post('/websites/overview/NewOldVisitor', {
    uuid: data.uuid,
    start_time: data.start_time,
    end_time: data.end_time,
    time_req: data.time_req,
    class_ify: data.class_ify,
    device: data.device,
    visitor: data.visitor,
    rule_Referer: data.rule_Referer,
    size: 50000,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}

///地图
export async function PostRegionInfo(data) {
  const request = await Request.post('/websites/overview/RegionInfo', {
    uuid: data.uuid,
    start_time: data.start_time,
    end_time: data.end_time,
    time_req: data.time_req,
    class_ify: data.class_ify,
    device: data.device,
    visitor: data.visitor,
    rule_Referer: data.rule_Referer,
    size: 50000,
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
