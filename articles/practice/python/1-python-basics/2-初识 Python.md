---
id: intro
sidebar_position: 2
title: 初识 Python
description: 初识 Python
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - 初识 Python
---

### 1. 简介

- 高级编程语言，解释型语言
- 代码在执行时会逐行翻译成 CPU 能理解的机器码
- 代码精简，但运行速度慢
- 基础代码库丰富，还有大量第三方库
- 代码不能加密

### 2. 用途

- 机器学习
- 网络应用
- 工具软件
- 包装其他语言开发程序

### 3. 解释器

| 解释器     | 说明                                                                               |
| ---------- | ---------------------------------------------------------------------------------- |
| CPython    | 用 C 语言开发                                                                      |
| IPython    | 基于 CPython 之上的一个交互式解释器，只是在交互方式上有所增强，以 In[n] 作为提示符 |
| PyPy       | 采用 JIT 技术对 Python 代码进行动态编译（不是解释），提高执行速度                  |
| Jython     | 运行在 Java 平台的 Python 解释器，可以把 Python 代码编译成 Java 字节码执行         |
| IronPython | 与 Jython 类似，运行在 .Net 平台的 Python 解释器，编译成 .Net 字节码               |

与 Java 和 .Net 平台交互最好的办法不是使用 Jython 和 IronPython，而是通过网络条用来交互，确保各程序之间的独立性；

### 4. 安装 Python 与使用虚拟环境

- 参照：[CentOS 8 按照 Python](https://blog.csdn.net/ChaoMing_H/article/details/82499308)

### 5. 命令行模式

- Windows 的 CMD、PowerShell（提示符是 `C:\>`）；
- Linux 的 Terminal（提示符是 `[aurelius@centos-dev ~]\$`）；

### 6. 交互模式

- 在命令行模式键入 python，即进入 Python 交互模式（提示符是 >>>）,输入 exit() 退出

**命令行模式 vs. 交互模式**

- 执行 .py 文件只能在命令行模式执行： python hello.py；
- python 交互模式会输出每一行执行的结果，命令模式不会；

**直接运行 .py 文件(仅限 Mac 和 Linux)**

- 通过 .py 文件首行特殊注释指定执行的 python 解释器；

```python
#!usr/bin/env python3
print('hello world.')
```

- 通过如下命令给 hello.py 添加执行权限；

```shell
chmod a+x hello.py
```

### 7. 输入和输出

- 输出 print(), 遇到逗号 “,” 会输出空格；
- 输入 input(), 入参会被打印出来；

### 8. 模块

**Module**

模块是一组 Python 代码集合，可以使用其他模块，也可以被其他模块使用，创建模块不能与系统模块名重复

一个 `.py` 文件就是一个模块

```
mycompany
├─ __init__.py
├─ abc.py
└─ xyz.py
```

按目录组织模块的方法，称之为包 `Package`，每个包目录下必须有一个 `__init__.py` 文件，否则这个目录就是一个普通目录；`__init__.py` 本身就是一个模块，它的模块名就是所在目录的名称

**使用模块**

```python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-

' a test module '

__author__ = 'aurelius'

import sys


def test():
    args = sys.argv
    if len(args) == 1:
        print('Hello world.')
    elif len(args) > 1:
        print('too many arguments.')


if __name__ == "__main__":
    test()
```

> 第 1 行指定 `.py` 文件在 `Unix/Linux/Mac` 上运行使用的 Python 解释器
> 第 2 行表示 `.py` 文件本身使用标准 UTF-8 编码
> 第 4 行表示模块文档注释，模块代码的第一个字符串都被视作模块的文档注释
> 第 6 行使用 `__author__` 变量表明作者
> 第 8 行导入模块，这样就可以访问模块的所有功能

**sys**

`sys` 模块有一个 `argv` 变量，存储着启动 `.py` 文件时命令中的所有参数，至少有一个元素，第一个元素永远是该 `.py` 文件的名称

**\_\_main\_\_**

在使用 Python 解释器启动 `.py` 文件时，Python 解释器会把该 `.py` 模块的 `__name__` 置为 `__main__`，通常用于通过命令行直接执行 `.py` 文件执行一些额外代码，用于运行测试等

**作用域**

- public: xxx
- private: \_xxx, \_\_xxx
- 特殊变量: \_\_xxx\_\_

`Python 对 private 函数或变量的访问限制无强制作用`

**第三方模块**

- 使用 `pip`

```shell
pip install Pillow
```

- 使用 `Anaconda`

基于 Python 的数据处理和科学计算平台

**模块搜索路径**

模块搜索路径存放在 `sys` 模块的 `path` 变量

**模块搜索顺序**

当前目录 > 所有已安装的内置模块 > 第三方模块

**修改模块搜索目录**

- 直接修改 sys.path 的值，运行时修改，运行结束失效
- 设置环境变量 `PYTHONPATH`，该环境变量的内容会被添加到模块搜索目录

---

- 专栏：[《Python 基础》](https://blog.csdn.net/chaoming_h/category_7726265.html)
- 下一篇：[「Python 基础」基础语法与高级特性](https://blog.csdn.net/ChaoMing_H/article/details/129340733)

**PS：感谢每一位志同道合者的阅读，欢迎关注、评论、赞！**
