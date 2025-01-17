import { ipcMain } from "electron";
import { is } from "electron-util";

import channels from "./channels";
import type { IpcHandler, Register, Unregister } from "./ipc-handler";

export const systemIpcHandler: IpcHandler = () => {
  const register: Register = () => {
    ipcMain.handle(channels.system.isMacos, (): boolean => is.macos);
  };

  const unregister: Unregister = () => {
    ipcMain.removeHandler(channels.system.isMacos);
  };

  return { register, unregister };
};
