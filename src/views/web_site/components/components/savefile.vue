<template>
    <div class="savefile">
        <div>
            <a-input placeholder="请输入完整路径" v-model="fullpath" ></a-input>
        </div>
        <a-scrollbar style="height:600px;overflow:auto;margin-top: 15px;">
            <a-tree :data="treeData" :load-more="loadMore" v-if="treeData.length > 0" @select="select" :default-expanded-keys="expandNodes"></a-tree>
            <div style="margin:10px auto;" v-else>
                <a-spin :size="28"/>
            </div>
        </a-scrollbar>
    </div>
</template>

<script>
import { ref, reactive, h } from 'vue'
import { GetFileList } from '@/api/file/index.js'
import { IconFolder, IconDriveFile } from '@arco-design/web-vue/es/icon';

export default {
    props:{
        hostId: {
            type: Number,
            default: -1,
        },
        showFile: {
            type: Boolean,
            default: false
        },
        modelValue: String
    },
    setup(){
        

        return {
            expandedKeys: reactive([]),
            fullpath: ref(""),
            treeData: ref([]),

        }
    },
    methods: {
        renderFolder(){ // Folder Icon
            return h(IconFolder, {style:'color:rgb(var(--primary-6))'})
        },
        renderFile(){ // File Icon
            return h(IconDriverFile, {style:'color:rgb(var(--primary-6))'})
        },
        select(key){ // 选中节点时
            this.fullpath = key[0]
        },
        async getFileList(path, page=1){
            const result = []
            for(;;page++)
            {
                const response = GetFileList(path, this.hostId, page, false, '', 300)
                const resp = await response.request
                if(resp.code === 7){
                    this.$message.error("获取错误:" + resp.msg)
                    return result
                }
                result.push(...(resp.data.items || []))
                if(!resp.data.items || result.length >= resp.data.itemTotal){
                    return result
                }
            }
        },
        async loadMore(nodeData){
            const result = await this.getFileList(nodeData.key)
            if(result.length === 0){
                this.$message.warning("没有更多了...")
            }
            result.forEach((item)=>{
                if(!this.showFile && !item.isDir){
                    return
                }
                nodeData.children.push({
                    title: item.name,
                    key: item.path,
                    isDir: item.isDir,
                    children: [],
                    icon: item.isDir ? this.renderFolder : this.renderFile
                })
            })
        },
        expandAllNode(){
            let treeData = this.treeData
            this.expandedKeys.splice(0, this.expandedKeys.length)
            this.fullpath.split("/").forEach((item, index)=>{
                if(item.length === 0){
                    return
                }
                const findIndex = treeData.findIndex(i=>i.title === item)
                if(findIndex === -1){
                    return
                }
                this.expandedKeys.push(treeData[findIndex].key)
                treeData = treeData[findIndex].children
            })
        }
    },
    mounted(){
        this.getFileList('/').then((res)=>{
            res.forEach((item)=>{
                if(!this.showFile && !item.isDir){
                    return
                }
                this.treeData.push({
                    title: item.name,
                    key: item.path,
                    isDir: item.isDir,
                    children: reactive([]),
                    icon: item.isDir ? this.renderFolder : this.renderFile
                })
            })
            this.expandAllNode()
        }).catch(err=>{
            this.$message.error("获取目录失败：" + err)
        })
    },
    watch:{
        modelValue:{
            immediate: true,
            handler(val){
                this.fullpath = val
            }
        },
        fullpath:{
            immediate: true,
            handler(val, old){
                if(val === old)
                {
                    return
                }
                this.$emit("update:modelValue", val)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.savefile{
    width: 100%;
    height: 100%;

    .content{
        width: 100%;
        height: 600px;
        border: 1px solid red;
        margin-top: 30px;
    }
}
</style>