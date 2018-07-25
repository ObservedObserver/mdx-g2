class Leaf {
    constructor () {
        this.rawData = []
        this.aggData = {}
    }
    push = (el) => {
        this.rawData.push(el)
        for (let key in el) {
            if (typeof el[key] === 'number') {
                typeof this.aggData[key] !== 'undefined' ? this.aggData[key] += el[key] : this.aggData[key] = 0
            } else {
                this.aggData[key] = el[key]
            }
        }
    }
    sum = () => {
        let data = { ...this.aggData }
        return data
    }
    avg = () => {
        let data = { ...this.aggData }, len = this.rawData.length
        for (let key in data) {
            if (typeof data[key] === 'number') {
                data[key] /= len
            }
        }
        return data
    }
}
class dataset {
    constructor (props) {
        const { dataSource } = props
        this.MeasureType = 'meaType'
        this.MeasureValue = 'meaValue'
        this.dataSource = dataSource
        this.leaves = []
    }

    normalizeMeasures (dataSource, meaCodes) {
        let newData = []
        meaCodes.forEach((meaCode) => {
            let transData = dataSource.map((item) => {
                return {
                    ...item,
                    meaType: meaCode,
                    meaValue: Number(item[meaCode]) || 0
                }
            })
            newData = newData.concat(transData)
        })
        // console.log(JSON.stringify(newData))
        return newData
    }

    aggregater (dataSource, dimCodes) {
        // 在transform之前运行，否则会聚合掉transform生成的数据
        let aggData = [], dimTree = {}
        this.leaves = []
        dataSource.forEach((item) => {
            let node = dimTree
            dimCodes.forEach((dim, i) => {
                if (i === dimCodes.length - 1) {
                    if (typeof node[item[dim]] === 'undefined') {
                        node[item[dim]] = new Leaf()
                        this.leaves.push(node[item[dim]])
                    }
                    node[item[dim]].push(item)
                } else {
                    if (typeof node[item[dim]] === 'undefined') {
                        node[item[dim]] = {}
                    }
                    node = node[item[dim]]
                }
            })
        })
        return dimTree
        // aggData = []
        // this.tree2Array(dimTree, {}, 0)
        // return aggData
    }

    tree2Array (node, item, level, dimCodes, aggData) {
        return this.leaves.map((leaf) => {
            return leaf.aggData
        })
    }

    getVisData (dimCodes, method = 'avg') {
        let data = this.dataSource
        let dimTree = this.aggregater(data, dimCodes.concat(this.MeasureType))
        let aggData = this.leaves.map((leaf) => {
            return leaf[method]()
        });
        let dataSource = this.dataSource
        return { dataSource, aggData }
    }
}

export {dataset}