---
id: pandas
sidebar_position: 2
title: Pandas 数据分析
description: Pandas 数据分析
last_update:
  author: Aurelius
  date: 2024-08-10
tags:
  - Python
  - Pandas 数据分析
---

_Pandas 是一个开源的 Python 库，专为数据处理和分析任务而设计；它提供了高性能、易用的数据结构和数据分析工具，使得在 Python 中进行数据科学变得简单高效；Pandas 基于 NumPy，因此可以与许多其他基于 NumPy 的库（如 SciPy 和 scikit-learn）无缝集成；_

**Pandas 中的两个主要数据结构**

- `Series`，一个一维带标签的数组，可存储整数、浮点数、字符串等不同类型的数据；Series 具有索引（index），这使得它类似于 Python 字典，但具有更多的特性和功能；

- `DataFrame`，一个二维带标签的数据结构，类似于表格或电子表格；它由一系列具有相同索引的列组成，每列可以具有不同的数据类型；DataFrame 提供了各种功能，如筛选、排序、分组、合并和聚合，以便在大型数据集上进行高效操作；

**支持的数据处理和分析任务**

- 数据导入和导出
- 数据清洗和预处理
- 数据过滤和选择
- 数据排序、排名和聚合
- 缺失值处理
- 分组操作
- 数据透视表
- 时间序列分析
- 合并和连接多个数据集

Pandas 提供了丰富的功能，使得它成为 Python 数据科学生态系统中最受欢迎和广泛使用的库之一；

```python
import pandas as pd
import numpy as np
```

@[toc]

## 1. Series

### 1. 构造与初始化

1. Series 是一个一维数据结构，Pandas 会默认用 0 到 n 来作为 Series 的 index；

```python
>>> s = pd.Series([1, 3, 'Beijing', 3.14, -123, 'Year!'])
>>> s
0          1
1          3
2    Beijing
3       3.14
4       -123
5      Year!
dtype: object
```

2. 自行指定 index；

```python
>>> s = pd.Series([1, 3, 'Beijing', 3.14, -123, 'Year!'], index=['A', 'B', 'C', 'D', 'E','G'])
>>> s
A          1
B          3
C    Beijing
D       3.14
E       -123
G      Year!
dtype: object
```

3. 直接使用 dictionary 构造 Series, 因为 Series 本身就是 keyvalue pairs；

```python
>>> cities = {'Beijing': 55000, 'Shanghai': 60000, 'Shenzhen': 50000,
>>>           'Hangzhou': 20000, 'Guangzhou': 25000, 'Suzhou': None}
>>> apts = pd.Series(cities)
>>> apts
Beijing      55000.0
Shanghai     60000.0
Shenzhen     50000.0
Hangzhou     20000.0
Guangzhou    25000.0
Suzhou           NaN
dtype: float64
```

### 2. 选择数据

1. 通过 index 选择数据

```python
>>> apts['Hangzhou']
20000.0

>>> apts[['Hangzhou', 'Beijing', 'Shenzhen']]
Hangzhou    20000.0
Beijing     55000.0
Shenzhen    50000.0
dtype: float64

>>> # boolean indexing
>>> apts[apts < 50000]
Hangzhou     20000.0
Guangzhou    25000.0
dtype: float64

>>> # boolean indexing 的工作方式
>>> less_than_50000 = apts < 50000
>>> less_than_50000
Beijing      False
Shanghai     False
Shenzhen     False
Hangzhou      True
Guangzhou     True
Suzhou       False
dtype: bool

>>> apts[less_than_50000]
Hangzhou     20000.0
Guangzhou    25000.0
dtype: float64
```

### 3. 元素赋值

```python
>>> print("Old value: ", apts['Shenzhen'])
Old value:  50000.0

>>> apts['Shenzhen'] = 55000
>>> print("New value: ", apts['Shenzhen'])
New value:  55000.0

>>> print(apts[apts < 50000])
Hangzhou     20000.0
Guangzhou    25000.0
dtype: float64

>>> apts[apts <= 50000] = 40000
>>> print(apts[apts < 50000])
angzhou     40000.0
Guangzhou    40000.0
dtype: float64
```

### 4. 数学运算

```python
>>> apts / 2
Beijing      27500.0
Shanghai     30000.0
Shenzhen     27500.0
Hangzhou     20000.0
Guangzhou    20000.0
Suzhou           NaN
dtype: float64

>>> np.square(apts)
Beijing      3.025000e+09
Shanghai     3.600000e+09
Shenzhen     3.025000e+09
Hangzhou     1.600000e+09
Guangzhou    1.600000e+09
Suzhou                NaN
dtype: float64

>>> cars = pd.Series({'Beijing': 300000, 'Shanghai': 400000, 'Shenzhen': 300000,
>>>                   'Tianjin': 200000, 'Guangzhou': 200000, 'Chongqing': 150000})
>>> cars
Beijing      300000
Shanghai     400000
Shenzhen     300000
Tianjin      200000
Guangzhou    200000
Chongqing    150000
dtype: int64

>>> # 按 index 运算
>>> cars + apts * 100
Beijing      5800000.0
Chongqing          NaN
Guangzhou    4200000.0
Hangzhou           NaN
Shanghai     6400000.0
Shenzhen     5800000.0
Suzhou             NaN
Tianjin            NaN
dtype: float64
```

### 5. 数据缺失

```python
>>> print('Hangzhou' in apts)
True

>>> print('Hangzhou' in cars)
False

>>> apts.notnull()
Beijing       True
Shanghai      True
Shenzhen      True
Hangzhou      True
Guangzhou     True
Suzhou       False
dtype: bool

>>> print(apts.isnull())
Beijing      False
Shanghai     False
Shenzhen     False
Hangzhou     False
Guangzhou    False
Suzhou        True
dtype: bool

>>> print(apts[apts.isnull()])
Suzhou   NaN
dtype: float64
```

## 2. DataFrame

一个 DataFrame 就是一张表格，Series 表示的是一维数组，DataFrame 则是一个二维数组，可以类比成一张 excel 的表格；也可以把 DataFrame 当做一个一组 Series 的集合；

### 1. 构造和选择数据

1. 由一个 dictionary 构造；

```python
>>> data = {'city': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Hangzhou', 'Chongqing'],
>>>         'year': [2016, 2017, 2016, 2017, 2016, 2016],
>>>         'population': [2100, 2300, 1000, 700, 500, 500]}
>>> d1 = pd.DataFrame(data)
>>> print(d1)
        city  year  population
0    Beijing  2016        2100
1   Shanghai  2017        2300
2  Guangzhou  2016        1000
3   Shenzhen  2017         700
4   Hangzhou  2016         500
5  Chongqing  2016         500
```

