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
		if (method === distributionMethods.equal) {
			return totalAmount / membersCount;
		} else if (method === distributionMethods.percentage) {
			const numValue = value.toString().replace("%", "");
			return (totalAmount * +numValue) / 100;
		} else if (method === distributionMethods.fraction) {
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
		if (method === distributionMethods.equal) {
			if (amount === 0) return 0;
			return roundOff(totalAmount / membersCount, 2);
		} else if (method === distributionMethods.percentage) {
			return `${roundOff((amount * 100) / totalAmount, 2)}%`;
		} else if (method === distributionMethods.fraction) {
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
				method === distributionMethods.equal
					? totalAmount / totalMembers
					: 0,
			value:
				method === distributionMethods.equal
					? roundOff(totalAmount / totalMembers, 2)
					: method === distributionMethods.percentage
						? "0%"
						: distributionMethods.fraction
							? `0/${totalMembers}`
							: 0,
		};
	}
}
