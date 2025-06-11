import { initialWalletFilterOptions } from "@/constants";
import { Button, IconButton, Input, Slider, Typography } from "@/library";
import { Logger } from "@/log";
import { useWalletStore } from "@/store";
import { WalletDashboardOptions } from "@/types";
import {
	isSameArray,
	isSameObject,
	roundOff,
	stylesConfig,
	WalletUtils,
} from "@/utils";
import dayjs from "dayjs";
import React, { useRef, useState } from "react";
import {
	FiCalendar,
	FiCheckCircle,
	FiDollarSign,
	FiRotateCcw,
	FiX,
} from "react-icons/fi";
import styles from "./styles.module.scss";

const classes = stylesConfig(styles, "home-filters");

type HomeFiltersProps = { onClose: () => void };

export const Filters: React.FC<HomeFiltersProps> = ({ onClose }) => {
	const { filterOptions, filters, setFilters } = useWalletStore();
	const [payload, setPayload] =
		useState<WalletDashboardOptions["filters"]>(filters);
	const tsBeginRef = useRef<HTMLInputElement>(null);
	const tsEndRef = useRef<HTMLInputElement>(null);
	const handleSelectTag = (tag: string) => {
		let tagsToSet = [];
		if (payload && payload.tags) {
			if (payload.tags.includes(tag)) {
				tagsToSet = payload.tags.filter((t) => t !== tag);
			} else {
				tagsToSet = [...payload.tags, tag];
			}
		} else {
			tagsToSet = [tag];
		}
		setPayload((prev) => ({
			...prev,
			tags: tagsToSet,
		}));
	};
	const isTagSelected = (tag: string) => {
		return (payload?.tags || []).includes(tag);
	};
	const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const formattedValue = dayjs(value).format("YYYY-MM-DDTHH:mm:ss.SSSZ");
		let tsToSet = payload?.timestamp;
		if (tsToSet) {
			if (name === "timestamp-begin") {
				tsToSet = {
					...tsToSet,
					begin: formattedValue,
				};
			} else if (name === "timestamp-end") {
				tsToSet = {
					...tsToSet,
					end: formattedValue,
				};
			}
		} else {
			tsToSet = {
				begin: initialWalletFilterOptions.timestamp.begin,
				end: initialWalletFilterOptions.timestamp.end,
			};
			if (name === "timestamp-begin") {
				tsToSet = {
					...tsToSet,
					begin: formattedValue,
				};
			} else if (name === "timestamp-end") {
				tsToSet = {
					...tsToSet,
					end: formattedValue,
				};
			}
		}
		setPayload((prev) => ({
			...prev,
			timestamp: tsToSet,
		}));
	};
	const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let amountToSet = payload?.amount;
		if (amountToSet) {
			if (name === "amount-min") {
				amountToSet = {
					...amountToSet,
					min: +value,
				};
			} else if (name === "amount-max") {
				amountToSet = {
					...amountToSet,
					max: +value,
				};
			}
		} else {
			amountToSet = {
				min: initialWalletFilterOptions.amount.min,
				max: initialWalletFilterOptions.amount.max,
			};
			if (name === "amount-min") {
				amountToSet = {
					...amountToSet,
					min: +value,
				};
			} else if (name === "amount-max") {
				amountToSet = {
					...amountToSet,
					max: +value,
				};
			}
		}
		setPayload((prev) => ({
			...prev,
			amount: amountToSet,
		}));
	};
	const resetFilters = () => {
		setFilters({
			amount: filterOptions.amount,
			timestamp: filterOptions.timestamp,
			tags: [],
		});
	};
	const applyFilters = () => {
		setFilters(payload);
	};
	return (
		<div className={classes("")}>
			<div className={classes("-header")}>
				<span className={classes("-header-empty")} />
				<Typography>Filters</Typography>
				<button onClick={onClose} className={classes("-close")}>
					<FiX />
				</button>
			</div>
			<div className={classes("-content")}>
				<div className={classes("-tags")}>
					{filterOptions.tags.map(({ tag }) => (
						<span
							key={`filters-tag-${tag}`}
							className={classes("-tag", {
								"-tag--active": isTagSelected(tag),
							})}
							onClick={(e) => {
								e.preventDefault();
								handleSelectTag(tag);
							}}
						>
							{WalletUtils.getIcon([tag], tag, "-tag__icon")}
							{tag}
						</span>
					))}
				</div>
				<hr className={classes("-divider")} />
				<div className={classes("-price-range")}>
					<Typography
						size="lg"
						className={classes("-price-range__heading")}
					>
						Price Range
					</Typography>
					<div
						className={classes(
							"-price-range__inputs",
							"-price-range__inputs--slider"
						)}
					>
						<Slider
							min={
								filterOptions.amount.min % 10 === 0
									? filterOptions.amount.min
									: roundOff(filterOptions.amount.min, 1)
							}
							max={
								filterOptions.amount.max % 10 === 0
									? filterOptions.amount.max
									: roundOff(filterOptions.amount.max, 1)
							}
							step={
								((filterOptions.amount.max % 10 === 0
									? filterOptions.amount.max
									: roundOff(filterOptions.amount.max, 1)) -
									(filterOptions.amount.min % 10 === 0
										? filterOptions.amount.min
										: roundOff(
												filterOptions.amount.min,
												1
											))) /
								5
							}
							value={{
								max:
									payload?.amount?.max ||
									filterOptions.amount.max,
								min:
									payload?.amount?.min ||
									filterOptions.amount.min,
							}}
							setValue={(newVal) => {
								setPayload({
									...payload,
									amount: newVal,
								});
							}}
						/>
					</div>
					<div className={classes("-price-range__inputs")}>
						<Input
							name="amount-min"
							id="amount-min"
							type="number"
							value={
								payload?.amount?.min || filterOptions.amount.min
							}
							onChange={handleAmountChange}
							leftIcon={<FiDollarSign />}
						/>
						<Input
							name="amount-max"
							id="amount-max"
							type="number"
							value={
								payload?.amount?.max || filterOptions.amount.max
							}
							onChange={handleAmountChange}
							leftIcon={<FiDollarSign />}
						/>
					</div>
				</div>
				<hr className={classes("-divider")} />
				<div className={classes("-date-range")}>
					<Typography
						size="lg"
						className={classes("-date-range__heading")}
					>
						Date Range
					</Typography>
					<div className={classes("-date-range__inputs")}>
						<input
							name="timestamp-begin"
							id="timestamp-begin"
							type="date"
							placeholder=""
							value={dayjs(
								payload?.timestamp?.begin ??
									filterOptions.timestamp.begin
							).format("YYYY-MM-DD")}
							onChange={handleTimestampChange}
							required
							ref={tsBeginRef}
							className="dispn"
						/>
						<input
							name="timestamp-end"
							id="timestamp-end"
							type="date"
							placeholder=""
							value={dayjs(
								payload?.timestamp?.end ??
									filterOptions.timestamp.end
							).format("YYYY-MM-DD")}
							onChange={handleTimestampChange}
							required
							ref={tsEndRef}
							className="dispn"
						/>
						<label
							htmlFor="timestamp-begin"
							className={classes("-date-range__label")}
							onClick={(e) => {
								e.preventDefault();
								if (tsBeginRef && tsBeginRef.current) {
									try {
										tsBeginRef.current.showPicker();
									} catch {
										Logger.error("Unable to show picker");
									}
								}
							}}
						>
							<IconButton icon={<FiCalendar />} />
							<Typography>
								{dayjs(
									payload?.timestamp?.begin ??
										filterOptions.timestamp.begin
								).format("MMM DD, YYYY")}
							</Typography>
						</label>
						<label
							htmlFor="timestamp-end"
							className={classes("-date-range__label")}
							onClick={(e) => {
								e.preventDefault();
								if (tsEndRef && tsEndRef.current) {
									try {
										tsEndRef.current.showPicker();
									} catch {
										Logger.error("Unable to show picker");
									}
								}
							}}
						>
							<IconButton icon={<FiCalendar />} />
							<Typography>
								{dayjs(
									payload?.timestamp?.end ??
										filterOptions.timestamp.end
								).format("MMM DD, YYYY")}
							</Typography>
						</label>
					</div>
				</div>
				<hr className={classes("-divider")} />
			</div>
			<div className={classes("-actions")}>
				{/* Show Reset filters if filters are different than initial filters */}
				{!isSameObject(
					filters?.amount || {},
					initialWalletFilterOptions?.amount || {}
				) ||
				!isSameObject(
					filters?.timestamp || {},
					initialWalletFilterOptions?.timestamp || {}
				) ||
				!isSameArray<string>(filters?.tags || [], []) ? (
					<Button
						variant="outlined"
						onClick={resetFilters}
						icon={<FiRotateCcw />}
						className={classes("-action", "-reset")}
					>
						Reset to default
					</Button>
				) : null}

				{/* Show Apply filters if filters are different than applied filters */}
				{!isSameObject(filters?.amount || {}, payload?.amount || {}) ||
				!isSameObject(
					filters?.timestamp || {},
					payload?.timestamp || {}
				) ||
				!isSameArray(filters?.tags || [], payload?.tags || []) ? (
					<Button
						variant="filled"
						icon={<FiCheckCircle />}
						onClick={applyFilters}
						className={classes("-action", "-apply")}
					>
						Apply
					</Button>
				) : null}
			</div>
		</div>
	);
};
