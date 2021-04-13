<template>
  <div>
    <slot-component>
      <template v-slot:title>
        <div>title</div>
      </template>
      <div>content</div>
    </slot-component>
  </div>
</template>

<script>
  import SlotComponent from './component.vue';

  export default {
    name: 'Slots',
    components: {
      SlotComponent
    }
  }
</script>