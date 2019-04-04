

export const Queue=()=>{
  const list = []
  let index = 0
  let isRun= false
  const next=()=>{
    if (index >= list.length - 1) {
      isRun=false;
      return}
    const cur = list[++index];
    cur(next);
  }
  const add = (fn)=>{
    if (list.length-1-index>5) {
      return
    } else {
      list.push(fn)
    }
  }
  const run=()=>{
    const cur = list[index]
    typeof cur === 'function'&&cur(next)
  }
  const getStatus = ()=>{
    return isRun
  }
  return {
    add,
    run,
    getStatus
  }
}

export  const Commerce = {
  uid	:'uid',
qym	:'公司名称',
fddb:	'法定代表',
zczb:	'注册资本',
sjzb:	'实缴资本',
jyzt:	'经营状态',
clsj:	'成立时间',
shxydm:	'统一社会信用代码',
nsrsbh:	'纳税人识别号',
zch:	'注册号',
zzjgdm:	'组织机构代码',
gslx:	'公司类型',
sshy:	'所属行业',
hzrq:	'核准日期',
djjg:	'登记机关',
ssdq:	'所属地区',
ywm	:'英文名',
cym:	'曾用名',
cbrs:	'参保人数',
rygm:	'人员规模',
yyqx:	'营业期限',
qydz:	'企业地址',
jyfw:	'经营范围',
gdxx:	'股东信息',
zyry:	'主要人员',
insert_time:	'入库时间',
certno:	'法人证件号码',
xb:	'性别',
mz:	'民族',
}