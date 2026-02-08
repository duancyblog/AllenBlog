import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function getConfigTheme(): LIGHT_DARK_MODE {
	return siteConfig.theme;
}

export function isThemeForced(): boolean {
	const configTheme = getConfigTheme();
	return configTheme === LIGHT_MODE || configTheme === DARK_MODE;
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	const htmlElement = document.documentElement;
	if (!htmlElement) return;
	
	switch (theme) {
		case LIGHT_MODE:
			htmlElement.classList.remove("dark");
			break;
		case DARK_MODE:
			htmlElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				htmlElement.classList.add("dark");
			} else {
				htmlElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	htmlElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	if (isThemeForced()) {
		applyThemeToDocument(getConfigTheme());
		return;
	}
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	if (isThemeForced()) {
		return getConfigTheme();
	}
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
