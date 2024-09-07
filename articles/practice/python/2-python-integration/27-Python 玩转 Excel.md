---
id: python-excel
sidebar_position: 27
title: Python 玩转 Excel
description: Python 玩转 Excel
last_update:
  author: Aurelius
  date: 2024-09-06
tags:
  - Python
  - Excel
  - Pandas
  - openpyxl
  - xlrd / xlwt
  - pyxlsb
  - xlsxwriter
  - pywin32
---

## 引言

`Excel` 是在数据处理和分析中一种最常用的工具，而 Python 是一种强大的编程语言。结合 Python 的数据处理库，可以方便地操作 Excel 文件，进行数据读取、处理、分析和报告生成等工作。本文将介绍如何使用 Python 操作 Excel 文件，包括读取、写入、数据处理、样式设置、数据验证、公式支持和图表创建等方面的内容。

![Cover](<assets/cover/Python 玩转 Excel.drawio.png>)

在 Python 中，有多种库和方法可以操作 Excel 文件。下面我们捡一些常用的库及其基本操作进行介绍。

## Pandas

`Pandas` 是一个强大的数据分析和处理库，非常适合处理表格数据。它可以读取 Excel 文件：`pd.read_excel()`；写入 Excel 文件：`DataFrame.to_excel()`；处理 DataFrame，对数据进行筛选、聚合等操作。

> **安装 Pandas**
>
> ```python
> pip install pandas
> ```
>
> **导入 Pandas**
>
> ```python
> import pandas as pd
> ```

### 读取 Excel

Pandas 可以读取 `.xls` 和 `.xlsx` 文件。可以指定读取特定的 sheet。

```python
import pandas as pd

# 读取整个 Excel 文件
df = pd.read_excel('file.xlsx')

# 读取特定的 sheet
df_sheet1 = pd.read_excel('file.xlsx', sheet_name='Sheet1')

# 读取多个 sheet
dfs = pd.read_excel('file.xlsx', sheet_name=['Sheet1', 'Sheet2'])
```

### 写入 Excel

Pandas 可以将 DataFrame 保存为 Excel 文件。可以选择是否写入索引。

```python
# 创建一个简单的 DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie'],
    'Age': [24, 30, 22]
}
df = pd.DataFrame(data)

# 写入 Excel 文件
df.to_excel('output.xlsx', index=False)  # 不写入索引
```

### 数据操作

Pandas 可以对 DataFrame 进行数据筛选、分组、合并和聚合等。

```python
# 假设 df 包含以下数据
#    Name   Age   Salary
# 0  Alice   24   50000
# 1    Bob   30   60000
# 2 Charlie   22   45000
# 3    Eve   35   70000

# 数据筛选：筛选出年龄大于 25 的数据
filtered_df = df[df['Age'] > 25]

# 数据分组和聚合：计算每个年龄的平均工资
grouped_df = df.groupby('Age').mean()

# 合并多个 DataFrame：合并 df1 和 df2
df1 = pd.DataFrame({'Name': ['Alice', 'Bob'], 'Age': [24, 30]})
df2 = pd.DataFrame({'Name': ['Charlie', 'David'], 'Age': [22, 28]})
result = pd.concat([df1, df2])
```

### 样式设置

在 Pandas 中通过 `Styler` 类进行样式设置，可以在写入文件时使用。

```python
# 使用样式设置
styled_df = df.style.highlight_max(axis=0)  # 高亮最大值
styled_df.to_excel('styled_output.xlsx', engine='openpyxl')  # 需要指定引擎
```

### 数据验证

Pandas 本身不直接提供数据验证的功能，但可以使用 `openpyxl` 或 `xlsxwriter` 进行进一步的样式和数据验证。

```python
import pandas as pd

# 假设已有 DataFrame df
data = {
    'Names': ['Alice', 'Bob', 'Charlie'],
    'Ages': [24, 30, 'thirty']
}
df = pd.DataFrame(data)

# 数据验证（过滤掉不合格的年龄）
df['Ages'] = pd.to_numeric(df['Ages'], errors='coerce')  # 转为数值类型，不合格的设置为 NaN
valid_ages = df[df['Ages'].notnull()]
```

