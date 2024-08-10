---
id: io-regex
sidebar_position: 7
title: I/O 编程、正则表达式
description: I/O 编程、正则表达式
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - I/O 编程、正则表达式
---

## 1. I/O 编程

`I/O`指`Input`/`Output`；

`Input Stream` 从外面（磁盘、网络）流进内存；

`Output Stream` 从内存流到外面；

`同步 I/O` CPU 等待`I/O`完成，程序暂停后续执行；

`异步 I/O` CPU 不等待`I/O`完成，先做其他事，通过**回调**或**轮询**处理`I/O`后续；

### 文件读写

在磁盘上读写文件的功能都是有操作系统提供的，现代操作系统不允许普通程序直接操作磁盘；

**文件流操作方法**

| 方法        | 说明                                                                                                      |
| ----------- | --------------------------------------------------------------------------------------------------------- |
| open()      | 以指定模式打开文件对象，参数为`文件名`和`模式标示符`，可选参数`encoding`(编码) `errors`(编码错误处理方式) |
| read()      | 一次读取文件所有内容，返回`str`对象                                                                       |
| read(size)  | 每次读取`size`个字节的内容                                                                                |
| readline()  | 每次读取一行内容                                                                                          |
| readlines() | 一次读取所有内容，并返回以行分割的`list`                                                                  |
| write()     | 将要写入的内容写入内存缓存，当`close` 被调用时真正将内容写出                                              |
| close()     | 关闭文件，关闭前将内存缓存中的内容全部写出                                                                |

**文件对象模式**

| 字符 | 含义                                   |
| ---- | -------------------------------------- |
| `r`  | 读取（默认）                           |
| `w`  | 写入，先 truncate 文件                 |
| `x`  | 独占创建，如果文件已经存在则失败       |
| `a`  | 写入，如果文件已经存在则追加到文件末尾 |
| `b`  | 二进制模型                             |
| `t`  | 文字模式（默认）                       |
| `+`  | 更新（读写）                           |

**读文件**

```python
with open('/Users/aurelius/test.txt', 'r') as f:
    print(f.read())
```

`with`语句可保证`open`的文件最终会被`close`，同样的功能可以通过`try ... finally`语句在`finally`中执行`close`实现；

**写文件**

```python
with open('/User/aurelius/test.txt', 'w') as f:
    f.write('hello, world.')
```

### StringIO 和 BytesIO

**StringIO**

在内存中读写`str`，和读写文件具有一致的接口；

```python
from io import StringIO
# InputStream
f = StringIO()
f.write('hello')
# 读取写入的 str
f.getvalue()

# OutputStream
f = StringIO('hello, 中国')
f.read()
```

**BytesIO**

在内存中读写`bytes`

```python
from io import BytesIO
# InputStream
f = BytesIO()
f.write('中文'.encode('utf-8'))
print(f.getvalue())

# OutputStream
f = BytesIO(b'\xe4\xb8\xad\xe6\x96\x87')
print(f.read().decode('utf-8'))
```

### 操作文件和目录

Python 内置的`os`模块可以直接调用系统提供的接口函数操作文件和目录；

```python
>>> import os
>>> os.name
nt
```

**环境变量**

```python
os.environ # 全部环境变量 (Class<Environ>)
os.environ.get('key', 'default') # 指定的环境变量，default 可选
```

**操作文件和目录**

| 函数                                  | 作用                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------- |
| os.path.abspath('.')                  | 当前路径的绝对路径                                                           |
| os.path.join(r'd:\a', 'b')            | 把路径 2（`b`）拼接到路径 1（`d:\a`）上，路径 2 若为绝对路径，直接返回路径 2 |
| os.mkdir(r'd:\test')                  | 创建一个目录                                                                 |
| os.mkdir(r'd:\test')                  | 删除一个目录                                                                 |
| os.path.split(r'd:\test\file.txt')    | 拆分成最后级别目录和文件名                                                   |
| os.path.splitext(r'd:\test\file.txt') | 拆分下文件扩展名                                                             |
| os.rename('test.txt', 'text.py')      | 重命名文件                                                                   |
| os.remove('test.py')                  | 删除文件                                                                     |
| os.listdir('.')                       | 列举指定路径                                                                 |
| os.path.isdir('d:\test')              | 判断是否路径                                                                 |
| os.path.isfile('d:\test\test.txt')    | 判断是否文件                                                                 |

