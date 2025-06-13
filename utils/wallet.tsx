import { expenseTypes, TAG_DICTIONARY } from "@/constants";
import { ExpensesBucket, ExpenseSpread } from "@/types";
import Image from "next/image";
import {
	PiBookBookmark,
	PiBowlFood,
	PiCar,
	PiCoins,
	PiConfetti,
	PiDevices,
	PiGameController,
	PiGift,
	PiHandbag,
	PiHash,
	PiHeartbeat,
	PiHouse,
	PiReceipt,
	PiTrash,
	PiUsers,
	PiWallet,
} from "react-icons/pi";
import { intersection } from "./functions";

export class WalletUtils {
	public static sortExpensesInMonths(
		expenses: Array<ExpenseSpread>
	): Array<ExpensesBucket> {
		const monthMap = new Map<string, ExpensesBucket>();

		expenses.forEach((expense) => {
			const date = new Date(expense.timestamp);
			const monthYear = `${date.toLocaleString("default", { month: "long" })} ${date.getFullYear()}`;
			const bucket = monthMap.get(monthYear) || {
				month: date.toLocaleString("default", { month: "long" }),
				year: date.getFullYear().toString(),
				expenses: [],
				total: 0,
				type: expense.type,
			};
			bucket.expenses.push(expense);
			if (expense.type === expenseTypes.PAID.id) {
				bucket.total -= expense.amount;
			} else if (expense.type === expenseTypes.RECEIVED.id) {
				bucket.total += expense.amount;
			}
			if (bucket.total < 0) {
				bucket.type = expenseTypes.PAID.id;
			} else if (bucket.total > 0) {
				bucket.type = expenseTypes.RECEIVED.id;
			}
			monthMap.set(monthYear, bucket);
		});

		return Array.from(monthMap.values()).sort(
			(a, b) =>
				new Date(`${b.month} ${b.year}`).getTime() -
				new Date(`${a.month} ${a.year}`).getTime()
		);
	}
	public static inferTagsFromTitle(originalTitle: string): Array<string> {
		const title = originalTitle.toLowerCase();
		const matchedTags = new Set<string>();

		for (const [tag, keywords] of Object.entries(TAG_DICTIONARY)) {
			if (keywords.some((keyword) => title.includes(keyword))) {
				matchedTags.add(tag);
			}
		}

		return Array.from(matchedTags);
	}

	public static getIcon(
		tags: Array<string>,
		title: string,
		className: string,
		icon?: string
	) {
		if (icon) {
			return <Image src={icon} alt={title} width={24} height={24} />;
		}
		let matched = intersection(tags || [], Object.keys(TAG_DICTIONARY));
		if (matched.length === 0) {
			matched = WalletUtils.inferTagsFromTitle(title);
		}
		if (matched.length > 0) {
			switch (matched[0]) {
				case "food":
				case "drinks":
					return <PiBowlFood className={className} />;
				case "commute":
				case "travel":
					return <PiCar className={className} />;
				case "entertainment":
				case "sports":
				case "games":
					return <PiGameController className={className} />;
				case "devices":
				case "mobile":
				case "laptop":
					return <PiDevices className={className} />;
				case "shopping":
					return <PiHandbag className={className} />;
				case "books":
					return <PiBookBookmark className={className} />;
				case "health":
					return <PiHeartbeat className={className} />;
				case "rent":
					return <PiHouse className={className} />;
				case "gift":
					return <PiGift className={className} />;
				case "salary":
				case "income":
				case "recharge":
					return <PiWallet className={className} />;
				case "investment":
					return <PiCoins className={className} />;
				case "bill":
				case "receipt":
					return <PiReceipt className={className} />;
				case "party":
				case "celebration":
					return <PiConfetti className={className} />;
				case "friend":
				case "family":
					return <PiUsers className={className} />;
				case "waste":
					return <PiTrash className={className} />;
				default:
					return <PiHash className={className} />;
			}
		}
		return <PiHash className={className} />;
	}
}