### 公式支持

Pandas 自身不支持添加公式，但可以通过 `openpyxl` 来实现。

```python
import pandas as pd
from openpyxl import load_workbook

# 创建 DataFrame
data = {
    'Numbers': [1, 2, 3, 4],
    'Doubles': [2, 4, 6, 8]
}
df = pd.DataFrame(data)

# 写入 Excel
df.to_excel('output_with_formula.xlsx', index=False)

# 使用 openpyxl 添加公式
wb = load_workbook('output_with_formula.xlsx')
ws = wb.active
ws['C1'] = 'Sum'
ws['C2'] = '=SUM(A2:A5)'  # 在 C2 中写入公式
wb.save('output_with_formula.xlsx')
```

Pandas 提供了强大的数据处理和分析功能，配合其他库如 `openpyxl` 和 `xslxwriter`，可以实现复杂的 Excel 文件操作，包括读取、写入、数据操作、样式设置、数据验证、公式支持和图表创建等。

对于非常大的 Excel 文件，使用 `pandas` 进行批量操作通常更高效。使用 `pandas` 读取 Excel 时，注意数据类型的自动推断，可能需要使用 `dtype` 参数进行控制。Pandas 提供了丰富的工具来处理缺失值（如 `isnull()`、`fillna()`等）。

## openpyxl

`openpyxl` 是一个用于处理 Excel 2007 及更高版本的 `.xlsx` 文件的强大库。`openpyxl` 可用于 Excel 文件的读取、写入、数据操作、样式设置、数据验证、公式支持和图表创建等方面。

> **安装 openpyxl**
>
> ```python
> pip install openpyxl
> ```

### 读取 Excel

openpyxl 可以读取整个 Excel 文件的内容，获取指定工作表的值。

```python
from openpyxl import load_workbook

# 读取 Excel 文件
workbook = load_workbook('file.xlsx')

# 获取默认工作表
sheet = workbook.active

# 获取单元格值
value = sheet['A1'].value
print(value)

# 获取所有行的值
for row in sheet.iter_rows(values_only=True):
    print(row)
```

### 写入 Excel

openpyxl 可以创建新的工作簿、工作表，并写入单元格值。

```python
from openpyxl import Workbook

# 创建新的工作簿
workbook = Workbook()
sheet = workbook.active

# 写入数据到单元格
sheet['A1'] = 'Name'
sheet['B1'] = 'Age'
sheet['A2'] = 'Alice'
sheet['B2'] = 24

# 保存工作簿
workbook.save('output.xlsx')
```

### 数据操作

openpyxl 支持读取、修改和删除单元格的值。

```python
# 读取和修改数据
workbook = load_workbook('output.xlsx')
sheet = workbook.active

# 修改单元格的值
sheet['B2'] = 25  # 修改 Alice 的年龄

# 删除一行
sheet.delete_rows(2)  # 删除第二行

# 添加新行
sheet.append(['Bob', 30])

# 保存修改
workbook.save('output_modified.xlsx')
```

### 样式设置

openpyxl 可以设置单元格的样式，包括字体、颜色、边框、填充等。

```python
from openpyxl.styles import Font, Color, PatternFill, Border, Side

workbook = load_workbook('output.xlsx')
sheet = workbook.active

# 设置字体
font = Font(name='Arial', size=12, bold=True, color='FF0000')
sheet['A1'].font = font

# 设置填充颜色
fill = PatternFill(start_color='FFFF00', end_color='FFFF00', fill_type='solid')
sheet['B1'].fill = fill

# 设置边框
border = Border(left=Side(style='thin'), right=Side(style='thin'),
                top=Side(style='thin'), bottom=Side(style='thin'))
sheet['A1'].border = border

# 保存修改
workbook.save('styled_output.xlsx')
```

### 数据验证

openpyxl 可以设置数据有效性规则，例如下拉菜单。

