<template>
  <div class="common-layout">
    <el-container  style="margin: 0;weight:100%">
      <el-header class="flex justify-between items-center px-4 h-16">
        <!-- 左侧 -->
        <div class="slogn font-bold text-lg" style="margin-left: 5px ;font-weight: bold">
          医生端角色列表
        </div>

        <!-- 右侧 -->
        <div class="flex items-center space-x-2">
          <div class="Search-input flex">
            <el-input
                v-model="searchQuery"
                placeholder="搜索角色信息"
                class="flex-1"
            >
            </el-input>
            <div class="Search-btn -ml-1">
              <el-button @click="handleSearch" type="primary"> <el-icon><Search /></el-icon></el-button>
            </div>
          </div>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>

            添加角色</el-button>
          <el-button type="danger" @click="handleBatchDelete" :disabled="!selectedRows.length">

            <el-icon><DeleteFilled /></el-icon>
            批量删除</el-button>
        </div>
      </el-header>

      <el-main>
        <el-table
          :data="filteredTableData"
          style="width: 100%"
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column fixed="left" label="序号" width="120">
            <template #default="{ row }">
              <div class="w-[120px] truncate">{{ row.id }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="roleName" label="角色名称" width="180" />
          <el-table-column prop="permissions" label="系统权限" min-width="980">
            <template #default="{ row }">
              <div class="permissions-content">
                <div v-for="(children, parent) in getGroupedPermissions(row.permissions)" :key="parent" class="permissions-item">
                  <div>{{ parent }}：{{ children.join('，') }}；</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <!--          <el-table-column prop="status" label="状态" width="100">-->
          <!--            <template #default="{ row }">-->
          <!--              <el-tag :type="row.status === 'active' ? 'success' : 'info'">-->
          <!--                {{ row.status === 'active' ? '启用' : '禁用' }}-->
          <!--              </el-tag>-->
          <!--            </template>-->
          <!--          </el-table-column>-->
          <!--          <el-table-column prop="createTime" label="创建时间" width="180" />-->
          <!--          <el-table-column prop="updateTime" label="更新时间" width="180" />-->

          <el-table-column fixed="right" label="操作" min-width="120" style="text-align: left">
            <template #default="{ row }">
              <div class="min-w-[100px] flex justify-end gap-2 pr-2">
                <el-button type="primary" plain @click="handleEdit(row)"  text>编辑</el-button>
                <el-button type="danger" @click="handleDelete(row)" text style="margin-left: 0">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-dialog
        v-model="dialogFormVisible"
        :title="isEdit ? '编辑医生端角色' : '添加医生端角色'"
        width="1000"
        style="text-align: center;"
      >
        <el-form :model="permissionForm" :rules="rules" ref="formRef">
          <el-form-item label="医生端角色名称" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="permissionForm.roleName" placeholder="请输入医生端角色信息" autocomplete="off" />
          </el-form-item>

          <el-form-item label="医生端权限" :label-width="formLabelWidth" required class="permission-form-item">
            <div class="permission-header">
              <el-checkbox
                v-model="permissionForm.noPermission"
                @change="handleNoPermissionChange"
              >无医生端权限</el-checkbox>
            </div>

            <div class="permission-checkbox-group">
              <div v-for="group in permissionTree" :key="group.value" class="permission-group">
                <el-checkbox
                  v-model="group.checked"
                  :indeterminate="group.indeterminate"
                  @change="(val) => handleGroupChange(val, group)"
                  style="font-weight: bold;"
                >
                  {{ group.label }}
                </el-checkbox>
                <div class="children-group">
                  <el-checkbox
                    v-for="child in group.children"
                    :key="child.value"
                    v-model="child.checked"
                    @change="(val) => handleChildChange(val, child, group)"
                  >
                    {{ child.label }}
                  </el-checkbox>
                </div>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-footer>
        <div class="custom" style="display: flex;justify-content: center">

          <el-pagination

            v-model:page-size="pageSize"
            v-model:current-page="currentPage"
            :pager-count="10"
            :page-sizes="[10, 20, 50, 100]"
            :background="true"
            layout="total, sizes,jumper,prev, pager, next,"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { Edit } from '@element-plus/icons-vue';
import { ref, reactive, computed, onMounted } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage, ElMessageBox } from 'element-plus';
import { mockPermissions, permissionGroups, type Permission } from '@/mock/permissions';
console.log(1111111111);
console.log(mockPermissions);

