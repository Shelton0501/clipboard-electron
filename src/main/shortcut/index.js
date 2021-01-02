import { globalShortcut } from "electron";
import windowManager from "../windows";
export default () => {
  let mainWin = new windowManager().mainWindowSafe;

  try {
    globalShortcut.register("Alt+V", () => {
      mainWin.show();
    });
  } catch (e) {
    console.error("注册快捷键失败:", e.toString());
  }
};
