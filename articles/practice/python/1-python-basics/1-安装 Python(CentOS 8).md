---
id: install
sidebar_position: 1
title: 安装 Python (CentOS 7/8、macOS、Debian、Windows 11)
description: 安装 Python (CentOS 7/8、macOS、Debian、Windows 11)
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - 安装
  - CentOS
  - macOS
  - Debian
  - Windows
---

## CentOS 8 安装 Python

### 安装依赖包

安装从源代码编译 python 需要的 `C/C++` 编译器和其他开发包；

```shell
sudo dnf groupinstall 'development tools'
sudo dnf install bzip2-devel expat-devel gdbm-devel \
    ncurses-devel openssl-devel readline-devel \
    sqlite-devel tk-devel xz-devel zlib-devel wget
```

### 下载 Python

```shell
VERSION=3.12.5
wget https://www.python.org/ftp/python/${VERSION}/Python-${VERSION}.tgz
```

### 解压 tgz 包

```shell
# tar -zxvf Python-3.12.5.tgz
tar -xf Python-${VERSION}.tgz
```

### configure

进入 python 目录，运行 `configure` 脚本，该脚本执行许多检查以确保系统上的所有依赖项都存在，该 `--enable-optimizations` 选项通过运行多个测试来优化 python 二进制文件；

```shell
# cd /usr/local/Python-3.12.5/
cd Python-${VERSION}
./configure --enable-optimizations
```

### 编译

`-j` 使其与处理器中的内核数量相对应；

```shell
make -j 2
```

### 安装

不要使用该标准 `make install`，因为它将覆盖默认的系统 python 二进制文件；

```shell
sudo make altinstall
```

### 验证

```shell
python3.12 --version
```

## CentOS 7

### 安装

**启用 EPEL 和 Software Collections (SCL)**

```bash
sudo yum install -y epel-release
sudo yum install -y centos-release-scl
```

**安装 Python**

```bash
sudo yum install -y rh-python38  # 目前 CentOS 7 对 Python 版本的支持较为有限，可能需要指定 Python 3.8
```

**使用 SCL 激活 Python**：

```bash
scl enable rh-python38 bash
```

### 验证

在终端中输入：

```bash
python3 --version
```

#### 卸载 Python

在终端中运行：

```bash
sudo yum remove rh-python38
```

## macOS (14.6) 安装 Python (3.12)

### 安装

**使用 Homebrew 安装**：

首先，确保已经安装了 Homebrew。如果没有安装，可以在终端中运行以下命令：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

安装 Python 3.12

```bash
brew install python@3.12
```

**直接下载安装包**

访问 [Python 官方网站](https://www.python.org/downloads/)，下载适用于 macOS 的安装程序并运行。

### 验证

打开终端，输入以下命令以查看版本：

```bash
python3.12 --version
```

如果你使用 Homebrew 安装，可能需要使用：

```bash
brew list --versions python@3.12
```

### 卸载

**使用 Homebrew 卸载**

在终端中运行以下命令：

```bash
brew uninstall python@3.12
```

**使用手动方式卸载**

如果你是通过安装包安装的，可以在“应用程序”中找到 Python 的文件夹并手动删除。

## Debian

### 安装

**更新软件包列表**

```bash
sudo apt update
```

**安装依赖**

```bash
sudo apt install -y software-properties-common
```

**添加 deadsnakes PPA**

```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```

**安装 Python 3.12**

```bash
sudo apt install python3.12
```

### 验证

在终端中输入：

```bash
python3.12 --version
```

### 卸载

在终端中运行：

```bash
sudo apt remove python3.12
```

## Windows 11

### 安装

前往 [Python 官方下载页面](https://www.python.org/downloads/)，**下载适用于 Windows 的安装程序**。

**运行安装程序**，在安装启动器中，确保选中“Add Python to PATH”选项，然后点击“Install Now”或自定义安装。

### 验证

在命令提示符中输入：

```bash
python --version
```

### 卸载

**打开“设置”**，前往“应用程序” -> “应用和功能”。

**找到 Python 的条目**，点击并选择“卸载”。

## Python 虚拟环境

### 创建虚拟环境

```shell
# cd 到指定路径
# 创建一个名为 .venv 的虚拟环境
python3.12 -m venv .venv
```

### 激活环境

```shell
source .venv/bin/activate
```

### 返回到常规 shell

```shell
deactivate
```

---

- 专栏：[《Python 基础》](https://blog.csdn.net/chaoming_h/category_7726265.html)

**PS：感谢每一位志同道合者的阅读，欢迎关注、评论、赞！**