2. 全列遍历

```python
>>> for row in d1.values:
>>>     print(row)
['Beijing' 2016 2100]
['Shanghai' 2017 2300]
['Guangzhou' 2016 1000]
['Shenzhen' 2017 700]
['Hangzhou' 2016 500]
['Chongqing' 2016 500]
```

3. 选择列并合并遍历

```python
>>> for row in zip(d1['city'], d1['year'], d1['population']):
>>>     print(row)
('Beijing', 2016, 2100)
('Shanghai', 2017, 2300)
('Guangzhou', 2016, 1000)
('Shenzhen', 2017, 700)
('Hangzhou', 2016, 500)
('Chongqing', 2016, 500)

>>> print(d1.columns)
Index(['city', 'year', 'population'], dtype='object')
```

4. 列序重组

```python
>>> print(pd.DataFrame(data, columns=['year', 'city', 'population']))
   year       city  population
0  2016    Beijing        2100
1  2017   Shanghai        2300
2  2016  Guangzhou        1000
3  2017   Shenzhen         700
4  2016   Hangzhou         500
5  2016  Chongqing         500
```

5. 行与列索引

```python
>>> frame2 = pd.DataFrame(data,
>>>                       columns=['year', 'city', 'population', 'debt'],
>>>                       index=['one', 'two', 'three', 'four', 'five', 'six'])
>>> print(frame2)
       year       city  population debt
one    2016    Beijing        2100  NaN
two    2017   Shanghai        2300  NaN
three  2016  Guangzhou        1000  NaN
four   2017   Shenzhen         700  NaN
five   2016   Hangzhou         500  NaN
six    2016  Chongqing         500  NaN

>>> print(frame2['city'])
one        Beijing
two       Shanghai
three    Guangzhou
four      Shenzhen
five      Hangzhou
six      Chongqing
Name: city, dtype: object

>>> print(frame2.year)
one      2016
two      2017
three    2016
four     2017
five     2016
six      2016
Name: year, dtype: int64

>>> # loc 取 label based indexing or iloc 取 positional indexing
>>> print(frame2.loc['three'])
year               2016
city          Guangzhou
population         1000
debt                NaN
Name: three, dtype: object

>>> print(frame2.iloc[2].copy())
year               2016
city          Guangzhou
population         1000
debt                NaN
Name: three, dtype: object
```

### 2. 元素赋值

1. 整列赋值（单值）；

```python
>>> frame2['debt'] = 100
>>> print(frame2)
       year       city  population  debt
one    2016    Beijing        2100   100
two    2017   Shanghai        2300   100
three  2016  Guangzhou        1000   100
four   2017   Shenzhen         700   100
five   2016   Hangzhou         500   100
six    2016  Chongqing         500   100
```

2. 整列赋值（列表值）；

```python
>>> frame2.debt = np.arange(6)
>>> print(frame2)
       year       city  population  debt
one    2016    Beijing        2100     0
two    2017   Shanghai        2300     1
three  2016  Guangzhou        1000     2
four   2017   Shenzhen         700     3
five   2016   Hangzhou         500     4
six    2016  Chongqing         500     5
```

3. 用 Series 来指定需要修改的 index 以及相对应的 value，没有指定的默认用 NaN；

```python
>>> val = pd.Series([100, 200, 300], index=['two', 'three', 'five'])
>>> frame2['debt'] = val
>>> print(frame2)
       year       city  population   debt
one    2016    Beijing        2100    NaN
two    2017   Shanghai        2300  100.0
three  2016  Guangzhou        1000  200.0
four   2017   Shenzhen         700    NaN
five   2016   Hangzhou         500  300.0
six    2016  Chongqing         500    NaN
```

4. 用存在的列赋值（创建新列）；

```python
>>> frame2['western'] = (frame2.city == 'Chongqing')
>>> print(frame2)
       year       city  population   debt  western
one    2016    Beijing        2100    NaN    False
two    2017   Shanghai        2300  100.0    False
three  2016  Guangzhou        1000  200.0    False
four   2017   Shenzhen         700    NaN    False
five   2016   Hangzhou         500  300.0    False
six    2016  Chongqing         500    NaN     True
```

5. DataFrame 的转置；

```python
>>> pop = {'Beijing': {2016: 2100, 2017: 2200},
>>>        'Shanghai': {2015: 2400, 2016: 2500, 2017: 2600}}
>>> frame3 = pd.DataFrame(pop)
>>> print(frame3)
      Beijing  Shanghai
2016   2100.0      2500
2017   2200.0      2600
2015      NaN      2400

>>> print(frame3.T)
            2016    2017    2015
Beijing   2100.0  2200.0     NaN
Shanghai  2500.0  2600.0  2400.0
```

6. 行序重组；

```python
>>> pd.DataFrame(pop, index=[2015, 2016, 2017])
	Beijing	Shanghai
2015	NaN	2400
2016	2100.0	2500
2017	2200.0	2600
```

6. 使用切片初始化数据；

```python
>>> pdata = {'Beijing': frame3['Beijing'][:-1],
>>>          'Shanghai': frame3['Shanghai'][:-1]}
>>> pd.DataFrame(pdata)
	Beijing	Shanghai
2016	2100.0	2500
2017	2200.0	2600
```

7. 指定 index 的名字和列的名字；

```python
>>> frame3.index.name = 'year'
>>> frame3.columns.name = 'city'
>>> print(frame3)
city  Beijing  Shanghai
year
2016   2100.0      2500
2017   2200.0      2600
2015      NaN      2400

>>> print(frame2.values)
[[2016 'Beijing' 2100 nan False]
 [2017 'Shanghai' 2300 100.0 False]
 [2016 'Guangzhou' 1000 200.0 False]
 [2017 'Shenzhen' 700 nan False]
 [2016 'Hangzhou' 500 300.0 False]
 [2016 'Chongqing' 500 nan True]]

>>> print(frame2)
      year       city  population   debt  western
one    2016    Beijing        2100    NaN    False
two    2017   Shanghai        2300  100.0    False
three  2016  Guangzhou        1000  200.0    False
four   2017   Shenzhen         700    NaN    False
five   2016   Hangzhou         500  300.0    False
six    2016  Chongqing         500    NaN     True

>>> print(type(frame2.values))
<class 'numpy.ndarray'>
```

