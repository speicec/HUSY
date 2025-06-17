<template>
  <div class="common-layout">
    <el-container  style="margin: 0;weight:100%">
      <el-header class="flex justify-between items-center px-4 h-16">
        <!-- 左侧 -->
        <div class="slogn font-bold text-lg">
          医生端角色列表
        </div>

        <!-- 右侧 -->
        <div class="flex items-center space-x-2">
          <el-input placeholder="搜索角色信息" style="margin-right: 12px"></el-input>
          <el-button type="primary">添加角色</el-button>
          <el-button type="danger">批量删除</el-button>
        </div>
      </el-header>

      <el-main>
        <el-table :data="tableData" style="width: 100%" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column fixed="left" label="序号" width="120">
            <template #default="{ row }">
              <div class="w-[120px] truncate">{{ row.date }}</div>
            </template>
          </el-table-column>

          <el-table-column prop="permission" width="1000" label="系统权限" />

          <el-table-column fixed="right" label="操作" min-width="120">
            <template #default="{ row }">
              <div class="min-w-[100px] flex justify-end gap-2 pr-2">
                <el-button size="small" type="primary" plain @click="dialogFormVisible = true">编辑</el-button>
                <el-button size="small" type="danger">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-main>

      <el-dialog v-model="dialogFormVisible" title="角色编辑" width="1000" style="text-align: center">
        <el-form :model="permissionForm">
          <!-- 第一行 -->
          <el-form-item label="医生端角色名称" :label-width="formLabelWidth" required>
            <el-input v-model="permissionForm.roleName" autocomplete="off" />
          </el-form-item>

          <!-- 第二行 -->
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
            <el-button type="primary" @click="submit">
              确认
            </el-button>
          </div>
        </template>
      </el-dialog>

      <el-footer>
        <div class="demo-pagination-block">
          <el-pagination
            v-model:current-page="currentPage4"
            v-model:page-size="pageSize4"
            :page-sizes="[100, 200, 300, 400]"
            :size="size"
            :disabled="disabled"
            :background="background"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import type { ElTree } from 'element-plus';
import type { ComponentSize } from 'element-plus';

interface User {
  date: string
  name: string
  permission: string
}

interface Permission {
  label: string
  value: string
  children?: Permission[]
  checked?: boolean
  indeterminate?: boolean
}

const dialogFormVisible = ref(false);
const formLabelWidth = '140px';

const permissionForm = ref({
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[]
});

const permissionTree = ref<Permission[]>([
  {
    label: '总览',
    value: 'group-a',
    checked: false,
    indeterminate: false,
    children: [
      { label: '查看患者详情', value: 'ckhzxq', checked: false },
      { label: '术前访视', value: 'sqfs', checked: false },
      { label: '预警申报', value: 'yjsb', checked: false }
    ]
  },
  {
    label: '排班',
    value: 'group-b',
    checked: false,
    indeterminate: false,
    children: [
      { label: '查看个人排班', value: 'ckgrpb', checked: false },
      { label: '查看全科排班', value: 'ckqkpb', checked: false }
    ]
  },
  {
    label: '访视',
    value: 'group-c',
    checked: false,
    indeterminate: false,
    children: [
      { label: '查看个人访视', value: 'ckgrfs', checked: false },
      { label: '查看全科访视', value: 'ckqkfs', checked: false }
    ]
  },
  {
    label: '预警',
    value: 'group-d',
    checked: false,
    indeterminate: false,
    children: [
      { label: '查看报警详情', value: 'ckbjxq', checked: false },
      { label: '处理报警', value: 'clbj', checked: false }
    ]
  },
  {
    label: '工作量统计',
    value: 'group-e',
    checked: false,
    indeterminate: false,
    children: [
      { label: '查看个人工作量', value: 'ckgrgzl', checked: false },
      { label: '查看全科工作量', value: 'ckqkgzl', checked: false }
    ]
  },
  {
    label: '查看个人工作报告',
    value: 'group-f',
    checked: false,
    indeterminate: false
  }
]);

function handleNoPermissionChange(val: boolean) {
  if (val) {
    permissionTree.value.forEach(group => {
      group.checked = false;
      group.indeterminate = false;
      group.children?.forEach(child => {
        child.checked = false;
      });
    });
    updateCheckedPermissions();
  }
}

function handleGroupChange(val: boolean, group: Permission) {
  if (val) {
    permissionForm.value.noPermission = false;
  }
  
  group.children?.forEach(child => {
    child.checked = val;
  });
  group.indeterminate = false;
  
  updateCheckedPermissions();
}

function handleChildChange(val: boolean, child: Permission, group: Permission) {
  if (val) {
    permissionForm.value.noPermission = false;
  }
  
  const children = group.children || [];
  const checkedCount = children.filter(c => c.checked).length;
  group.checked = checkedCount === children.length;
  group.indeterminate = checkedCount > 0 && checkedCount < children.length;
  
  updateCheckedPermissions();
}

function updateCheckedPermissions() {
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
}

function submit() {
  console.log('提交内容:', permissionForm.value);
  dialogFormVisible.value = false;
}

const tableData: User[] = [
  {
    date: '2016-05-04',
    name: 'Aleyna Kutzner',
    permission: 'Lohrbergstr. 86c, Süd Lilli, Saarland'
  },
  {
    date: '2016-05-03',
    name: 'Helen Jacobi',
    permission: '760 A Street, South Frankfield, Illinois'
  },
  {
    date: '2016-05-02',
    name: 'Brandon Deckert',
    permission: 'Arnold-Ohletz-Str. 41a, Alt Malinascheid, Thüringen'
  },
  {
    date: '2016-05-01',
    name: 'Margie Smith',
    permission: '23618 Windsor Drive, West Ricardoview, Idaho'
  }
];

const currentPage4 = ref(1);
const pageSize4 = ref(100);
const size = ref<ComponentSize>('default');
const background = ref(false);
const disabled = ref(false);

const handleSizeChange = (val: number) => {
  console.log(`${val} items per page`);
};

const handleCurrentChange = (val: number) => {
  console.log(`current page: ${val}`);
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
    padding: 20px;
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
</style>

