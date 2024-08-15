---
id: rdbms-storage-index-basic-maintenance
sidebar_position: 14
title: 数据库技术核心：基本维护（PostgreSQL）
description: 数据库技术核心：基本维护（PostgreSQL）
last_update:
  author: Aurelius
  date: 2024-08-15
tags:
  - 关系数据库
  - RDBMS
  - 基本维护
  - PostgreSQL
---

本文提供 PostgreSQL 的安装、启停、卸载、用户管理、库表创建及一些基本维护操作的指引，帮助你直接上手 PostgreSQL 数据库的应用与管理。

![Cover](assets/数据库核心技术：基本维护（PostgreSQL）.drawio.png)

## 安装 PostgreSQL 15

针对不同的操作系统，安装、启动、停止和卸载 PostgreSQL 的方法虽然基本相似，但会有一些细微差异。以下是不同系统上的详细指南：

### macOS（14.6）

**使用 Homebrew 安装（推荐）**

- **安装 Homebrew**，如果你还没有安装 Homebrew，可以在终端运行以下命令：

```sh
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

- **安装 PostgreSQL 15**，使用 Homebrew 安装 PostgreSQL：

```sh
brew install postgresql@15
```

安装完成提示：

```bash
This formula has created a default database cluster with:
  initdb --locale=C -E UTF-8 /opt/homebrew/var/postgresql@15
For more details, read:
  https://www.postgresql.org/docs/15/app-initdb.html

postgresql@15 is keg-only, which means it was not symlinked into /opt/homebrew,
because this is an alternate version of another formula.

If you need to have postgresql@15 first in your PATH, run:
  echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc

For compilers to find postgresql@15 you may need to set:
  export LDFLAGS="-L/opt/homebrew/opt/postgresql@15/lib"
  export CPPFLAGS="-I/opt/homebrew/opt/postgresql@15/include"

For pkg-config to find postgresql@15 you may need to set:
  export PKG_CONFIG_PATH="/opt/homebrew/opt/postgresql@15/lib/pkgconfig"

To start postgresql@15 now and restart at login:
  brew services start postgresql@15
Or, if you don't want/need a background service you can just run:
  LC_ALL="C" /opt/homebrew/opt/postgresql@15/bin/postgres -D /opt/homebrew/var/postgresql@15
