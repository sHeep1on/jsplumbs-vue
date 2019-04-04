<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div style="text-align: center;" :key="index">
                <Dropdown transfer v-if="item.children.length !== 1" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button style="width: 70px;margin-left: -5px;padding:10px 0;" type="text">
                       <img :src="item.imgSrc" style="margin-right: 14px;"/>
                       <!--<span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>-->
                    </Button>
                    <DropdownMenu style="width: 200px;" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i"><Icon :type="child.icon"></Icon><span style="padding-left:10px;">{{ itemTitle(child) }}</span></DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <img @click="changeMenu(item.children[0].name)" :src="item.imgSrc" style="margin-right: 14px;margin-left: -5px;padding:10px 0;"/>
                    <DropdownMenu  slot="list">
                        <DropdownItem :name="item.children[0].name" :key="'d' + index">
                        	<!--<img :src="item.imgSrc" style="margin-right: 14px;"/>-->
                        	<span class="layout-text" :key="'title' + item.name">{{ itemTitle(item.children[0]) }}</span>
                        	<!--<span style="padding-left:10px;">{{ itemTitle(item.children[0]) }}</span>-->
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    name: 'sidebarMenuShrink',
    props: {
        menuList: {
            type: Array
        },
        iconColor: {
            type: String,
            default: 'white'
        },
        menuTheme: {
            type: String,
            default: 'darck'
        }
    },
    methods: {
        changeMenu (active) {
            this.$emit('on-change', active);
        },
        itemTitle (item) {
            if (typeof item.title === 'object') {
                return this.$t(item.title.i18n);
            } else {
                return item.title;
            }
        }
    }
};
</script>
