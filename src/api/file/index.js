import { Request, GetCancelController } from '@/api/request'
import axios from 'axios'
// GetFileList 获取文件列表
// @param path: 文件路径
// @param hostId: 服务器ID
// @param page: 页码
// @param containSub
export function GetFileList(
  url,
  path,
  hostId,
  page,
  containSub,
  search = false,
  pageSize = 20,
  ensure
) {
  const req = {
    data: {
      path,
      hostId,
      page,
      search,
      pageSize,
      containSub,
      expand: true,
      showHidden: true,
      ensure,
    },
  }
  const controller = GetCancelController(req)

  return {
    controller,
    request: Request({
      method: 'POST',
      url: '/files/search',
      ...req,
      baseURL: url,
    }),
  }
}

// GetDirctorySize 获取文件夹大小
// @param: hostId - 服务器ID
// @param: path - 文件路径
export function GetDirctorySize(url, hostId, path) {
  return Request.post(
    '/files/size',
    {
      hostId,
      path,
    },
    {
      baseURL: url,
    }
  )
}

// SetFileMode 设置文件权限
// @param: hostId - 服务器ID
// @param: path - 文件路径
// @param: isDir - 是否是文件夹
// @param: mode - 文件权限
// @param: sub - 是否包含子目录
export function SetFileMode(url, hostId, path, isDir, mode, sub) {
  return Request.post(
    '/files/mode',
    {
      hostId,
      path,
      isDir,
      mode,
      sub,
    },
    {
      baseURL: url,
    }
  )
}

// RenameFileName 重命名文件名称
// @param: hostId - 服务器ID
// @param: newName - 新的文件路径
// @param: oldName - 旧的文件路径
export function RenameFileName(url, hostId, newName, oldName) {
  return Request.post(
    '/files/rename',
    {
      hostId,
      newName,
      oldName,
    },
    {
      baseURL: url,
    }
  )
}
export function ScpFile(url, data) {
  return Request.post(
    '/files/scp',
    {
      ...data
    },
    {
      baseURL: url,
    }
  )
}

// CreateFile 创建文件
// @param name - 文件名
// @param path - 路径
export function CreateDirctory(url, hostId,path, name, isDir) {
  return Request.post(
    '/files',
    {
      hostId,
      path,
      name,
      isDir,
      mode: 438, // 0666
      isLink: false,
      isSymlink: false,
      linkPath: '',
    },
    {
      baseURL: url,
    }
  )
}

// DeleteDirctoryAndFile 删除目录或者文件
// @param hostId - 服务器ID
// @param isDir - 是否是一个目录
// @param path - 删除路径
export function DeleteDirctoryAndFile(url, hostId, isDir, path) {
  return Request.post(
    '/files/del',
    {
      hostId,
      isDir,
      path,
    },
    {
      baseURL: url,
    }
  )
}

// ReadFile 读取文件
// @param hostId - 服务器ID
// @param path - 文件路径
export function ReadFile(url, hostId, path) {
  return Request.post(
    '/files/loadfile',
    {
      path,
      hostId,
    },
    {
      baseURL: url,
    }
  )
}

// SaveFile 保存文件
// @param hostId - 服务器ID
// @param path - 文件路径
// @param content - 保存的内容
export function SaveFile(url, hostId, path, content) {
  return Request.post(
    '/files/save',
    {
      content,
      hostId,
      path,
    },
    {
      baseURL: url,
    }
  )
}

// RemoveBatchFile 批量删除文件
// @param hostId - 服务器ID
// @param paths - 文件目录
export function RemoveBatchFile(url, hostId, paths) {
  return Request.post(
    '/files/batch/del',
    {
      hostId,
      paths,
      isDir: true,
    },
    {
      baseURL: url,
    }
  )
}

// GetDownloadFile 获取下载路径
// @param - hostId 服务器ID
// @param - path 文件路径
export function GetDownloadFile(url, hostId, path) {
  return Request.post(
    '/files/download/bypath',
    {
      hostId,
      path,
    },
    {
      baseURL: url,
    }
  )
}

// DecompressFile 解压文件
// @param - hostId 主机ID
// @param - dst 解压输出目录
// @param - path 目录
// @param - type 扩展名
export function DecompressFile(url, hostId, dst, path, type) {
  return Request.post(
    '/files/decompress',
    {
      dst,
      hostId,
      path,
      type,
    },
    {
      baseURL: url,
    }
  )
}

// CompressFile 压缩文件
// @param - hostId 主机ID
// @param - files 文件
// @param - type 压缩文件类型
// @param - name 压缩文件的文件名
// @param - replace 是否覆盖
export function CompressFile(url, hostId, files, type, dst, name, replace) {
  return Request.post(
    '/files/compress',
    {
      hostId,
      files,
      type,
      dst,
      name,
      replace,
    },
    {
      baseURL: url,
    }
  )
}

// MoveFile 文件转移
// @param - hostId 主机ID
// @param - newPath 目标路径
// @param - oldPaths 选取的路径
// @param - type cut-剪切 copy-复制
export function MoveFile(url, hostId, newPath, oldPaths, type) {
  return Request.post(
    '/files/move',
    {
      hostId,
      newPath,
      oldPaths,
      type,
    },
    {
      baseURL: url,
    }
  )
}

// FileDownload 远程文件下载
// @param - hostId 主机ID
// @param - url 下载地址
// @param - path 保存路径
// @param - name 文件名称
export function FileDownload(request, hostId, url, path, name) {
  return Request.post(
    '/files/wget',
    {
      hostId,
      url,
      path,
      name,
    },
    {
      baseURL: request,
    }
  )
}

// TestFile 检测文件是否存在
// @param - hostId 主机ID
// @param - path 路径
export function TestFile(url, hostId, path) {
  return Request.post(
    '/files/check',
    {
      hostId,
      path,
    },
    {
      baseURL: url,
    }
  )
}
// 
export async function getWebSitePath(hostId) {
  try {
    const request = await Request.get('/websites/sitePath', {
      params: {
        hostId: hostId,
      },
    })
    if (request.code === 7) {
      throw request
    } else {
      return request
    }
  } catch (e) {
    Message.error(e.msg)
  }
}


///清理缓存
export async function delDomainHtml(domain,hostId) {
  const request = await Request.get(`/infinite_website/domains/delDomainHtml`,{
    params:{
      domains:domain,
      hostId:hostId
    }
  })
  if (request.code === 7) {
    Message.error(request.msg)
    return request
  } else {
    return request
  }
}
