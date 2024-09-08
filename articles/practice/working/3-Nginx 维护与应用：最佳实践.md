---
id: nginx-maintenance-using
sidebar_position: 3
title: Nginx 维护与应用：最佳实践
description: Nginx 维护与应用：最佳实践
last_update:
  author: Aurelius
  date: 2024-09-01
tags:
  - Nginx
  - 维护
  - 应用
  - 最佳实践
---

## 引言

Nginx 是一款高性能的 Web 服务器和反向代理服务器，广泛应用于互联网服务的负载均衡、反向代理、动静分离、缓存等场景中。本文将深入介绍 Nginx 基本维护与场景应用的最佳实践，包括基础的安装、各类场景的配置、监控与性能优化、高可用性配置、缓存机制、CDN 结合等方面的内容。

![Cover](<assets/Nginx 维护与应用：最佳实践.drawio.png>)

## 安装与基础维护

Nginx 的安装方法依据操作系统的不同而有所不同，以下是主要操作系统的安装方式：

### macOS 上安装 Nginx

在 macOS 上安装 Nginx 可以通过多种方法，以下是几种常用的安装方式：

**使用 Homebrew 安装**

1. **安装 Homebrew**（如果尚未安装）：
   打开终端并运行以下命令：

   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **安装 Nginx**：
   确保 Homebrew 已经更新，然后使用以下命令安装 Nginx：

   ```bash
   brew update
   brew install nginx
   ```

3. **启动 Nginx**：
   安装完成后，可以通过以下命令启动 Nginx：

   ```bash
   brew services start nginx
   ```

4. **访问 Nginx**：
   打开浏览器，访问 `http://localhost:8080`。默认情况下，Nginx 会在 8080 端口上运行。

5. **停止 Nginx**：
   如果需要停止 Nginx，可以使用以下命令：

   ```bash
   brew services stop nginx
   ```

**从源代码编译安装**

1. **安装依赖**：
   确保安装了 `gcc` 和 `make`，可以通过 Homebrew 安装：

   ```bash
   brew install gcc
   ```

