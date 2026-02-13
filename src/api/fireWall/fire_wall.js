import { Request } from '../request'
import { Message } from '@arco-design/web-vue'

export function GetFirewall(hosts_id) {
    return Request.get('/firewall/config', {
      params: {
        host_id: hosts_id,
      },
    })
  }
  export async function PutFirewall(hosts_id,params) {
    // return Request.post('/firewall/config?host_id='+hosts_id, {
    //     params
    // })
    try {
        const request = await Request.post("/firewall/config?host_id="+hosts_id,{
            super:{
                type:Number(params.super.type),
                ip_list:params.super.ip_list,
            },
            region:{
                type:Number(params.region.type),
                region_list:params.region.region_list,
                ip_list:params.region.ip_list,
            },
            tcp:{
                type:Number(params.tcp.type),
                white_list:params.tcp.white_list,
                black_list:params.tcp.black_list,
            },udp:{
                type:Number(params.udp.type),
                white_list:params.udp.white_list,
                black_list:params.udp.black_list,
            },geoipfile:{
                type:Number(params.geoipfile.type),
                model:Number(params.geoipfile.model),
                filePath:params.geoipfile.filePath,
            },
            crossfile:{
              type:Number(params.crossfile.type),
              hosts:params.crossfile.hosts,
          }
        })
        if (request.code === 7) {
          throw request
        } else {
          // Message.success(request.msg)
          return request
        }
      } catch (e) {
        Message.error(e.msg)
      }

  }

  export async function OpenCrosswall(host_id,enable) {
    try {
      const request = await Request.post("/firewall/crosswall?host_id="+host_id+"&enable="+enable, {
        
      })
      if (request.code === 7) {
        throw request
      } else {
        // Message.success(request.msg)
        return request
      }
    } catch (e) {
      Message.error(e.msg)
    }
  }

  export async function Getareacodes(host_id,enable) {
    try {
      const request = await Request.get("/security/areacodes", {
        
      })
      return request
    } catch (e) {
      Message.error(e.msg)
    }
  }