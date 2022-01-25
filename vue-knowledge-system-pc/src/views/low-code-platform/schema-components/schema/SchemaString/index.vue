<template>
  <config-item :label="label" :label-width="labelWidth">
    <el-input
      v-model="innerValue"
      v-bind="innerOptions"
    ></el-input>
  </config-item>
</template>

<script>
  import ConfigItem from '@/views/low-code-platform/schema-components/support/ConfigItem/index.vue'
  import SchemaMixin from '@/views/low-code-platform/schema-components/mixins.js'

  export default {
    name: '',
    components: {
      ConfigItem
    },
    mixins: [SchemaMixin],
    data() {
      return {

      }
    }
  }
</script>

<style lang="less" scoped>

</style>