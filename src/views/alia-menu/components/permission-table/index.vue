<script lang="ts" setup>
import type { Permission } from '@/mock/permissions';

const props = defineProps<{
  tableData: Permission[];
  permissionGroups: any[];
}>();

const emit = defineEmits<{
  (e: 'selection-change', rows: Permission[]): void;
  (e: 'edit', row: Permission): void;
  (e: 'delete', row: Permission): void;
}>();

const handleSelectionChange = (rows: Permission[]) => {
  emit('selection-change', rows);
};

const handleEdit = (row: Permission) => {
  emit('edit', row);
};

const handleDelete = (row: Permission) => {
  emit('delete', row);
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
