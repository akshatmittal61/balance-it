import { expenseTypes } from "@/constants";
import { ExpensesBucket, ExpenseSpread } from "@/types";

export class WalletUtils {
	/* let allEvents = [...events];
		let newEvents = allEvents
			.map((ev) => ({
				...ev,
				date: new Date(ev.date),
			}))
			.sort((a, b) => b.date - a.date);
		let m1 = new Map();
		for (let event of newEvents) {
			let presentDate = `${moment(event.date).format("MMMM YYYY")}`;
			let a = m1.get(presentDate);
			if (!event.trashed) {
				if (!a) m1.set(presentDate, [event]);
				else m1.set(presentDate, [...a, event]);
			}
		}
		let newArr = [];
		for (const [key, value] of m1) {
			newArr = [
				...newArr,
				{
					month: key,
					eventsOfMonth: value,
				},
			];
		}
		setEventsToRender(newArr); */
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
}
