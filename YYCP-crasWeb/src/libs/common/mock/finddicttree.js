import Mock from 'mockjs';

export const finddicttype = Mock.mock('http://192.168.0.71:7080/dictType/findDictType', {
    'lists|1-7': [{
        'title': '@ctitle(5)',
        'dicttypeid|+1': 1,
        'children': [{}]
    }]

})
export const finddicttypebyid = Mock.mock('http://192.168.0.71:7080/dictType/findDictTypeById', {
    'lists|1-5': [{
        'title': '@ctitle(5)',
        'children': [{}]
    }]

})
