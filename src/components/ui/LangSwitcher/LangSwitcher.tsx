"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import React from "react";

// List your supported locales here
const SUPPORTED_LOCALES = ["en", "id"];

export default function LanguageSwitcher() {
	const router = useRouter();
	const currentLocale = useLocale();

	// Get the next locale in the list (for a toggle button)
	const nextLocale =
		SUPPORTED_LOCALES[
			(SUPPORTED_LOCALES.indexOf(currentLocale) + 1) % SUPPORTED_LOCALES.length
		];

	const handleSwitch = () => {
		// Set the locale cookie (next-intl default is 'NEXT_LOCALE')
		document.cookie = `NEXT_LOCALE=${nextLocale}; path=/`;

		// Reload the page to apply the new locale
		router.refresh();
	};

	return (
		<button
			type="button"
			className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
			onClick={handleSwitch}
			aria-label={`Switch language to ${nextLocale}`}
		>
			{nextLocale.toUpperCase()}
		</button>
	);
}
