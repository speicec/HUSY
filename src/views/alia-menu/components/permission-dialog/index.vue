<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import type { FormInstance, FormRules } from 'element-plus';
import { ElMessage } from 'element-plus';

const props = defineProps<{
  visible: boolean;
  isEdit: boolean;
  permissionForm: {
    id: number;
    roleName: string;
    noPermission: boolean;
    checkedPermissions: string[];
  };
  permissionTree: any[];
}>();

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'submit', formData: any): void;
  (e: 'no-permission-change', value: boolean): void;
  (e: 'group-change', value: boolean, group: any): void;
  (e: 'child-change', value: boolean, child: any, group: any): void;
}>();

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
const localForm = ref({
  id: 0,
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[],
});

// 监听props变化，同步到本地表单
watch(
  () => props.permissionForm,
  newForm => {
    localForm.value = { ...newForm };
  },
  { deep: true, immediate: true }
);

// 处理对话框关闭
const handleClose = () => {
  emit('update:visible', false);
};

// 处理无权限变更
const handleNoPermissionChange = (val: boolean) => {
  emit('no-permission-change', val);
};

// 处理组权限变更
const handleGroupChange = (val: boolean, group: any) => {
  emit('group-change', val, group);
};

// 处理子权限变更
const handleChildChange = (val: boolean, child: any, group: any) => {
  emit('child-change', val, child, group);
};

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return;

  await formRef.value.validate(valid => {
    if (valid) {
      emit('submit', localForm.value);
    }
  });
};
</script>

<template>
  <div class="dialog">
    <el-dialog
      :model-value="visible"
      @update:model-value="handleClose"
      :title="isEdit ? '编辑医生端角色' : '添加医生端角色'"
      width="800"
      style="text-align: center"
      class="custom-dialog"
    >
      <br />
      <el-form :model="localForm" :rules="rules" ref="formRef">
        <el-form-item
          label="医生端角色名称"
          :label-width="formLabelWidth"
          prop="roleName"
        >
          <el-input
            v-model="localForm.roleName"
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
              v-model="localForm.noPermission"
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
