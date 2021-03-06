<template>
  <div class="user-manage wrapper-main">
    <div class="user-container">
      <div class="user-container-header">
        <el-input 
          class="search-input"
          v-model="searchInput" 
          placeholder="请输出查询账号"
          @keyup.enter.native="searchUser"
        >
          <i
            class="el-icon-search search-icon" 
            slot="suffix" 
            @click="searchUser"
          ></i>
        </el-input>
        <el-button size="small" type="primary" @click="showAdd">新增用户</el-button>
        <el-button size="small" type="danger" style="display: none;">批量删除</el-button>
      </div>
      <div class="user-container-table">
        <el-table
          stripe
          border
          :data="tableData"
          :loading="loading"
          style="width: 100%"
          @sort-change="changeTableSort"
        >
          <el-table-column
            type="selection"
            align="center"
            width="55"
          >
          </el-table-column>
          <el-table-column
            prop="user_cname"
            label="姓名"
          ></el-table-column>
          <el-table-column
            prop="user_name"
            label="账号"
          ></el-table-column>
          <el-table-column
            prop="user_password"
            label="密码"
          >{{'******'}}</el-table-column>
          <el-table-column
            prop="user_department"
            label="部门"
            :filters="[{ text: 'IT部', value: 'IT部' }, { text: '市场部', value: '市场部' }]"
            :filter-method="filterTag"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.user_department === 'IT部' ? 'success' : ''"
                size="mini"
                disable-transitions
              >{{scope.row.user_department}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="user_role"
            label="职位"
          ></el-table-column>
          <el-table-column
            sortable="custom"
            prop="article_count"
            label="发布博客总数"
            width="180"
          ></el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
          >
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看详情"
                placement="bottom"
              >
                <el-button 
                  @click="showDetail(scope.row)" 
                  size="small"
                  icon="el-icon-view"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="编辑当前行"
                placement="bottom"
              >
                <el-button 
                  @click="showEdit(scope.row)" 
                  size="small"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除当前行"
                placement="bottom"
              >
                <el-button 
                  @click="deleteRow(scope.row.id)"
                  size="small" 
                  type="danger"
                  icon="el-icon-delete"
                  circle
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="user-container-footer">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="100"
          layout="total, sizes, prev, pager, next, jumper"
          :total="100"
        ></el-pagination>
      </div>
    </div>
    <el-dialog
      title="用户详情"
      :visible.sync="detailVisible"
      :before-close="handleDetailClose"
      width="25%"
    >
      <user-detail :userDetail="userDetail"/>
    </el-dialog>
    <el-dialog
      :title="editTitle"
      :visible.sync="editVisible"
      v-if="editVisible"
      width="30%"
    >
      <user-edit :editData="editData" :editType="editType" @getUserList="getUserByChildren"/>
    </el-dialog>
  </div>
</template>

<script>
import {tableData} from './data'
import API from './api'
import UserDetail from './components/user-detail'
import UserEdit from './components/user-edit'

export default {
  name: 'user-manage',
  components: {
    UserDetail,
    UserEdit
  },
  data() {
    return {
      tableData,
      searchInput: '',
      currentPage: 2,
      detailVisible: false,
      editVisible: false,
      addVisible: false,
      loading: false,
      editTitle: '新增用户',
      editData: {},
      editType: 1, // 1,表示編輯，2,表示新增
      userDetail: {}
    }
  },
  created() {
    this.getUserInfo();
  },
  methods: {
    async getUserInfo() {
      try {
        this.loading = true;
        let result = await API.getUserInfo();
        let {code, message=[]} = result;
        if(code ===200) {
          this.tableData = message;
        }
        this.loading = false;
      }catch(e) {
        console.log(e);
      }
    },
    searchUser() {
      this.loading = true;
      if(this.searchInput === '') {
        this.getUserInfo();
      }else {
        this.getUserByUserName();
      }
    },
    async getUserByUserName() {
      try {
        let params = {
          user_name: this.searchInput
        }
        let result = await API.getUserByUserName(params)
        let {code, message=[]} = result;
        if(code === 200) {
          this.tableData = message;
        }
        this.loading = false;
      }catch(e) {
        console.log(e);
      }
    },
    handleSizeChange() {},
    handleCurrentChange() {},
    filterTag(value, row) {
      return row.user_department === value;
    },
    handleDetailClose() {
      this.detailVisible = false;
    },
    showDetail(data) {
      this.detailVisible = true;
      this.userDetail = data;
    },
    showEdit(data) {
      this.editTitle = '编辑用户';
      this.editVisible = true;
      this.editData = data;
      this.editType = 1;
    },
    showAdd() {
      this.editTitle = '新增用户'
      this.editVisible = true;
      this.editData = {};
      this.editType = 2;
    },
    deleteRow(id) {
      this.$confirm('确认删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        this.deleteUserById(id);
        this.loading = false;
        this.getUserInfo();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })     
      })
    },
    async deleteUserById(id) {
      try {
        let params = { id }
        let result = await API.deleteUserById(params);
        let {code} = result;
        if(200 === code) {
          this.$notify.success({ 
            message: '删除当前行成功！',
            showClose: false
          })
        }else {
          this.$notify.error({ 
            message: '删除当前行失败！',
            showClose: false
          })
        }
      }catch(e) {
        console.log(e)
      }
    },
    changeTableSort(val) {
      if(val.order === 'ascending') {
        this.sortOrder = 'ASC'
      }else {
        this.sortOrder = 'DESC'
      }
    },
    getUserByChildren() {
      this.editVisible = false;
      this.getUserInfo();
    }
  }
}
</script>

<style lang="less">
.user-manage {
  .user-container-header {
    width: 100%;
    margin-bottom: 32px;
    .search-input {
      width: 400px;
      margin-right: 8px;
      .search-icon {
        position: relative;
        margin: 10px;
        cursor: pointer;
      }
    }
  }
  .user-container-footer {
    background-color: #fff;
    margin-top: 24px;
    .el-pagination {
      text-align: right;
      .el-pagination__total {
        float: left;
      }
      .el-pagination__sizes {
        float: left;
      }
    }
  }
  .el-button+.el-button {
    margin-left: 8px;
  }
}
</style>