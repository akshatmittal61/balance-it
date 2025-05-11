import {
	ExpensesSummary,
	T_COMPONENT_THEME,
	T_EXPENSE_METHOD,
	T_EXPENSE_TYPE,
} from "@/types";
import React from "react";
import { IconBaseProps } from "react-icons";
import {
	TbArrowLeftFromArc,
	TbArrowLeftToArc,
	TbRestore,
} from "react-icons/tb";
import { frontendBaseUrl } from "./variables";

export const expenseMethods: Record<
	T_EXPENSE_METHOD,
	{ id: T_EXPENSE_METHOD; label: string; logo: string }
> = {
	UPI: {
		id: "UPI",
		label: "UPI",
		logo: `${frontendBaseUrl}/vectors/upi-logo.svg`,
	},
	CASH: {
		id: "CASH",
		label: "Cash",
		logo: `${frontendBaseUrl}/vectors/cash-logo.svg`,
	},
	CARD: {
		id: "CARD",
		label: "Card",
		logo: `${frontendBaseUrl}/images/card-logo.png`,
	},
	NETBANKING: {
		id: "NETBANKING",
		label: "Netbanking",
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
		label: "Paid",
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
		label: "Received",
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
		label: "Self",
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
