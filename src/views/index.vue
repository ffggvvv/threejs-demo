<template>
    <div>
        <button id="change">切换模型</button>
        <div id="page-wrapper">

        </div>
    </div>
</template>
<script>
import Runner from '@/assets/js/scene.js'
export default {
    mounted() {
        new Runner('#page-wrapper')
    }
}
</script>
<style lang="scss" scoped>
#page-wrapper{
    overflow: hidden;
}
#change{
    position: fixed;
    z-index: 999;
    
}
</style>