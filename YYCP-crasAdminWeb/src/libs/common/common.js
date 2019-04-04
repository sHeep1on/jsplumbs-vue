export function uniqueArr(arr, name) { //数组去重
    var result = [];
    var flag = true;
    if (!arr.length) return;
    if (arr[0][name]) { //数组中套的是对象
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < result.length; j++) {
                if (arr[i][name] === result[j][name]) {
                    flag = false;
                }
            }
            if (flag) {
                result.push(arr[i]);
            }
        }
    } else { //纯数组
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < result.length; j++) {
                if (arr[i] === result[j]) {
                    flag = false;
                }
            }
            if (flag) {
                result.push(arr[i]);
            }
        }
    }
    return result;
}

export function addZero(value) { //小于10的数字，前边加个0
    if (value < 10) {
        return '0' + value;
    } else {
        return value
    }
}

export function isNull(obj) { //判断是否为空
    var flag = false;
    if (obj == null || obj == undefined || typeof(obj) == 'undefined' || obj == '') {
        flag = true;
    } else if (typeof(obj) == 'string') {
        obj = obj.trim();
        if (obj == '') { //为空
            flag = true;
        } else { //不为空
            obj = obj.toUpperCase();
            if (obj == 'NULL' || obj == 'UNDEFINED' || obj == '{}') {
                flag = true;
            }
        }
    } else {
        flag = false;
    }
    return flag;
}

export function isNumber(value) { //判断是否是整数
    if (value == 'NaN') {
        return false
    } else {
        return value == parseInt(value).toString();
    }
}

export function setCookie(name, value, outTime) { //设置cookie
    document.cookie = name + '=' + value + ';expries=' + outTime;
}

export function getCookie(name) { //获取cookie
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var arr = cookies[i].split('=');
        if (name == arr[0]) {
            return arr[1]
        }
    }
}

export function setString(arr) {
    let ids = "";
    if (arr.length >= 1) {
        for (var i = 0; i < arr.length; i++) {
            if (i == arr.length - 1) {
                ids += arr[i] = "'" + arr[i] + "'";
            } else {
                ids += arr[i] = "'" + arr[i] + "',";
            }

        }
    }
    return ids;
}

export function toNull(val) {
    if (val == null || val == 'null') {
        return ''
    } else {
        return val
    }
}

export function timestampToTime(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() + ' ';
    var H = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var F = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var S = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()) + ' ';

    return Y + M + D + H + F + S;
}

export function unique(arr, title) {
    var oldArr = [arr[0]];
    for (var i = 1; i < arr.length; i++) {
        var flag = false;
        for (var j = 0; j < oldArr.length; j++) {
            if (oldArr[j][title] == arr[i][title]) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            oldArr.push(arr[i])
        }
    }
    return oldArr
}

export function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}
export function tableToLine(arr){
	arr.forEach(function(val){
        var brr=Object.keys(val);
		brr.forEach(function(n){
			if(val[n]==null || val[n]=='null'){
				val[n]='--';
			}
		})
	})
	return arr
}
//判断对象是否为空，为空--展示
export function formToLine(value){
    let val = value ? value : '--'
	return val
}