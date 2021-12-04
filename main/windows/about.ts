import { default as _openAboutWindow } from "about-window";
import { BrowserWindow } from "electron";
import path from "path";

let aboutWindow: BrowserWindow | undefined;

export const openAboutWindow = () => {
  if (aboutWindow && !aboutWindow.isDestroyed()) {
    aboutWindow.show();
    aboutWindow.focus();
    return;
  }

  aboutWindow = _openAboutWindow({
    icon_path: path.join(__dirname, "images", "app-icon.png"),
    product_name: "Proxy Doggo Switcher",
    copyright: "Copyright © 2021 Naoki Yamamoto",
    description:
      '<div>Icons made by <a href="https://www.flaticon.com/authors/vitaly-gorbachev" title="Vitaly Gorbachev">Vitaly Gorbachev</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div>',
    use_inner_html: true,
    package_json_dir: path.resolve(`${__dirname}/../`),
  });
};