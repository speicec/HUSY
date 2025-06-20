<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, DeleteFilled } from '@element-plus/icons-vue';
import { mockPermissions, permissionGroups } from '@/mock/permissions';
import type { Permission } from '@/types/permission';
import { ToolbarActions, type ToolbarActionEvent } from '@/types/EventTypes';

const props = defineProps<{
  selectedRows: any[];
  tableData: Permission[];
  total: number;
}>();

const emit = defineEmits<{
  (e: 'action', event: ToolbarActionEvent): void;
}>();

const searchQuery = ref('');

// 获取权限标签
const getPermissionLabel = (value: string) => {
  for (const group of permissionGroups) {
    if (group.value === value) return group.label;
    const child = group.children?.find((c: any) => c.value === value);
    if (child) return child.label;
  }
  return value;
};

// 内部搜索处理
const handleSearch = () => {
  const query = searchQuery.value;
  let filteredData: Permission[];

  if (!query) {
    filteredData = [...mockPermissions];
  } else {
    filteredData = mockPermissions.filter(
      (item: any) =>
        item.roleName.toLowerCase().includes(query.toLowerCase()) ||
        (item.noPermission && '无医生端权限'.includes(query)) ||
        item.permissions.some((p: string) =>
          getPermissionLabel(p).toLowerCase().includes(query.toLowerCase())
        )
    );
  }

  emit('action', {
    type: ToolbarActions.SEARCH,
    payload: {
      tableData: filteredData,
      total: filteredData.length,
      currentPage: 1,
    },
  });
};

// 内部添加处理
const handleAdd = () => {
  emit('action', {
    type: ToolbarActions.ADD,
    payload: {
      isEdit: false,
      permissionForm: {
        id: 0,
        roleName: '',
        noPermission: false,
        checkedPermissions: [],
      },
      dialogFormVisible: true,
    },
  });
};

// 内部批量删除处理
const handleBatchDelete = async () => {
  if (props.selectedRows.length === 0) {
    ElMessage.warning('请先选择要删除的角色');
    return;
  }

  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${props.selectedRows.length} 个角色吗？`,
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    const ids = props.selectedRows.map((row: Permission) => row.id);
    const newTableData = props.tableData.filter(
      (item: Permission) => !ids.includes(item.id)
    );

    emit('action', {
      type: ToolbarActions.BATCH_DELETE,
      payload: {
        tableData: newTableData,
        total: newTableData.length,
      },
    });

    ElMessage.success('批量删除成功');
  } catch {
    // 用户取消删除
  }
};
</script>

<template>
  <div class="flex items-center space-x-2">
    <div class="Search-input flex">
      <el-input
        v-model="searchQuery"
        placeholder="搜索角色信息"
        class="flex-1"
        @keyup.enter="handleSearch"
      >
      </el-input>
      <div class="Search-btn -ml-1">
        <el-button @click="handleSearch" color="#089ead">
          <el-icon><Search /></el-icon>
        </el-button>
      </div>
    </div>
    <el-button color="#089ead" @click="handleAdd">
      <el-icon><Plus /></el-icon>
      添加角色
    </el-button>
    <el-button type="danger" @click="handleBatchDelete">
      <el-icon><DeleteFilled /></el-icon>
      批量删除
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
