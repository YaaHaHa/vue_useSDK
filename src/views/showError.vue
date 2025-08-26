<template>
  <div>
    <pre>
            {{ jsError.stack }}
        </pre
    >
    <div class="collapse">
      <el-collapse v-model="activeNames" @change="handleChange">
        <el-collapse-item
          v-for="(item, index) in jsError.stack_frames"
          :key="index"
          :name="index"
          :title="item.source"
        >
          <el-row :gutter="20">
            <el-col :span="20">
              <div>{{ item.fileName }}</div>
            </el-col>
            <el-col :span="4">
              <el-button
                type="primary"
                size="small"
                @click="openDialog(item, index)"
              >
                映射源码</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <template v-if="item.origin">
              <!-- <PreView :orgin="item.origin"></PreView> -->
              {{ item.orgin }}
            </template>
            <template v-else>
              <div>{{ item.fileName }}</div>
            </template>
          </el-row>
        </el-collapse-item>
      </el-collapse>
    </div>
    <el-dialog v-model="dialogVisible" title="soureMap源码映射" width="500">
      <el-tabs v-model="tabActiveName" class="demo-tabs">
        <el-tab-pane label="本地上传" name="local">
          <el-upload drag :before-upload="sourceMapUpload">
            <i class="el-icon-upload"></i>
            <div>将文件拖到此处，或者<em>点击上传</em></div>
          </el-upload>
        </el-tab-pane>
        <el-tab-pane label="远程加载" name="request">远程加载</el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ElMessage } from "element-plus";
import type { CollapseModelValue } from "element-plus";
import SouceMap from "source-map-js";
const dialogVisible = ref<Boolean>(false);
const tabActiveName = ref("local");
const jsError = JSON.parse(localStorage.getItem("jsErrorList") || "[]");
const activeNames = ref(["1"]);
let stackFrameObj = {
  line: 0,
  column: 0,
  index: 0,
};
const handleChange = (val: CollapseModelValue) => {
  console.log(val);
};
const openDialog = (item: any, index: number) => {
  dialogVisible.value = true;
  stackFrameObj.line = item.lineNumber;
  stackFrameObj.column = item.columnNumber;
  stackFrameObj.index = index;
};
const sourceMapUpload = (file: File) => {
  if (file.name.substring(file.name.lastIndexOf(".") + 1) !== "map") {
    ElMessage.error("请上传正确的sourceMap文件");
    return;
  }
  const reader: FileReader = new FileReader();
  reader.readAsText(file, "utf-8");
  reader.onload = (e) => {
    const result = e.target?.result;
    getSource(result, stackFrameObj.line, stackFrameObj.column);
  };
};
// 手写定位错误
const getSource = async (file: any, line: number, col: number) => {
  let smc = await new SouceMap.SourceMapConsumer(JSON.parse(file));
  // 拿到定位然后去找源码
  let originalPosition = smc.originalPositionFor({
    line: line, // 这里的行列是报错的行列
    column: col,
  });
  let originalCode = smc.sourceContentFor(originalPosition.source);
  return {
    originalCode,
    column: originalPosition.column,
    line: originalPosition.line,
  };
};
</script>
