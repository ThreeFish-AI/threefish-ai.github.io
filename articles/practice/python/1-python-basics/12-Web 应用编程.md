---
id: web-application-programming
sidebar_position: 12
title: Web 应用编程
description: Web 应用编程
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - Web 应用编程
---

- `CS`，Client/Server 客户端升级麻烦；
- `BS`，Browser/Server；

除了重量级软件如`Office`、`PS`等，大部分软件都以`Web`形式提供，如新浪新闻、博客、微博等；

**`Web`开发的几个阶段**

1. 静态 Web 页面，每次修改页面都直接通过手动修改 HTML 源文件保存，无法处理交互；
2. CGI，Common Gateway Interface，用于处理用户发送的动态数据（C/C++编写）；
3. ASP/JSP/PHP，脚本语言开发效率高，与 HTML 结合紧密，迅速取代低级语言的 CGI；
4. MVC，为了解决直接用脚本语言签入 HTML 导致的可维护性差的问题，Web 应用引入了 `Model-View-Controller`的模式，简化 Web 开发；
5. 目前异步开发，MVVM 前端技术层出不穷；

## 1. HTTP 协议简介

HTTP/1.1 版本允许多个 HTTP 请求复用一个`TCP`连接；

### 1. HTTP 请求

请求-响应模式，一个请求只处理一个响应；

> 1. 必须先有客户端向服务端发出请求，请求包括；

- 类型：GET、POST、DELETE ...
- 路径：/full/url/path
- 域名：www.sina.com.cn
- 其他 Header
- 如果是 POST，请求还包括一个 Body

> 2. 服务端想客户端返回 HTTP 响应，响应包括；

- 响应代码：200 成功，3XX 重定向，4XX 请求有错，5XX 服务端处理请求错误
- 响应类型：由 Content-Type 指定
- 其他 Header
- Body：包含了响应的内容，网页的 HTML 源码等

> 3. 如果返回的内容还包含其他 HTTP 请求，重复 1. 2；

### 2. HTTP 格式

- 每个`Header`一行，多个`Header`用换行符'\r\n'分割；
- `Header`与`Body`用两个'\r\n'分割；
- `Body`的数据类型由`Content-Type`头确定；
- `Content-Encoding`指定压缩方式；

## 2. HTML 简介

HTML 定义了一套语法规则，来告诉浏览器如何把网页显示出来；

HTML 文档是有一系列 Tag 组成，最外层的 Tag 是`<html>`，规范的要包括`<head>...</head>` 和`<body>...</body>`；

HTML 是富文档模型，因此还有一系列 Tag 用来表示链接、图片、表格、表单等；

### 1. CSS

`Cascading Style Sheets` 层叠样式表，用来控制 HTML 里所有元素的展现方式；

### 2. JavaScript

为了让 HTML 具交互性而添加的，可以内嵌在 HTML，也可以外部链接到 HTML；

**对于优秀的 Web 开发人员，精通 HTML、CSS、JavaScript 是必须的**

## 3. WSGI 接口

`Web Server Gateway Interface`

用于接收 HTTP 请求，解析 HTTP 请求，发送 HTTP 响应的 Python 标准接口，是 Web 服务端或网关端与 Web 业务端或框架端的桥梁；

无论多复杂的 Web 应用，入口都是一个 WSGI 处理函数，HTTP 请求的所有输入信息通过`environ`获取，HTTP 响应通过`start_response()`输出`Header`，通过函数返回值输出`Body`；

### 1. 实现 WSGI 接口

```python
def application(environ, start_response):
    start_response('200 oK', [('Content-Type', 'text/html')])
    body = f"<h1>Hello, {environ['PATH_INFO'][1:] or 'web'}!</h1>"
    return [body.encode('utf-8')]
```

- `environ` 一个包含所有 HTTP 请求信息的 dict 对象；
- `start_response` 一个发送 HTTP 响应的函数，只能发送一次，格式见上例；
- `return` HTTP 响应的 Body，bytes；

### 2. 运行 WSGI

Python 内置了一个 WSGI 服务器模块`wsgiref`，纯 Python 编写的参考实例，完全符合 WSGI 标准，单不考虑运行效果，仅供开发和测试使用；

```python
from wsgiref.simple_server import make_server

# 创建一个服务器，IP地址为空，端口是 8000，处理函数是 application
httpd = make_server('', 8000, application)
print('Serving HTTP on port 8000...')
# 开始监听HTTP 请求
httpd.serve_forever()
```

## 4. 使用 Web 框架

面对客服端的不同请求，若使用 WSGI，需对`environ`的不同信息作出不同处理逻辑，这样的代码很难维护；

Web 框架负责`URL`到函数的映射，解析 HTTP 请求的参数，让我们可以专注于一个函数处理一个`URL`；

### 1. Flask

Python 最流行的 Web 框架；

**安装**

```shell
pip install flask
```

**示例**

```python
from flask import Flask
from flask import request

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    return '<h1>Home</h1>'


@app.route('/signin', methods=['GET'])
def signin_form():
    return '''<form action="/signin" method="post">
              <p><input name="username"></p>
              <p><input name="password" type="password"></p>
              <p><button type="submit">Sign In</button></p>
              </form>'''


@app.route('/signin', methods=['POST'])
def signin():
    # 需要从request对象读取表单内容：
    if request.form['username'] == 'admin' and request.form[
            'password'] == 'password':
        return '<h3>Hello, admin!</h3>'
    return '<h3>Bad username or password.</h3>'


if __name__ == "__main__":
    app.run()
```

Flask 通过装饰器关联`URL`和函数，通过`request.form['name']`获取表单内容；

Flask 自带的服务器（调试使用）端口为 5000；

### 2. 其他 Web 框架

- `Django` 全能型
- `web.py` 小巧
- `Bottle` 类似 Flask
- `Tornado` 异步

## 5. 使用模板

分离出 Python 代码与 HTML 代码，HTML 代码全部放在模板里；

### 1. MVC

**Model-View-Controller**

`Controller` 处理 URL 的函数，负责业务逻辑；

`View` .html 模板页，负责显示逻辑，通过简单的变量替换，最终输出用户看到的 HTML；

`Model` 用来传给 View 替换的变量；

### 2. Jinja2

**安装**

```shell
$ pip install janja2
```

**示例**

```python
from flask import Flask, request, render_template

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def home():
    # 使用模板: ./templates/home.html
    return render_template('home.html')


@app.route('/signin', methods=['GET'])
def signin_form():
    return render_template('form.html')


@app.route('/signin', methods=['POST'])
def signin():
    # 需要从request对象读取表单内容：
    username = request.form['username']
    password = request.form['password']
    if username == 'admin' and password == 'password':
        return render_template('signin-ok.html', username=username)
    return render_template('form.html',
                           message='Bad username or password',
                           username=username)
```

`Flask`通过`render_templates()`函数实现模板的渲染；

`{{ name }}`表示一个需要替换的变量；

`{% ... %}`表示循环、条件判断等指令；

### 3. 其他模板

- `Mako`，\<\% ... \%\> 和 $\{xxx\}
- `Cheetah`，\<\% ... \%\> 和 $\{xxx\}
- `Django`，\{\% ... \%\} 和 \{\{ xxx \}\}

---

- 上一篇：[「Python 基础」数据库应用编程](https://blog.csdn.net/ChaoMing_H/article/details/129541163)
- 专栏：[《Python 基础》](https://blog.csdn.net/chaoming_h/category_7726265.html)

**PS：欢迎各路道友`阅读`与`评论`，感谢道友`点赞`、`关注`、`收藏`！**
