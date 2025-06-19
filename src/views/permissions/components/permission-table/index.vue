<style lang="scss" scoped>
.permissions-item {
  display: inline-block;
  text-align: center;
  line-height: 1.5;
}

.permissions-content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 8px;
  text-align: center;
  width: 100%;
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

:deep(.el-button--primary.is-plain) {
  --el-button-bg-color: transparent;
  --el-button-border-color: #11d2c8;
  --el-button-hover-bg-color: #409eff;
  --el-button-hover-border-color: #409eff;
  --el-button-active-bg-color: #409eff;
  --el-button-active-border-color: #409eff;
  color: #11d2c8;
}

:deep(.el-button--danger.is-plain) {
  --el-button-bg-color: transparent;
  --el-button-border-color: #f56c6c;
  --el-button-hover-bg-color: #f56c6c;
  --el-button-hover-border-color: #f56c6c;
  --el-button-active-bg-color: #f56c6c;
  --el-button-active-border-color: #f56c6c;
  color: #f56c6c;
}
</style>
<script lang="ts" setup>
import { defineProps, defineEmits } from 'vue';
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

  permissions.forEach(perm => {
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
      <el-table-column
        prop="permissions"
        style="margin: auto"
        label="系统权限"
        min-width="980"
      >
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

      <!--          <el-table-column prop="status" label="状态" width="100">-->
      <!--            <template #default="{ row }">-->
      <!--              <el-tag :type="row.status === 'active' ? 'success' : 'info'">-->
      <!--                {{ row.status === 'active' ? '启用' : '禁用' }}-->
      <!--              </el-tag>-->
      <!--            </template>-->
      <!--          </el-table-column>-->
      <!--          <el-table-column prop="createTime" label="创建时间" width="180" />-->
      <!--          <el-table-column prop="updateTime" label="更新时间" width="180" />-->

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
