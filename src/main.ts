import { createApp } from "vue";
import ErrorStackParser from "error-stack-parser";
import { getOriginalCode } from "./utils";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.config.errorHandler = (err, vm) => {
  // 解析错误获得错误栈
  const ErrorStack = ErrorStackParser.parse(err as Error);
  //   console.error("err", err, "ErrorStack", ErrorStack, "vm", vm);
  getOriginalCode(ErrorStack[0]);
};

app.mount("#app");