```python
from openpyxl.worksheet.datavalidation import DataValidation

workbook = load_workbook('output.xlsx')
sheet = workbook.active

# 创建数据验证规则（下拉列表）
dv = DataValidation(type="list", formula1='"Option1,Option2,Option3"', showDropDown=True)
sheet.add_data_validation(dv)

# 应用验证到单元格
dv.add(sheet['C1'])

# 保存修改
workbook.save('validated_output.xlsx')
```

### 公式支持

openpyxl 可以在单元格中添加公式。

```python
workbook = load_workbook('output.xlsx')
sheet = workbook.active

# 设置公式
sheet['D1'] = 'Total'
sheet['D2'] = '=B2*2'  # 假设 B2 存储了某个值

# 保存修改
workbook.save('formula_output.xlsx')
```

### 图表创建

openpyxl 可以创建各种类型的图表。

```python
from openpyxl.chart import BarChart, Reference

workbook = load_workbook('output.xlsx')
sheet = workbook.active

# 假设数据在 A1 到 B4 的区域
data = Reference(sheet, min_col=2, min_row=1, max_col=2, max_row=4)
categories = Reference(sheet, min_col=1, min_row=2, max_row=4)

bar_chart = BarChart()
bar_chart.add_data(data, titles_from_data=True)
bar_chart.set_categories(categories)
bar_chart.title = "Sample Bar Chart"
sheet.add_chart(bar_chart, "E5")  # 放置图表的位置

# 保存修改
workbook.save('chart_output.xlsx')
```

`openpyxl` 提供丰富的功能，可以高效地读取、写入和操作 Excel 文件。通过灵活地设置单元格样式、数据验证以及公式支持，用户可以创建功能强大的 Excel 报告和分析。同时，图表的创建功能使得数据可视化变得更简单直观。

## xlrd / xlwt

`xlrd` 用于读取 `.xls` 文件，但不支持写入操作；`xlwt` 用于写入 `.xls` 文件，还可以创建新工作簿和工作表。这两个库主要适用于旧版 Excel 文件。从`xlrd` 2.0 版本开始，仅支持读取 `xls` 格式文件，不再支持 `xlsx`。

> **安装 xlrd / xlwt**
>
> ```python
> pip install xlrd xlwt
> ```

### 读取 Excel（xlrd）

```python
import xlrd

# 打开 Excel 文件
workbook = xlrd.open_workbook('file.xls')

# 选择工作表
sheet = workbook.sheet_by_index(0)  # 选择第一个工作表

# 获取单元格值
value = sheet.cell_value(0, 0)  # 获取 A1 单元格的值
print(value)

# 获取所有行的值
for row_idx in range(sheet.nrows):
    print(sheet.row_values(row_idx))
```

`xlwt` 用于写入 `.xls` 文件。它用于。

### 写入 Excel（xlwt）

```python
import xlwt

# 创建一个工作簿
workbook = xlwt.Workbook()
sheet = workbook.add_sheet('Sheet1')

# 写入数据
sheet.write(0, 0, 'Name')  # A1
sheet.write(0, 1, 'Age')   # B1
sheet.write(1, 0, 'Alice')  # A2
sheet.write(1, 1, 24)      # B2

# 保存工作簿
workbook.save('output.xls')
```

## pyxlsb

`pyxlsb` 是一个用于读取 Excel 二进制格式 `.xlsb` 文件的库。

> **安装 pyxlsb**
>
> ```python
> pip install pyxlsb
> ```

### 读取 Excel（pyxlsb）

```python
from pyxlsb import open_workbook

# 打开 Excel 文件
with open_workbook('file.xlsb') as wb:
    with wb.get_sheet(1) as sheet:  # 获取第一个工作表
        for row in sheet.rows():
            print([item.v for item in row])  # 打印行
```

## xlsxwriter

`xlsxwriter` 是一个用于创建复杂 `.xlsx` 文件的库，支持写入和格式化操作。

> **安装 xlsxwriter**
>
> ```python
> pip install xlsxwriter
> ```

### 写入 Excel

```python
import xlsxwriter

# 创建一个工作簿
workbook = xlsxwriter.Workbook('output.xlsx')
worksheet = workbook.add_worksheet()

# 写入数据
worksheet.write('A1', 'Name')
worksheet.write('B1', 'Age')
worksheet.write('A2', 'Alice')
worksheet.write('B2', 24)

# 保存工作簿
workbook.close()
```