## 3. Index

### 1. Index 对象

```python
>>> obj = pd.Series(range(3), index=['a', 'b', 'c'])
>>> index = obj.index
>>> index
Index(['a', 'b', 'c'], dtype='object')

>>> index[1:]
Index(['b', 'c'], dtype='object')

>>> # index 不能被动态改动
>>> # index[1]='d'

>>> index = pd.Index(np.arange(3))
>>> obj2 = pd.Series([2, 5, 7], index=index)
>>> print(obj2)
0    2
1    5
2    7
dtype: int64

>>> print(obj2.index is index)
True

>>> 2 in obj2.index
True

>>> pop = {'Beijing': {2016: 2100, 2017: 2200},
>>>        'Shanghai': {2015: 2400, 2016: 2500, 2017: 2600}}
>>> frame3 = pd.DataFrame(pop)
>>> print('Shanghai' in frame3.columns)
True

>>> print('2015' in frame3.index)
False

>>> print(2015 in frame3.index)
True
```

### 2. Index 索引和切片

```python
>>> obj = pd.Series(np.arange(4), index=['a', 'b', 'c', 'd'])
>>> print(obj)
a    0
b    1
c    2
d    3
dtype: int64

>>> print(obj['b'])
1
```

1. 使用默认的数字 index；

```python
>>> print(obj[3])
3

>>> print(obj[[1, 3]])
b    1
d    3
dtype: int64

>>> print(obj[['b', 'd']])
b    1
d    3
dtype: int64
```

2. 条件筛选；

```python
>>> print(obj[obj < 2])
a    0
b    1
dtype: int32
```

3. 切片筛选与赋值

```python
>>> print(obj['b':'c'])
b    1
c    2
dtype: int64

>>> obj['b':'c'] = 5
>>> print(obj)
a    0
b    5
c    5
d    3
dtype: int64
```

4. DataFrame 的 Indexing

```python
>>> a = np.arange(9).reshape(3, 3)
>>> print(a)
[[0 1 2]
 [3 4 5]
 [6 7 8]]

>>> frame = pd.DataFrame(a,
>>>                      index=['a', 'c', 'd'],
>>>                      columns=['Hangzhou', 'Shenzhen', 'Nanjing'])
>>> frame
   Hangzhou  Shenzhen  Nanjing
a         0         1        2
c         3         4        5
d         6         7        8

>>> frame['Hangzhou']
a    0
c    3
d    6
Name: Hangzhou, dtype: int64

>>> frame[['Shenzhen', 'Nanjing']]
   Shenzhen  Nanjing
a         1        2
c         4        5
d         7        8

>>> frame[:2]
   Hangzhou  Shenzhen  Nanjing
a         0         1        2
c         3         4        5

>>> frame.loc['a']
Hangzhou    0
Shenzhen    1
Nanjing     2
Name: a, dtype: int64

>>> frame.loc[['a', 'd'], ['Shenzhen', 'Nanjing']]
   Shenzhen  Nanjing
a         1        2
d         7        8

>>> frame.loc[:'c', 'Hangzhou']
a    0
c    3
Name: Hangzhou, dtype: int64
```

5. DataFrame 的 condition selection

```python
>>> frame[frame.Hangzhou > 1]
   Hangzhou  Shenzhen  Nanjing
c         3         4        5
d         6         7        8

>>> frame < 5
   Hangzhou  Shenzhen  Nanjing
a      True      True     True
c      True      True    False
d     False     False    False

>>> frame[frame < 5] = 0
>>> frame
   Hangzhou  Shenzhen  Nanjing
a         0         0        0
c         0         0        5
d         6         7        8
```

### 3. reindex

1. 按照新的 index 顺序进行重排；

```python
>>> obj = pd.Series([4.5, 7.2, -5.3, 3.2], index=['d', 'b', 'a', 'c'])
>>> print(obj)
d    4.5
b    7.2
a   -5.3
c    3.2
dtype: float64

>>> obj2 = obj.reindex(['a', 'b', 'c', 'd', 'e'])
>>> obj2
a   -5.3
b    7.2
c    3.2
d    4.5
e    NaN
dtype: float64
```

2. 在新的 index 上填充指定值；

```python
>>> obj.reindex(['a', 'b', 'c', 'd', 'e'], fill_value=0)
a   -5.3
b    7.2
c    3.2
d    4.5
e    0.0
dtype: float64
```

3. 在新的 index 上填充前面最近的值；

```python
>>> obj3 = pd.Series(['blue', 'purple', 'yellow'], index=[0, 2, 4])
>>> obj3
0      blue
2    purple
4    yellow
dtype: object

>>> # forward
>>> obj3.reindex(range(6), method='ffill')
0      blue
1      blue
2    purple
3    purple
4    yellow
5    yellow
dtype: object
```

4. 在新的 index 上填充后面最近的值；

```python
>>> # backward
>>> obj3.reindex(range(6), method='bfill')
0      blue
1    purple
2    purple
3    yellow
4    yellow
5       NaN
dtype: object
```

5. 对 DataFrame 进行 reindex；

```python
>>> frame = pd.DataFrame(np.arange(9).reshape(3, 3),
                     index=['a', 'c', 'd'],
                     columns=['Hangzhou', 'Shenzhen', 'Nanjing'])
>>> frame
   Hangzhou  Shenzhen  Nanjing
a         0         1        2
c         3         4        5
d         6         7        8

>>> frame2 = frame.reindex(['a', 'b', 'c', 'd'])
>>> frame2
   Hangzhou  Shenzhen  Nanjing
a       0.0       1.0      2.0
b       NaN       NaN      NaN
c       3.0       4.0      5.0
d       6.0       7.0      8.0
```

6. 重新指定 columns；

```python
>>> frame.reindex(columns=['Shenzhen', 'Hangzhou', 'Chongqing'])
   Shenzhen  Hangzhou  Chongqing
a         1         0        NaN
c         4         3        NaN
d         7         6        NaN

>>> frame3 = frame.reindex(index=['a', 'b', 'c', 'd'], method='ffill').reindex(
>>>     columns=['Shenzhen', 'Hangzhou', 'Chongqing'])
>>> print(frame3)
   Shenzhen  Hangzhou  Chongqing
a         1         0        NaN
b         1         0        NaN
c         4         3        NaN
d         7         6        NaN

>>> print(frame3.loc[['a', 'b', 'd', 'c'],
>>>       ['Shenzhen', 'Hangzhou', 'Chongqing']])
   Shenzhen  Hangzhou  Chongqing
a         1         0        NaN
b         1         0        NaN
d         7         6        NaN
c         4         3        NaN
```

