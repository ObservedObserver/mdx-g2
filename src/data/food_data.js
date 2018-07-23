const Len = 200;
const Dimensions = {
    'restaurant': ['KFC', '呷哺', '外婆家', '必胜客'], 
    'year': ['2015', '2016', '2017', '2018'], 
    'food': ['冰阔落', '汉堡', '蛋挞', '肥牛', '鱼豆腐', '披萨', '沙拉']
}
const Measures = {
    'price': [20, 500],
    'rating': [0, 10],
    'amount': [0, 200]
}
let data = []
function generateData () {
    let i, j, data = [], item;
    let dims = Object.keys(Dimensions)
    let meas = Object.keys(Measures)
    for (i = 0; i < Len; i++) {
        item = {}
        dims.forEach((dim) => {
            item[dim] = Dimensions[dim][parseInt(Math.random() * Dimensions[dim].length)]
        })
        meas.forEach((mea) => {
            item[mea] = Measures[mea][0] + parseInt(Math.random() * (Measures[mea][1] - Measures[mea][0]))
        })
        data.push(item)
    }
    console.log(data)
    return data
}
export {generateData, Dimensions, Measures}