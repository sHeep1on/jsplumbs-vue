export function filterNull(val) {
    if (val == null || val == '' || val == undefined || val == 'null') {
        return '--'
    } else {
        return val
    }
}

export function filterSex(val) {
    if (val == 0) {
        return '男'
    } else if (val == 1) {
        return '女'
    } else {
        return '未知'
    }
}

export function typeFilter(val) {
    if (val == 0) {
        return '菜单'
    } else if (val == 1) {
        return '控制器'
    } else {
        return '方法'
    }
}

export function isFilter(val) {
    if (val == 0) {
        return '有效'
    } else {
        return '无效'
    }
}