### 样式设置

```python
# 设置单元格格式
bold = workbook.add_format({'bold': True})
worksheet.write('A1', 'Name', bold)  # 使用格式写入

# 设置背景颜色
cell_format = workbook.add_format({'bg_color': '#FFCC00'})
worksheet.write('A2', 'Alice', cell_format)  # 设置背景颜色
```

### 公式支持

```python
# 写入公式
worksheet.write('C1', 'Total')
worksheet.write_formula('C2', '=B2*2')  # 在 C2 中写入公式
```

### 图表创建

```python
# 创建图表
chart = workbook.add_chart({'type': 'column'})

# 配置数据系列
chart.add_series({
    'name': 'Age Data',
    'categories': '=Sheet1!$A$2:$A$3',
    'values': '=Sheet1!$B$2:$B$3',
})

worksheet.insert_chart('E2', chart)  # 插入图表

# 保存工作簿
workbook.close()
```

## pywin32 (Windows Only)

`pywin32` 是一个 Python 库，允许 Python 程序与 Windows COM（组件对象模型）进行交互，因此可以直接操作安装在 Windows 系统上的 Microsoft Excel。以下是使用 `pywin32` 操作 Excel 文件的详细介绍，涵盖读取、写入、数据操作、样式设置、数据验证、公式支持和图表创建等方面。

> **安装 pywin32**
>
> ```python
> pip install pywin32
> ```

### 读取 Excel

pywin32 可以打开现有的 Excel 文件，读取工作表及单元格内容。

```python
import win32com.client

# 启动 Excel 应用程序
excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = False  # 不显示 Excel 窗口

# 打开 Excel 文件
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')

# 选择工作表
sheet = workbook.Sheets('Sheet1')

# 获取单元格值
value = sheet.Cells(1, 1).Value  # A1
print(value)

# 遍历整行数据
for row in range(1, 4):
    print([sheet.Cells(row, col).Value for col in range(1, 4)])

# 关闭工作簿
workbook.Close(SaveChanges=False)
excel.Quit()
```

### 写入 Excel

pywin32 可以创建新的 Excel 文件或在现有文件中写入数据。

```python
# 启动 Excel 应用程序
excel = win32com.client.Dispatch('Excel.Application')
excel.Visible = True  # 可视化 Excel 窗口

# 创建新工作簿
workbook = excel.Workbooks.Add()
sheet = workbook.ActiveSheet

# 写入数据
sheet.Cells(1, 1).Value = 'Name'
sheet.Cells(1, 2).Value = 'Age'
sheet.Cells(2, 1).Value = 'Alice'
sheet.Cells(2, 2).Value = 24

# 保存工作簿
workbook.SaveAs(r'path\to\your\new_file.xlsx')
workbook.Close()
excel.Quit()
```

### 数据操作

pywin32 可以修改单元格的值，删除行或列，插入新行等。

```python
# 打开现有工作簿
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')
sheet = workbook.Sheets('Sheet1')

# 修改单元格的值
sheet.Cells(2, 2).Value = 25  # 修改 B2

# 插入新的行
sheet.Rows(3).Insert()  # 在第三行插入新行
sheet.Cells(3, 1).Value = 'Bob'
sheet.Cells(3, 2).Value = 30

# 删除一行
sheet.Rows(4).Delete()  # 删除第四行

# 保存修改
workbook.Save()
workbook.Close()
excel.Quit()
```

### 样式设置

pywin32 可以设置单元格的字体、颜色、边框等样式。

```python
# 打开现有工作簿
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')
sheet = workbook.Sheets('Sheet1')

# 设置字体样式
font = sheet.Cells(1, 1).Font
font.Bold = True
font.Color = 0xFF0000  # 红色

# 设置单元格背景颜色
sheet.Cells(1, 1).Interior.Color = 0xFFFF00  # 黄色背景

# 保存修改
workbook.Save()
workbook.Close()
excel.Quit()
```

### 数据验证

