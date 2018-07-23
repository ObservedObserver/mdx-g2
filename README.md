# MDX to G2
使用MDX的方式创建G2图表

## 安装
```bash
npm i

npm start
```
访问[localhost:3000](http://localhost:3000)

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

## TODO
+ [x] 数据聚合处理
+ [x] 维度数量限制解除
+ [x] 度量预处理, 所有度量转化到度量维度中
+ [ ] 更科学的mdx-parser(tokenizer, AST)
+ [ ] 支持row与column均为度量的图表
+ [ ] 支持部分图表（散点图）的非聚合数据展示（聚合、非聚合切换）
+ [ ] mdx扩展语法（可能会扩展为g2）
+ [ ] 封装成更易复用的组件，包含base版本与react版本
+ [ ] 严格的元组与集合的概念
+ [ ] 支持层级，属性，成员

## ISSUES
+ [ ] mdx解析尾部需添加额外的空格或回车
### 有趣的探索
+ [ ] 基于3D/4D(动态))可视化的pivot或mdx组件