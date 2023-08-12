import isUndefined from "lodash-es/isUndefined";
import { customAlphabet } from "nanoid";
import { Plugin, TFile, moment } from "obsidian";
import { AutoFrontMatterSettingTab } from "src/setting-tab";
import { notice } from "src/utils";

const nanoid = customAlphabet("1234567890abcdef", 10);

interface PluginSettings {
  auto: boolean;
  isReorderRequired: boolean;
  isTitleRequired: boolean;
  isIdRequired: boolean;
  isDatetimeCreateRequired: boolean;
  isDatetimeUpdateRequired: boolean;
}

const DEFAULT_SETTINGS: PluginSettings = {
  auto: false,
  isReorderRequired: false,
  isTitleRequired: false,
  isIdRequired: false,
  isDatetimeCreateRequired: false,
  isDatetimeUpdateRequired: false,
};

export default class AutoFrontMatterPlugin extends Plugin {
  settings: PluginSettings;

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoFrontMatterSettingTab(this.app, this));

    // event
    this.registerEvent(
      this.app.vault.on("modify", async (file) => {
        if (this.settings.auto) {
          if (file instanceof TFile) {
            this.updateFrontMatter(file);
          }
        }
      })
    );
    this.registerEvent(
      this.app.vault.on("rename", async (file) => {
        if (this.settings.auto) {
          if (file instanceof TFile) {
            this.updateFrontMatter(file);
          }
        }
      })
    );

    // command
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
        if (this.settings.isTitleRequired) {
          frontMatter.title = file.basename;
        }
        // id
        if (this.settings.isIdRequired && isUndefined(frontMatter.id)) {
          frontMatter.id = nanoid();
        }
        // datetimeCreate
        if (
          this.settings.isDatetimeCreateRequired &&
          isUndefined(frontMatter.datetimeCreate)
        ) {
          frontMatter.datetimeCreate = moment(file.stat.ctime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        // datetimeUpdate
        if (this.settings.isDatetimeUpdateRequired) {
          frontMatter.datetimeUpdate = moment(file.stat.mtime).format(
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        // reorder these keys
        // simply delete and add
        if (this.settings.isReorderRequired) {
          const oldFrontMatter = { ...frontMatter };
          delete frontMatter.title;
          delete frontMatter.id;
          delete frontMatter.datetimeCreate;
          delete frontMatter.datetimeUpdate;
          frontMatter.title = oldFrontMatter.title;
          frontMatter.id = oldFrontMatter.id;
          frontMatter.datetimeCreate = oldFrontMatter.datetimeCreate;
          frontMatter.datetimeUpdate = oldFrontMatter.datetimeUpdate;
        }
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
