import { moment } from "obsidian";
import { customAlphabet } from "nanoid";
import { App, Plugin, PluginSettingTab, Setting, TFile } from "obsidian";
import { notice } from "src/utils";
import isUndefined from "lodash-es/isUndefined";

const nanoid = customAlphabet("1234567890abcdef", 10);

interface PluginSettings {
  updateOnModify: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  updateOnModify: true,
};

export default class AutoFrontMatterPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoFrontMatterSettingTab(this.app, this));

    this.registerEvent(
      this.app.vault.on("modify", async (file) => {
        if (this.settings.updateOnModify) {
          if (file instanceof TFile) {
            this.updateFrontMatter(file);
          }
        }
      })
    );

    this.addCommand({
      id: "update-current-front-matter",
      name: "Update current front matter",
      editorCallback: (editor, ctx) => {
        if (ctx.file) {
          this.updateFrontMatter(ctx.file);
        }
      },
    });
  }

  onunload() {}

  async updateFrontMatter(file: TFile) {
    try {
      await this.app.fileManager.processFrontMatter(file, (frontMatter) => {
        // title
        if (isUndefined(frontMatter.title)) {
          frontMatter.title = file.name.replace(/\.[^.]+$/, "");
        }
        // id
        if (isUndefined(frontMatter.id)) {
          frontMatter.id = nanoid();
        }
        // datetimeCreate
        if (isUndefined(frontMatter.datetimeCreate)) {
          frontMatter.datetimeCreate = moment().format("YYYY-MM-DD HH:mm:ss");
        }
        // datetimeUpdate
        frontMatter.datetimeUpdate = moment().format("YYYY-MM-DD HH:mm:ss");
        // reorder these keys
        // simply delete and add
        const oldFrontMatter = { ...frontMatter };
        delete frontMatter.title;
        delete frontMatter.id;
        delete frontMatter.datetimeCreate;
        delete frontMatter.datetimeUpdate;
        frontMatter.title = oldFrontMatter.title;
        frontMatter.id = oldFrontMatter.id;
        frontMatter.datetimeCreate = oldFrontMatter.datetimeCreate;
        frontMatter.datetimeUpdate = oldFrontMatter.datetimeUpdate;
      });
    } catch (e) {
      notice("happened an error, please check your front matter");
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

class AutoFrontMatterSettingTab extends PluginSettingTab {
  plugin: AutoFrontMatterPlugin;

  constructor(app: App, plugin: AutoFrontMatterPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    new Setting(containerEl)
      .setName("Automatically update the front matter when a file changed")
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.updateOnModify)
          .onChange(async (value) => {
            this.plugin.settings.updateOnModify = value;
            await this.plugin.saveSettings();
          })
      );
  }
}