// 表格数据
const tableData = ref<Permission[]>([]);
const searchQuery = ref('');
const selectedRows = ref<Permission[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 对话框相关
const dialogFormVisible = ref(false);
const isEdit = ref(false);
const formRef = ref<FormInstance>();
const formLabelWidth = '140px';

// 表单数据
const permissionForm = ref({
  id: 0,
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[]
});

// 表单验证规则
const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
  ]
});

// 权限树数据
const permissionTree = ref(permissionGroups.map(group => ({
  ...group,
  checked: false,
  indeterminate: false,
  children: group.children?.map(child => ({
    ...child,
    checked: false
  }))
})));

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
const handleSearch = () => {
  if (!searchQuery.value) {
    tableData.value = [...mockPermissions];
  } else {
    tableData.value = mockPermissions.filter(item =>
      item.roleName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.permissions.some(p => getPermissionLabel(p).toLowerCase().includes(searchQuery.value.toLowerCase()))
    );
  }
  total.value = tableData.value.length;
  currentPage.value = 1;
};

// 获取权限标签
const getPermissionLabel = (value: string) => {
  for (const group of permissionGroups) {
    if (group.value === value) return group.label;
    const child = group.children?.find(c => c.value === value);
    if (child) return child.label;
  }
  return value;
};

// 获取权限父子关系
const getPermissionParentChild = (value: string) => {
  for (const group of permissionGroups) {
    if (group.value === value) return group.value;
    const child = group.children?.find(c => c.value === value);
    if (child) return `${group.value}：${child.value}`;
  }
  return value;
};

// 获取分组后的权限
const getGroupedPermissions = (permissions: string[]) => {
  const grouped: { [key: string]: string[] } = {};

  permissions.forEach(perm => {
    for (const group of permissionGroups) {
      const child = group.children?.find(c => c.value === perm);
      if (child) {
        if (!grouped[group.value]) {
          grouped[group.value] = [];
        }
        grouped[group.value].push(child.value);
        break;
      }
    }
  });

  return grouped;
};

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
    checkedPermissions: []
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
    checkedPermissions: [...row.permissions]
  };
  resetPermissionTree();
  updatePermissionTree(row.permissions);
  dialogFormVisible.value = true;
};

// 删除角色
const handleDelete = (row: Permission) => {
  ElMessageBox.confirm(
    '确定要删除该角色吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = tableData.value.findIndex(item => item.id === row.id);
    if (index !== -1) {
      tableData.value.splice(index, 1);
      total.value = tableData.value.length;
      ElMessage.success('删除成功');
    }
  }).catch(() => {});
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
      type: 'warning'
    }
  ).then(() => {
    const ids = selectedRows.value.map(row => row.id);
    tableData.value = tableData.value.filter(item => !ids.includes(item.id));
    total.value = tableData.value.length;
    ElMessage.success('批量删除成功');
  }).catch(() => {});
};

// 重置权限树
const resetPermissionTree = () => {
  permissionTree.value.forEach(group => {
    group.checked = false;
    group.indeterminate = false;
    group.children?.forEach(child => {
      child.checked = false;
    });
  });
};

