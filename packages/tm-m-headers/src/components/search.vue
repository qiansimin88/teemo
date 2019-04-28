<template>
    <div class="search">
        <input type="search" v-model="str" @focus="focus()" @blur="blur()" autocomplete="off" @keyup.enter="search()" v-el:search> 
        <div class="tag">
            <i class="iconfont icon-sousuo"></i>
            <span>{{ title }}</span>
        </div>
        <div v-show="coverShow" class="cover"></div>
    </div>
</template>
<style lang="less" scoped>

    .search {
        width: 5.42rem;
        text-align: center;
        font-size: .28rem;
        position: relative;
        i {
            color: #fff;
            font-size: inherit;
            font-weight: 200;
        }
        input {
            position: absolute;
            background: rgba(255, 255, 255, .5);
            top: 0;
            left: 0;
            color: #fff;
            width: 100%;
            height: 100%;
            padding: 0 10%;
            vertical-align: middle;
            border: none;
            border-radius: 3px;
            outline: none;
        }
        input:focus {               
            background: #fff;
            color: black;
        }
        input::placeholder {
            color: #fff;
        }
        input:focus + .tag {
            i {
                position: absolute;
                color: #ccc;
                left: 2.5%;
            }
        }
        .cover {
            position: fixed;
            top: .88rem;
            bottom: 0;
            left: 0;
            width: 100%;
            background: rgba(0,0,0,.8);
        }
    }
</style>
<script>
export default {
    name: 'search',
    props: {
        title: {
            type: String
        },
        value: {
            type: String,
            default: null,
            twoWay: true
        }
    },
    data() {
        return {
            str: null,
            coverShow: false // 是否遮罩
        };
    },
    methods:{
        focus() {
            this.coverShow = true;
            this.$dispatch('searchFocus');
        },
        blur() {
            this.$dispatch('searchBlur');
            this.coverShow = false;
            this.str = null;
        },
        search() {
            this.value = this.str;
            this.coverShow = false;
            this.$els.search.blur();
            this.$dispatch('search', this.value);
        }
    }
};
</script>