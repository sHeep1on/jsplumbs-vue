<template>
    <div class="contentMain">  					<!--编辑修改展示栏 -->
        <div class="editBtn">
            <el-button class="edit" @click="relationInfoEdit" size="small" type="ghost" icon="el-icon-edit-outline" :title="title">编辑</el-button>
        </div>
        <Form class="formShow">
            <Row>
                <Col span="8">
                    <FormItem label="关系名称：">
                        <p :title="baseInfor.relationName">{{baseInfor.relationName}}</p>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="关系ID：">
                        <p :title="baseInfor.groupId">{{baseInfor.groupId}}</p>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="所属分组：">
                        <p :title="baseInfor.groupName">{{baseInfor.groupName}}</p>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="8">
                    <FormItem label="源对象：">
                        <p :title="baseInfor.fromTarget">{{baseInfor.fromTarget}}</p>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="关系描述：">
                        <p :title="baseInfor.remark">{{baseInfor.remark}}</p>
                    </FormItem>
                </Col>
                <Col span="8">
                    <FormItem label="排序号：">
                        <p :title="baseInfor.indexSort">{{baseInfor.indexSort}}</p>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col span="24">
                    <FormItem label="目标对象：">
                        <p :title="baseInfor.toTarget">{{baseInfor.toTarget}}</p>
                    </FormItem>
                </Col>
            </Row>
        </Form>
    </div>
</template>

<script>
export default {
    props:{
        baseInfor:{},
        title:""     
    },
    methods:{
        relationInfoEdit(){
            this.$emit('infoEdit')
        }
    }
}
   
</script>
