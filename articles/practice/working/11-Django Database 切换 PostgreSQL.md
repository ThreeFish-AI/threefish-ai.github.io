---
id: django-postgresql-ssl
sidebar_position: 11
title: Django 集成 PostgreSQL：使用 SSL/TLS 证书连接
description: Django 集成 PostgreSQL：使用 SSL/TLS 证书连接
last_update:
  author: Aurelius
  date: 2024-08-18
tags:
  - Django
  - 集成
  - PostgreSQL
  - SSL/TLS
  - 加密传输
---

为了将 Django 的数据库切换到远程的 PostgreSQL，并通过 SSL/TLS 证书和账号密码进行连接，请按照以下步骤操作：

### 1. 安装 PostgreSQL 依赖

确保安装了 PostgreSQL 客户端库和 Python 的 PostgreSQL 适配器 `psycopg2`。

```sh
pip install psycopg2-binary
```

### 2. 配置 PostgreSQL 连接证书

确保你的证书文件 `client-cert.pem`、`client-key.der`、`server-ca.pem` 可以在 Django 代码中访问。你可以将这些文件存放在 Django 项目的某个目录中，例如 `project_root/certs/`。

### 3. 更新 Django 设置

在 `myproject/settings.py` 中添加或修改 `DATABASES` 配置，例如：

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
        }
    }
}
```

确保用实际的值替换以下占位符：

- `your_database_name`：数据库名称。
- `your_database_user`：数据库用户名。
- `your_database_password`：数据库用户密码。
- `your_remote_db_host`：远程数据库主机名或 IP 地址。
- `/path/to/client-cert.pem`：客户端证书的绝对路径。
- `/path/to/client-key.der`：客户端密钥的绝对路径。
- `/path/to/server-ca.pem`：服务器 CA 证书的绝对路径。

### 4. 确保证书文件的权限

确保 Django 项目运行的用户有权限读取这些证书文件。例如，在类 Unix 系统上，可以使用 `chmod` 设置文件权限：

```sh
chmod 600 /path/to/client-cert.pem
chmod 600 /path/to/client-key.der
chmod 600 /path/to/server-ca.pem
```

### 5. 测试连接

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

### 6. 示例：完整的 `settings.py` 配置

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

### 7. 注意事项

- **证书格式**：确保证书文件格式正确。PostgreSQL 通常支持 PEM 格式。如果你的密钥文件是 DER 格式，可以使用 OpenSSL 工具将其转换为 PEM 格式。
- **网络连接**：确保 Django 服务器能够通过网络访问远程 PostgreSQL 数据库，检查防火墙设置和网络访问权限。
- **安全性**：存储在服务器上的证书和密钥文件应妥善保管，避免未授权访问。

通过以上步骤，你应该能成功将 Django 数据库切换到远程 PostgreSQL，并通过 SSL/TLS 证书和账号密码进行安全连接。
