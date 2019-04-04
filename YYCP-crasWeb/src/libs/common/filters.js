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
export function timestampToTime(timestamp) {//时间戳转为YYYY-MM-DD
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ' ';

    return Y + M + D + H + F + S;
}