`shutil`模块对`os`功能做了补充，其`copyfile()`提供文件复制功能；

### 序列化

把变量从内存中变成可存储或传输的过程称为序列化`pickling`，把序列化对象重新读到内存里称为反序列化`unpickling`；

**Pickle**

- **dumps/dump**

```python
>>> import pickle
>>> d = dict(name='中国人', age=18, score=99)
# pickle.dumps 把任意对象序列化成 bytes
>>> pickle.dumps(d)
b'\x80\x04\x95*\x00\x00\x00\x00\x00\x00\x00}\x94(\x8c\x04name\x94\x8c\t\xe4\xb8\xad\xe5\x9b\xbd\xe4\xba\xba\x94\x8c\x03age\x94K\x12\x8c\x05score\x94Kcu.'
# pickle.dump 直接把对象序列化后写入 file-like Ojbect
>>> with open('dump.txt', 'wb') as w:
...     pickle.dump(d, w)
```

- **loads/load**

```python
>>> with open('dump.txt', 'rb') as r:
...     d = pickle.load(r)
...
>>> d
{'name': 'Aurelius', 'age': 18, 'score': 99}
```

`pickle`反序列化得到的变量与原来的变量完全无关，只是值相同而已；

`pickle`序列化只适用于 Python，且不同版本彼此不兼容；

**JSON**

序列化的一种标准格式，适用于不同编程语言之间传递，标准编码使用 UTF-8；

- **JSON 类型关系**

| JSON 类型  | Python 类型 |
| ---------- | ----------- |
| {}         | dict        |
| []         | list        |
| string     | str         |
| int/float  | int/float   |
| true/false | True/False  |
| null       | None        |

```python
>>> import json
>>> d = dict(name='Aurelius', age=18, score=99)
>>> json_str = json.dumps(d)
>>> json_str
'{"name": "Aurelius", "age": 18, "score": 99}'
>>> json.loads(json_str)
{'name': 'Aurelius', 'age': 18, 'score': 99}
```

`dumps`/`dump`的`ensure_ascii`参数可以决定是否统一将返回的`str`对象编码为`ascii`字符；

**JSON 进阶**

自定义类的对象不能直接序列化，需要实现`dumps`/`dump`的`default`参数对应的方法，将该对象转化成`dict`对象；

```python
json.dumps(o, default=object2dict)
```

通常`class`都有`__dict__`属性，存储着实例的变量（定义了`__solts__`除外），因此可以直接如此调用；

```python
json.dumps(o, default=lambda o: o.__dict__)
```

`loads`/`load`在反序列化自定义类型时也需传入`object_hook`相应方法，将`dict`对象转化为自定义类型的对象；

```python
json.loads(json_str, object_hook=dict2object)
```

## 2. 正则表达式

用一种描述性的语言给字符串定义一个规则，用这种规则匹配字符串；

| 描述符 | 作用                      | 示例                              |
| ------ | ------------------------- | --------------------------------- |
| \d     | 匹配数字                  | '00\d' 匹配 '007'                 |
| \w     | 字母或数字                | '\w\w\d' 匹配 'py3'               |
| .      | 任意字符                  | 'py.' 匹配 'pyc'、'py!'           |
| \*     | 人一个字符串（包括 0 个） |                                   |
| +      | 至少 1 个字符             |                                   |
| ?      | 0 个或 1 个字符           |                                   |
| \{n\}    | n 个字符                  | '\d{3}' 匹配 '010'                |
| \{n,m\}  | n ~ m 个字符              | '\d{3,8}' 匹配 '1234567'          |
| \      | 转义字符                  | '\d{3}\-\d{3,8}' 匹配 '010-12345' |
| \s     | 空格、空位符              |                                   |