```

- **启动 PostgreSQL**，安装完成后，可以启动 PostgreSQL 服务：

```sh
brew services start postgresql@15
```

或者手动启动：

```sh
pg_ctl -D /opt/homebrew/var/postgresql@15 start
```

- **停止 PostgreSQL**，如果需要停止 PostgreSQL 服务：

```sh
brew services stop postgresql@15
```

或者手动停止：

```sh
pg_ctl -D /opt/homebrew/var/postgresql@15 stop
```

- **卸载 PostgreSQL**，如果需要卸载 PostgreSQL：

```sh
brew uninstall postgresql@15
```

**从 PostgreSQL 官方下载**

- **下载 PostgreSQL 安装包**，从 [PostgreSQL 官方网站](https://www.postgresql.org/download/macosx/)下载适用于 macOS 的安装包，选择 PostgreSQL 15 并下载 appropriate .dmg 或 .pkg 文件后，按照安装向导执行安装过程。

- **启动 PostgreSQL**，如果你通过官方包安装，可以使用以下命令启动服务（可能需要管理员权限）：

```sh
sudo su - postgres
pg_ctl -D /var/lib/postgresql/data start
exit
```

或者通过 macOS 的 LaunchDaemon 启动：

```sh
sudo launchctl load -w /Library/LaunchDaemons/com.edb.launchd.postgresql-15.plist
```

- **停止 PostgreSQL**，可以使用以下命令停止服务：

```sh
sudo su - postgres
pg_ctl -D /var/lib/postgresql/data stop
exit
```

或者通过 macOS 的 LaunchDaemon 停止：

```sh
sudo launchctl unload -w /Library/LaunchDaemons/com.edb.launchd.postgresql-15.plist
```

- **卸载 PostgreSQL**，找到 PostgreSQL 安装包中提供的卸载脚本，通常位于安装目录，执行以下命令进行卸载：

```sh
sudo /Library/PostgreSQL/15/uninstall-postgresql
```

**验证安装**

无论通过哪种方法安装 PostgreSQL，都可以通过以下命令检查 PostgreSQL 是否正确安装及其版本：

```sh
psql --version
```

**注意事项**

- **权限**：有些操作可能需要超用户权限（例如使用 `sudo`）。
- **路径**：根据你的具体安装情况，PostgreSQL 数据目录的路径可能会有所不同。确保使用正确的路径来管理 PostgreSQL 服务。
- **环境变量**：安装后可能需要将 PostgreSQL 的二进制目录添加到你的环境变量中，如 `$PATH`。可以在 `~/.zshrc` 或 `~/.bash_profile` 中进行配置：
  ```sh
  export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
  ```

### Debian 系统

**安装 PostgreSQL**

```sh
sudo apt update
sudo apt install postgresql postgresql-contrib
```

**启动 PostgreSQL**

```sh
sudo systemctl start postgresql
sudo systemctl enable postgresql  # 开机启动
```

**停止 PostgreSQL**

```sh
sudo systemctl stop postgresql
```

**卸载 PostgreSQL**

```sh
sudo apt remove postgresql postgresql-contrib
sudo apt purge postgresql postgresql-contrib
sudo apt autoremove
```

### CentOS 7

**安装 PostgreSQL**

添加 PostgreSQL 仓库并安装：

```sh
sudo yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-centos13-13-2.noarch.rpm
sudo yum install -y postgresql13-server postgresql13-contrib
```

初始化 PostgreSQL 数据库并启动服务：

```sh
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
sudo systemctl start postgresql-13
sudo systemctl enable postgresql-13  # 开机启动
```

**停止 PostgreSQL**

```sh
sudo systemctl stop postgresql-13
```

**卸载 PostgreSQL**

```sh
sudo yum remove postgresql13-server postgresql13-contrib
sudo rm -rf /var/lib/pgsql/13/data /var/lib/pgsql/13/backups
```

### CentOS 8

**安装 PostgreSQL**

添加 PostgreSQL 仓库并安装：

```sh
sudo dnf install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-8-x86_64/pgdg-redhat-repo-latest.noarch.rpm
sudo dnf install -y postgresql13-server postgresql13-contrib
```

初始化 PostgreSQL 数据库并启动服务：

```sh
sudo /usr/pgsql-13/bin/postgresql-13-setup initdb
sudo systemctl start postgresql-13
sudo systemctl enable postgresql-13  # 开机启动
```

**停止 PostgreSQL**

```sh
sudo systemctl stop postgresql-13
```

**卸载 PostgreSQL**

```sh
sudo dnf remove postgresql13-server postgresql13-contrib
sudo rm -rf /var/lib/pgsql/13/data /var/lib/pgsql/13/backups
```

### Windows 11

**安装 PostgreSQL**

从 PostgreSQL 官方网站下载 [Windows 版本](https://www.postgresql.org/download/windows/) 并运行安装程序，按照向导提示进行安装。选择合适的安装目录，并记住你设置的数据库超级用户（通常是 `postgres`）的密码。

**启动 PostgreSQL**

安装程序会自动启动 PostgreSQL 服务。如果你需要手动启动，可以通过 Windows 服务管理器：

- 打开任务管理器，切换到“服务”选项卡，点击“打开服务”。
- 在服务列表中找到 `PostgreSQL`。
- 右键点击选择“启动”。

**停止 PostgreSQL**

通过 Windows 服务管理器停止服务：

- 在服务列表中找到 `PostgreSQL`。
- 右键点击选择“停止”。

**卸载 PostgreSQL**

- 打开“控制面板”。
- 选择“程序和功能”。
- 在列表中找到 PostgreSQL，右键点击选择“卸载”。
- 按照卸载向导完成卸载过程。

## 常用操作

### 检查数据库状态

通过以下命令检查 PostgreSQL 服务的状态：

```sh
brew services info postgresql@15  # 使用 Homebrew 安装时
```

### 初次连接 PostgreSQL

用 `psql` 客户端连接到默认的 `postgres` 数据库：

```sh
psql postgres
```

修改初始密码（假设初始用户是 `postgres`），在 `psql` 提示符下，执行以下命令：

```sql
-- 在 psql 提示符下输入以下命令查看现有角色：
\du
-- 修改当前 role 的密码（将 {role} 替换成上一步查到的 role 名称，比如 postgres）
\password {role}
```

然后系统会提示你输入并确认新密码。

### 创建新的用户

在 `psql` 提示符下，执行以下命令：

```sql
CREATE USER new_username WITH PASSWORD 'new_password';
```

为新用户赋予权限（可选，根据需要）：

```sql
-- 如果你希望给新用户超级用户权限，执行以下命令：
ALTER USER new_username WITH SUPERUSER;

