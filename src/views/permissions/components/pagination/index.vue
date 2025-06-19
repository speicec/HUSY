<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
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
    />
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #11d2c8;
}

:deep(.el-pagination .el-select .el-input .el-input__inner:focus) {
  border-color: #11d2c8;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #11d2c8 inset;
}

:deep(.el-pagination .el-select .el-input .el-input__inner:hover) {
  border-color: #11d2c8;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  color: #11d2c8;
}

:deep(.el-pagination .el-pager li:hover) {
  color: #11d2c8;
}

:deep(.el-pagination .el-pager li.is-active) {
  color: #fff;
  background-color: #11d2c8;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #11d2c8 inset;
}
</style>
