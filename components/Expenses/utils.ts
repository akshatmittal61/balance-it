import { TAG_DICTIONARY } from "@/constants";

export const inferTagsFromTitle = (originalTitle: string): Array<string> => {
	const title = originalTitle.toLowerCase();
	const matchedTags = new Set<string>();

	for (const [tag, keywords] of Object.entries(TAG_DICTIONARY)) {
		if (keywords.some((keyword) => title.includes(keyword))) {
			matchedTags.add(tag);
		}
	}

	return Array.from(matchedTags);
};
