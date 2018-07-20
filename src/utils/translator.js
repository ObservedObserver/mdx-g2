function spliter (mdx) {
    let row, column, cube, measure
    try {
        row = mdx.match(/\(.*\) on row/)[0].split(/[\(\)]/)[1]
        column = mdx.match(/,[ ]*\(.*\) on column/)[0].split(/[\(\)]/)[1]
        cube = mdx.match(/from \(.*\)/)[0].split(/[\(\)]/)[1]
        measure = mdx.match(/where \(.*\)/)[0].split(/[\(\)]/)[1]
    } catch (err) {

    }
    console.log(column, mdx.match(/\(.*\) on column/))
    return { row, column,  cube, measure}
}
export {spliter}