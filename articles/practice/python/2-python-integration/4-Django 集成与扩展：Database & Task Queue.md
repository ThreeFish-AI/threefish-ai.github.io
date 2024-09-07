---
id: django-database-task-queue
sidebar_position: 4
title: Django｜Database & Task Queue
description: Django 集成与扩展：Database & Task Queue
last_update:
  author: Aurelius
  date: 2024-08-22
tags:
  - Django
  - Database
  - PostgreSQL
  - Redis
  - Celery
  - SSL/TLS
  - 加密传输
---

Django 试图在所有数据库后端上支持尽可能多的功能。但并不是所有的数据库后端都是一样的，Django 不得不在设计上决定如何安全地支持哪一部分重要的功能。Django 官方支持的数据库有 PostgreSQL、MySQL、SQLite 和 Oracle。在这篇文章中，我们将讨论如何将 Django 切换到连接 PostgreSQL、MySQL、Oracle 和 SQL Server 数据库，同时使用 SSL/TLS 证书进行加密传输。

![Cover](<assets/Django 集成与扩展：Database & Task Queue.drawio.png>)

## Django 连接 PostgreSQL

要将 Django 切换为连接 PostgreSQL（使用 SSL 证书），可以按照以下步骤进行配置：

### 安装 PostgreSQL 驱动

确保已经安装了 `psycopg2` 或 `psycopg2-binary`，可以使用以下命令安装：

```bash
pip install psycopg2-binary
```

### 配置 PostgreSQL 数据库

确保 PostgreSQL 数据库启用了 SSL。可以查阅[PostgreSQL SSL 配置文档](https://www.postgresql.org/docs/current/ssl-tcp.html)以设置此项。

### 更新 Django 设置

在 Django 项目中，打开 `settings.py` 文件，并更新 `DATABASES` 设置。提供 SSL 证书的路径。以下是示例配置：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',  # 数据库名称
        'USER': 'your_database_user',   # 数据库用户名
        'PASSWORD': 'your_database_password',  # 数据库密码
        'HOST': 'your_database_host',    # 数据库主机
        'PORT': 'your_database_port',     # 数据库端口，通常是 5432
        'OPTIONS': {
            'sslmode': 'require',  # 或者 'verify-ca' / 'verify-full'，取决于具体需求
            'sslrootcert': '/path/to/ca-cert.pem',  # 根证书
            'sslcert': '/path/to/client-cert.pem',    # 客户端证书（可选）
            'sslkey': '/path/to/client-key.pem',      # 客户端密钥（可选）
        }
    }
}
```

### 确保证书文件的权限

确保提供的证书路径是正确的，并且 Django 有权限访问这些文件。如果不确定路径，可以在终端中使用 `pwd` 命令获取当前路径。

确保 Django 项目运行的用户有权限读取这些证书文件。例如，在类 Unix 系统上，可以使用 `chmod` 设置文件权限：

```sh
chmod 600 /path/to/client-cert.pem
chmod 600 /path/to/client-key.der
chmod 600 /path/to/server-ca.pem
```

### 测试连接

在 Django 项目目录下运行数据库迁移命令，以检查连接是否配置正确：

```sh
python manage.py makemigrations
python manage.py migrate
```

运行以下命令以启动 Django 开发服务器：

```sh
python manage.py runserver
```

访问你的应用程序，确保能够正确连接到远程的 PostgreSQL 数据库。

### 示例：完整的 `settings.py` 配置

以下是一个包含完整配置的 `settings.py` 示例，仅供参考：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'your_remote_db_host',
        'PORT': '5432',
        'OPTIONS': {
            'sslmode': 'verify-ca',
            'sslcert': '/path/to/client-cert.pem',
            'sslkey': '/path/to/client-key.der',
            'sslrootcert': '/path/to/server-ca.pem',
        },
    }
}

# 其他配置
INSTALLED_APPS = [
    ...
]

MIDDLEWARE = [
    ...
]
```

### 注意事项

