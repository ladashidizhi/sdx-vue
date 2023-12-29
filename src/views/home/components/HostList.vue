<template>
    <div class="hosts">
        <div class="item" @click="collapse=!collapse">
            <h2>{{ hostInfo.name }}</h2>
            <h3>{{ hostInfo.host }}</h3>
        </div>
        <div class="list" 
        :style="{width: windowWidth+'px', height: (collapse ? 0 : widthHeight / 2)+'px', opacity: collapse ? 0 : 1, zIndex: collapse ? 0:1000}">
           <div class="list_content">
                <div class="form">
                    <a-input :style="{width:'500px'}" placeholder="请输入主机IP" allow-clear v-model="hostName"/>
                    <span class="icon" @click.stop="collapse=true">
                        <icon-close />
                    </span>
                </div>
                <a-scrollbar style="height:100%;overflow: auto;margin-top: 20px;">
                    <div class="hosts_addr" v-if="(searching ? hostFindResult : hostList).length > 0">
                        <div class="host_item" v-for="item,index in (searching ? hostFindResult : hostList)" :key="index" :title="item.name+'\n'+item.host" @click="updateHost(item)">
                                <h2>{{ item.name }}</h2>
                                <h3>{{ item.host }}</h3>
                                <div class="icon" :style="getStyle(item.status)"></div>
                        </div>
                    </div>
                    <a-empty v-else/>
                </a-scrollbar>
           </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'

export default{
    props:{
        hostList:{
            type: Array,
            default:()=>[]
        }
    },
    setup(){
        const hostInfo = ref({
            "id": 0,
            "name": "",
            "host": ""
        })

        let windowWidth = ref(window.document.documentElement.offsetWidth), 
            widthHeight = window.document.documentElement.offsetHeight
            widthHeight = widthHeight < 900 ? ref(934) : ref(widthHeight)
        return {
            searching: ref(false),
            hostName: ref(""),
            hostFindResult: reactive([]),
            hostInfo,
            windowWidth,
            widthHeight,
            collapse: ref(true)
        }
    },
    methods:{
        search(){
            if(this.hostName.length === 0){
                this.$message.error("请输入正确的主机IP")
                return
            }
        },
        getStyle(status){
            switch(status){
                case 0:
                    return {'background-color': '#F56C6C',  'box-shadow': '0 0 20px #F56C6C'}
                case 1:
                    return {'background-color': '#E6A23C',  'box-shadow': '0 0 20px #E6A23C'}
                case 2:
                    return {'background-color': '#67C23A',  'box-shadow': '0 0 20px #67C23A'}
            }
        },
        updateHost(item){
            this.hostInfo.id = item.id
            this.hostInfo.name = item.name
            this.hostInfo.host = item.host
            this.$emit('updateHost', item)
        }
    },
    mounted(){
        if(this.hostList.length > 0)
        {
            this.hostInfo.id = this.hostList[0].id
            this.hostInfo.name = this.hostList[0].name
            this.hostInfo.host = this.hostList[0].host
        }

        window.addEventListener('resize', ()=>{
            this.windowWidth = window.document.documentElement.offsetWidth
            this.widthHeight = window.document.documentElement.offsetHeight
            this.widthHeight = this.widthHeight < 900 ? 934 : this.widthHeight
        })
    },
    watch:{
        hostList:{
            immediate: true,
            deep: true,
            handler(val){
            }
        },
        hostName(val){
           this.searching = val.length > 0
           this.hostFindResult.splice(0, this.hostFindResult.length)
           this.hostList.forEach((item)=>{
            if(item.host.indexOf(val) > -1 || item.name.indexOf(val) > -1){
                this.hostFindResult.push(reactive(item))
            }
           })
        }
    }
}
</script>


<style lang="scss" scoped>
.hosts{
    width: 100%;
    height: 100%;
    position: relative;
    
    .item{
        width: 80%;
        margin: 0 auto;
        height: 100%;
        cursor: pointer;
        line-height: 30px;

        h2{
            text-align: center;
            color: #909399;
        }

        h3{
            text-align: center;
            color: #909399;
        }
    }

    .list{
        z-index: 100;
        overflow: hidden;
        box-sizing: border-box;
        position: absolute;
        top: 100%;
        height: 0px;
        opacity: 0;
        background-color: #182030;
        transition: all .5s ease-in-out;

        .list_content{
            padding: 15px;
        }

        .form{
            width: 100%;
            display: flex;
            justify-content: space-between;
            
            .icon{
                cursor: pointer;
                font-size: 20px;
                color: white;
                margin-right: 50px;
                transition: all .3s;
                
                &:hover{
                    color: rgb(60, 126, 255);
                    transform: scale(1.3);
                }
            }
        }
        
        .hosts_addr{
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            max-height: 385px;
            box-sizing: border-box;
            padding: 10px;

            .host_item{
                width: 140px;
                height: 50px;
                box-sizing: border-box;
                padding-top: 10px;
                margin-right: 24px;
                margin-bottom: 24px;
                cursor: pointer;
                border-radius: 5px;
                background-color: #7f7f80;
                transition: all .3s;
                position: relative;

                &:hover{
                    background-color: #5aaafb;
                    transform: scale(1.1);
                }

                h2{
                    color: white;
                    font-size: 14px;
                    text-align: center;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 80%;
                    margin: 0 auto;
                }

                h3{
                    color: white;
                    font-size: 14px;
                    text-align: center;
                    font-weight: normal;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                    width: 80%;
                    margin: 0 auto;
                }

                .icon{
                    width: 10px;
                    height: 10px;
                    position: absolute;
                    top: 3px;
                    right: 5px;
                    border-radius: 50%;
                    transform: all .5s;
                }
            }
        }
    
    }

    // &:hover{
    //     .list{
    //         height: 300px;
    //         opacity: 1;
    //     }
    // }
}
</style>