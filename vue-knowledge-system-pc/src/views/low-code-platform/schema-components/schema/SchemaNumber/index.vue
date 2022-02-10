<template>
  <config-item :label="label" :label-width="labelWidth">
    <el-input-number
      v-model="innerValue"
      v-bind="innerOptions"
    ></el-input-number>
  </config-item>
</template>

<script>
  import ConfigItem from '@/views/low-code-platform/schema-components/support/ConfigItem/index.vue'
  import SchemaMixin from '@/views/low-code-platform/schema-components/mixins.js'

  export default {
    name: 'SchemaNumber',
    components: {
      ConfigItem
    },
    mixins: [SchemaMixin],
    data() {
      return {

      }
    },
    mounted() {
      
    }
  }
</script>

<style lang="scss" scoped>

</style>