- **证书格式**：确保证书文件格式正确。PostgreSQL 通常支持 PEM 格式。如果你的密钥文件是 DER 格式，可以使用 OpenSSL 工具将其转换为 PEM 格式。
- **网络连接**：确保 Django 服务器能够通过网络访问远程 PostgreSQL 数据库，检查防火墙设置和网络访问权限。
- **安全性**：存储在服务器上的证书和密钥文件应妥善保管，避免未授权访问。

通过以上步骤，应该能成功将 Django 数据库切换到远程 PostgreSQL，并通过 SSL/TLS 证书和账号密码进行安全连接。

## Django 连接 MySQL

要将 Django 切换为连接 MySQL（使用 SSL/TLS 证书），请按照以下步骤进行配置：

### 安装 MySQL 驱动

首先，确保已经安装了 `mysqlclient` 或 `PyMySQL`，可以使用以下命令之一进行安装：

```bash
pip install mysqlclient
```

或者

```bash
pip install PyMySQL
```

如果使用 `PyMySQL`，还需要在项目的启动脚本中添加以下行，以确保 Django 使用它：

```python
import pymysql
pymysql.install_as_MySQLdb()
```

### 配置 MySQL 数据库

确保 MySQL 数据库启用了 SSL。具体设置可以参考[MySQL SSL 配置文档](https://dev.mysql.com/doc/refman/9.0/en/creating-ssl-rsa-files-using-mysql.html)。

### 更新 Django 设置

在 Django 项目中，打开 `settings.py` 文件，并更新 `DATABASES` 设置。以下是示例配置：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'your_database_name',  # 数据库名称
        'USER': 'your_database_user',   # 数据库用户名
        'PASSWORD': 'your_database_password',  # 数据库密码
        'HOST': 'your_database_host',    # 数据库主机
        'PORT': 'your_database_port',     # 数据库端口，默认是 3306
        'OPTIONS': {
            'ssl': {
                'ca': '/path/to/ca-cert.pem',  # 根证书
                'cert': '/path/to/client-cert.pem',    # 客户端证书（可选）
                'key': '/path/to/client-key.pem',      # 客户端密钥（可选）
            }
        }
    }
}
```

检查证书路径是否正确，并且 Django 有权限访问这些文件。

### 运行迁移

配置完成后，运行数据库迁移以确保一切正常：

```bash
python manage.py migrate
```

启动 Django 项目，检查是否成功连接到 MySQL 数据库。

### 调试连接问题

在连接过程中如遇到问题，请检查以下项：

- 数据库配置是否正确。
- SSL 证书是否有效并格式正确。
- MySQL 服务是否在运行，并允许 SSL 连接。

通过以上步骤，应该能够成功将 Django 切换至连接 MySQL（使用 SSL 证书）。

## Django 连接 Oracle

要将 Django 切换为连接 Oracle 数据库（使用 SSL 证书），请确保遵循以下步骤：

### 安装 Oracle 驱动

安装 `cx_Oracle` 驱动程序。可以使用以下命令安装：

```bash
pip install cx_Oracle
```

确保本地已经安装了 Oracle Instant Client。如果没有，可以从 [Oracle 官网](https://www.oracle.com/database/technologies/instant-client/downloads.html) 下载并安装。

### 配置 Oracle 数据库

确保 Oracle 数据库启用了 SSL，并进行相应配置。具体配置可以参考 [Oracle SSL 配置文档](https://docs.oracle.com/en/industries/financial-services/banking-liquidity-management/14.7.4.0.0/sslsg/configure-ssl-oracle-weblogic.htmlting-ssl.html)。

### 更新 Django 设置

在 Django 项目的 `settings.py` 文件中更新 `DATABASES` 设置，如下所示：

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.oracle',
        'NAME': 'your_service_name',  # 或使用 SID，比如 'hostname:port/SID'
        'USER': 'your_database_user',   # 数据库用户名
        'PASSWORD': 'your_database_password',  # 数据库密码
        'HOST': 'your_database_host',    # 数据库主机
        'PORT': 'your_database_port',     # 数据库端口，默认可以是 1521
        'OPTIONS': {
            'threaded': True,
            'ssl': {
                'ca': '/path/to/ca-cert.pem',  # 根证书
                'cert': '/path/to/client-cert.pem',    # 客户端证书（可选）
                'key': '/path/to/client-key.pem',      # 客户端密钥（可选）
            }
        }
    }
}
```

