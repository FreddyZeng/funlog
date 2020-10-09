<template>
<div>a</div>
</template>

<script>
export default {
    name: "foo",
    created() {
        console.log(
            "path: /Users/fanrong/Documents/APP工程/funlog/test/file/foo.vue.tmp, line: 3, column: 14"
        );

        console.log(
            "path: /Users/fanrong/Documents/APP工程/funlog/test/file/foo.vue.tmp, line: 3, column: 14"
        );

        console.log(
            "path: /Users/fanrong/Documents/APP工程/funlog/test/file/foo.vue.tmp, line: 3, column: 14"
        );
    },
};
</script>

<style lang="less" scoped>
/* Won't be extracted */
.a {
    padding: 2px;
    content: 'file: /home/fanrong/funlog/test/file/foo.vue, line: 50';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 51';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 52';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 53';
}

nav {
    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        content: 'file: /home/fanrong/funlog/test/file/foo.vue, line: 57';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 59';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 61';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 63';
    }

    li {
        display: inline-block;
        content: 'file: /home/fanrong/funlog/test/file/foo.vue, line: 61';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 64';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 67';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 70';
    }

    a {
        display: block;
        padding: 6px 12px;
        text-decoration: none;
        content: 'file: /home/fanrong/funlog/test/file/foo.vue, line: 67';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 71';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 75';
        content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 79';
    }

    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 68';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 74';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 79';
    content:'file: /home/fanrong/funlog/test/file/foo.vue, line: 84';
}
</style>
