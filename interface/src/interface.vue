<template>
  <div>
    <v-input
        :model-value="value"
        @update:model-value="onChange"
    />
    {{validateInput(value, fieldsData.regex)}}
  </div>
</template>
<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { useApi } from '@directus/extensions-sdk';

const props = defineProps({
  value: {
    type: String,
    default: '',
  },
  allowExternalLinks: {
    type: Boolean,
    default: false,
  },
  collection: {
    type: String,
    required: true,
  },
  field: {
    type: String,
    required: true,
  },
  primaryKey: {
    type: Number
  }
})

const emit = defineEmits(['input'])
const fieldsData = computed(async () => {
  const api = useApi()
  const response = await api.get(`/items/${props.collection}?filter[id][_eq]=${props.primaryKey}`);
  return response.data.data;
})

const validateInput = (input: string, isRegex: boolean) => {
  const errors: string[] = []
  if (isRegex){
    // TODO: Validate Regex
  } else {
    if (!input.startsWith('/')){
      console.log(1)
      errors.push('must start with a /')
    } else if (input.includes(' ')){
      console.log(2)
      errors.push('can\'t contain spaces')
    }
  }
  return errors;
}

const onChange = (value: string) => {
  if (props.value === value) return;

  // Emit exact value.
  emit('input', value || '');
}
</script>
