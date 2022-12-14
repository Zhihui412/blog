const { exec } = require('../db/mysql')

const getList = (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if (author) {
        sql += `and author='${author}' `
    }
    if (keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc;`

    // 返回 promise
    return exec(sql)
}

const getDeatail = (id) => {
    const sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        console.log(rows[0]);
        return rows[0]
    })
}


const newBlog = (blogData = {}) => {
    // blogData 是一个博客对象，包含title content author 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
        insert into blogs (title, content, createtime, author)
        values ('${title}', '${content}', ${createTime}, '${author}');
    `

    return exec(sql).then(insertData => {
        // console.log('insertData is ', insertData)
        return {
            id: insertData.insertId
        }
    })
}

const updateBlog = (id, blogData = {}) => {
    // id 就是要更新博客的id
    // blogData 是一个博客对象，包含title content 属性

    const title = blogData.title
    const content = blogData.content

    const sql = `
        update blogs set title='${title}', content='${content}' where id=${id}
    `

    return exec(sql).then(updateData => {
        // console.log('updateData is ', updateData)
        if (updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) => {
    // id 就是要删除博客的id
    const sql = `delete from blogs where id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const getCommentList = (id) => {
    const sql = `select * from comments where blogid = '${id}'`
    return exec(sql);
}

const addComment = (id, content) => {
    let i = '`time`';
    const createTime = Date.now()
    const sql = `insert into comments (comment, ${i}, blogid) values ('${content}', ${createTime}, '${id}')`;
    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}

module.exports = {
    getList,
    getDeatail,
    newBlog,
    updateBlog,
    delBlog,
    getCommentList,
    addComment
}