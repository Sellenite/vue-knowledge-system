<template>
  <div class="schema-content">
    <div class="area-item" v-for="(field, index) in platform.activatedComponent.fields" :key="index">
      <div class="area-title">
        <span>{{ field.title }}</span>
      </div>
      <div class="schema-config-list">
        <template v-for="(item, index) in field.schema">
          <component :is="item.type" v-model="platform.activatedComponent.props[item.model]" :label="item.label" :label-width="item.labelWidth" :options="item.options" @input="handleInput(item, arguments)"></component>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'SchemaContent',
    inject: ['platform'],
    data() {
      return {

      }
    },
    methods: {
      handleInput(item, [value]) {
        // 更新currentComponentList里schema列表里的value值，同步更新props和schema的value
        item.value = value
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '~@/styles/element-variables.scss';
  .schema-content {
    margin-top: 10px;
    .area-item {
      margin-bottom: 20px;
      .area-title {
        padding: 10px 12px;
        background: #e8f0fb40;
        font-size: 14px;
        color: #323233;
        & > span {
          &::before {
            content: ".";
            width: 3px;
            height: 10px;
            margin-right: 8px;
            background: $--color-primary;
          }
        }
      }
      .schema-config-list {
        padding: 20px 12px 10px 24px;
      }
    }
  }
</style>