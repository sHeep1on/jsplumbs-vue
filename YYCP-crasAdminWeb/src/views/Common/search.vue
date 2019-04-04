<template>
	<div>
		<div class="tree2" >
			<el-input  class="oInput" v-model="filterText" suffix-icon="el-icon-search" placeholder="请输入关键字搜索"></el-input>
			<div style="padding-top: 10px;">
				<el-tree class="filter-tree"
                :data="treeData"
                node-key="id"
                :props="defaultProps"
                @check-change="checkChange"
                :default-expand-all="false"
                :filter-node-method="filterNode"
                :expand-on-click-node="true"
                @node-click="onTree"
                :highlight-current="true"
                ref="treeInput"
                :accordion="true"
                show-checkbox>
			    </el-tree>
			</div>
		</div>
	</div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
import store from '@/store/index.js';
import api from '@/fetch/api.js';
export default {
    props: {
        url: {//左侧下拉框请求地址   是下拉框
            type: String,
            default: '/relation/group/selectTree'
        },
        params: {
            type: Object,
            default: function () {
                return {};
            }
        }
    },
    watch: {
        filterText (val) {
            this.$refs.treeInput.filter(val);
        }
    },
    data () {
        return {
            filterText: '',
            treeData: [],
            defaultProps: {
                children: 'child',
                label: 'title'
            },
        };
    },
    methods: {
        onTree (nodes){//下方的部门树执行的函数

            this.$emit('onTree', nodes);
        },
        open (obj, node) {
            setTimeout(function () {
                let arr = $('.el-tree-node__content .el-tree-node__label')
                $.each(arr, function (index, val) {
                    let texts = $('.el-tree-node__content .el-tree-node__label:eq(' + index + ')').html();
                    $('.el-tree-node__content .el-tree-node__label:eq(' + index + ')').attr('title', texts)
                });
            }, 100)
            this.$emit('expandNode', obj, node);
        },
        filterNode (value, data) {//如果没有下拉框，会有个模糊搜索，用作模糊搜索的
            if (!value) return true;
            return data.title.indexOf(value) !== -1;
        },
        initTree () {
            api.api('post', api.configUrl + this.url, this.params).then(res => {
                this.treeData = res;
            });
        },
        checkChange (nodes, checked) { //复选框勾选时触发的按钮
            this.$emit('checkChange', nodes, checked,this.$refs.treeInput.getCheckedNodes(),this.$refs.treeInput.getCheckedKeys());
        }
    },
    mounted () {
        let self = this;
        self.initTree();
        $('.tree2 .el-tree').height($(window).height() - 50 - 60 - 83 + 'px');
        window.onresize = function temp () {
            $('.tree2 .el-tree').height($(window).height() - 50 - 60 - 83 + 'px');
        };
        self.$nextTick(function () {
            setTimeout(function () {
                let arr = $('.el-tree-node__content .el-tree-node__label')
                $.each(arr, function (index, val) {
                    let texts = $('.el-tree-node__content .el-tree-node__label:eq(' + index + ')').html()
                    $('.el-tree-node__content .el-tree-node__label:eq(' + index + ')').attr('title', texts);
                });
            }, 100);
        });
    }
};
</script>
<style type="text/css">
	.tree2 {
		width: 100%;
		max-width: 280px;
		float: left;
		overflow: auto;
		position: relative;
		box-sizing: border-box;
	}
	.tree2 .el-tree {
		overflow: auto;
	}
	.tree2 .oInput {
		padding: 10px 10px 0 10px;
	}
	.el-tree-node__label {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		width: 230px;
	}
	.modalSelect{
		position: absolute;
		top: 50px;
		left:-3px;
		width:248px;
		background:#ffffff;
		z-index: 9999;
		height: 200px;
		overflow: auto;
		border: 1px solid #CCCCCC;
    }
    .tree2 .oInput i{
        font-size: 20px;
        margin-right: 10px;
        margin-top: 4px;
    }
</style>
