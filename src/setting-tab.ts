import { App, PluginSettingTab, Setting } from "obsidian";
import AutoFrontMatterPlugin from "../main";

export class AutoFrontMatterSettingTab extends PluginSettingTab {
  plugin: AutoFrontMatterPlugin;

  constructor(app: App, plugin: AutoFrontMatterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h1", { text: "Auto Front Matter" });

    new Setting(containerEl)
      .setName("Automatically update the front matter when a file changed")
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.auto).onChange(async (value) => {
          this.plugin.settings.auto = value;
          await this.plugin.saveSettings();
        })
      );
    new Setting(containerEl)
      .setName("Reorder front matter keys")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.isReorderRequired)
          .onChange(async (value) => {
            this.plugin.settings.isReorderRequired = value;
            await this.plugin.saveSettings();
          })
      );
    new Setting(containerEl).setName("Use title").addToggle((toggle) =>
      toggle
        .setValue(this.plugin.settings.isTitleRequired)
        .onChange(async (value) => {
          this.plugin.settings.isTitleRequired = value;
          await this.plugin.saveSettings();
        })
    );
    new Setting(containerEl).setName("Use id").addToggle((toggle) =>
      toggle
        .setValue(this.plugin.settings.isIdRequired)
        .onChange(async (value) => {
          this.plugin.settings.isIdRequired = value;
          await this.plugin.saveSettings();
        })
    );
    new Setting(containerEl).setName("Use datetimeCreate").addToggle((toggle) =>
      toggle
        .setValue(this.plugin.settings.isDatetimeCreateRequired)
        .onChange(async (value) => {
          this.plugin.settings.isDatetimeCreateRequired = value;
          await this.plugin.saveSettings();
        })
    );
    new Setting(containerEl).setName("Use datetimeUpdate").addToggle((toggle) =>
      toggle
        .setValue(this.plugin.settings.isDatetimeUpdateRequired)
        .onChange(async (value) => {
          this.plugin.settings.isDatetimeUpdateRequired = value;
          await this.plugin.saveSettings();
        })
    );
  }
}