2. **下载 Nginx 源代码**：
   访问 [Nginx 官网](http://nginx.org/en/download.html)，下载最新的源代码包，或在终端中运行：

   ```bash
   curl -O http://nginx.org/download/nginx-1.x.x.tar.gz
   ```

   请替换 `1.x.x` 为实际版本号。

3. **解压并编译**：

   ```bash
   tar -zxvf nginx-1.x.x.tar.gz
   cd nginx-1.x.x
   ./configure
   make
   sudo make install
   ```

4. **启动 Nginx**：
   使用以下命令启动 Nginx：

   ```bash
   sudo /usr/local/nginx/sbin/nginx
   ```

5. **访问 Nginx**：
   在浏览器中访问 `http://localhost`。

**使用 Docker 安装**

如果已经安装了 Docker，可以通过 Docker 安装 Nginx：

1. **拉取 Nginx 镜像**：

   ```bash
   docker pull nginx
   ```

2. **运行 Nginx 容器**：

   ```bash
   docker run --name my-nginx -p 8080:80 -d nginx
   ```

3. **访问 Nginx**：
   在浏览器中访问 `http://localhost:8080`。

### Ubuntu 上安装 Nginx

```bash
sudo apt update
sudo apt install nginx
```

### CentOS 上安装 Nginx

```bash
# 添加 nginx 的yum repro库
rpm -ivh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm

# 查看 nginx 信息
sudo yum info nginx

# 安装 nginx
sudo yum install -y nginx

# 启动 nginx
sudo systemctl start nginx.service # Ubuntu
sudo service nginx start           # CentOS

# 停止 Nginx
sudo systemctl stop nginx         # Ubuntu
sudo service nginx stop           # CentOS

# 重启 Nginx
sudo systemctl restart nginx      # Ubuntu
sudo service nginx restart        # CentOS

# sudo yum install epel-release
# sudo yum install nginx
```

### Windows 上安装 Nginx

1. 下载 Nginx 压缩包。
2. 解压到希望的目录。
3. 通过命令行进入解压目录，执行 `start nginx` 启动。

### 查看 Nginx 运行状态与日志信息（Linux）

运行状态可以通过以下命令检查：

```bash
sudo systemctl status nginx       # 状态检查
```

Nginx 日志文件通常位于 `/var/log/nginx/access.log` 和 `/var/log/nginx/error.log`，可以使用以下命令查看：

```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 版本升级与配置备份（Linux）

**版本升级**

在 Ubuntu 上，可以通过以下命令来升级：

```bash
sudo apt update
sudo apt upgrade nginx
```

在 CentOS 中，使用：

```bash
sudo yum update nginx
```

**配置文件备份**

使用以下命令备份配置文件：

```bash
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak
```

定期进行备份与版本升级是保障服务稳定的重要措施。可以考虑使用自动化脚本来执行这些任务，提升工作效率。

## Nginx 应用场景

### Web 服务器

Nginx 可以作为静态文件的 Web 服务器，以下是基本配置示例：

```nginx
server {
    listen 80;                      # 监听端口
    server_name example.com;        # 域名

    location / {                    # 根目录
        root /var/www/html;         # 网站根目录
        index index.html index.htm; # 默认首页
    }
}
```

### 反向代理

`反向代理`（`Reverse Proxy`）方式是指以代理服务器来接受 internet 上的连接请求，然后将请求转发给内部网络上的服务器，并将从服务器上得到的结果返回给 internet 上请求连接的客户端，此时代理服务器对外就表现为一个服务器。

```nginx
server {
    listen 80;
    server_name  nginx-01.edu.cn;   # nginx 所在服务器的主机名

    # 反向代理的配置
    location / {                    # 拦截所有请求
        root html;
        # 这里是代理走向的目标服务器：比如 tomcat
        proxy_pass http://192.168.0.21:8080;
    }
}
```

### 动静分离

`动静分离`是指将动态页面和静态页面分开处理，静态页面由 Nginx 处理，动态页面由后端服务器处理。以下是一个简单的配置示例：

```nginx
# 动态资源 index.jsp
location ~ .*\.(jsp|do|action)$ {
    proxy_pass http://tomcat-01.itcast.cn:8080;
}

# 静态资源
location ~ .*\.(html|js|css|gif|jpg|jpeg|png)$ {
    expires 3d;
}
```

### 负载均衡

`负载均衡`（`Load Balance`）指建立在现有网络结构之上，并提供了一种廉价有效透明的方法扩展网络设备和服务器的带宽、增加吞吐量、加强网络数据处理能力、提高网络的灵活性和可用性。其原理就是数据流量分摊到多个服务器上执行，减轻每台服务器的压力，多台服务器共同完成工作任务，从而提高了数据的吞吐量。

```nginx
# 在 http 这个节下面配置一个叫 upstream 的，后面的名字可以随意取，但是要和 location 下的 proxy_pass http://后的保持一致
http {
    # 是在 http 里面的, 已有 http, 不是在 server 里,在 server 外面
    upstream tomcats {
        server shizhan02:8080 weight=1; #weight表示多少个
        server shizhan03:8080 weight=1;
        server shizhan04:8080 weight=1;
    }

    # 卸载 server 里
    location ~ .*\.(jsp|do|action) {
        # tomcats 是后面的 tomcat 服务器组的逻辑组号
        proxy_pass http://tomcats;
    }
}
```

### 访问日志文件

添加对 log 文件的浏览器查看：

```nginx
# 修改nginx mime.types，为text/plain 添加log类型文件
types{
    text/plain txt log;
}
```

添加服务监听路径：

```nginx
server {
    listen       80;
    server_name  localhost;
    location /logs/ {
        #log日志存放目录
        alias /home/logs/;

        #打开目录浏览功能
        autoindex on;

        #默认为on，显示出文件的确切大小，单位是bytes
        #显示出文件的大概大小，单位是kB或者MB或者GB
        autoindex_exact_size off;

        #默认为off，显示的文件时间为GMT时间。
        #改为on后，显示的文件时间为文件的服务器时间
        autoindex_localtime on;

        add_header Cache-Control no-store;

        if (-f $request_filename){
            #定义文档以及编码格式防止乱码
            add_header Content-Type "text/plain;charset=utf-8";
            }
        }
    }
 }
