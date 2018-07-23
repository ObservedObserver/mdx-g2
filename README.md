# MDX to G2
使用markdown的方式创建G2图表

## 安装
```bash
npm i

npm start
```
访问[localhost:3000](http://localhost:3000)

## 实例
选择Cube: `VideoWebsites`
```sql
select {[department]} on row, {[video]} on column from [VideoWebsites] where {[profit], [count]}
```

选择Cube: `VideoWebsites`
```sql
select {[department], [video]} on row, {[profit]} on column from [VideoWebsites]
```

## TODO
+ [x] 数据聚合处理
+ [x] 维度数量限制解除
+ [x] 度量预处理, 所有度量转化到度量维度中
+ [ ] 更科学的mdx-parser
+ [ ] 支持更多图表