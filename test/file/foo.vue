<template>
    <div>a</div>
</template>

<script>
    export default {
        name: 'foo',
        created () {
            console.log("path: /home/fanrong/funlog/test/file/foo.vue, line: 8, column: 19");
        }
    };
</script>

<style scoped lang="less">
    /* Won't be extracted */
.a {
 padding: 2px;
}
</style>
