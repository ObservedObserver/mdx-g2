# MDX to G2
> 将mdx转化为g2

你可能需要先了解：
+ [MDX](https://docs.microsoft.com/en-us/sql/analysis-services/multidimensional-models/mdx/mdx-query-fundamentals-analysis-services?view=sql-server-2017)
+ [G2](https://antv.alipay.com/zh-cn/g2/3.x/index.html)
## 安装
```bash
npm i

npm start
```
访问[localhost:3000](http://localhost:3000)

## 使用

```js
import Chart from './components/mdxChart.js'
// here are three examples
const mdx1 = 'select {[restaurant]} on row, {[food]} on column from [dataSource] where {[price], [rating]}'
const mdx2 = 'select {[restaurant]} on row, {[rating], [price]} on column from [dataSource]'
const mdx3 = 'select {[rating], [price]} on row, {[restaurant]} on column from [dataSource]'
ReactDOM.render(<Chart dataSource={dataSource} mdx={mdx1}  />, document.getElementById('root'));
```
## 示例
选择Cube: `VideoWebsites`<br>
由`where`选取度量
```sql
select {[department]} on row, {[video]} on column from [VideoWebsites] where {[profit], [count]}
```

选择Cube: `VideoWebsites`
由`row`或`column`选取度量
```sql
select {[department], [video]} on row, {[profit]} on column from [VideoWebsites]
```

散点图
```sql
select {[profit]} on row, {[count]} on column from [VideoWebsites] where {[department]}
```

## TODO
+ [x] 数据聚合处理
+ [x] 维度数量限制解除
+ [x] 度量预处理, 所有度量转化到度量维度中
+ [ ] 更科学的mdx-parser(tokenizer, AST)
+ [x] 支持row与column均为度量的图表
+ [ ] 支持部分图表（散点图）的非聚合数据展示（聚合、非聚合切换）
+ [ ] mdx扩展语法（可能会扩展为g2）
+ [x] 封装成更易复用的组件，
+ [ ] 包含base版本与react版本
+ [ ] 严格的元组与集合的概念
+ [ ] 支持层级，属性，成员
+ [ ] 更自由的聚合运算方式(可以保留原始数据)

## ISSUES
+ [ ] mdx解析尾部需添加额外的空格或回车
+ [ ] 聚合底层没有安全检测，在聚合value为非数字时递归栈溢出
### 有趣的探索
+ [ ] 基于3D/4D(动态))可视化的pivot或mdx组件