```

重启 nginx：

```shell
sudo nginx -s reload
```

```nginx
server {
        listen 80;
        server_name localhost;
        charset utf-8;

        # location /pos-cloud/ {
        #        proxy_pass http://localhost:8085/pos-cloud/;
        # }

        location /pos/ {
                alias /app/cloud-galaxy-web/;
        }
}
```

### 性能监控

可以通过 Nginx 的 `stub_status` 模块监控性能指标，以下是基本配置：

```nginx
server {
    location /nginx_status {
        stub_status on;
        allow 127.0.0.1;  # 允许的 IP 地址
        deny all;         # 拒绝其他地址
    }
}
```

你可以通过访问 `http://your-server/nginx_status` 来查看连接数、请求情况等。

### 性能优化

为提高性能，可以对 Nginx 的一些参数进行调优，如下：

```nginx
http {
    gzip on;                                # 启用 Gzip 压缩
    gzip_types text/plain application/json; # 压缩类型
    worker_processes 4;                     # 进程数
    worker_connections 1024;                # 每个进程的最大连接数
}
```

- 使用 Gzip 压缩静态内容。
- 设置适当的 `worker_processes` 和 `worker_connections`。

在监控和优化方面，使用图形化监控工具（如 Grafana 和 Prometheus）能够更直观地获取性能数据，建议在服务器架构中集成这样的工具。

## 负载均衡策略

负载均衡是一种能够均匀分配请求的技术，可以提高 Web 应用的响应速度与可靠性。

### 负载均衡算法

Nginx 提供几种负载均衡算法：

- **轮询（Round Robin）**：默认为均匀分配请求。
- **最少连接（Least Connections）**：将请求转发到当前连接数最少的服务器。
- **IP 哈希（IP Hash）**：根据客户 IP 地址的 hash 值，将请求分配到特定的服务器。

### 配置示例

对负载均衡配置，以下是不同算法的示例：

**轮询**

```nginx
upstream backend {
    server backend1.example.com;
    server backend2.example.com;
}
```

**最少连接**

```nginx
upstream backend {
    least_conn;  # 使用最少连接算法
    server backend1.example.com;
    server backend2.example.com;
}
```

**IP 哈希**

```nginx
upstream backend {
    ip_hash;  # 使用 IP 哈希算法
    server backend1.example.com;
    server backend2.example.com;
}
```

### 性能评估

依据不同的负载均衡策略，监控一些关键性能指标，包括：

- **响应时间**：平均请求响应时间。
- **服务器负载**：每个后端服务器的 CPU 和内存使用率。
- **请求成功率**：成功处理的请求占总请求的比例。

考虑一个视频流媒体服务，接入高并发请求，通过 Nginx 实现多服务器负载均衡。在高峰期，采用最少连接算法可有效分散负载，提高用户观看体验。

负载均衡的实施需要根据业务场景进行调整，可以利用机器学习技术动态调整负载均衡策略，从而实现实时响应变化。

## 反向代理与微服务架构

反向代理是一种代理服务器，用户请求会先发送到反向代理，然后由代理选择合适的后端服务进行处理。Nginx 可作为高效的反向代理服务器。

### Nginx 反向代理配置

