import { initialWalletDashboardOptions } from "@/constants";
import { Button, Typography } from "@/library";
import { useWalletStore } from "@/store";
import { stylesConfig } from "@/utils";
import React from "react";
import { FiClock, FiDollarSign, FiRotateCcw, FiX } from "react-icons/fi";
import { IoIosCheckmarkCircle } from "react-icons/io";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "home-sort");

type HomeSortProps = { onClose: () => void };

type SortOption = {
	id: string;
	label: string;
	icon: React.ReactNode;
	field: "timestamp" | "amount";
	order: 1 | -1;
};

export const Sort: React.FC<HomeSortProps> = ({ onClose }) => {
	const { sort, setSort } = useWalletStore();
	const options: Array<SortOption> = [
		{
			id: "timestamp-desc",
			label: "Recently Added",
			icon: <FiClock />,
			field: "timestamp",
			order: -1,
		},
		{
			id: "amount-desc",
			label: "Highest amount",
			icon: <FiDollarSign />,
			field: "amount",
			order: -1,
		},
		{
			id: "amount-asc",
			label: "Lowest amount",
			icon: <FiDollarSign />,
			field: "amount",
			order: 1,
		},
	];
	const isActive = (item: SortOption) => {
		return sort
			? sort.field === item.field && sort.order === item.order
			: false;
	};
	return (
		<div className={classes("")}>
			<div className={classes("-header")}>
				<span className={classes("-header-empty")} />
				<Typography>Sort By</Typography>
				<button onClick={onClose} className={classes("-close")}>
					<FiX />
				</button>
			</div>
			<div className={classes("-options")}>
				{options.map((item) => (
					<button
						key={`sort-option-${item.id}`}
						onClick={() => {
							setSort({
								field: item.field,
								order: item.order,
							});
						}}
						className={classes("-option", {
							"-option--active": isActive(item),
						})}
					>
						<div className={classes("-option__icon")}>
							{item.icon}
						</div>
						<Typography>{item.label}</Typography>
						{isActive(item) ? (
							<div className={classes("-option__checkmark")}>
								<IoIosCheckmarkCircle />
							</div>
						) : null}
					</button>
				))}
			</div>
			{sort ? (
				sort.field !== initialWalletDashboardOptions.sort?.field ||
				sort.order !== initialWalletDashboardOptions.sort?.order ? (
					<Button
						variant="outlined"
						onClick={() => {
							setSort(initialWalletDashboardOptions.sort);
						}}
						icon={<FiRotateCcw />}
						className={classes("-reset")}
					>
						Reset to default
					</Button>
				) : null
			) : null}
		</div>
	);
};