检查证书路径是否正确，并且 Django 有权限访问这些文件。

### 运行迁移

配置完成后，运行数据库迁移以确保一切正常：

```bash
python manage.py migrate
```

启动 Django 项目，检查是否成功连接到 Oracle 数据库。

### 调试连接问题

如果出现连接问题，请检查以下内容：

- 数据库配置是否正确。
- SSL 证书是否有效且格式正确。
- Oracle 数据库服务是否在运行，并允许 SSL 连接。

### 可能的环境配置

在某些情况下，可能需要在环境变量中配置 Oracle Home 和 LD_LIBRARY_PATH，以便系统能够找到 Oracle Instant Client。

通过以上步骤，应该能够成功将 Django 切换至连接 Oracle 数据库（使用 SSL 证书）。

## Django 连接 SQL Server

要将 Django 切换为连接 SQL Server（使用 SSL 证书），请按照以下步骤操作：

### 安装 SQL Server 驱动

安装 `django-pyodbc-azure` 或 `django-pyodbc`。可以使用以下命令安装：

```bash
pip install django-pyodbc-azure
```

或

```bash
pip install django-pyodbc
```

### 配置 SQL Server 数据库

确保 SQL Server 数据库支持 SSL。如果使用的是 Azure SQL Database，SSL 将默认启用。可以查看 [Microsoft SQL Server 连接文档](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/www-administration-management/enable-ssl-all-customers) 以检查相关配置。

### 更新 Django 设置

在 Django 项目的 `settings.py` 文件中更新 `DATABASES` 设置，如下所示：

```python
DATABASES = {
    'default': {
        'ENGINE': 'sql_server.pyodbc',
        'NAME': 'your_database_name',         # 数据库名称
        'USER': 'your_database_user',         # 数据库用户名
        'PASSWORD': 'your_database_password',  # 数据库密码
        'HOST': 'your_database_host',          # 数据库主机
        'PORT': '1433',                        # 默认 SQL Server 端口
        'OPTIONS': {
            'driver': 'ODBC Driver 17 for SQL Server',  # ODBC 驱动
            'Encrypt': 'yes',                     # 启用加密
            'TrustServerCertificate': 'yes',      # 让服务器信任证书（可选，根据需求设置）
            # 其他 SSL 选项，如果需要可以添加
        }
    }
}
```