### 4. drop

1. 删除 Series 和 DataFrame 中的 index；

```python
>>> print(obj3)
0      blue
2    purple
4    yellow
dtype: object

>>> obj4 = obj3.drop(2)
>>> print(obj4)
0      blue
4    yellow
dtype: object

>>> print(obj3.drop([2, 4]))
0    blue
dtype: object
```

```python
>>> print(frame)
   Hangzhou  Shenzhen  Nanjing
a         0         1        2
c         3         4        5
d         6         7        8

>>> print(frame.drop(['a', 'c']))
   Hangzhou  Shenzhen  Nanjing
d         6         7        8
```

2. 删除 DataFrame 中的 columns；

```python
>>> print(frame.drop('Shenzhen', axis=1))
   Hangzhou  Nanjing
a         0        2
c         3        5
d         6        8

>>> print(frame.drop(['Shenzhen', 'Hangzhou'], axis=1))
   Nanjing
a        2
c        5
d        8
```

### 5. Hierarchical Indexing

1. Series 的 hierarchical indexing；

```python
>>> data = pd.Series(np.random.randn(10),
>>>                  index=[['a', 'a', 'a', 'b', 'b', 'c', 'c', 'c', 'd', 'd'],
>>>                         [1, 2, 3, 1, 2, 1, 2, 3, 1, 2]])
>>> data
a  1   -0.587772
   2    0.597073
   3   -2.354382
b  1    1.403719
   2   -0.612704
c  1   -1.409393
   2    2.098933
   3    0.076322
d  1    0.295683
   2    1.188039

>>> data.index
MultiIndex([('a', 1),
            ('a', 2),
            ('a', 3),
            ('b', 1),
            ('b', 2),
            ('c', 1),
            ('c', 2),
            ('c', 3),
            ('d', 1),
            ('d', 2)],
           )

>>> data.b
1    1.403719
2   -0.612704
dtype: float64

>>> data['b':'c']
b  1    1.403719
   2   -0.612704
c  1   -1.409393
   2    2.098933
   3    0.076322
dtype: float64

>>> data[:2]
a  1   -0.587772
   2    0.597073
dtype: float64
```

2. unstack 和 stack；

```python
>>> # 将 hierarchical indexing 的 Series 转换为 DataFrame
>>> data.unstack()
          1         2         3
a -0.587772  0.597073 -2.354382
b  1.403719 -0.612704       NaN
c -1.409393  2.098933  0.076322
d  0.295683  1.188039       NaN

>>> type(data.unstack())
pandas.core.frame.DataFrame

>>> # 将 DataFrame 转换为 hierarchical indexing 的 Series
>>> data.unstack().stack()
a  1   -0.587772
   2    0.597073
   3   -2.354382
b  1    1.403719
   2   -0.612704
c  1   -1.409393
   2    2.098933
   3    0.076322
d  1    0.295683
   2    1.188039
dtype: float64
```

3. DataFrame 的 hierarchical indexing；

```python
>>> frame = pd.DataFrame(np.arange(12).reshape((4, 3)),
>>>                      index=[['a', 'a', 'b', 'b'], [1, 2, 1, 2]],
>>>                      columns=[['Beijing', 'Beijing', 'Shanghai'],
>>>                               ['apts', 'cars', 'apts']])
>>> frame
    Beijing      Shanghai
       apts cars     apts
a 1       0    1        2
  2       3    4        5
b 1       6    7        8
  2       9   10       11

>>> frame.index.names = ['key1', 'key2']
>>> frame.columns.names = ['city', 'type']
>>> frame
city      Beijing      Shanghai
type         apts cars     apts
key1 key2
a    1          0    1        2
     2          3    4        5
b    1          6    7        8
     2          9   10       11

>>> frame.loc['a', 1]
city      type
Beijing   apts    0
          cars    1
Shanghai  apts    2
Name: (a, 1), dtype: int64

>>> frame.loc['a', 2]['Beijing']
type
apts    3
cars    4
Name: (a, 2), dtype: int64

>>> frame.loc['a', 2]['Beijing']['apts'] # 等价：frame.loc['a', 2]['Beijing', 'apts']
3
```

## 4. Concatenate 与 Append

```python
>>> df1 = pd.DataFrame({'apts': [55000, 60000],
>>>                    'cars': [200000, 300000], },
>>>                    index=['Shanghai', 'Beijing'])
>>> print(df1)
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000

>>> df2 = pd.DataFrame({'apts': [25000, 20000],
>>>                    'cars': [150000, 120000], },
>>>                    index=['Hangzhou', 'Najing'])
>>> print(df2)
           apts    cars
Hangzhou  25000  150000
Najing    20000  120000

>>> df3 = pd.DataFrame({'apts': [30000, 10000],
>>>                    'cars': [180000, 100000], },
>>>                    index=['Guangzhou', 'Chongqing'])
>>> print(df3)
            apts    cars
Guangzhou  30000  180000
Chongqing  10000  100000
```

### 1. 纵向 concat

```python
>>> frames = [df1, df2, df3]
>>> print(frames)
[           apts    cars
Shanghai  55000  200000
Beijing   60000  300000,            apts    cars
Hangzhou  25000  150000
Najing    20000  120000,             apts    cars
Guangzhou  30000  180000
Chongqing  10000  100000]

>>> result = pd.concat(frames)
>>> print(result)
            apts    cars
Shanghai   55000  200000
Beijing    60000  300000
Hangzhou   25000  150000
Najing     20000  120000
Guangzhou  30000  180000
Chongqing  10000  100000
```

```python
>>> # 给 concat 的每一个部分加上一个 Key
>>> result2 = pd.concat(frames, keys=['x', 'y', 'z'])
>>> print(result2)
              apts    cars
x Shanghai   55000  200000
  Beijing    60000  300000
y Hangzhou   25000  150000
  Najing     20000  120000
z Guangzhou  30000  180000
  Chongqing  10000  100000

>>> result2.loc['y']
           apts    cars
Hangzhou  25000  150000
Najing    20000  120000
```

### 2. 横向 concat

