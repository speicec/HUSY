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

      <el-dialog v-model="dialogFormVisible" title="角色编辑" width="500">
        <el-form :model="permissionForm">
          <!-- 第一行 -->
          <el-form-item label="医生端角色名称" :label-width="formLabelWidth">
            <el-input v-model="permissionForm.roleName" autocomplete="off" />
          </el-form-item>

          <!-- 第二行 -->
          <el-form-item label="医生端权限" :label-width="formLabelWidth" required>
            <el-checkbox
              v-model="permissionForm.noPermission"
              @change="handleNoPermissionChange"
            >无医生端权限</el-checkbox>

            <el-cascader
              v-model="permissionForm.checkedPermissions"
              :options="permissionTree"
              :props="{
                multiple: true,
                checkStrictly: true,
                emitPath: false,
                value: 'value',
                label: 'label',
                children: 'children'
              }"
              collapse-tags
              collapse-tags-tooltip
              class="w-full"
              placeholder="请选择权限"
            />
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
}

const dialogFormVisible = ref(false);
const formLabelWidth = '140px';

const permissionForm = ref({
  roleName: '',
  noPermission: false,
  checkedPermissions: [] as string[]
});

const permissionTree: Permission[] = [
  {
    label: '总览',
    value: 'group-a',
    children: [
      { label: '查看患者详情', value: 'ckhzxq' },
      { label: '术前访视', value: 'sqfs' },
      { label: '预警申报', value: 'yjsb' }
    ]
  },
  {
    label: '排班',
    value: 'group-b',
    children: [
      { label: '查看个人排班', value: 'ckgrpb' },
      { label: '查看全科排班', value: 'ckqkpb' }
    ]
  },
  {
    label: '访视',
    value: 'group-c',
    children: [
      { label: '查看个人访视', value: 'ckgrfs' },
      { label: '查看全科访视', value: 'ckqkfs' }
    ]
  },
  {
    label: '预警',
    value: 'group-d',
    children: [
      { label: '查看报警详情', value: 'ckbjxq' },
      { label: '处理报警', value: 'clbj' }
    ]
  },
  {
    label: '工作量统计',
    value: 'group-e',
    children: [
      { label: '查看个人工作量', value: 'ckgrgzl' },
      { label: '查看全科工作量', value: 'ckqkgzl' }
    ]
  },
  {
    label: '查看个人工作报告',
    value: 'group-f'

  }
];

function handleNoPermissionChange(val: boolean) {
  if (val) {
    permissionForm.value.checkedPermissions = [];
  }
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
</style>