确保系统上已安装适当的 ODBC 驱动程序，可以从 [Microsoft 官网](https://docs.microsoft.com/en-us/sql/connect/odbc/download-odbc-driver-for-sql-server) 下载所需的驱动程序。

### 运行迁移

配置完成后，运行数据库迁移以确保一切正常：

```bash
python manage.py migrate
```

启动 Django 项目，检查是否成功连接到 SQL Server 数据库。

### 调试连接问题

如果在连接时出现问题，请检查以下几点：

- 数据库配置是否正确。
- ODBC 驱动程序是否正确安装并兼容。
- SQL Server 服务是否在运行，并允许 SSL 连接。

通过以上步骤，应该能够成功将 Django 切换至连接 SQL Server（使用 SSL 证书）。

## Django 集成 Redis

要将 Django 切换为连接 Redis，可以按照以下步骤进行配置（请注意，Redis 通常不使用 SSL，但如果需要使用 SSL，可以配置 Redis 服务器和客户端支持 SSL）：

### 安装 Redis 客户端

安装 `django-redis` 作为缓存 backend 的选项，可以使用以下命令安装：

```bash
pip install django-redis
```

如果还没有安装 Redis 的 Python 客户端，可以同时安装 `redis`：

```bash
pip install redis
```

### 配置 Redis 服务器（可选）

确保 Redis 服务器已正确安装并运行。如果需要使用 SSL，可以考虑使用 `stunnel` 或类似工具创建 SSL 隧道。

### 更新 Django 设置

在 Django 项目中的 `settings.py` 文件中，配置缓存设置，以便 Django 使用 Redis 作为缓存后端。以下是一个示例配置：

```python
CACHES = {
    'default': {
        'BACKEND': 'django_redis.cache.RedisCache',
        'LOCATION': 'redis://your_redis_host:6379/1',  # Redis 服务器地址
        'OPTIONS': {
            'CLIENT_CLASS': 'django_redis.client.DefaultClient',
            'PASSWORD': 'your_redis_password',  # 如果有设置密码
            'SSL': True,  # 如果 Redis 支持 SSL，可以设置为 True
        }
    }
}
```

如果使用的是 SSL 隧道，还需要相应地配置 Redis 连接。

### 测试连接

确保 Redis 服务器已启动，并使用以下命令测试连接：

```bash
python -m redis-cli -h your_redis_host -p 6379
```

如果需要使用 SSL，也可以使用 `redis-cli` 进行测试：

```bash
redis-cli -h your_redis_host -p 6379 --tls
```

### 使用缓存

在 Django 视图或其他位置使用缓存。例如：

```python
from django.core.cache import cache

# 设置缓存
cache.set('my_key', 'my_value', timeout=60)

# 获取缓存
value = cache.get('my_key')
```

### 调试连接问题

如果连接出现问题，请检查以下内容：

- Redis 配置是否正确。
- Redis 服务是否在运行，并且端口（默认 6379）是否可用。
- 防火墙设置是否允许访问 Redis。

通过以上步骤，应该能够成功将 Django 切换至连接 Redis。

## Django 集成 Celery

要将 Django 项目与 Celery 集成并利用 Redis 作为消息代理，可以按照以下步骤进行配置：

### 安装依赖

确保已经安装了 Celery 和 Redis 的客户端。可以使用以下命令：

```bash
pip install celery redis
```

### 配置 Celery

在 Django 项目目录下创建一个名为 `celery.py` 的文件，通常与 `settings.py` 在同一目录下。以下是一个示例配置：

```python
import os
from celery import Celery

# 设置 Django 的默认设置模块
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project_name.settings')

app = Celery('your_project_name')

# 从 Django 的 settings.py 中加载配置
app.config_from_object('django.conf:settings', namespace='CELERY')

# 注册所有的任务模块
app.autodiscover_tasks()
```

### 配置 Django 设置

在 `settings.py` 文件中添加 Celery 的配置，指定 Redis 作为消息代理。以下是一个示例配置：

```python
CELERY_BROKER_URL = 'redis://your_redis_host:6379/0'  # Redis 服务器地址
CELERY_RESULT_BACKEND = 'redis://your_redis_host:6379/0'  # 结果后端
```

如果 Redis 有密码，还可以这么配置：

```python
CELERY_BROKER_URL = 'redis://:your_redis_password@your_redis_host:6379/0'
CELERY_RESULT_BACKEND = 'redis://:your_redis_password@your_redis_host:6379/0'
```

### 创建任务

在应用程序中创建一个任务文件（通常命名为 `tasks.py`），并定义一些任务。例如：

```python
from celery import shared_task

@shared_task
def add(x, y):
    return x + y
```

### 启动 Celery Worker

在项目根目录下运行以下命令启动 Celery 工人：

```bash
celery -A your_project_name worker --loglevel=INFO
```

### 调用任务

现在可以从 Django 视图或其他地方异步调用任务。例如：

```python
from .tasks import add

result = add.delay(4, 6)  # 异步调用任务
```

### 监控任务（可选）

可以使用 Flower 这样的工具来监控 Celery 任务。安装 Flower：

```bash
pip install flower
```

并通过以下命令启动 Flower：

```bash
celery -A your_project_name flower
```

### 测试和调试

确保 Redis 服务正在运行，并在有必要时调试 Celery 任务，以确认一切是否正常。

通过以上步骤，可以成功将 Django 项目与 Celery 集成，并使用 Redis 作为消息代理。

## 结语

在本文中，我们讨论了如何将 Django 切换到连接 PostgreSQL、MySQL、Oracle 和 SQL Server 数据库，并使用 SSL/TLS 证书进行加密传输。另外还讨论了如何将 Django 与 Redis 和 Celery 集成。这些配置可以帮助你在 Django 项目中实现更安全和高效的数据库和任务处理。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
