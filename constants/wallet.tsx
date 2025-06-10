import {
	ExpensesSummary,
	T_COMPONENT_THEME,
	T_EXPENSE_METHOD,
	T_EXPENSE_TYPE,
	WalletDashboardOptions,
	WalletFilterOptions,
} from "@/types";
import React from "react";
import { IconBaseProps } from "react-icons";
import { FaGooglePay } from "react-icons/fa6";
import { PiCreditCard, PiMoney, PiPiggyBank } from "react-icons/pi";
import {
	TbArrowLeftFromArc,
	TbArrowLeftToArc,
	TbRestore,
} from "react-icons/tb";
import { frontendBaseUrl } from "./variables";

export const expenseMethods: Record<
	T_EXPENSE_METHOD,
	{
		id: T_EXPENSE_METHOD;
		label: string;
		Icon: React.FC<IconBaseProps>;
		logo: string;
	}
> = {
	UPI: {
		id: "UPI",
		label: "UPI",
		Icon: (props?: IconBaseProps) => <FaGooglePay {...props} />,
		logo: `${frontendBaseUrl}/vectors/upi-logo.svg`,
	},
	CASH: {
		id: "CASH",
		label: "Cash",
		Icon: (props?: IconBaseProps) => <PiMoney {...props} />,
		logo: `${frontendBaseUrl}/vectors/cash-logo.svg`,
	},
	CARD: {
		id: "CARD",
		label: "Card",
		Icon: (props?: IconBaseProps) => <PiCreditCard {...props} />,
		logo: `${frontendBaseUrl}/images/card-logo.png`,
	},
	NETBANKING: {
		id: "NETBANKING",
		label: "Netbanking",
		Icon: (props?: IconBaseProps) => <PiPiggyBank {...props} />,
		logo: `${frontendBaseUrl}/images/netbanking-logo.png`,
	},
};

export const expenseTypes: Record<
	T_EXPENSE_TYPE,
	{
		id: T_EXPENSE_TYPE;
		label: string;
		Icon: React.FC<IconBaseProps>;
		theme: T_COMPONENT_THEME;
	}
> = {
	PAID: {
		id: "PAID",
		label: "Money Sent",
		Icon: (props?: IconBaseProps) => (
			<TbArrowLeftFromArc
				style={{
					color: "var(--material-red)",
					...(props?.style || {}),
				}}
				{...props}
			/>
		),
		theme: "error",
	},
	RECEIVED: {
		id: "RECEIVED",
		label: "Money Received",
		Icon: (props?: IconBaseProps) => (
			<TbArrowLeftToArc
				style={{
					color: "var(--material-green)",
					...(props?.style || {}),
				}}
				{...props}
			/>
		),
		theme: "success",
	},
	SELF: {
		id: "SELF",
		label: "Self Transfer",
		Icon: (props?: IconBaseProps) => (
			<TbRestore
				style={{
					color: "var(--material-blue)",
					...(props?.style || {}),
				}}
				{...props}
			/>
		),
		theme: "info",
	},
};

export const initialExpensesSummary: ExpensesSummary = {
	paid: 0,
	received: 0,
};

export const TAG_DICTIONARY: Record<string, string[]> = {
	food: [
		"food",
		"breakfast",
		"lunch",
		"dinner",
		"snack",
		"tea",
		"coffee",
		"restaurant",
		"pizza",
		"roll",
		"sandwich",
		"momos",
	],
	commute: [
		"uber",
		"ola",
		"auto",
		"rickshaw",
		"metro",
		"train",
		"flight",
		"cab",
		"ride",
		"travel",
	],
	entertainment: ["movie", "netflix", "game", "concert", "event", "fun"],
	shopping: ["grocery", "amazon", "shopping", "clothes", "shoes", "flipkart"],
	health: ["medicine", "hospital", "doctor", "checkup"],
	rent: ["rent", "room", "apartment", "flat"],
	gift: ["gift", "present", "birthday", "anniversary"],
};

export const initialWalletFilterOptions: WalletFilterOptions = {
	amount: {
		min: 0,
		max: 0,
	},
	timestamp: {
		begin: "",
		end: "",
	},
	tags: [],
	types: [],
	methods: [],
};

export const initialWalletDashboardOptions: WalletDashboardOptions = {
	sort: {
		field: "timestamp",
		order: -1, // Default to descending order of payment date
	},
	pagination: {
		page: 1,
		limit: 100, // Default to showing 100 expenses per page
	},
};
