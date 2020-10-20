<template>
  <div class="test">
   <h1>test count {{count}}</h1>
    <div>count * 2 = {{doubleCount}}</div>
    <button @click="add">add</button>
    <button @click="getlist">get</button>
    <button @click="getlist1">post</button>
  </div>
</template>

<script>
  import {ref,computed,watch,getCurrentInstance} from 'vue'
  import {getList,getList2} from "../request/api";

  export default {
    setup(){
      const count=ref(0)
      const { ctx } = getCurrentInstance()
      const doubleCount = computed(()=>count.value*2)
      watch(()=>count.value,val=>{console.log(val)})
      const add=()=>{
        ctx.$store.commit('setToken', 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNjAzMTYzMTM0LCJleHAiOjE2MDMyNDU5MzR9.lOS9tLVaMPn_rxHPqAP7jzQU5TygfbRWWX9XAhrDxPDUjAUeDU2D3fkOUKJjVuh22vjXeoeByVeVGOlUyPTFtg')
        count.value++
      }
      const getlist=()=>{
        getList({goodsId:31}).then(res=>{console.log(res)})
      }
      const getlist1=()=>{
        getList2({
          current: 1,
          size: 20,
          customerId: "",
          nickname: "",
          type: "",
        }).then(res=>{console.log(res)})
      }
      return {
        count,
        add,
        doubleCount,
        getlist,
        getlist1
      }
    }
  }
</script>

<style lang="scss" scoped>
  .test {
    color: red;
  }
</style>
