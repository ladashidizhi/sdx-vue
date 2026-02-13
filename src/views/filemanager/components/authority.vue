<template>
    <div class="cmd">
        <div class="item">
            <div class="name">所有者</div>
            <a-checkbox-group v-model="all">
                <a-checkbox value="0">读取</a-checkbox>
                <a-checkbox value="1">写入</a-checkbox>
                <a-checkbox value="2">执行</a-checkbox>
            </a-checkbox-group>
        </div>
        <div class="item">
            <div class="name">用户组</div>
            <a-checkbox-group v-model="group">
                <a-checkbox value="0">读取</a-checkbox>
                <a-checkbox value="1">写入</a-checkbox>
                <a-checkbox value="2">执行</a-checkbox>
            </a-checkbox-group>
        </div>
        <div class="item">
            <div class="name">&nbsp;&nbsp;&nbsp;公共</div>
            <a-checkbox-group v-model="public">
                <a-checkbox value="0">读取</a-checkbox>
                <a-checkbox value="1">写入</a-checkbox>
                <a-checkbox value="2">执行</a-checkbox>
            </a-checkbox-group>
        </div>
        <div class="item">
            <div class="name">&nbsp;&nbsp;&nbsp;权限</div>
            <a-input :style="{width:'200px'}" v-model="result" @input="inputNumber"/>
        </div>
        <div class="item">
            <div class="name">权限概览</div>
            <span style="cursor: default;">{{ resultPreviewList.join('') }}</span>
        </div>
        <div class="item">
            <div class="name" style="width: 93px;">
            </div>
            <a-checkbox v-model="subFlag">同修改子目录属性</a-checkbox>
        </div>
    </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
    props:{
        modelValue: String,
        sub: Boolean
    },
    setup(){
        return {
            subFlag: ref(false),
            preview: "",
            result: ref("0000"),
            resultList: reactive([0,0,0,0]),
            resultPreviewList: reactive(["---","---","---"]),
            all: ref([]),
            group: ref([]),
            public: ref([]),
        }
    },
    methods:{
        computPreview(result){
            let resultPreview = ""
            for(let i = 0; i < 3; i++){
                if((result >> i) & 1){
                    switch(i){
                        case 0:
                            resultPreview += "r"
                            break
                        case 1:
                            resultPreview += "w"
                            break
                        case 2:
                            resultPreview += "x"
                            break
                    }
                }else{
                    resultPreview += "-"
                }
            }
            return resultPreview
        },
        computBit(idx, val){
            let result = 0
            val.forEach((item)=>{
                result += Math.pow(2, Number(item))
            })
            this.resultPreviewList[idx-1] = this.computPreview(result)
            this.resultList[idx] = result.toString()
        },
        inputNumber(){
            const reg = /^[0-7]+$/;
            if(!reg.test(this.result) && this.result.length > 0){
                this.$message.error("这不是一个合法的八进制数字")
                return
            }
            this.all.splice(0, this.all.length)
            this.group.splice(0, this.group.length)
            this.public.splice(0, this.public.length)
            this.resultPreviewList.map(i=>"---")

            this.result = this.result.slice(0, 4)
            if(parseInt(this.result,8) > 511){
                this.result = "0777"
            }
            
            
            const split = this.result.length === 4 ? this.result.split('').slice(1) : this.result.split('').slice(1)
            split.forEach((item, i)=>{
                this.resultList[i + 1] = Number(item)
                let resultPreview = ""
                for(let j = 0; j < 3; j++){
                    if((Number(item) >> j) & 1){
                        switch(i){
                            case 0:
                                this.all.push(j.toString())
                                break
                            case 1:
                                this.group.push(j.toString())
                                break
                            case 2:
                                this.public.push(j.toString())
                                break
                        }
                    }else{
                        resultPreview += "-"
                    }
                }
                this.resultPreviewList[i] = this.computPreview(Number(item))
            })

            this.$emit("update:modelValue", this.result)

        }
    },
    mounted(){

    },
    watch:{
        all(val){
            this.computBit(1, val)
            this.result = this.resultList.join('')
            this.$emit("update:modelValue", this.result)
        },
        group(val){
            this.computBit(2, val)
            this.result = this.resultList.join('')
            this.$emit("update:modelValue", this.result)
        },
        public(val){
            this.computBit(3, val)
            this.result = this.resultList.join('')
            this.$emit("update:modelValue", this.result)
        },
        modelValue:{
            immediate: true,
            handler(val){
                this.all.splice(0, this.all.length)
                this.group.splice(0, this.group.length)
                this.public.splice(0, this.public.length)
                this.result = val
                const split = val.length === 4 ? val.split('').slice(1) : val.split('').slice(1)
                split.forEach((item, i)=>{
                    this.resultList[i + 1] = Number(item)
                    let resultPreview = ""
                    for(let j = 0; j < 3; j++){
                        if((Number(item) >> j) & 1){
                            switch(i){
                                case 0:
                                    this.all.push(j.toString())
                                    break
                                case 1:
                                    this.group.push(j.toString())
                                    break
                                case 2:
                                    this.public.push(j.toString())
                                    break
                            }
                        }else{
                            resultPreview += "-"
                        }
                    }
                    this.resultPreviewList[i] = this.computPreview(Number(item))
                })
            }
        },
        sub:{
            immediate: true, 
            handler(val){
                this.subFlag = val
            }
        },
        subFlag(val){
            this.$emit("update:sub", val)
        }
    }
}
</script>

<style lang="scss" scoped>
.cmd{
    width: 100%;

    .item{
        display: flex;
        margin-bottom: 15px;

        .name{
            width: 100px;
            font-size: 14px;
            margin-left: 30px;
            margin-right: 40px;
        }
    }
}
</style>