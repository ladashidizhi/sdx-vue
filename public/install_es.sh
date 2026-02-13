#!/bin/bash



# 使用 df 命令获取文件系统的使用情况，并按照可用空间大小进行排序
# 然后使用 awk 提取第一个文件系统的挂载点信息

max_disk=$(df -h | grep '^/dev' | sort -rh -k 4 | awk 'NR==1{print $6}')

# 在最大磁盘路径下创建目录
if [ -n "$max_disk" ]; then
    echo "最大磁盘路径: $max_disk"
    mkdir -p "$max_disk/elasksearch"
    echo "目录创建成功： $max_disk/elasksearch"
else
    echo "无法获取磁盘目录，请联系技术人员！"
fi

# 进入最大磁盘路径下的目录，下载镜像配置文件
cd "$max_disk/elasksearch" || { echo "路径可能不存在，请联系技术人员"; exit 1; }
rm -rf ./*
curl -L "http://license.webstart.vip/share/elasksearch_docker.zip" -o /tmp/elasksearch_docker.zip && unzip /tmp/elasksearch_docker.zip -d "$max_disk/elasksearch"
# 生成 8 位随机密码
password=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 8)
# 将密码替换指定文本文件中的占位符
sed -i "s|{{PASSWORD_PLACEHOLDER}}|$password|g" "$max_disk/elasksearch/docker-compose.yml"
sed -i "s|{{PASSWORD_PLACEHOLDER}}|$password|g" "$max_disk/elasksearch/data01/kibana/kibana.yml"

# 检查 Docker 是否已安装
if ! command -v docker &> /dev/null; then
    echo "缺少Docker环境，开始初始化..."
    # 安装 Docker，具体命令可能因您的系统版本和环境而异
    # 这里假设使用的是 CentOS 系统
    sudo yum install -y docker
    # 启动 Docker 服务
    sudo systemctl start docker
    echo "Docker安装并启动运行..."
else
    echo "Docker已经安装，跳过"
fi

# 检查 Docker Compose 是否已安装
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose不存在，开始安装..."
    # 安装 Docker Compose
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose安装完成"
else
    echo "Docker Compose已经存在，跳过"
fi

# 使用 docker-compose 启动镜像
docker-compose up -d

# 检查镜像是否正常启动运行
if docker ps | grep -q 'es'; then
    echo "Elastic正在运行"
else
    echo "无法启动Elastic"
fi

echo  -e  "\033[42mElastic的授权信息如下，服务地址需要全部填入后台！\033[0m"
echo "密码: $password"
echo "服务地址：http://127.0.0.1:9200"
echo "服务地址：http://127.0.0.1:9201"
echo "服务地址：http://127.0.0.1:9202"
exit 1; 