-- 如果只需要赋予创建数据库的权限：
ALTER USER new_username WITH CREATEDB;
```

完成上述步骤之后，你就可以使用新用户进行数据库操作了。需要注意的是，为保证安全，请根据具体需求合理分配权限。

### 连接到数据库

使用 `psql` 命令连接到数据库：

```sh
psql -h localhost -U myuser -d mydatabase
```

通过 `psql` 连接并查看当前连接的数据库、用户等信息：

```sh
psql -h localhost -U myuser -d mydatabase -c '\conninfo'
```

### 创建数据库

```sh
# 在 PostgreSQL 交互式终端中执行
CREATE DATABASE mydatabase;
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
```

### 备份和恢复数据库

使用 `pg_dump` 和 `pg_restore` 进行数据库备份和恢复：

```sh
# 备份数据库
pg_dump -U myuser -h localhost -d mydatabase > mydatabase_backup.sql

# 恢复数据库
psql -U myuser -h localhost -d newdatabase < mydatabase_backup.sql
```

或者使用压缩格式：

```sh
# 备份数据库
pg_dump -U myuser -h localhost -d mydatabase | gzip > mydatabase_backup.sql.gz

# 恢复数据库
gunzip -c mydatabase_backup.sql.gz | psql -U myuser -h localhost -d newdatabase
```

### 配置文件

- `postgresql.conf`：主要配置文件，用于设置内存、连接选项等。通常位于数据目录下。
- `pg_hba.conf`：用于配置客户端认证。

## 注意事项

### 文件权限

确保 PostgreSQL 数据目录和配置文件拥有正确的文件权限。通常，数据目录应只对 PostgreSQL 用户可读写。

```sh
chmod 700 /var/lib/postgresql/data
chown -R postgres:postgres /var/lib/postgresql/data
```

### 配置文件

PostgreSQL 的两个主要配置文件是 `postgresql.conf` 和 `pg_hba.conf`。调整这些文件以优化性能和安全性。

- **`postgresql.conf`**：通常位于 `/etc/postgresql/15/main/` 或安装目录下的 `data` 文件夹。该文件包含服务器的主要配置选项，例如连接数、内存限制和日志记录。
- **`pg_hba.conf`**：用于设置客户端认证方法和策略，确保只允许授权用户和客户端连接到数据库。

### 防火墙和网络配置

确保 PostgreSQL 所在服务器的防火墙允许所需端口（默认端口为 5432）的访问。同时，确保网络连接稳定，尤其是在远程服务器上运行 PostgreSQL 时。

例如，在 `ufw` 防火墙上打开 5432 端口：

```sh
sudo ufw allow 5432/tcp
```

### 安全性

- **密码策略**：为数据库用户设置强密码，并定期更新。
- **SSL/TLS 加密**：使用 SSL/TLS 加密数据库连接，确保传输中的数据安全。

### 环境变量

为了便于日常操作，可以在 shell 配置文件（如 `~/.zshrc` 或 `~/.bash_profile`）中添加 PostgreSQL 的环境变量：

```sh
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
```

然后重新加载 shell 配置文件：

```sh
source ~/.zshrc  # 或 source ~/.bash_profile
```

### 自动启动

确保 PostgreSQL 服务在系统启动时自动启动（已经通过 Homebrew 安装服务时默认是自动启动的，如果使用其他方法，需要根据系统服务管理器配置，如 `launchctl`, `systemd` 等）。

### 日志管理

定期检查 PostgreSQL 的日志文件，了解数据库运行状态，并迅速解决潜在问题。日志文件的位置可在 `postgresql.conf` 中配置。

## 基本维护

### VACUUM

`VACUUM` 用于清理数据库内不再使用的数据以释放存储空间，并防止数据库膨胀。

```sh
# 手动执行 VACUUM
psql -h localhost -U myuser -d mydatabase -c 'VACUUM;'

