<script lang="ts" setup>
import { ref, computed } from 'vue';
import {
  PaginationActions,
  type PaginationActionEvent,
} from '@/types/EventTypes';

const props = defineProps<{
  total: number;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  (e: 'action', event: PaginationActionEvent): void;
}>();

// 使用 props 中的分页状态，不再内部管理

// 内部处理页面大小变化
const handleSizeChange = (val: number) => {
  emit('action', {
    type: PaginationActions.CHANGE,
    payload: {
      type: 'size-change',
      pageSize: val,
      currentPage: 1,
    },
  });
};

// 内部处理当前页变化
const handleCurrentChange = (val: number) => {
  emit('action', {
    type: PaginationActions.CHANGE,
    payload: {
      type: 'current-change',
      currentPage: val,
      pageSize: props.pageSize,
    },
  });
};
</script>

<template>
  <div class="custom" style="display: flex; justify-content: center">
    <el-pagination
      :page-size="pageSize"
      :current-page="currentPage"
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