```python
>>> df4 = pd.DataFrame({'salaries': [10000, 30000, 30000, 20000, 15000]},
>>>                    index=['Suzhou', 'Beijing', 'Shanghai', 'Guangzhou', 'Tianjin'])
>>> print(df4)
           salaries
Suzhou        10000
Beijing       30000
Shanghai      30000
Guangzhou     20000
Tianjin       15000

>>> result3 = pd.concat([result, df4], axis=1, sort=True)
>>> print(result3)
              apts      cars  salaries
Beijing    60000.0  300000.0   30000.0
Chongqing  10000.0  100000.0       NaN
Guangzhou  30000.0  180000.0   20000.0
Hangzhou   25000.0  150000.0       NaN
Najing     20000.0  120000.0       NaN
Shanghai   55000.0  200000.0   30000.0
Suzhou         NaN       NaN   10000.0
Tianjin        NaN       NaN   15000.0

>>> # DataFrame 转化为 hierarchical indexing 的 Series
>>> print(result3.stack())
Beijing    apts         60000.0
           cars        300000.0
           salaries     30000.0
Chongqing  apts         10000.0
           cars        100000.0
Guangzhou  apts         30000.0
           cars        180000.0
           salaries     20000.0
Hangzhou   apts         25000.0
           cars        150000.0
Najing     apts         20000.0
           cars        120000.0
Shanghai   apts         55000.0
           cars        200000.0
           salaries     30000.0
Suzhou     salaries     10000.0
Tianjin    salaries     15000.0
dtype: float64
```

### 3. join concat

1. 按 index 进行 inner join；

```python
>>> print(result)
            apts    cars
Shanghai   55000  200000
Beijing    60000  300000
Hangzhou   25000  150000
Najing     20000  120000
Guangzhou  30000  180000
Chongqing  10000  100000

>>> print(df4)
           salaries
Suzhou        10000
Beijing       30000
Shanghai      30000
Guangzhou     20000
Tianjin       15000

>>> result3 = pd.concat([result, df4], axis=1, join='inner')
>>> print(result3)
           apts    cars  salaries
Shanghai   55000  200000     30000
Beijing    60000  300000     30000
Guangzhou  30000  180000     20000
```

### 4. append（deprecated）

1. 纵向 concat；

```python
>>> print(df1)
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000

>>> print(df2)
           apts    cars
Hangzhou  25000  150000
Najing    20000  120000

>>> df1.append(df2)
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000
Hangzhou  25000  150000
Najing    20000  120000
```

2. 横向 concat；

```python
>>> print(df1)
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000

>>> print(df4)
           salaries
Suzhou        10000
Beijing       30000
Shanghai      30000
Guangzhou     20000
Tianjin       15000

>>> df1.append(df4, sort=True)
              apts      cars  salaries
Shanghai   55000.0  200000.0       NaN
Beijing    60000.0  300000.0       NaN
Suzhou         NaN       NaN   10000.0
Beijing        NaN       NaN   30000.0
Shanghai       NaN       NaN   30000.0
Guangzhou      NaN       NaN   20000.0
Tianjin        NaN       NaN   15000.0
```

### 5. Series 与 DataFrame 进行 concatenate

1. Series 作为 Column 进行 concat；

```python
>>> s1 = pd.Series([60, 50], index=['Shanghai', 'Beijing'], name='meal')
>>> s1
Shanghai    60
Beijing     50
Name: meal, dtype: int64

>>> print(df1)
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000

>>> print(s1)
Shanghai    60
Beijing     50
Name: meal, dtype: int64

>>> print(pd.concat([df1, s1], axis=1))
           apts    cars  meal
Shanghai  55000  200000    60
Beijing   60000  300000    50
```

2. Series 作为 Row 进行 concat；

```python
>>> s2 = pd.Series([18000, 12000], index=['apts', 'cars'], name='Xiamen')
>>> s2
apts    18000
cars    12000
Name: Xiamen, dtype: int64

>>> print(df1.append(s2))
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000
Xiamen    18000   12000
```

## 5. Merge

### 1. 按指定列进行 inner join

```python
>>> df1 = pd.DataFrame({'apts': [55000, 60000, 58000],
>>>                    'cars': [200000, 300000, 250000],
>>>                     'cities': ['Shanghai', 'Beijing', 'Shenzhen']})
>>> df1
    apts    cars    cities
0  55000  200000  Shanghai
1  60000  300000   Beijing
2  58000  250000  Shenzhen

>>> df4 = pd.DataFrame({'salaries': [10000, 30000, 30000, 20000, 15000],
>>>                     'cities': ['Suzhou', 'Beijing', 'Shanghai', 'Guangzhou', 'Tianjin']})
>>> df4
   salaries     cities
0     10000     Suzhou
1     30000    Beijing
2     30000   Shanghai
3     20000  Guangzhou
4     15000    Tianjin

>>> pd.merge(df1, df4, on='cities')
    apts    cars    cities  salaries
0  55000  200000  Shanghai     30000
1  60000  300000   Beijing     30000
```

### 2. 按指定列进行 outer join

```python
>>> pd.merge(df1, df4, on='cities', how='outer')
      apts      cars     cities  salaries
0  55000.0  200000.0   Shanghai   30000.0
1  60000.0  300000.0    Beijing   30000.0
2  58000.0  250000.0   Shenzhen       NaN
3      NaN       NaN     Suzhou   10000.0
4      NaN       NaN  Guangzhou   20000.0
5      NaN       NaN    Tianjin   15000.0
```

### 3. 按指定列进行 right join

```python
>>> pd.merge(df1, df4, on='cities', how='right')
      apts      cars     cities  salaries
0      NaN       NaN     Suzhou     10000
1  60000.0  300000.0    Beijing     30000
2  55000.0  200000.0   Shanghai     30000
3      NaN       NaN  Guangzhou     20000
4      NaN       NaN    Tianjin     15000
```

### 4. 按指定列进行 left join

```python
>>> pd.merge(df1, df4, on='cities', how='left')
    apts    cars    cities  salaries
0  55000  200000  Shanghai   30000.0
1  60000  300000   Beijing   30000.0
2  58000  250000  Shenzhen       NaN
```

## 6. Join

```python
>>> df1 = pd.DataFrame({'apts': [55000, 60000, 58000],
>>>                    'cars': [200000, 300000, 250000]},
>>>                    index=['Shanghai', 'Beijing', 'Shenzhen'])
>>> df1
           apts    cars
Shanghai  55000  200000
Beijing   60000  300000
Shenzhen  58000  250000

>>> df4 = pd.DataFrame({'salaries': [10000, 30000, 30000, 20000, 15000]},
>>>                    index=['Suzhou', 'Beijing', 'Shanghai', 'Guangzhou', 'Tianjin'])
>>> df4
           salaries
Suzhou        10000
Beijing       30000
Shanghai      30000
Guangzhou     20000
Tianjin       15000
```

