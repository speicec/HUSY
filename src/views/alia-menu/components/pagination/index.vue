<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
  total: number;
}>();

const emit = defineEmits<{
  (e: 'size-change', size: number): void;
  (e: 'current-change', page: number): void;
}>();

const pageSize = ref(10);
const currentPage = ref(1);

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
  emit('size-change', val);
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  emit('current-change', val);
};
</script>

<template>
  <div class="custom" style="display: flex; justify-content: center">
    <el-pagination
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      :pager-count="7"
      :page-sizes="[10, 20, 50, 100]"
      :background="true"
      layout="total, sizes,jumper,prev, pager, next,"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      color="#089ead"
    />
  </div>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