### 进阶

| 描述符 | 作用        | 示例                                           |
| ------ | ----------- | ---------------------------------------------- |
| []     | 表示范围    | '[0-9a-zA-Z\_]' 匹配任意一个数字、字母或下划线 |
| A\|B   | 匹配 A 或 B |                                                |
| ^      | 行的开头    | '^\d' 表示以数字开头                           |
| \$     | 行的结束    | '\d\$' 表示以数字结束                          |

### re 模块

Python 字符串本身用`\`转义，正则表达式也用`\`转义，在拼写正则表达式时使用`r`前缀可以忽略掉 Python 本身字符串的转义；

**match**

```python
>>> import re
>>> re.match(r'^\d{3}\-\d{3,8}$', '010-12345')
<re.Match object; span=(0, 9), match='010-12345'>
>>> re.match(r'^\d{3}\-\d{3,8}$', '010 12345')
>>>
```

当匹配成功时，返回一个 Match 对象，否则返回 None；

**split**

```python
>>> re.split(r'\s+', 'a b   c')
['a', 'b', 'c']
>>> re.split(r'[\s\,\;]+', 'a,b;; c  d')
['a', 'b', 'c', 'd']
```

通过模式分割字符串，返回分割的数组；

**group**

```python
>>> m = re.match(r'^(\d{3})-(\d{3,8})$', '010-12345')
>>> m
<re.Match object; span=(0, 9), match='010-12345'>
>>> m.group(2)
'12345'
>>> m.group(1)
'010'
>>> m.group(0)
'010-12345'
```

通过`()`提取分组子串，`group(0)`表示匹配的全部字符串，`group(n)`表示第 n 个子串；

**贪婪匹配**

匹配尽可能多的字符

```python
>>> re.match(r'^(\d+)(0*)$', '102300').groups()
('102300', '')
>>> re.match(r'^(\d+)(0+)$', '102300').groups()
('10230', '0')
```

正则匹配默认是贪婪匹配，想要非贪婪匹配（尽可能少匹配），在`\d+`后加`?`；

```python
>>> re.match(r'^(\d+?)(0*)$', '102300').groups()
('1023', '00')
```

**编译**

`re`模块执行步骤：

1. 编译正则表达式，不合法则报错；
2. 用编译后的正则表达式匹配字符串；

- **预编译**

```python
>>> import re
>>> re_telephone = re.compile(r'^(\d{3})-(\d{3,8})$')
>>> re_telephone.match('010-12345').groups()
('010', '12345')
>>> re_telephone.match('010-8086').groups()
('010', '8086')
```

> 匹配简单邮箱

```python
def is_valid_email(addr):
    if re.match(r'(^[a-zA-Z\.]+)\@(gmail|microsoft)\.com$', addr):
        return True
    else:
        return False
```

> 匹配带名称邮箱，提取名称

```python
def name_of_email(addr):
    # 提取邮箱前缀
    m = re.match(r'^([a-zA-Z\d\s\<\>]+)\@(voyager|example)\.(org|com)$', addr)
    if not m:
        return None
    # 提取前缀中 <> 里面的名称，若不存在，则取全名
    m = re.match(r'^\<([a-zA-Z\s]+)\>[\s]+[a-zA-Z\d]+|([a-zA-Z\d]+)$', m.group(1))

    return m.group(1) if m and m.group(1) else m.group(2)
```

---

- 上一篇：[「Python 基础」错误、调试与测试](https://blog.csdn.net/ChaoMing_H/article/details/129393970)
- 下一篇：[「Python 基础」进程与线程](https://blog.csdn.net/ChaoMing_H/article/details/129455599)

**PS：感谢每一位志同道合者的阅读，欢迎关注、评论、赞！**
