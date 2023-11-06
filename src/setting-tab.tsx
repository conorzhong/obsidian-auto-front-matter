import { ConfigProvider, theme } from "antd";
import { App, PluginSettingTab } from "obsidian";
import { StrictMode } from "react";
import { Root, createRoot } from "react-dom/client";
import AutoFrontMatterPlugin from "../main";
import { Settings } from "./settings";

export class AutoFrontMatterSettingTab extends PluginSettingTab {
  plugin: AutoFrontMatterPlugin;
  root: Root | null = null;

  constructor(app: App, plugin: AutoFrontMatterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    this.root = createRoot(this.containerEl);
    this.root.render(
      <StrictMode>
        <ConfigProvider
          theme={{
            algorithm: theme.darkAlgorithm,
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
