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
          @search="handleSearch"
          @add="handleAdd"
          @batch-delete="handleBatchDelete"
        />
      </el-header>

      <PermissionTable
        :table-data="filteredTableData"
        :permission-groups="permissionGroups"
        @selection-change="handleSelectionChange"
        @edit="handleEdit"
        @delete="handleDelete"
      />

      <PermissionDialog
        v-model:visible="dialogFormVisible"
        :is-edit="isEdit"
        :permission-form="permissionForm"
        :permission-tree="permissionTree"
        @submit="submitForm"
        @no-permission-change="handleNoPermissionChange"
        @group-change="handleGroupChange"
        @child-change="handleChildChange"
      />

      <el-footer>
        <Pagination
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import {
  mockPermissions,
  permissionGroups,
  type Permission,
} from '@/mock/permissions';

// 导入组件
import Toolbar from './components/toolbar/index.vue';
import PermissionTable from './components/permission-table/index.vue';
import PermissionDialog from './components/permission-dialog/index.vue';
import Pagination from './components/pagination/index.vue';

// 表格数据
const tableData = ref<Permission[]>([]);
const selectedRows = ref<Permission[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 对话框相关
const dialogFormVisible = ref(false);
const isEdit = ref(false);

// 表单数据
const permissionForm = ref({
  id: 0,
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[],
});

// 权限树数据
const permissionTree = ref(
  permissionGroups.map((group: any) => ({
    ...group,
    checked: false,
    indeterminate: false,
    children: group.children?.map((child: any) => ({
      ...child,
      checked: false,
    })),
  }))
);

// 计算属性：过滤后的表格数据
const filteredTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.value.slice(start, end);
});

// 初始化数据
onMounted(() => {
  tableData.value = [...mockPermissions];
  total.value = tableData.value.length;
});

// 搜索处理
const handleSearch = (query: string) => {
  if (!query) {
    tableData.value = [...mockPermissions];
  } else {
    tableData.value = mockPermissions.filter(
      (item: any) =>
        item.roleName.toLowerCase().includes(query.toLowerCase()) ||
        item.permissions.some((p: string) =>
          getPermissionLabel(p).toLowerCase().includes(query.toLowerCase())
        )
    );
  }
  total.value = tableData.value.length;
  currentPage.value = 1;
};

// 获取权限标签
const getPermissionLabel = (value: string) => {
  for (const group of permissionGroups) {
    if (group.value === value) return group.label;
    const child = group.children?.find((c: any) => c.value === value);
    if (child) return child.label;
  }
  return value;
};

// 获取权限父子关系 (暂时保留，可能在其他地方使用)
// const getPermissionParentChild = (value: string) => {
//   for (const group of permissionGroups) {
//     if (group.value === value) return group.value;
//     const child = group.children?.find(c => c.value === value);
//     if (child) return `${group.value}：${child.value}`;
//   }
//   return value;
// };

// 选择行变化
const handleSelectionChange = (rows: Permission[]) => {
  selectedRows.value = rows;
};

// 添加角色
const handleAdd = () => {
  isEdit.value = false;
  permissionForm.value = {
    id: 0,
    roleName: '',
    noPermission: false,
    checkedPermissions: [],
  };
  resetPermissionTree();
  dialogFormVisible.value = true;
};

// 编辑角色
const handleEdit = (row: Permission) => {
  isEdit.value = true;
  permissionForm.value = {
    id: row.id,
    roleName: row.roleName,
    noPermission: row.permissions.length === 0,
    checkedPermissions: [...row.permissions],
  };
  resetPermissionTree();
  updatePermissionTree(row.permissions);
  dialogFormVisible.value = true;
};

// 删除角色
const handleDelete = (row: Permission) => {
  ElMessageBox.confirm('确定要删除该角色吗？', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      const index = tableData.value.findIndex(
        (item: Permission) => item.id === row.id
      );
      if (index !== -1) {
        tableData.value.splice(index, 1);
        total.value = tableData.value.length;
        ElMessage.success('删除成功');
      }
    })
    .catch(() => {});
};

// 批量删除
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) return;

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 个角色吗？`,
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      const ids = selectedRows.value.map((row: Permission) => row.id);
      tableData.value = tableData.value.filter(
        (item: Permission) => !ids.includes(item.id)
      );
      total.value = tableData.value.length;
      ElMessage.success('批量删除成功');
    })
    .catch(() => {});
};

// 重置权限树
const resetPermissionTree = () => {
  permissionTree.value.forEach((group: any) => {
    group.checked = false;
    group.indeterminate = false;
    group.children?.forEach((child: any) => {
      child.checked = false;
    });
  });
};

// 更新权限树
const updatePermissionTree = (permissions: string[]) => {
  permissionTree.value.forEach((group: any) => {
    if (group.children) {
      const childrenChecked = group.children.filter((child: any) =>
        permissions.includes(child.value)
      );
      group.checked = childrenChecked.length === group.children.length;
      group.indeterminate =
        childrenChecked.length > 0 &&
        childrenChecked.length < group.children.length;
      group.children.forEach((child: any) => {
        child.checked = permissions.includes(child.value);
      });
    } else {
      group.checked = permissions.includes(group.value);
    }
  });
};

// 无权限变更
const handleNoPermissionChange = (val: boolean) => {
  if (val) {
    resetPermissionTree();
  }
};

// 组权限变更
const handleGroupChange = (val: boolean, group: any) => {
  if (val) {
    permissionForm.value.noPermission = false;
  }

  if (group.children) {
    group.children.forEach((child: any) => {
      child.checked = val;
    });
    group.indeterminate = false;
  }

  updateCheckedPermissions();
};

// 子权限变更
const handleChildChange = (val: boolean, child: any, group: any) => {
  if (val) {
    permissionForm.value.noPermission = false;
  }

  if (group.children) {
    const checkedCount = group.children.filter((c: any) => c.checked).length;
    group.checked = checkedCount === group.children.length;
    group.indeterminate =
      checkedCount > 0 && checkedCount < group.children.length;
  }
  if (child) {
    console.log(child);
  }
  updateCheckedPermissions();
};

// 更新选中的权限
const updateCheckedPermissions = () => {
  const permissions: string[] = [];
  permissionTree.value.forEach((group: any) => {
    if (group.checked) {
      permissions.push(group.value);
    }
    group.children?.forEach((child: any) => {
      if (child.checked) {
        permissions.push(child.value);
      }
    });
  });
  permissionForm.value.checkedPermissions = permissions;
};

// 提交表单
const submitForm = (formData: any) => {
  const now = new Date().toISOString();
  const permissions = formData.noPermission
    ? []
    : permissionForm.value.checkedPermissions;

  if (isEdit.value) {
    // 编辑现有角色
    const index = tableData.value.findIndex(
      (item: Permission) => item.id === permissionForm.value.id
    );
    if (index !== -1) {
      tableData.value[index] = {
        ...tableData.value[index],
        roleName: formData.roleName,
        permissions,
        updateTime: now,
      };
      ElMessage.success('编辑成功');
    }
  } else {
    // 添加新角色
    const newRole: Permission = {
      id: Math.max(...tableData.value.map((item: Permission) => item.id)) + 1,
      roleName: formData.roleName,
      permissions,
      createTime: now,
      updateTime: now,
      status: 'active',
    };
    tableData.value.unshift(newRole);
    total.value = tableData.value.length;
    ElMessage.success('添加成功');
  }

  dialogFormVisible.value = false;
};

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};

const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};
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