### 1. 按 index 进行 inner join

```python
>>> df1.join(df4)
           apts    cars  salaries
Shanghai  55000  200000   30000.0
Beijing   60000  300000   30000.0
Shenzhen  58000  250000       NaN
```

### 2. 按 index 进行 outer join

```python
>>> df1.join(df4, how='outer')
              apts      cars  salaries
Beijing    60000.0  300000.0   30000.0
Guangzhou      NaN       NaN   20000.0
Shanghai   55000.0  200000.0   30000.0
Shenzhen   58000.0  250000.0       NaN
Suzhou         NaN       NaN   10000.0
Tianjin        NaN       NaN   15000.0

>>> pd.merge(df1, df4, left_index=True, right_index=True, how='outer')
              apts      cars  salaries
Beijing    60000.0  300000.0   30000.0
Guangzhou      NaN       NaN   20000.0
Shanghai   55000.0  200000.0   30000.0
Shenzhen   58000.0  250000.0       NaN
Suzhou         NaN       NaN   10000.0
Tianjin        NaN       NaN   15000.0
```

## 7. Group By

### 1. 分组求和

```python
>>> salaries = pd.DataFrame({
>>>     'Name': ['July', 'Chu', 'Chu', 'Lin', 'July', 'July', 'Chu', 'July'],
>>>     'Year': [2016, 2016, 2016, 2016, 2017, 2017, 2017, 2017],
>>>     'Salary': [10000, 2000, 4000, 5000, 18000, 25000, 3000, 4000],
>>>     'Bonus': [3000, 1000, 1000, 1200, 4000, 2300, 500, 1000]
>>> })
>>> salaries
   Name  Year  Salary  Bonus
0  July  2016   10000   3000
1   Chu  2016    2000   1000
2   Chu  2016    4000   1000
3   Lin  2016    5000   1200
4  July  2017   18000   4000
5  July  2017   25000   2300
6   Chu  2017    3000    500
7  July  2017    4000   1000

>>> group_by_name = salaries.groupby('Name')
>>> group_by_name
<pandas.core.groupby.generic.DataFrameGroupBy object at 0x11c48e550>

>>> group_by_name.aggregate(sum)
      Year  Salary  Bonus
Name
Chu   6049    9000   2500
July  8067   57000  10300
Lin   2016    5000   1200

>>> group_by_name.sum()
      Year  Salary  Bonus
Name
Chu   6049    9000   2500
July  8067   57000  10300
Lin   2016    5000   1200

>>> group_by_name_year = salaries.groupby(['Name', 'Year'])
>>> group_by_name_year.sum()
           Salary  Bonus
Name Year
Chu  2016    6000   2000
     2017    3000    500
July 2016   10000   3000
     2017   47000   7300
Lin  2016    5000   1200

>>> group_by_name_year.size()
Name  Year
Chu   2016    2
      2017    1
July  2016    1
      2017    3
Lin   2016    1
dtype: int64
```

### 2. 展示分组的各种统计信息

```python
>>> group_by_name_year.describe()
          Salary                                                         \
           count          mean           std      min      25%      50%
Name Year
Chu  2016    2.0   3000.000000   1414.213562   2000.0   2500.0   3000.0
     2017    1.0   3000.000000           NaN   3000.0   3000.0   3000.0
July 2016    1.0  10000.000000           NaN  10000.0  10000.0  10000.0
     2017    3.0  15666.666667  10692.676622   4000.0  11000.0  18000.0
Lin  2016    1.0   5000.000000           NaN   5000.0   5000.0   5000.0

                            Bonus                                           \
               75%      max count         mean         std     min     25%
Name Year
Chu  2016   3500.0   4000.0   2.0  1000.000000     0.00000  1000.0  1000.0
     2017   3000.0   3000.0   1.0   500.000000         NaN   500.0   500.0
July 2016  10000.0  10000.0   1.0  3000.000000         NaN  3000.0  3000.0
     2017  21500.0  25000.0   3.0  2433.333333  1504.43788  1000.0  1650.0
Lin  2016   5000.0   5000.0   1.0  1200.000000         NaN  1200.0  1200.0


              50%     75%     max
Name Year
Chu  2016  1000.0  1000.0  1000.0
     2017   500.0   500.0   500.0
July 2016  3000.0  3000.0  3000.0
     2017  2300.0  3150.0  4000.0
Lin  2016  1200.0  1200.0  1200.0
```

## 8. 应用案例（计算每个工作日的骑车人数之和）

### 1. 读取 bike.csv 到 DataFrame

