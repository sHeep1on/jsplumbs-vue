export const validateNameExsitAdd = (rule, value, callback) => {
    var regEn = /[`~!@#$%^&*()_+<>?:"{},./;'[\]]/im;
    var regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
        return callback(new Error('账号不能包含特殊字符'));
    }
    var regEn2 = /^([a-z]|[A-Z]|[0-9])+$/im;
    if (!regEn2.test(value)) {
        return callback(new Error('只能包含数字或者字母'));
    }
    return callback();
};
export const validateCaseId = (rule, value, callback) => {
    var regEn = /[`~!@%^&*?:"{},./;'[\]]/im;
    var regCn = /[·！#￥；“”‘、，|《。》？、【】[\]]/im;
    if (regEn.test(value) || regCn.test(value)) {
        return callback(new Error('案件编号不能包含特殊字符'));
    }
    var regEn2 = /[\u4e00-\u9fa5]/im;
    if (regEn2.test(value)) {
        return callback(new Error('案件编号不能为中文'));
    }
    return callback();
};
export const telphoneNumber = (rule, value, callback) => { // 手机号校验
    if (value !== '' && value !== null && value !== undefined) {
        var myreg = new RegExp('^((13)|(14)|(15)|(17)|(18))\\d{9}$');
        if (!myreg.test(value)) {
            return callback(new Error('手机号码应为11位数字，以13/14/15/17/18开头'));
        }
    }
    return callback();
};
export const email = (rule, value, callback) => { // 邮箱校验
    var myreg = new RegExp('^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$');
    if (value !== '' && value !== null && value !== undefined) {
        if (!myreg.test(value)) {
            return callback(new Error('请输入有效的邮箱'));
        }
    }
    return callback();
};
export const http = (rule, value, callback) => { // 网址校验
    var myreg = new RegExp('^((http|https)://)');
    if (value !== '' && value !== null && value !== undefined) {
        if (!myreg.test(value)) {
            return callback(new Error('请输入有效网址'));
        }
    }
    return callback();
};
export const isNumber = (rule, value, callback) => { // 纯数字校验
    var myreg = new RegExp('^[0-9]+$');
    if (value != '' && value != null && value != undefined) {
        if (!myreg.test(value)) {
            return callback(new Error('只能输入数字'));
        }
    }
    return callback();
};
export const isAmount = (rule, value, callback) => { // 纯数字校验
    if (value != '' && value != null && value != undefined) {
        var myreg = /^\d+(\.\d{1,6})?$/
        if (!myreg.test(value)) {
            return callback(new Error('请仔细核对您输入的金额数'));
        }
        var regEn2 = /[\u4e00-\u9fa5]|[a-zA-Z]/im;
        if (regEn2.test(value)) {
            return callback(new Error('金额数只能为数字'));
        }
    }
    return callback();
};
export const callPhone = (rule, value, callback) => { // 电话号码校验
    var myreg = new RegExp('^0[0-9]{2}[0-9]{7,8}$');
    if (value != '' && value != null && value != undefined) {
        if (!myreg.test(value)) {
            return callback(new Error('请输入正确的电话号码'));
        }
    }
    return callback();
};
export const IdCodeValid = (rule, value, callback) => {
    // 身份证号合法性验证
    // 支持15位和18位身份证号
    // 支持地址编码、出生日期、校验位验证
    var city = {
        11: '北京',
        12: '天津',
        13: '河北',
        14: '山西',
        15: '内蒙古',
        21: '辽宁',
        22: '吉林',
        23: '黑龙江 ',
        31: '上海',
        32: '江苏',
        33: '浙江',
        34: '安徽',
        35: '福建',
        36: '江西',
        37: '山东',
        41: '河南',
        42: '湖北 ',
        43: '湖南',
        44: '广东',
        45: '广西',
        46: '海南',
        50: '重庆',
        51: '四川',
        52: '贵州',
        53: '云南',
        54: '西藏 ',
        61: '陕西',
        62: '甘肃',
        63: '青海',
        64: '宁夏',
        65: '新疆',
        71: '台湾',
        81: '香港',
        82: '澳门',
        91: '国外 '
    };

    if (!value || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(value)) {
        return callback(new Error('请输入正确的证件号码'));
    } else if (!city[value.substr(0, 2)]) {
        return callback(new Error('请输入正确的证件号码'));
    } else {
    // 18位身份证需要验证最后一位校验位
        if (value.length == 18) {
            value = value.split('');
            // ∑(ai×Wi)(mod 11)
            // 加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            // 校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = value[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != value[17].toUpperCase()) {
                return callback(new Error('请输入正确的证件号码'));
            }
        }
    }
    return callback();
};
