<template>
  <div class="low-code-platform">
    <div class="left">
      <selector-list></selector-list>
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
import Vue from 'vue'
import Editor from '@/views/low-code-platform/layout/Editor.vue'
import PageConfig from '@/views/low-code-platform/layout/PageConfig.vue'
import SchemaContent from '@/views/low-code-platform/layout/SchemaContent.vue'
import SelectorList from '@/views/low-code-platform/layout/SelectorList.vue'
import _ from 'lodash'

function register (context) {
  context.keys().forEach(cnt => {
    const component = context(cnt)
    let ctrl = component.default || component
    let a = ctrl.name
    let b = ctrl

    // 注册组件
    Vue.component(a, b)
  })
}

const componentsFiles = require.context('@/views/low-code-platform/components', true, /component.json$/)

const listComponents = []

componentsFiles.keys().forEach(key => {
  const obj = _.cloneDeep(componentsFiles(key))
  obj.props = {}
  const fields = obj.fields || []
  fields.forEach(field => {
    const schema = field.schema || []
    schema.forEach(schema => {
      obj.props[schema.model] = schema.value
    })
  })

  listComponents.push(obj)
})

register(require.context('@/views/low-code-platform/components', true, /index.vue/))

export default {
  name: 'LowCodePlatform',
  provide() {
    return {
      platform: this
    }
  },
  components: {
    Editor,
    PageConfig,
    SchemaContent,
    SelectorList
  },
  data() {
    return {
      listComponents: listComponents,
      isDragging: false,
      dragComponent: null,
      currentComponentList: [],
      activatedComponent: null
    }
  },
  created() {

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
