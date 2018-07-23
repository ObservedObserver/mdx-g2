class dataset {
    constructor (props) {
        const { dataSource } = props
        this.MeasureType = 'meaType'
        this.MeasureValue = 'meaValue'
        this.dataSource = dataSource
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
        dataSource.forEach((item) => {
            let node = dimTree
            dimCodes.forEach((dim, i) => {
                if (i === dimCodes.length - 1) {
                    if (typeof node[item[dim]] === 'undefined') {
                        node[item[dim]] = 0
                    }
                    node[item[dim]] += item[this.MeasureValue]
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
        if (!isNaN(node)) {
            aggData.push({
                ...item,
                [this.MeasureValue]: node
            })
        } else {
            let keys = Object.keys(node)
            // console.log('keys', keys)
            keys.forEach((key) => {
                this.tree2Array(node[key], {
                    ...item,
                    [dimCodes[level]]: key
                }, level + 1, dimCodes, aggData)
            })
        }
    }

    getVisData (dimCodes, meaCodes) {
        let data = this.normalizeMeasures(this.dataSource, meaCodes)
        let dimTree = this.aggregater(data, dimCodes.concat(this.MeasureType))
        let aggData = [];
        this.tree2Array(dimTree, {}, 0, dimCodes.concat(this.MeasureType), aggData)
        return aggData
    }
}

export {dataset}