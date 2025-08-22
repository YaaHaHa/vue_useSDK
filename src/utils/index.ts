import axios from "axios";
import SouceMap from "source-map-js";
const MAP_URL = "";

// 获取报错源文件
export async function getOriginalCode(stackFrame: any) {
  const sourcemap = await axios.get(`${MAP_URL}/${stackFrame.fileName}.map`);
  const fileContent = sourcemap.data;
  // 解析map文件
  const smc = await new SouceMap.SourceMapConsumer(fileContent);
  // 通过报错的位置还原
  const originalPosition = smc.originalPositionFor({
    line: stackFrame.lineNumber,
    column: stackFrame.columnNumber,
  });
  // 获取真实错误代码
  const originalCode = smc.sourceContentFor(originalPosition.source);
  console.log("还原后的错误代码", originalCode);
  return originalCode;
}
