<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';
import { permissionGroups } from '@/mock/permissions';
import type { Permission } from '@/types/permission';
import { DialogActions, type DialogActionEvent } from '@/types/EventTypes';

const props = defineProps<{
  tableData: Permission[];
  total: number;
}>();

const emit = defineEmits<{
  (e: 'action', event: DialogActionEvent): void;
}>();

// 内部状态管理
const dialogFormVisible = ref(false);
const isEdit = ref(false);

const formRef = ref<FormInstance>();
const formLabelWidth = '140px';

// 表单验证规则
const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
});

// 本地表单数据
const permissionForm = ref({
  id: 0,
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[],
});

// 权限树数据（内部管理）
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

// 打开对话框 - 添加模式
const openAddDialog = () => {
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

// 打开对话框 - 编辑模式
const openEditDialog = (row: Permission) => {
  isEdit.value = true;
  permissionForm.value = {
    id: row.id,
    roleName: row.roleName,
    noPermission: row.noPermission,
    checkedPermissions: [...row.permissions],
  };
  resetPermissionTree();
  if (row.permissions.length > 0) {
    updatePermissionTree(row.permissions);
  }
  dialogFormVisible.value = true;
};

// 监听外部事件
watch(
  () => props,
  () => {
    // 可以在这里处理外部数据变化
  },
  { deep: true }
);

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

// 处理对话框关闭
const handleClose = () => {
  dialogFormVisible.value = false;
};

// 处理无权限变更
const handleNoPermissionChange = (val: boolean) => {
  permissionForm.value.noPermission = val;
  if (val) {
    resetPermissionTree();
    permissionForm.value.checkedPermissions = [];
  }
};

// 处理组权限变更
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

// 处理子权限变更
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

  updateCheckedPermissions();
};

// 内部提交表单逻辑
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(valid => {
    if (valid) {
      // 确保权限数据是最新的
      updateCheckedPermissions();

      const now = new Date().toISOString();
      const permissions = permissionForm.value.noPermission
        ? []
        : permissionForm.value.checkedPermissions;

      const newTableData = [...props.tableData];
      let newTotal = props.total;

      if (isEdit.value) {
        // 编辑现有角色
        const index = newTableData.findIndex(
          (item: Permission) => item.id === permissionForm.value.id
        );
        if (index !== -1) {
          newTableData[index] = {
            ...newTableData[index],
            roleName: permissionForm.value.roleName,
            permissions,
            noPermission: permissionForm.value.noPermission,
            updateTime: now,
          };
          ElMessage.success('编辑成功');
        }
      } else {
        // 添加新角色
        const newRole: Permission = {
          id: Math.max(...newTableData.map((item: Permission) => item.id)) + 1,
          roleName: permissionForm.value.roleName,
          permissions,
          noPermission: permissionForm.value.noPermission,
          createTime: now,
          updateTime: now,
          status: 'active',
        };
        newTableData.unshift(newRole);
        newTotal = newTableData.length;
        ElMessage.success('添加成功');
      }

      // 通过 action 事件通知父组件更新数据
      emit('action', {
        type: DialogActions.SUBMIT,
        payload: {
          tableData: newTableData,
          total: newTotal,
        },
      });

      dialogFormVisible.value = false;
    }
  });
};

// 暴露方法给父组件调用
defineExpose({
  openAddDialog,
  openEditDialog,
});
</script>

<template>
  <div class="dialog">
    <el-dialog
      :model-value="dialogFormVisible"
      @update:model-value="handleClose"
      :title="isEdit ? '编辑医生端角色' : '添加医生端角色'"
      width="800"
      style="text-align: center"
      class="custom-dialog"
    >
      <br />
      <el-form :model="permissionForm" :rules="rules" ref="formRef">
        <el-form-item
          label="医生端角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input
            v-model="permissionForm.roleName"
            placeholder="请输入医生端角色信息"
            autocomplete="off"
          />
        </el-form-item>

        <el-form-item
          label="医生端权限"
          :label-width="formLabelWidth"
          required
          class="permission-form-item"
        >
          <div class="permission-header">
            <el-checkbox
              v-model="permissionForm.noPermission"
              @change="handleNoPermissionChange"
              >无医生端权限</el-checkbox
            >
          </div>

          <div class="permission-checkbox-group">
            <div
              v-for="group in permissionTree"
              :key="group.value"
              class="permission-group"
            >
              <el-checkbox
                v-model="group.checked"
                :indeterminate="group.indeterminate"
                @change="(val: any) => handleGroupChange(val, group)"
                style="font-weight: bold"
              >
                {{ group.value }}
              </el-checkbox>
              <div class="children-group">
                <el-checkbox
                  v-for="child in group.children"
                  :key="child.value"
                  v-model="child.checked"
                  @change="(val: any) => handleChildChange(val, child, group)"
                >
                  {{ child.value }}
                </el-checkbox>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose" color="#909399" class="dialog-button"
            >取消</el-button
          >
          <el-button color="#089ead" @click="submitForm" class="dialog-button">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
