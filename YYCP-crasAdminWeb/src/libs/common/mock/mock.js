import Mock from 'mockjs';

export const mock1 = Mock.mock('http://192.168.0.71:7080/office/findDictTreeOneByOne', {
    'list|1-10': [{
        'title': '@cname',
        'id|+1': 1,
        'children': [{
            'title': '@cname',
            'id|+1': 1
        }]
    }]
})

