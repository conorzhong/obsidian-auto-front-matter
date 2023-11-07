import { ConfigProvider, theme } from "antd";
import { App, PluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import AutoFrontMatterPlugin from "../main";
import { Settings } from "./settings";

export class AutoFrontMatterSettingTab extends PluginSettingTab {
  plugin: AutoFrontMatterPlugin;
  root: Root | null = null;
  theme: "dark" | "light" = "dark";

  constructor(app: App, plugin: AutoFrontMatterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.plugin.registerEvent(
      plugin.app.workspace.on("css-change", () => {
        this.theme = document.body.classList.contains("theme-dark")
          ? "dark"
          : "light";
      })
    );
  }

  display(): void {
    this.root = createRoot(this.containerEl);
    this.root.render(
      <StrictMode>
        <ConfigProvider
          theme={{
            algorithm:
              this.theme === "dark"
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
            token: { colorPrimary: "#7756ec" },
          }}
        >
          <Settings plugin={this.plugin} />
        </ConfigProvider>
      </StrictMode>
    );
  }

  hide() {
    this.root?.unmount();
  }
}
