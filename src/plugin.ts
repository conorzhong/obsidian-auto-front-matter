import { Plugin, TFile } from "obsidian";
import { AutoFrontMatterSettingTab } from "src/setting-tab";
import { notice } from "src/utils";
import { modifyFrontMatter } from "./field";
import { DEFAULT_SETTINGS, PluginSettings } from "./settings";
import { proxy, subscribe } from "valtio";

export default class AutoFrontMatterPlugin extends Plugin {
  settings = proxy<PluginSettings>(DEFAULT_SETTINGS);

  async onload() {
    this.unsubscribe = subscribe(this.settings, async () => {
      this.saveSettings();
    });

    await this.loadSettings();
    this.addSettingTab(new AutoFrontMatterSettingTab(this.app, this));

    // command
    this.addCommand({
      id: "update-current-front-matter",
      name: "Update current front matter",
      editorCallback: async (editor, ctx) => {
        if (ctx.file) {
          await this.updateFrontMatter(ctx.file);
        }
      },
    });
  }

  onunload() {
    this.unsubscribe();
  }

  async updateFrontMatter(file: TFile) {
    try {
      await this.app.fileManager.processFrontMatter(file, (frontMatter) => {
        modifyFrontMatter(frontMatter, this.settings.fieldOptions, file);
      });
    } catch (e) {
      notice("happened an error, please check your front matter");
    }
  }

  private unsubscribe: () => void;

  private async loadSettings() {
    const data = await this.loadData();
    this.settings.fieldOptions =
      data.fieldOptions || DEFAULT_SETTINGS.fieldOptions;
  }

  private async saveSettings() {
    await this.saveData(this.settings);
  }
}
