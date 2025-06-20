<script lang="ts" setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import type { Permission } from '@/types/permission';
import { TableActions, type TableActionEvent } from '@/types/EventTypes';

const props = defineProps<{
  tableData: Permission[];
  permissionGroups: any[];
}>();

const emit = defineEmits<{
  (e: 'action', event: TableActionEvent): void;
}>();

// 选择变化处理
const handleSelectionChange = (rows: Permission[]) => {
  emit('action', { type: TableActions.SELECT, payload: rows });
};

// 内部编辑逻辑
const handleEdit = (row: Permission) => {
  emit('action', { type: TableActions.EDIT, payload: row });
};

// 内部删除逻辑
const handleDelete = async (row: Permission) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色 "${row.roleName}" 吗？`,
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    );

    emit('action', { type: TableActions.DELETE, payload: row });
    ElMessage.success('删除成功');
  } catch {
    ElMessage.info('已取消删除');
  }
};

const getGroupedPermissions = (permissions: string[]) => {
  const grouped: { [key: string]: string[] } = {};

  permissions.forEach((perm: string) => {
    for (const group of props.permissionGroups) {
      const child = group.children?.find((c: any) => c.value === perm);
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
</script>

<template>
  <el-main>
    <el-table
      :data="tableData"
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
            <!-- 显示无医生端权限 -->
            <div v-if="row.noPermission">无医生端权限</div>
            <!-- 显示具体权限 -->
            <div v-else>
              <div
                v-for="(children, parent) in getGroupedPermissions(
                  row.permissions
                )"
                :key="parent"
                class="permissions-item"
              >
                <div>{{ parent }}：{{ children.join('，') }}；</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作"
        min-width="120"
        style="text-align: left"
      >
        <template #default="{ row }">
          <div class="min-w-[100px] flex justify-end gap-2 pr-2">
            <el-button type="primary" plain @click="handleEdit(row)" text
              >编辑</el-button
            >
            <el-button
              type="danger"
              @click="handleDelete(row)"
              text
              style="margin-left: 0"
              >删除</el-button
            >
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<style lang="scss" scoped>
@import './style/index.scss';
</style>
