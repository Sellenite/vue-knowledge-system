<template>
  <div class="low-code-platform">
    <div class="left">
      <selector-list :list="listComponents"></selector-list>
    </div>
    <div class="center">
      <editor></editor>
    </div>
    <div class="right">
      <schema-content></schema-content>
    </div>
  </div>
</template>

<script>

import Editor from '@/views/low-code-platform/layout/Editor.vue'
import PageConfig from '@/views/low-code-platform/layout/PageConfig.vue'
import SchemaContent from '@/views/low-code-platform/layout/SchemaContent.vue'
import SelectorList from '@/views/low-code-platform/layout/SelectorList.vue'

const componentsFiles = require.context('@/views/low-code-platform/components', true, /component.json$/)

const listComponents = []

componentsFiles.keys().forEach(key => {
  listComponents.push(componentsFiles(key))
})

export default {
  name: 'LowCodePlatform',
  components: {
    Editor,
    PageConfig,
    SchemaContent,
    SelectorList
  },
  data() {
    return {
      listComponents: listComponents
    }
  },
  created() {
    console.log(this.listComponents)
  }
}
</script>

<style lang="scss" scoped>
  .low-code-platform {
    display: flex;
    .left {
      width: 176px;
    }
    .center {
      flex: 1;
    }
    .right {
      width: 360px;
    }
  }
</style>