# 建议使用 VACUUM FULL
# 但是它会锁表，因此需要在一个维护时段执行
psql -h localhost -U myuser -d mydatabase -c 'VACUUM FULL;'
```

### ANALYZE

`ANALYZE` 用于收集数据库表的统计信息，这些统计信息可以帮助查询优化器生成有效的查询计划。

```sh
# 单独执行 ANALYZE
psql -h localhost -U myuser -d mydatabase -c 'ANALYZE;'

# 也可以与 VACUUM 结合使用
psql -h localhost -U myuser -d mydatabase -c 'VACUUM ANALYZE;'
```

### 重建索引

索引是提高数据库查询性能的重要工具，但它们可能会随着时间的推移而变得不再高效，通过重建索引可以重新组织索引的存储方式。

```sh
# 重建单个索引
psql -h localhost -U myuser -d mydatabase -c 'REINDEX INDEX myindex;'

# 重建特定表的所有索引
psql -h localhost -U myuser -d mydatabase -c 'REINDEX TABLE mytable;'

# 重建整个数据库的所有索引
psql -h localhost -U myuser -d mydatabase -c 'REINDEX DATABASE mydatabase;'
```

### 备份数据库

定期备份数据库是防止数据丢失的重要手段。

```sh
# 使用 pg_dump 备份数据库
pg_dump -U myuser -h localhost -d mydatabase > mydatabase_backup.sql

# 使用压缩格式备份
pg_dump -U myuser -h localhost -d mydatabase | gzip > mydatabase_backup.sql.gz
```

### 恢复数据库

通过备份文件恢复数据库。

```sh
# 恢复数据库
psql -U myuser -h localhost -d newdatabase < mydatabase_backup.sql

# 恢复压缩格式的备份
gunzip -c mydatabase_backup.sql.gz | psql -U myuser -h localhost -d newdatabase
```

### 日志管理

定期查看和管理 PostgreSQL 的日志文件，可以有助于识别和解决潜在的问题。

**配置日志记录**

在 `postgresql.conf` 中配置日志记录选项，例如：

```ini
# 配置日志记录
logging_collector = on
log_directory = 'pg_log'
log_filename = 'postgresql-%Y-%m-%d.log'
log_truncate_on_rotation = on
log_rotation_age = 1d
log_rotation_size = 100MB
```

**查看日志文件**

日志文件通常存储在配置的日志目录中，例如 `/var/lib/pgsql/data/pg_log/` 或 `/var/log/postgresql/`。

```sh
# 查看最新的日志文件
tail -f /var/lib/pgsql/data/pg_log/postgresql-YYYY-MM-DD.log
```

### 监控和警报

使用工具监控数据库的性能和健康状况，并设置警报以在出现问题时通知你。

- **监控工具**
  - **pgAdmin**：一个流行的开源 PostgreSQL 管理工具，提供图形化界面管理和监控。
  - **Prometheus + Grafana**：组合使用进行监控和告警。
- **Prometheus 和 Grafana 监控**
  - 部署 Prometheus 和 Grafana。
  - 安装 `postgres_exporter` 以从 PostgreSQL 收集性能数据。
  - 配置 Prometheus 收集数据源，并在 Grafana 中创建仪表板以可视化数据库性能。

### 性能调优

定期检查和优化数据库性能，确保查询执行效率高，避免瓶颈。

- **调整连接池**：通过设置合理的最大连接数来优化资源使用。
- **优化查询**：使用 `EXPLAIN` 分析查询计划，优化慢查询。
- **实用配置参数**：调整 `shared_buffers` 和 `work_mem` 等配置参数以提高性能。

### 安全更新

确保 PostgreSQL 版本始终更新到最新的安全补丁版本，防止已知的漏洞被利用。

```sh
# 更新 Homebrew 并升级 PostgreSQL（适用于 Homebrew 安装）
brew update
brew upgrade postgresql

# 使用包管理器更新（适用于 Debian 或 CentOS 等系统）
sudo apt update && sudo apt upgrade postgresql
sudo yum update postgresql
```

## 结语

以上涵盖了 PostgreSQL 的大部分基本维护操作，掌握这些技巧是使用 PostgreSQL 数据库的基础，也是提供数据库性能和稳定性，确保数据安全等的基本保障。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
