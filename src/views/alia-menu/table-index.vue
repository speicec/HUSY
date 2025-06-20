<template>
  <div class="common-layout">
    <el-container style="margin: 0; width: 100%">
      <el-header class="flex justify-between items-center px-4 h-16">
        <!-- 左侧 -->
        <div
          class="slogn font-bold text-lg"
          style="margin-left: 5px; font-weight: bold"
        >
          医生端角色列表
        </div>

        <!-- 右侧 -->
        <Toolbar
          :selected-rows="selectedRows"
          :table-data="tableData"
          :total="total"
          @action="handleToolbarAction"
        />
      </el-header>

      <PermissionTable
        :table-data="paginatedData"
        :permission-groups="permissionGroups"
        @action="handleTableAction"
      />

      <PermissionDialog
        ref="permissionDialogRef"
        :table-data="tableData"
        :total="total"
        @action="handleDialogAction"
      />

      <el-footer>
        <Pagination
          ref="paginationRef"
          :total="total"
          :current-page="currentPage"
          :page-size="pageSize"
          @action="handlePaginationAction"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { mockPermissions, permissionGroups } from '@/mock/permissions';
import type { Permission } from '@/types/permission';

// 导入事件类型
import {
  ToolbarActions,
  TableActions,
  DialogActions,
  PaginationActions,
  type ToolbarActionEvent,
  type TableActionEvent,
  type DialogActionEvent,
  type PaginationActionEvent,
} from '@/types/EventTypes';

// 导入 composables
import { useTableManager } from '@/composables/useTableManager';
import { usePagination } from '@/composables/usePagination';

// 导入组件
import Toolbar from './components/toolbar/index.vue';
import PermissionTable from './components/permission-table/index.vue';
import PermissionDialog from './components/permission-dialog/index.vue';
import Pagination from './components/pagination/index.vue';

// ==================== 状态层 ====================
// 表格数据管理
const tableManager = useTableManager(mockPermissions); //初始化数据
const { tableData, selectedRows, total } = tableManager;

// 分页管理
const pagination = usePagination(tableData, 10);
const { paginatedData, currentPage, pageSize } = pagination;

// ==================== 展示层引用 ====================
const permissionDialogRef = ref();
const paginationRef = ref();

// 权限树数据已移动到PermissionDialog组件内部

// // 获取权限标签
// const getPermissionLabel = (value: string) => {
//   for (const group of permissionGroups) {
//     if (group.value === value) return group.label;
//     const child = group.children?.find((c: any) => c.value === value);
//     if (child) return child.label;
//   }
//   return value;
// };

// 初始化数据

// 搜索、添加、批量删除逻辑已移动到 Toolbar 组件内部

// 获取权限父子关系 (暂时保留，可能在其他地方使用)
// const getPermissionParentChild = (value: string) => {
//   for (const group of permissionGroups) {
//     if (group.value === value) return group.value;
//     const child = group.children?.find(c => c.value === value);
//     if (child) return `${group.value}：${child.value}`;
//   }
//   return value;
// };

// ==================== 事件分发器 ====================
// 表格操作处理
const handleTableAction = (event: TableActionEvent) => {
  switch (event.type) {
    case TableActions.SELECT:
      tableManager.setSelectedRows(event.payload);
      break;
    case TableActions.EDIT:
      // 调用对话框组件的编辑方法
      permissionDialogRef.value?.openEditDialog(event.payload);
      break;
    case TableActions.DELETE:
      handleDelete(event.payload);
      break;
  }
};

// 工具栏操作处理
const handleToolbarAction = (event: ToolbarActionEvent) => {
  switch (event.type) {
    case ToolbarActions.SEARCH:
      tableManager.replaceData(event.payload.tableData);
      pagination.resetPagination();
      break;
    case ToolbarActions.ADD:
      // 调用对话框组件的添加方法
      permissionDialogRef.value?.openAddDialog();
      break;
    case ToolbarActions.BATCH_DELETE:
      tableManager.replaceData(event.payload.tableData);
      tableManager.clearSelectedRows();
      pagination.resetPagination();
      break;
  }
};

// 对话框操作处理
const handleDialogAction = (event: DialogActionEvent) => {
  switch (event.type) {
    case DialogActions.SUBMIT:
      tableManager.replaceData(event.payload.tableData);
      // 分页会自动重新计算
      break;
  }
};

// 分页操作处理
const handlePaginationAction = (event: PaginationActionEvent) => {
  switch (event.type) {
    case PaginationActions.CHANGE:
      if (event.payload.type === 'size-change') {
        pagination.changePageSize(event.payload.pageSize);
      } else if (event.payload.type === 'current-change') {
        pagination.changePage(event.payload.currentPage);
      }
      break;
  }
};

// // 选择行变化
// const handleSelectionChange = (rows: Permission[]) => {
//   selectedRows.value = rows;
// };

// 删除角色
const handleDelete = (row: Permission) => {
  tableManager.deleteRow(row.id);
  // ElMessage.success('删除成功'); // 消息已在组件内部处理
};

// 批量删除逻辑已移动到 Toolbar 组件内部
// 权限树管理逻辑已移动到 PermissionDialog 组件内部
// 表单提交逻辑已移动到 PermissionDialog 组件内部
// 分页处理逻辑已移动到 Pagination 组件内部
</script>

<style lang="scss" src="@/styles/reset.scss"></style>

<style lang="scss" scoped>
.common-layout {
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;

  :deep(.el-container) {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  :deep(.el-header) {
    padding: 12px;
    margin: 0;
    border-bottom: 1px solid #dcdfe6;
  }

  :deep(.el-main) {
    --el-main-padding: 5px;
    margin: 0;
    height: calc(100vh - 120px);
    overflow: auto;
  }

  :deep(.el-footer) {
    padding: 10px 20px;
    margin: 0;
    border-top: 1px solid #dcdfe6;
  }
}

:deep(.el-button--primary) {
  --el-button-bg-color: #089ead;
  --el-button-border-color: #089ead;
  --el-button-hover-bg-color: #409eff;
  --el-button-hover-border-color: #409eff;
  --el-button-active-bg-color: #409eff;
  --el-button-active-border-color: #409eff;
}

:deep(.el-button--primary.is-plain) {
  --el-button-bg-color: transparent;
  --el-button-border-color: #089ead;
  --el-button-hover-bg-color: #409eff;
  --el-button-hover-border-color: #409eff;
  --el-button-active-bg-color: #409eff;
  --el-button-active-border-color: #409eff;
  color: #089ead;
}
</style>