反向代理可以通过简单的配置实现：

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://backend;  # 将请求代理到 backend
        proxy_set_header Host $host;  # 保留原始 Host 头信息
    }
}
```

### 在微服务架构中的应用

在微服务架构中，Nginx 经常用于服务网关，负责路由、负载均衡和安全控制。以下是微服务场景的示例配置：

```nginx
http {
    upstream service1 {
        server service1.example.com;
    }

    upstream service2 {
        server service2.example.com;
    }

    server {
        listen 80;

        location /service1/ {
            proxy_pass http://service1;
        }

        location /service2/ {
            proxy_pass http://service2;
        }
    }
}
```

### 性能监控与优化指标

监控反向代理的性能主要关注以下几个指标：

- **请求转发时间**：从接收到请求到响应的总时间。
- **后端服务响应时间**：后端服务的处理时间。

某在线教育平台采用微服务架构，利用 Nginx 作为反向代理，统计用户请求并根据访问频率自动转发至不同的服务。

- **实施效果**：
  - 通过 Nginx 的负载均衡功能，分配用户请求，减少单一服务压力。
  - 监控后端服务性能，确保响应时间稳定在 200 毫秒以内。

结合 API 网关技术，可以进一步增强 Nginx 作为反向代理的能力，实现更复杂的请求路由与服务治理功能。

## Nginx 安全性

### 防 DDoS 攻击

可以通过限制连接数来减轻 DDoS 攻击的影响：

```nginx
http {
    limit_conn_zone $binary_remote_addr zone=addr:10m;  # 定义连接数限制区域

    server {
        location / {
            limit_conn addr 10;                         # 限制每个 IP 同时连接数
        }
    }
}
```

### 配置 SSL 证书

确保通信的安全性，配置 SSL 如下：

```nginx
server {
    listen 443 ssl;                                     # 监听 443 端口
    server_name example.com;                            # 域名

    ssl_certificate /etc/ssl/certs/ssl-cert.pem;        # SSL 证书
    ssl_certificate_key /etc/ssl/private/ssl-key.pem;   # SSL 证书密钥

    location / {
        root /var/www/html;                             # 网站根目录
    }
}
```

### 访问控制

可限制特定 IP 地址访问：

```nginx
server {
    location / {
        allow 192.168.1.1;  # 允许的 IP
        deny all;           # 拒绝其他 IP
    }
}
```

### 定期安全检查

使用工具（如 Lynis 或 OpenVAS）定期检查 Nginx 安全性，对发现的漏洞进行及时修复。

结合防火墙（如 iptables 或 fail2ban）与 Nginx 的访问控制可以更有效地防御攻击，建立多层的安全防护体系。

## 高可用性与集群配置

`高可用性`（`High Availability`, `HA`）指的是系统在给定时间内可用性最大化，确保服务持续运行。在 Nginx 环境中，通过冗余配置和负载均衡可以实现高可用性。

### Nginx 集群配置

为实现高可用性，通常会将多个 Nginx 实例组合成一个集群。常见的方法有使用 Keepalived 和 HAProxy 或直接在 Nginx 中实现负载均衡。

**使用 Keepalived 进行 Nginx 高可用性配置**

```bash
# 在主 Nginx 上配置：
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 101
    authentication {
        auth_type PASS
        auth_pass 1234
    }
    virtual_ipaddress {
        192.168.0.100  # 虚拟 IP
    }
}

# 在备份 Nginx 上配置：
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 100
    authentication {
        auth_type PASS
        auth_pass 1234
    }
    virtual_ipaddress {
        192.168.0.100
    }
}
```

### 健康检查配置

集群中的每个实例都应通过健康检查来监控其状态。可以使用 Nginx 的 `proxy_pass` 结合健康检查功能来定期检查后端服务的状态。例如：

```nginx
http {
    upstream backend {
        server backend1.example.com;
        server backend2.example.com;
        # 使用健康检查
        server backend3.example.com max_fails=3 fail_timeout=30s;
    }

    server {
        location / {
            proxy_pass http://backend;
        }
    }
}
```

### 演示案例

假设有一个电商网站，使用 Nginx 作为负载均衡器。通过以上配置实现高可用性，并在接口请求失败时自动切换到备份方案。

- **Cluster 设计**：
  - 主 Nginx 和备份 Nginx 各 serve 应用，使用 Keepalived 进行监控和快速切换。
  - 假设某个用户在高峰期访问，如果主 Nginx 故障，用户请求会瞬间转移至备份 Nginx，而不导致实际服务中断。

整合云服务提供商的负载均衡服务（如 AWS ELB），可以进一步增强高可用性，同时减少运维负担。根据业务需求和流量大小进行动态扩展，优化资源利用效率。

## 缓存机制与 CDN

缓存是提高 Web 应用性能的重要手段，通过临时存储经常请求的数据减少数据库负载，并降低请求响应时间。

### Nginx 的缓存机制

Nginx 提供了多种缓存机制，包括硬盘缓存和内存缓存。通过配置 `proxy_cache` 和 `fastcgi_cache`，可以有效地存储和管理缓存内容。

**硬盘缓存配置示例**

```nginx
http {
    proxy_cache_path /tmp/cache levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;               # 缓存路径和大小

    server {
        location /api/ {
            proxy_pass http://backend;                 # 后端服务
            proxy_cache my_cache;                      # 使用缓存
            proxy_cache_valid 200 1h;                  # 缓存成功响应 1 小时
        }
    }
}
```

### 缓存策略

合理的缓存策略是实现高效率缓存的关键。可以设置缓存过期时间、指定哪些内容需要缓存，以及针对特定的请求条件（如 URL 参数）进行缓存。

**缓存策略示例**

```nginx
location /images/ {
    proxy_cache my_cache;           # 使用缓存
    proxy_cache_valid 200 30d;      # 图片缓存 30 天
}

