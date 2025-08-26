import { createApp } from "vue";
import ErrorStackParser from "error-stack-parser";
import { getOriginalCode } from "./utils";
import router from "./router";
// import "./style.css";
import App from "./App.vue";
import "element-plus/dist/index.css";
import { ElMessage } from "element-plus";

const app = createApp(App);

app.config.errorHandler = (err: any, vm) => {
  // 解析错误获得错误栈
  console.log(err);
  const ErrorStack = ErrorStackParser.parse(err as Error);
  //   console.error("err", err, "ErrorStack", ErrorStack, "vm", vm);
  const jsError = {
    stack_frames: ErrorStack,
    message: err.message,
    stack: err.stack,
    error_name: err.name,
  };
  // getOriginalCode(ErrorStack[0]);
  // ✅ 用 ElMessage 代替 vm!.$message
  ElMessage.error(`您触发了一个 ${err.name} 错误`);
  localStorage.setItem("jsErrorList", JSON.stringify(jsError));
};

app.use(router).mount("#app");
