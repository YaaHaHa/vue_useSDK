import { createApp } from "vue";
import ErrorStackParser from "error-stack-parser";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);

app.config.errorHandler = (err, vm) => {
  const ErrorStack = ErrorStackParser.parse(err as Error);
  console.error("err", err, "ErrorStack", ErrorStack, "vm", vm);
};

app.mount("#app");