location /api/ {
    proxy_cache my_cache;
    proxy_cache_bypass $arg_nocache;  # 根据 URL 参数控制是否缓存
}
```

### 性能监控

缓存的效果需要通过以下指标进行监控：

- **缓存命中率**：命中缓存的请求占总请求的比例。
- **缓存使用率**：已经使用的缓存空间占总缓存空间的比例。

在一个电商网站中，通常商品信息请求量较大。可以通过 Nginx 配置缓存，减少数据库的请求频率，从而加速页面加载。

- **实施效果**：
  - 使用硬盘缓存策略，为商品页面设置缓存，有效减少后端数据库的负担。
  - 监控缓存命中率，确保能达到 90% 以上的命中率，提升用户体验。

可结合机器学习算法，根据用户访问习惯和实时请求数据动态调整缓存策略，使缓存机制更智能。

### Nginx 作为 CDN 边缘服务器

`内容分发网络`（`CDN`）通过全球部署的节点减少延迟，提高内容交付效率。

Nginx 可以配置为处理静态内容并作为 CDN 的边缘服务器，为用户提供更快的访问速度。

**推荐配置**

通过 Nginx 定义 CDN 的静态文件处理规则：

```nginx
server {
    listen 80;
    server_name cdn.example.com;    # CDN 域名

    location / {
        root /path/to/static/files; # 静态文件目录
        expires 30d;                # 设置缓存过期时间
    }
}
```

### 性能监控

通过配置 `proxy_cache`，可监控缓存命中率和使用频率，进一步优化性能。

```nginx
http {
    proxy_cache_path /tmp/cache keys_zone=my_cache:10m; # 缓存路径和大小

    server {
        location / {
            proxy_cache my_cache;                       # 使用缓存
            proxy_pass http://backend;                  # 后端服务
        }
    }
}
```

假设一家新闻网站配置了 CDN 以减少页面加载时间。Nginx 作为 CDN 边缘节点，每次访问都能将静态内容（如图片和文章）按千次提供，显著提升用户体验。

将 Nginx 与智能 CDN 结合（如 Cloudflare），可以实现实时监控和动态内容调整，提供更智能的内容交付服务。

## 通过 Docker 部署 Nginx

Docker 是一种快速、轻量的容器化技术，允许开发者将应用及其所有依赖一起打包为容器，以实现轻松部署和扩展。

### Docker 的基本配置

在 Docker 环境中运行 Nginx，首先需要构建 Dockerfile：

```Dockerfile
FROM nginx:latest

COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY ./html /usr/share/nginx/html
```

然后通过 Docker-compose 配置启动 Nginx 实例：

```yaml
version: '3'
services:
  nginx:
    image: nginx:latest
    ports:
      - '80:80'
    volumes:
      - ./html:/usr/share/nginx/html
      - ./nginx.conf:/etc/nginx/nginx.conf
```

### 容器间通信

在多容器环境中，使用 Docker 网络绘制 Nginx 和后端服务之间的通信：

```yaml
services:
  nginx:
    networks:
      - my_network
  backend:
    networks:
      - my_network

networks:
  my_network:
