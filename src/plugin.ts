import keyBy from "lodash-es/keyBy";
import { Plugin, TFile } from "obsidian";
import { AutoFrontMatterSettingTab } from "src/setting-tab";
import { notice } from "src/utils";
import { DEFAULT_SETTINGS, PluginSettings } from "./settings";

import { computeField } from "./field";

export default class AutoFrontMatterPlugin extends Plugin {
  settings: PluginSettings;
  async loadSettings() {
    this.settings = { ...DEFAULT_SETTINGS, ...(await this.loadData()) };
  }
  async saveSettings() {
    await this.saveData(this.settings);
  }

  async onload() {
    await this.loadSettings();
    this.addSettingTab(new AutoFrontMatterSettingTab(this.app, this));

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
        const hash = keyBy(this.settings.fieldOptions, "name");
        for (const key in hash) {
          if (Object.prototype.hasOwnProperty.call(hash, key)) {
            const element = hash[key];
            if (element.actionType === "none") {
              continue;
            } else if (element.actionType === "delete") {
              delete frontMatter[element.name];
            } else if (element.actionType === "update") {
              const nextValue = computeField(element, file);
              frontMatter[element.name] = nextValue;
            } else if (element.actionType === "append") {
              const nextValue = computeField(element, file);
              const value = frontMatter[element.name];
              if (!value) {
                // empty
                frontMatter[element.name] = [nextValue];
              } else if (!Array.isArray(value)) {
                // single, not array
                if (value !== nextValue) {
                  frontMatter[element.name] = [value, nextValue];
                }
              } else {
                // array
                if (!value.includes(nextValue)) {
                  value.push(nextValue);
                }
              }
            } else if (element.actionType === "once") {
              const nextValue = computeField(element, file);
              const value = frontMatter[element.name];
              if (!value) {
                // empty
                frontMatter[element.name] = nextValue;
              }
            }
          }
        }
      });
    } catch (e) {
      notice("happened an error, please check your front matter");
    }
  }
}