pywin32 可以在单元格中设置数据有效性规则（例如下拉列表）。

```python
# 打开现有工作簿
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')
sheet = workbook.Sheets('Sheet1')

# 创建下拉列表
validation = sheet.Range("C1").Validation
validation.Delete()  # 删除之前的验证
validation.Add(
    Type=1,  # 1 = List
    AlertStyle=1,
    Operator=1,
    Formula1='"Option1,Option2,Option3"',
    InCellDropdown=True
)

# 保存修改
workbook.Save()
workbook.Close()
excel.Quit()
```

### 公式支持

pywin32 可以在单元格中输入公式。

```python
# 打开现有工作簿
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')
sheet = workbook.Sheets('Sheet1')

# 设置公式
sheet.Cells(2, 3).Formula = '=B2*2'  # 在 C2 中写入公式

# 保存修改
workbook.Save()
workbook.Close()
excel.Quit()
```

### 图表创建

pywin32 可以创建各种类型的图表。

```python
# 打开现有工作簿
workbook = excel.Workbooks.Open(r'path\to\your\file.xlsx')
sheet = workbook.Sheets('Sheet1')

# 添加图表
chart = workbook.Charts.Add()
chart.ChartType = 51  # 51 = xlColumnClustered
chart.SetSourceData(sheet.Range("A1:B3"))  # 数据来源

# 保存修改
workbook.Save()
workbook.Close()
excel.Quit()
```

`pywin32` 提供了与 Excel 的深度集成，能够进行全面的文件操作。通过 Windows COM 接口，可以充分利用 Excel 的所有功能，这使得它成为处理 Excel 文件的强大工具。但是需要注意，`pywin32` 只在 Windows 环境中有效，并且需要安装 Excel 软件。

## 横向对比

以下是各个 Python 模块在操作 Excel 文件时支持的各种操作类型的详细描述。

| 模块            | 描述                                       | 支持的操作                                                                                                                                                                             |
| --------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pandas**      | 强大的数据分析库，适合处理表格数据。       | - 读取 Excel 文件（`.xls`，`.xlsx`，可指定 `sheet_name`）<br />- 写入 Excel 文件（可选择是否写入索引）<br />- 数据操作（筛选、分组、合并、清洗）<br />- 样式设置（通过 `Styler` 对象） |
| **openpyxl**    | 主要用于处理 `.xlsx` 文件的库。            | - 读取单元格、行、列和整个表格<br />- 写入单元格、行、列，设置格式<br />- 数据验证（如下拉菜单）<br />- 公式支持<br />- 创建图表（饼图、柱形图等）<br />- 自定义单元格样式             |
| **xlrd / xlwt** | 主要用于处理 `.xls` 格式的文件。           | - **xlrd**: 读取单元格、行、列，获取工作表元数据<br />- **xlwt**: 创建工作簿和工作表，写入单元格，设置样式，合并单元格                                                                 |
| **pyxlsb**      | 用于读取 `.xlsb`（Excel 二进制文件）格式。 | - 读取表格数据，支持逐行遍历和特定 sheet 的数据                                                                                                                                        |
| **xlsxwriter**  | 创建复杂的 `.xlsx` 文件的库。              | - 创建新的工作簿和工作表<br />- 写入各种数据类型<br />- 创建图表（饼图、柱形图、折线图等）<br />- 自定义单元格样式<br />- 设置工作簿保护                                               |
| **pywin32**     | 通过 Windows COM 接口与 Excel 交互。       | - 启动 Excel 应用程序<br />- 读取单元格和写入数据<br />- 操作 Excel 对象（如图表、表格）<br />- 设置公式                                                                               |

不同的库和方法适用于不同文件格式和需求。选择适合的库能够有效完成数据处理、分析和报告生成的需求。

确保使用正确的库对应正确的 Excel 文件格式（`.xls` 或 `.xlsx`）。通过上面介绍的库和功能，Python 提供了一系列灵活和方便的方式来操作 Excel 文件，能够很好地满足数据处理与分析的需求。

---

**PS：感谢每一位志同道合者的阅读，欢迎关注、点赞、评论！**
