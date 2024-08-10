---
id: install
sidebar_position: 1
title: 安装 Python（CentOS 8）
description: 安装 Python（CentOS 8）
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - 安装 Python（CentOS 8）
---

### 1. 安装依赖包

安装从源代码编译 python 需要的 `C/C++` 编译器和其他开发包；

```shell
sudo dnf groupinstall 'development tools'
sudo dnf install bzip2-devel expat-devel gdbm-devel \
    ncurses-devel openssl-devel readline-devel \
    sqlite-devel tk-devel xz-devel zlib-devel wget
```

### 2. 下载 python

```shell
VERSION=3.8.2
wget https://www.python.org/ftp/python/${VERSION}/Python-${VERSION}.tgz
```

### 3. 解压 tgz 包

```shell
# tar -zxvf Python-3.8.2.tgz
tar -xf Python-${VERSION}.tgz
```

### 4. configure

进入 python 目录，运行 `configure` 脚本，该脚本执行许多检查以确保系统上的所有依赖项都存在，该 `--enable-optimizations` 选项通过运行多个测试来优化 python 二进制文件；

```shell
# cd /usr/local/Python-3.8.2/
cd Python-${VERSION}
./configure --enable-optimizations
```

### 5. 编译

`-j` 使其与处理器中的内核数量相对应；

```shell
make -j 2
```

### 6. 安装

不要使用该标准 `make install`，因为它将覆盖默认的系统 python 二进制文件；

```shell
sudo make altinstall
```

### 7. 验证

```shell
python3.8 --version
```

### 8. 创建虚拟环境

```shell
mkdir ~/my_app && cd ~/my_app
python3.8 -m venv my_app_venv
```

### 9. 激活环境

```shell
source my_app_venv/bin/activate
```

### 10. 返回到常规 shell

```shell
deactivate
```

---

- 专栏：[《Python 基础》](https://blog.csdn.net/chaoming_h/category_7726265.html)

**PS：感谢每一位志同道合者的阅读，欢迎关注、评论、赞！**
