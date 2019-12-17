<template>
  <div class="Hamburger">
    <i style="font-size: 25px;color: #A0A5AB;cursor:pointer;margin: 10px;" @click="toggleClick" :class="isActive ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick () {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped lang="less">
.Hamburger {
  position: absolute;
  display: inline-block;
  height: 50px;
  width: 100px;
}
</style>