**[read_csv API reference](http://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html)**

bike.csv 记录了 Montreal 自行车路线的数据，具体有 7 条路线，数据记录了每条自行车路线每天分别有多少人；

```python
>>> pd.set_option('display.max_columns', 60)
>>> bikes = pd.read_csv('data/bikes.csv', encoding='latin1')
>>> bikes
    Date;Berri 1;Brébeuf (données non disponibles);Côte-Sainte-Catherine;Maisonneuve 1;Maisonneuve 2;du Parc;Pierre-Dupuy;Rachel1;St-Urbain (données non disponibles)
0                     01/01/2012;35;;0;38;51;26;10;16;
1                     02/01/2012;83;;1;68;153;53;6;43;
2                   03/01/2012;135;;2;104;248;89;3;58;
3                  04/01/2012;144;;1;116;318;111;8;61;
4                  05/01/2012;197;;2;124;330;97;13;95;
..                                                 ...
305      01/11/2012;2405;;1208;1701;3082;2076;165;2461
306        02/11/2012;1582;;737;1109;2277;1392;97;1888
307          03/11/2012;844;;380;612;1137;713;105;1302
308          04/11/2012;966;;446;710;1277;692;197;1374
309      05/11/2012;2247;;1170;1705;3221;2143;179;2430

[310 rows x 1 columns]
```

按分割好的列装载 bike.csv 到 DataFrame；

```python
>>> bikes = pd.read_csv('data/bikes.csv', sep=';',
>>>                     parse_dates=['Date'], encoding='latin1', dayfirst=True, index_col='Date')
>>> bikes
            Berri 1  Brébeuf (données non disponibles)  Côte-Sainte-Catherine  \
Date
2012-01-01       35                                NaN                      0
2012-01-02       83                                NaN                      1
2012-01-03      135                                NaN                      2
2012-01-04      144                                NaN                      1
2012-01-05      197                                NaN                      2
...             ...                                ...                    ...
2012-11-01     2405                                NaN                   1208
2012-11-02     1582                                NaN                    737
2012-11-03      844                                NaN                    380
2012-11-04      966                                NaN                    446
2012-11-05     2247                                NaN                   1170

            Maisonneuve 1  Maisonneuve 2  du Parc  Pierre-Dupuy  Rachel1  \
Date
2012-01-01             38             51       26            10       16
2012-01-02             68            153       53             6       43
2012-01-03            104            248       89             3       58
2012-01-04            116            318      111             8       61
2012-01-05            124            330       97            13       95
...                   ...            ...      ...           ...      ...
2012-11-01           1701           3082     2076           165     2461
2012-11-02           1109           2277     1392            97     1888
2012-11-03            612           1137      713           105     1302
...
2012-11-03                                  NaN
2012-11-04                                  NaN
2012-11-05                                  NaN

[310 rows x 9 columns]
```

### 2. 查看数据样例

1. 使用 head 与切片取前 5 行；

```python
>>> bikes.head(5)
            Berri 1  Brébeuf (données non disponibles)  Côte-Sainte-Catherine  \
Date
2012-01-01       35                                NaN                      0
2012-01-02       83                                NaN                      1
2012-01-03      135                                NaN                      2
2012-01-04      144                                NaN                      1
2012-01-05      197                                NaN                      2

            Maisonneuve 1  Maisonneuve 2  du Parc  Pierre-Dupuy  Rachel1  \
Date
2012-01-01             38             51       26            10       16
2012-01-02             68            153       53             6       43
2012-01-03            104            248       89             3       58
2012-01-04            116            318      111             8       61
2012-01-05            124            330       97            13       95

            St-Urbain (données non disponibles)
Date
2012-01-01                                  NaN
2012-01-02                                  NaN
2012-01-03                                  NaN
2012-01-04                                  NaN
2012-01-05                                  NaN

>>> bikes[:5]
            Berri 1  Brébeuf (données non disponibles)  Côte-Sainte-Catherine  \
Date
2012-01-01       35                                NaN                      0
2012-01-02       83                                NaN                      1
2012-01-03      135                                NaN                      2
2012-01-04      144                                NaN                      1
2012-01-05      197                                NaN                      2

            Maisonneuve 1  Maisonneuve 2  du Parc  Pierre-Dupuy  Rachel1  \
Date
2012-01-01             38             51       26            10       16
2012-01-02             68            153       53             6       43
2012-01-03            104            248       89             3       58
2012-01-04            116            318      111             8       61
2012-01-05            124            330       97            13       95

            St-Urbain (données non disponibles)
Date
2012-01-01                                  NaN
2012-01-02                                  NaN
2012-01-03                                  NaN
2012-01-04                                  NaN
2012-01-05                                  NaN
```

2. 使用 copy 复制选取的部分；

```python
>>> berri_bikes = bikes[['Berri 1']].copy()
>>> berri_bikes.head()
            Berri 1
Date
2012-01-01       35
2012-01-02       83
2012-01-03      135
2012-01-04      144
2012-01-05      197

>>> berri_bikes.index
DatetimeIndex(['2012-01-01', '2012-01-02', '2012-01-03', '2012-01-04',
               '2012-01-05', '2012-01-06', '2012-01-07', '2012-01-08',
               '2012-01-09', '2012-01-10',
               ...
               '2012-10-27', '2012-10-28', '2012-10-29', '2012-10-30',
               '2012-10-31', '2012-11-01', '2012-11-02', '2012-11-03',
               '2012-11-04', '2012-11-05'],
              dtype='datetime64[ns]', name='Date', length=310, freq=None)

>>> # 查看日期是每月的第几天
>>> berri_bikes.index.day
Int64Index([ 1,  2,  3,  4,  5,  6,  7,  8,  9, 10,
            ...
            27, 28, 29, 30, 31,  1,  2,  3,  4,  5],
           dtype='int64', name='Date', length=310)

>>> # 查看日期是星期几
>>> berri_bikes.index.weekday
Int64Index([6, 0, 1, 2, 3, 4, 5, 6, 0, 1,
            ...
            5, 6, 0, 1, 2, 3, 4, 5, 6, 0],
           dtype='int64', name='Date', length=310)
```

### 3. dropna

1. 删除所有带 NaN 的行；

```python
>>> bikes.dropna()
Empty DataFrame
Columns: [Berri 1, Brébeuf (données non disponibles), Côte-Sainte-Catherine, Maisonneuve 1, Maisonneuve 2, du Parc, Pierre-Dupuy, Rachel1, St-Urbain (données non disponibles)]
Index: []
```

2. 删除整行都为 NaN 的行；

```python
>>> bikes.dropna(how='all').head()
            Berri 1  Brébeuf (données non disponibles)  Côte-Sainte-Catherine  \
Date
2012-01-01       35                                NaN                      0
2012-01-02       83                                NaN                      1
2012-01-03      135                                NaN                      2
2012-01-04      144                                NaN                      1
2012-01-05      197                                NaN                      2

            Maisonneuve 1  Maisonneuve 2  du Parc  Pierre-Dupuy  Rachel1  \
Date
2012-01-01             38             51       26            10       16
2012-01-02             68            153       53             6       43
2012-01-03            104            248       89             3       58
2012-01-04            116            318      111             8       61
2012-01-05            124            330       97            13       95

            St-Urbain (données non disponibles)
Date
2012-01-01                                  NaN
2012-01-02                                  NaN
2012-01-03                                  NaN
2012-01-04                                  NaN
2012-01-05                                  NaN
```

3. 删除整列都为 NaN 的列；

```python
>>> bikes.dropna(axis=1, how='all').head()
            Berri 1  Côte-Sainte-Catherine  Maisonneuve 1  Maisonneuve 2  \
Date
2012-01-01       35                      0             38             51
2012-01-02       83                      1             68            153
2012-01-03      135                      2            104            248
2012-01-04      144                      1            116            318
2012-01-05      197                      2            124            330

            du Parc  Pierre-Dupuy  Rachel1
Date
2012-01-01       26            10       16
2012-01-02       53             6       43
2012-01-03       89             3       58
2012-01-04      111             8       61
2012-01-05       97            13       95
```

### 3. fillna

1. 填充缺失的数据（单行）；

```python
>>> row = bikes.iloc[0].copy()
>>> print(row)
Berri 1                                35.0
Brébeuf (données non disponibles)       NaN
Côte-Sainte-Catherine                   0.0
Maisonneuve 1                          38.0
Maisonneuve 2                          51.0
du Parc                                26.0
Pierre-Dupuy                           10.0
Rachel1                                16.0
St-Urbain (données non disponibles)     NaN
Name: 2012-01-01 00:00:00, dtype: float64

>>> # 平均值
>>> print(row.mean())
25.142857142857142

>>> print(row.fillna(row.mean()))
Berri 1                                35.000000
Brébeuf (données non disponibles)      25.142857
Côte-Sainte-Catherine                   0.000000
Maisonneuve 1                          38.000000
Maisonneuve 2                          51.000000
du Parc                                26.000000
Pierre-Dupuy                           10.000000
Rachel1                                16.000000
St-Urbain (données non disponibles)    25.142857
Name: 2012-01-01 00:00:00, dtype: float64
```

2. 填充缺失数据（全量）；

```python
>>> # 求所有行的行平均值；
>>> m = bikes.mean(axis=1)
>>> print(m)
Date
2012-01-01      25.142857
2012-01-02      58.142857
2012-01-03      91.285714
2012-01-04     108.428571
2012-01-05     122.571429
                 ...
2012-11-01    1871.142857
2012-11-02    1297.428571
2012-11-03     727.571429
2012-11-04     808.857143
2012-11-05    1870.714286
Length: 310, dtype: float64

>>> # 将行中缺失的部分用其行均值填充：遍历各列，将各列的所有行中为 NaN 的部分用 m 的对应位填充
>>> for i, col in enumerate(bikes):
>>>     bikes.iloc[:, i] = bikes.iloc[:, i].fillna(m)
>>>     print(i, col)
0 Berri 1
1 Brébeuf (données non disponibles)
2 Côte-Sainte-Catherine
3 Maisonneuve 1
4 Maisonneuve 2
5 du Parc
6 Pierre-Dupuy
7 Rachel1
8 St-Urbain (données non disponibles)

>>> bikes.head()
            Berri 1  Brébeuf (données non disponibles)  Côte-Sainte-Catherine  \
Date
2012-01-01       35                          25.142857                      0
2012-01-02       83                          58.142857                      1
2012-01-03      135                          91.285714                      2
2012-01-04      144                         108.428571                      1
2012-01-05      197                         122.571429                      2

            Maisonneuve 1  Maisonneuve 2  du Parc  Pierre-Dupuy  Rachel1  \
Date
2012-01-01             38             51       26            10       16
2012-01-02             68            153       53             6       43
2012-01-03            104            248       89             3       58
2012-01-04            116            318      111             8       61
2012-01-05            124            330       97            13       95

            St-Urbain (données non disponibles)
Date
2012-01-01                            25.142857
2012-01-02                            58.142857
2012-01-03                            91.285714
2012-01-04                           108.428571
2012-01-05                           122.571429
```

### 4. 计算单条路线每个工作日的骑车人数之和

1. 新增一个 weekday 列；

```python
>>> berri_bikes.loc[:, 'weekday'] = berri_bikes.index.weekday
>>> berri_bikes[:5]
            Berri 1  weekday
Date
2012-01-01       35        6
2012-01-02       83        0
2012-01-03      135        1
2012-01-04      144        2
2012-01-05      197        3
```

2. 按 weekday 分组求和；

```python
>>> weekday_counts = berri_bikes.groupby('weekday').aggregate(sum)
>>> weekday_counts
         Berri 1
weekday
0         134298
1         135305
2         152972
3         160131
4         141771
5         101578
6          99310
```

3. 使用星期名词替换默认 index；

```python
>>> weekday_counts.index = ['Monday', 'Tuesday', 'Wednesday',
>>>                         'Thursday', 'Friday', 'Saturday', 'Sunday']
>>> weekday_counts
           Berri 1
Monday      134298
Tuesday     135305
Wednesday   152972
Thursday    160131
Friday      141771
Saturday    101578
Sunday       99310
```

### 5. 计算所有路线每个工作日的骑车人数之和

1. 按日期求和（所有路线每天的人数之和）；

```python
>>> bikes = pd.read_csv('data/bikes.csv', sep=';',
>>>                     parse_dates=['Date'], encoding='latin1', dayfirst=True, index_col='Date')
>>> bikes_sum = bikes.sum(axis=1).to_frame()
>>> print(bikes_sum.head())
                0
Date
2012-01-01  176.0
2012-01-02  407.0
2012-01-03  639.0
2012-01-04  759.0
2012-01-05  858.0
```

2. 增加 weekday 列；

```python
>>> print(bikes_sum.index)
DatetimeIndex(['2012-01-01', '2012-01-02', '2012-01-03', '2012-01-04',
               '2012-01-05', '2012-01-06', '2012-01-07', '2012-01-08',
               '2012-01-09', '2012-01-10',
               ...
               '2012-10-27', '2012-10-28', '2012-10-29', '2012-10-30',
               '2012-10-31', '2012-11-01', '2012-11-02', '2012-11-03',
               '2012-11-04', '2012-11-05'],
              dtype='datetime64[ns]', name='Date', length=310, freq=None)

>>> bikes_sum.loc[:, 'weekday'] = bikes_sum.index.weekday
>>> bikes_sum.head()
                0  weekday
Date
2012-01-01  176.0        6
2012-01-02  407.0        0
2012-01-03  639.0        1
2012-01-04  759.0        2
2012-01-05  858.0        3
```

3. 按工作日分钟求和（每个工作日骑车的人数之和）；

```python
>>> weekday_counts = bikes_sum.groupby('weekday').aggregate(sum)
>>> weekday_counts.index = ['Monday', 'Tuesday', 'Wednesday',
>>>                         'Thursday', 'Friday', 'Saturday', 'Sunday']
>>> weekday_counts
                  0
Monday     714963.0
Tuesday    698582.0
Wednesday  789722.0
Thursday   829069.0
Friday     738772.0
Saturday   516701.0
Sunday     518047.0
```

---

- 上一篇：[「Python 机器学习」Numpy 矩阵运算](https://blog.csdn.net/ChaoMing_H/article/details/129679634)
- 下一篇：[「Python 机器学习」Matplotlib 数据探索](https://blog.csdn.net/ChaoMing_H/article/details/129927199)

**PS：欢迎各路道友`阅读`与`评论`，感谢道友`点赞`、`关注`、`收藏`！**
