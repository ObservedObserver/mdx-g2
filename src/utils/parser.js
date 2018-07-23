function parser (mdx) {
    let row, column, cube, measure
    try {
        row = mdx.match(/[ ,][\{\(]*(\[[a-zA-Z]*\][\s]*,[\s]*)*(\[[a-zA-Z]*\])[\}\)]* on row/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
        column = mdx.match(/[ ,][\{\(]*(\[[a-zA-Z]*\][\s]*,[\s]*)*(\[[a-zA-Z]*\])[\}\)]* on column/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
        cube = mdx.match(/from \[[a-zA-Z  ]*\]/)[0].split(/[\[\]]/)[1]
        measure = mdx.match(/where [\{\(]*(\[[a-zA-Z]*\][\s]*,[\s]*)*(\[[a-zA-Z]*\])[\}\)]*/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
    } catch (err) {
    }
    // console.log(column, mdx.match(/\(.*\) on column/))
    return { row, column,  cube, measure }
}
export {parser}