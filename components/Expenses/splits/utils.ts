import { IUser } from "@/types";
import { roundOff, simplifyFraction } from "@/utils";
import { distributionMethods } from "./assets";
import { DistributionMethod, ExpenseUser } from "./types";

export class ExpenseUtils {
	public static getAmount(
		value: string | number,
		method: DistributionMethod,
		membersCount: number,
		totalAmount: number
	): number {
		if (method === distributionMethods.equal.id) {
			return totalAmount / membersCount;
		} else if (method === distributionMethods.percentage.id) {
			const numValue = value.toString().replace("%", "");
			return (totalAmount * +numValue) / 100;
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
		membersCount: number,
		totalAmount: number
	): string | number {
		if (method === distributionMethods.equal.id) {
			if (amount === 0) return 0;
			return roundOff(totalAmount / membersCount, 2);
		} else if (method === distributionMethods.percentage.id) {
			return `${roundOff((amount * 100) / totalAmount, 2)}%`;
		} else if (method === distributionMethods.fraction.id) {
			return simplifyFraction(`${amount}/${totalAmount}`);
		} else {
			return amount;
		}
	}
	public static makeExpenseUser(
		user: IUser,
		method: DistributionMethod,
		totalMembers: number,
		totalAmount: number
	): ExpenseUser {
		return {
			...user,
			amount:
				method === distributionMethods.equal.id
					? totalAmount / totalMembers
					: 0,
			value:
				method === distributionMethods.equal.id
					? roundOff(totalAmount / totalMembers, 2)
					: method === distributionMethods.percentage.id
						? "0%"
						: distributionMethods.fraction.id
							? `0/${totalMembers}`
							: 0,
		};
	}
}
