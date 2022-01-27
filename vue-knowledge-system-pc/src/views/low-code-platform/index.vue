<template>
  <div class="low-code-platform">
    <div class="left">
      <selector-list></selector-list>
    </div>
    <div class="center">
      <editor></editor>
    </div>
    <div class="right">
      <schema-content v-if="activatedComponent"></schema-content>
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

const componentsJsonFiles = require.context('@/views/low-code-platform/components', true, /component.json$/)
const componentsVueFiles = require.context('@/views/low-code-platform/components', true, /index.vue$/)

const listComponents = []

componentsJsonFiles.keys().forEach(key => {
  const json = _.cloneDeep(componentsJsonFiles(key))
  const component = componentsVueFiles(key.replace('component.json', 'index.vue')).default
  // 使用vue组件里的name作为component
  json.component = component.name
  json.props = {}
  const fields = json.fields || []
  fields.forEach(field => {
    const schema = field.schema || []
    schema.forEach(schema => {
      json.props[schema.model] = schema.value
    })
  })

  listComponents.push(json)
})

register(require.context('@/views/low-code-platform/components', true, /index.vue/))

register(require.context('@/views/low-code-platform/schema-components/schema', true, /index.vue/))

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
