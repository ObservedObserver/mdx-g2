function parser (mdx) {
    let rows, columns, cube, values
    try {
        rows = mdx.match(/[ ,][\{\(]*(\[[a-zA-Z0-9_]*\][\s]*,[\s]*)*(\[[a-zA-Z0-9_]*\])[\}\)]* on row/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
        columns = mdx.match(/[ ,][\{\(]*(\[[a-zA-Z0-9_]*\][\s]*,[\s]*)*(\[[a-zA-Z0-9_]*\])[\}\)]* on column/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
        cube = mdx.match(/from \[[a-zA-Z0-9_ ]*\]/)[0].split(/[\[\]]/)[1]
        values = mdx.match(/where [\{\(]*(\[[a-zA-Z0-9_]*\][\s]*,[\s]*)*(\[[a-zA-Z0-9_]*\])[\}\)]*/)[0]
            .split(/[\{\}\(\)]/)[1].split(/[\s]*,[\s]*/).map((dim) => {
                return dim.split(/[\[\]]/)[1]
            })
    } catch (err) {
        console.log('mdx grammer problem')
    }
    // console.log(column, mdx.match(/\(.*\) on column/))
    return { rows, columns,  cube, values }
}
export {parser}