// 更新权限树
const updatePermissionTree = (permissions: string[]) => {
  permissionTree.value.forEach(group => {
    if (group.children) {
      const childrenChecked = group.children.filter(child =>
        permissions.includes(child.value)
      );
      group.checked = childrenChecked.length === group.children.length;
      group.indeterminate = childrenChecked.length > 0 && childrenChecked.length < group.children.length;
      group.children.forEach(child => {
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
    group.indeterminate = checkedCount > 0 && checkedCount < group.children.length;
  }

  updateCheckedPermissions();
};

// 更新选中的权限
const updateCheckedPermissions = () => {
  const permissions: string[] = [];
  permissionTree.value.forEach(group => {
    if (group.checked) {
      permissions.push(group.value);
    }
    group.children?.forEach(child => {
      if (child.checked) {
        permissions.push(child.value);
      }
    });
  });
  permissionForm.value.checkedPermissions = permissions;
};

// 提交表单
const submitForm = async() => {
  if (!formRef.value) return;

  await formRef.value.validate((valid) => {
    if (valid) {
      const now = new Date().toISOString();
      const permissions = permissionForm.value.noPermission ? [] : permissionForm.value.checkedPermissions;

      if (isEdit.value) {
        // 编辑现有角色
        const index = tableData.value.findIndex(item => item.id === permissionForm.value.id);
        if (index !== -1) {
          tableData.value[index] = {
            ...tableData.value[index],
            roleName: permissionForm.value.roleName,
            permissions,
            updateTime: now
          };
          ElMessage.success('编辑成功');
        }
      } else {
        // 添加新角色
        const newRole: Permission = {
          id: Math.max(...tableData.value.map(item => item.id)) + 1,
          roleName: permissionForm.value.roleName,
          permissions,
          createTime: now,
          updateTime: now,
          status: 'active'
        };
        tableData.value.unshift(newRole);
        total.value = tableData.value.length;
        ElMessage.success('添加成功');
      }

      dialogFormVisible.value = false;
    }
  });
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
    padding: 0;
    margin: 0;
    border-bottom: 1px solid #dcdfe6;
  }

  :deep(.el-main) {
    :deep(.el-main) {
      --el-main-padding:5px
    }
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
  --el-button-bg-color: #11d2c8;
  --el-button-border-color: #11d2c8;
  --el-button-hover-bg-color: #409EFF;
  --el-button-hover-border-color: #409EFF;
  --el-button-active-bg-color: #409EFF;
  --el-button-active-border-color: #409EFF;
}

:deep(.el-button--primary.is-plain) {
  --el-button-bg-color: transparent;
  --el-button-border-color: #11d2c8;
  --el-button-hover-bg-color: #409EFF;
  --el-button-hover-border-color: #409EFF;
  --el-button-active-bg-color: #409EFF;
  --el-button-active-border-color:#409EFF;
  color: #11d2c8;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active) {
  background-color: #11d2c8;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #11d2c8;
  border-color: #11d2c8;
}

:deep(.el-checkbox__input.is-indeterminate .el-checkbox__inner) {
  background-color: #11d2c8;
  border-color: #11d2c8;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #11d2c8;
}

:deep(.el-tag--success) {
  --el-tag-bg-color: #11d2c8;
  --el-tag-border-color: #11d2c8;
  --el-tag-hover-color: #0fbdb4;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #11d2c8 inset;
}

:deep(.el-input__inner:focus) {
  border-color: #11d2c8;
}

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #11d2c8;
}

:deep(.el-pagination .el-select .el-input .el-input__inner:focus) {
  border-color: #11d2c8;
}

:deep(.el-pagination .el-select .el-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #11d2c8 inset;
}

:deep(.custom-tree) {
  .el-tree-node {
    display: inline-block;
    margin-right: 20px;
    vertical-align: top;
  }

  .el-tree-node__content {
    height: auto;
    padding: 8px 0;
  }

  .el-tree-node__label {
    font-weight: bold;
  }

  .el-tree-node__children {
    display: inline-block;
    margin-top: 8px;
  }

  .el-tree-node__children .el-tree-node {
    display: block;
    margin-right: 0;
  }

  .el-tree-node__children .el-tree-node__content {
    padding: 4px 0;
  }

  .el-tree-node__children .el-tree-node__label {
    font-weight: normal;
  }
}

.permission-form-item {
  :deep(.el-form-item__content) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.permission-header {
  margin-bottom: 5px;
  text-align: left;

  :deep(.el-checkbox) {
    margin-left: 0;
    font-weight: bold;
  }
}

.permission-checkbox-group {
  margin-top: 0;

  .permission-group {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .children-group {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-left: 24px;
    }
  }
}

:deep(.el-table) {
  .el-table__header-wrapper {
    th.el-table__cell {
      background-color: #11d2c8 !important;
      color: white;
      font-weight: bold;
    }
  }
}

.permissions-item{
  display: inline-block;
  text-align: center;
  line-height: 1.5;
}
.permissions-content{
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  width: 100%;
}


.Search-btn{

  display: inline-block;
  margin-right: 12px;
}
</style>

