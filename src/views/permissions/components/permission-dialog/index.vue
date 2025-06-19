<script lang="ts" setup>
import { ref, reactive, computed } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import type { Permission } from '@/mock/permissions';

const props = defineProps<{
  modelValue: boolean;
  isEdit: boolean;
  permissionGroups: any[];
  editData?: Permission;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', formData: any): void;
}>();

const dialogVisible = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
});

const formRef = ref<FormInstance>();
const formLabelWidth = '140px';

const form = ref({
  id: 0,
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[],
});

const rules = reactive<FormRules>({
  roleName: [
    { required: true, message: '请输入角色名称', trigger: 'blur' },
    { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' },
  ],
});

const permissionTree = ref(
  props.permissionGroups.map(group => ({
    ...group,
    checked: false,
    indeterminate: false,
    children: group.children?.map(child => ({
      ...child,
      checked: false,
    })),
  }))
);

const resetPermissionTree = () => {
  permissionTree.value.forEach(group => {
    group.checked = false;
    group.indeterminate = false;
    group.children?.forEach(child => {
      child.checked = false;
    });
  });
};

const updatePermissionTree = (permissions: string[]) => {
  permissionTree.value.forEach(group => {
    if (group.children) {
      const childrenChecked = group.children.filter(child =>
        permissions.includes(child.value)
      );
      group.checked = childrenChecked.length === group.children.length;
      group.indeterminate =
        childrenChecked.length > 0 &&
        childrenChecked.length < group.children.length;
      group.children.forEach(child => {
        child.checked = permissions.includes(child.value);
      });
    } else {
      group.checked = permissions.includes(group.value);
    }
  });
};

const handleNoPermissionChange = (val: boolean) => {
  if (val) {
    resetPermissionTree();
  }
};

const handleGroupChange = (val: boolean, group: any) => {
  if (val) {
    form.value.noPermission = false;
  }

  if (group.children) {
    group.children.forEach((child: any) => {
      child.checked = val;
    });
    group.indeterminate = false;
  }

  updateCheckedPermissions();
};

const handleChildChange = (val: boolean, child: any, group: any) => {
  if (val) {
    form.value.noPermission = false;
  }

  if (group.children) {
    const checkedCount = group.children.filter((c: any) => c.checked).length;
    group.checked = checkedCount === group.children.length;
    group.indeterminate =
      checkedCount > 0 && checkedCount < group.children.length;
  }

  updateCheckedPermissions();
};

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
  form.value.checkedPermissions = permissions;
};

const handleCancel = () => {
  dialogVisible.value = false;
};

const handleSubmit = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(valid => {
    if (valid) {
      emit('submit', {
        ...form.value,
        permissions: form.value.noPermission
          ? []
          : form.value.checkedPermissions,
      });
    }
  });
};

// Initialize form data when editData changes
if (props.editData) {
  form.value = {
    id: props.editData.id,
    roleName: props.editData.roleName,
    noPermission: props.editData.permissions.length === 0,
    checkedPermissions: [...props.editData.permissions],
  };
  resetPermissionTree();
  updatePermissionTree(props.editData.permissions);
}
</script>

<template>
  <!--tanchuag-->
  <el-dialog
    v-model="dialogVisible"
    :title="isEdit ? '编辑医生端角色' : '添加医生端角色'"
    width="1000"
    style="text-align: center"
  >
    <el-form :model="form" :rules="rules" ref="formRef">
      <el-form-item
        label="医生端角色名称"
        :label-width="formLabelWidth"
        prop="roleName"
      >
        <el-input
          v-model="form.roleName"
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
            v-model="form.noPermission"
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
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss" scoped>
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

:deep(.el-dialog__headerbtn:hover .el-dialog__close) {
  color: #11d2c8;
}
</style>
