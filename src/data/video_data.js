const Len = 100;
const Dimensions = {
    'department': ['优酷', '爱奇艺', 'B站'], 
    'month': ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'], 
    'video': ['美剧', '动漫', '抗日神剧']
}
const Measures = {
    'profit': [0, 10000], 
    'count': [0, 200]
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
    // console.log(data)
    return data
}
export {generateData, Dimensions, Measures}