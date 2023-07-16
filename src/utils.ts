import { Notice } from "obsidian";

export const notice = (message: string) => {
	return new Notice(`Auto Front Matter: ${message}`);
};
