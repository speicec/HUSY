import { ref, computed, type Ref } from 'vue';
import type { Permission } from '@/types/permission';

/**
 * 表格数据管理 composable
 * 集中处理表格数据的增删改查操作
 */
export function useTableManager(initialData: Permission[]) {
  // 状态
  const tableData = ref<Permission[]>([...initialData]);
  const selectedRows = ref<Permission[]>([]);

  // 计算属性
  const total = computed(() => tableData.value.length);

  // 方法
  const replaceData = (newData: Permission[]) => {
    tableData.value = [...newData];
  };

  const addRow = (row: Permission) => {
    tableData.value.unshift(row);
  };

  const updateRow = (id: number, updatedRow: Partial<Permission>) => {
    const index = tableData.value.findIndex(item => item.id === id);
    if (index !== -1) {
      tableData.value[index] = { ...tableData.value[index], ...updatedRow };
    }
  };

  const deleteRow = (id: number) => {
    const index = tableData.value.findIndex(item => item.id === id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
    }
  };

  const deleteRows = (ids: number[]) => {
    tableData.value = tableData.value.filter(item => !ids.includes(item.id));
  };

  const setSelectedRows = (rows: Permission[]) => {
    selectedRows.value = [...rows];
  };

  const clearSelectedRows = () => {
    selectedRows.value = [];
  };

  const getNextId = () => {
    return Math.max(...tableData.value.map(item => item.id), 0) + 1;
  };

  // 搜索功能
  const searchData = (
    query: string,
    getPermissionLabel: (value: string) => string
  ) => {
    if (!query) {
      return [...initialData];
    }

    return initialData.filter(
      item =>
        item.roleName.toLowerCase().includes(query.toLowerCase()) ||
        (item.noPermission && '无医生端权限'.includes(query)) ||
        item.permissions.some(p =>
          getPermissionLabel(p).toLowerCase().includes(query.toLowerCase())
        )
    );
  };

  return {
    // 状态
    tableData: tableData as Ref<Permission[]>,
    selectedRows: selectedRows as Ref<Permission[]>,
    total,

    // 方法
    replaceData,
    addRow,
    updateRow,
    deleteRow,
    deleteRows,
    setSelectedRows,
    clearSelectedRows,
    getNextId,
    searchData,
  };
}
