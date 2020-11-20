<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <div class="clamp-wrapper">
            <lzlClamp :maxLines="2">{{ data }} </lzlClamp>
        </div>
    </div>
</template>

<script>
import lzlClamp from './components/clamp'

export default {
    name: 'App',
    components: {
        lzlClamp
    },
    data() {
        return {
            data:
                '一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五一二三四五'
        }
    }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
.clamp-wrapper {
    text-align: left;
    margin: 0 auto;
    width: 300px;
    border: 1px solid salmon;
    padding: 10px;
}
</style>
