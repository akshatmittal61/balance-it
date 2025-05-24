import { Logger } from "@/log";
import { IUser } from "@/types";
import {
	convertToCommonDenominator,
	parseFraction,
	roundOff,
	simplifyFraction,
} from "@/utils";
import { distributionMethods } from "./assets";
import { DistributionMethod, ExpenseUser } from "./types";

export class ExpenseUtils {
	public static getAmount(
		value: string | number,
		method: DistributionMethod,
		values: Array<ExpenseUser["value"]>,
		totalAmount: number
	): number {
		const membersCount = values.length;
		if (method === distributionMethods.equal.id) {
			return totalAmount / membersCount;
		} else if (method === distributionMethods.percentage.id) {
			const numValue = value.toString().replace("%", "");
			return (totalAmount * +numValue) / 100;
		} else if (method === distributionMethods.shares.id) {
			const currentUserShares = +value;
			const totalShares = values
				.map((m) => +m)
				.reduce((a, b) => a + b, 0);
			return (totalAmount * currentUserShares) / totalShares;
		} else if (method === distributionMethods.fraction.id) {
			const [numerator, denominator] = value.toString().split("/");
			return (totalAmount * +numerator) / +denominator;
		} else {
			return +value;
		}
	}

	public static getFormattedValue(
		amount: number,
		method: DistributionMethod,
		amounts: Array<ExpenseUser["amount"]>,
		totalAmount: number
	): string | number {
		const membersCount = amounts.length;
		if (method === distributionMethods.equal.id) {
			if (amount === 0) return 0;
			return roundOff(totalAmount / membersCount, 2);
		} else if (method === distributionMethods.percentage.id) {
			return `${roundOff((amount * 100) / totalAmount, 2)}%`;
		} else if (method === distributionMethods.shares.id) {
			return this.getShareForMember(amount, amounts, totalAmount);
		} else if (method === distributionMethods.fraction.id) {
			return simplifyFraction(`${amount}/${totalAmount}`);
		} else {
			return amount;
		}
	}
	public static generateNewExpenseUser(
		user: IUser,
		method: DistributionMethod,
		currentMembers: Array<ExpenseUser>,
		totalAmount: number
	): ExpenseUser {
		const membersCount = currentMembers.length + 1;
		return {
			...user,
			amount:
				method === distributionMethods.equal.id
					? totalAmount / membersCount
					: 0,
			value:
				method === distributionMethods.equal.id
					? roundOff(totalAmount / membersCount, 2)
					: method === distributionMethods.percentage.id
						? "0%"
						: distributionMethods.fraction.id
							? `0/${membersCount}`
							: 0,
		};
	}
	public static getShareForMember(
		amount: number,
		amounts: Array<ExpenseUser["amount"]>,
		totalAmount: number
	): number {
		Logger.debug("in beg of get share", amount, amounts, totalAmount);
		const allFractions = amounts
			.map((ma) => ({
				numerator: ma,
				denominator: totalAmount,
			}))
			.map((m) => simplifyFraction(`${m.numerator}/${m.denominator}`));
		const fractionsWithCommonDenominator =
			convertToCommonDenominator(allFractions);
		const currFraction = fractionsWithCommonDenominator.find(
			(f) =>
				simplifyFraction(f) ===
				simplifyFraction(`${amount}/${totalAmount}`)
		);
		Logger.debug(
			"allFractions, fractionsWithCommonDenominator, currFraction",
			allFractions,
			fractionsWithCommonDenominator,
			currFraction
		);
		if (!currFraction) return 0;
		const parsed = parseFraction(currFraction);
		Logger.debug("parsed", parsed);
		if (typeof parsed === "string") return 0;
		return parsed.numerator;
	}
}
