<script lang="ts" setup>
import { ref } from 'vue';
import { Search, Plus, DeleteFilled } from '@element-plus/icons-vue';

const props = defineProps<{
  selectedRows: any[];
}>();

const emit = defineEmits<{
  (e: 'search', query: string): void;
  (e: 'add'): void;
  (e: 'batch-delete'): void;
}>();

const searchQuery = ref('');

const handleSearch = () => {
  emit('search', searchQuery.value);
};

const handleAdd = () => {
  emit('add');
};

const handleBatchDelete = () => {
  emit('batch-delete');
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <div class="Search-input flex">
      <el-input
        v-model="searchQuery"
        placeholder="搜索角色信息"
        class="flex-1"
      >
      </el-input>
      <div class="Search-btn -ml-1">
        <el-button @click="handleSearch" type="primary">
          <el-icon><Search /></el-icon>
        </el-button>
      </div>
    </div>
    <el-button type="primary" @click="handleAdd">
      <el-icon><Plus /></el-icon>
      添加角色
    </el-button>
    <el-button
      type="danger"
      @click="handleBatchDelete"
      :disabled="!selectedRows.length"
    >
      <el-icon><DeleteFilled /></el-icon>
      批量删除
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.Search-btn {
  display: inline-block;
  margin-right: 12px;
}
</style>