```

### 性能监控

监控 Docker 中 Nginx 的性能，需要结合 Docker 自身的监控工具和第三方工具（如 Prometheus）：

- **关键监控指标**：
  - **容器 CPU/内存使用率**：监控 Nginx 容器的资源占用。
  - **请求延迟**：分析请求流量的延迟情况。

某 SaaS 平台基于 Docker 部署 Nginx 与后端服务为微服务架构，利用 Docker Compose 管理多个容器。

- **实施效果**：
  - 灵活调度服务，快速进行横向扩展，随时处理高峰流量。
  - 清晰的网络架构，监控各个服务的健康状况。

结合 Kubernetes，可以提升弹性扩展能力，实现更复杂的服务管理和负载均衡。

## Nginx 异常：403 Forbidden（子路径）

在 Nginx 中收到 "403 Forbidden" 错误通常表示客户端没有访问指定资源的权限。以下是一些常见原因及其解决方法：

### 文件和目录权限

确保 Nginx 具有访问文件和目录的权限。执行以下命令以更改文件权限和所有者：

```bash
sudo chown -R www-data:www-data /path/to/your/root
sudo chmod -R 755 /path/to/your/root
```

将 `/path/to/your/root` 替换为你的网站根目录路径。

### Nginx 配置文件

检查你的 Nginx 配置文件，确保没有设置错误的访问限制。例如，确认以下内容：

```nginx
location / {
    root /path/to/your/root;
    index index.html;
}
```

确保 `root` 指令正确设置，并且没有 `deny all;` 的配置。

### SELinux 配置（如果适用）

如果你的系统启用了 SELinux，它可能会阻止 Nginx 访问指定的目录。可以临时禁用 SELinux 来检查是否是这个原因：

```bash
sudo setenforce 0
```

如果禁用后可以正常访问，则需要为 Nginx 设置合适的上下文。可以使用以下命令：

```bash
sudo chcon -R -t httpd_sys_content_t /path/to/your/root
```

### .htaccess 文件（如果适用）

如果你的应用使用 `.htaccess` 文件，请确保这些规则不导致 Nginx 返回 403 错误。请注意，Nginx 不支持 `.htaccess`，你需要将其内容复制到 Nginx 配置文件中的相应位置。

### 日志文件查看

查看 Nginx 错误日志，以获取更详细的信息，通常位于 `/var/log/nginx/error.log`：

```bash
sudo tail -f /var/log/nginx/error.log
```

从日志中可以找到更具体的错误信息，帮助你定位问题。

### 其他潜在问题

- 确保 Nginx 服务正在运行，且未意外关闭。
- 检查你的防火墙设置，确保允许访问 Nginx。

根据上述步骤排查问题，应该可以解决 403 Forbidden 错误。

## Nginx 异常：404 Not Found

```
nginx 抛异常：[error] 886097#0: *18 open() "/var/www/threefish.site/trend/catalog" failed (2: No such file or directory), client: 121.15.191.198, server: threefish.site, request: "GET /trend/catalog HTTP/2.0", host: "threefish.site"
```

要在 Nginx 中配置自动添加 `.html` 后缀，通常的做法是使用 `try_files` 指令与重写（rewrite）规则。这种配置可以使得用户在访问没有后缀的 URL 时，Nginx 自动重定向到带有 `.html` 后缀的文件。

### 示例配置

以下是在 Nginx 配置文件中实现该功能的步骤：

1. **打开 Nginx 配置文件**：

   你可以在 `/etc/nginx/sites-available/` 目录中找到你的站点配置文件，通常是名为 `default` 或你的域名。

   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

2. **添加以下配置**：

   在 `server` 块中，添加以下配置。你需要将 `your_root_directory` 替换为实际的文档根目录。

   ```nginx
   server {
       listen 80;
       server_name your_domain.com;

       root /var/www/your_root_directory;

       location / {
           try_files $uri.html $uri /index.html;  # 尝试访问 .html 文件
       }

       # 其他 location 配置
   }
   ```

   解释：

   - `try_files $uri.html $uri /index.html;` 这行将首先尝试访问带 `.html` 后缀的文件，如果找不到，则访问原始 URI。如果仍然找不到，将访问 `index.html` 文件。

3. **重载 Nginx 配置**：

   修改完成后，保存并退出编辑器，然后重载 Nginx 配置以使更改生效：

   ```bash
   sudo systemctl reload nginx
   ```

### 注意事项

- 确保你的网页文件名正确，并以 `.html` 结尾。
- 可能还需要对 HTTPS 配置进行类似的设置。
- 如果希望在访问中添加 `.html` 后缀后进行重定向（例如，从 `/example` 重定向到 `/example.html`），可以添加如下配置：

  ```nginx
  location / {
      rewrite ^/(.*)$ $1.html last;  # 重写URL以添加.html后缀
  }
  ```

  **注意:** 这种方式会造成用户在访问时的 URL 改变。

通过上述配置，可以实现让浏览器地址后面自动加 `.html` 后缀的效果。

## 结语

Nginx 是开发者和运维人员常用的 Web 服务器和反向代理工具，具有高性能、高可靠性和丰富的功能。我们对 Nginx 的基本安装、配置和常见应用场景需要有足够的了解，对于如何通过 Nginx 实现高可用性、负载均衡、缓存和 CDN 等功能也需要有一定的认识。

Nginx 可以帮助企业建立稳定、高效的服务架构，但 Nginx 维护与应用具有一定的深度和广度，以上关于 Nginx 维护与应用的最佳实践提供了全方位的参考，为系统架构师和运维团队可以根据具体的应用场景和需求进行调整和优化。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
