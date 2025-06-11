import { stylesConfig } from "@/utils";
import React from "react";
import styles from "./styles.module.scss";

interface SliderProps {
	value: {
		min: number;
		max: number;
	};
	setValue: (_: { min: number; max: number }) => void;
	min: number;
	max: number;
	step: number;
	label?: React.ReactNode;
	showMin?: boolean;
	showMax?: boolean;
	disabled?: boolean;
	tooltip?: string;
}

const classes = stylesConfig(styles, "slider");

export const Slider: React.FC<SliderProps> = ({
	value,
	setValue,
	min,
	max,
	step,
	label,
	showMin = true,
	showMax = true,
	disabled = false,
	tooltip,
}) => {
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		if (showMin && showMax) {
			if (
				e.target.name === "min" &&
				+e.target.value >= value.max - step
			) {
				setValue({
					...value,
					min: +value.max - step,
				});
			} else if (
				e.target.name === "max" &&
				+e.target.value <= value.min + step
			) {
				setValue({
					...value,
					max: +value.min + step,
				});
			} else
				setValue({
					...value,
					[e.target.name]: +e.target.value,
				});
		} else if (showMin) {
			if (+e.target.value >= max - step) {
				setValue({
					...value,
					min: max - step,
				});
			} else
				setValue({
					...value,
					min: +e.target.value,
				});
		} else if (showMax) {
			if (+e.target.value <= min + step) {
				setValue({
					...value,
					max: min + step,
				});
			} else
				setValue({
					...value,
					max: +e.target.value,
				});
		}
	};

	return (
		<div className={classes("")} title={tooltip}>
			{label && <label className={classes("-label")}>{label}</label>}
			<div className={classes("-track")}>
				<div
					className={classes("-peek")}
					style={{
						left: `${((value.min - min) / (max - min)) * 100}%`,
						right: `${
							100 - ((value.max - min) / (max - min)) * 100
						}%`,
					}}
				></div>
			</div>{" "}
			<div className={classes("-inputs")}>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value.min}
					onChange={onChange}
					disabled={!showMin}
					name="min"
				/>
				<input
					type="range"
					min={min}
					max={max}
					step={step}
					value={value.max}
					onChange={onChange}
					disabled={!showMax}
					name="max"
				/>
			</div>
			<div className={classes("-values")}>
				{Array.from(
					{
						length: (max - min) / step + 1,
					},
					(_, i) => min + i * step
				).map((v, i) => (
					<div
						key={i}
						className={classes("-value")}
						style={{
							left: `${(v / (max - min)) * 100}%`,
							color:
								v >= value.min && v <= value.max
									? "var(--accent-color)"
									: "#000",
							opacity:
								v >= value.min && v <= value.max ? 1 : 0.75,
						}}
						onClick={() => {
							if (showMin && showMax) {
								if (
									Math.abs(value.min - v) <
									Math.abs(value.max - v)
								) {
									setValue({
										...value,
										min: v,
									});
								} else if (
									Math.abs(value.min - v) >
									Math.abs(value.max - v)
								) {
									setValue({
										...value,
										max: v,
									});
								} else if (
									Math.abs(value.min - v) ===
									Math.abs(value.max - v)
								) {
									if (v < value.min) {
										setValue({
											...value,
											min: v,
										});
									} else if (v > value.max) {
										setValue({
											...value,
											max: v,
										});
									}
								}
							} else if (showMin) {
								if (v > value.max) return;
								setValue({
									...value,
									min: v,
								});
							} else if (showMax) {
								if (v < value.min) return;
								setValue({
									...value,
									max: v,
								});
							} else {
								return;
							}
						}}
					>
						{v}
					</div>
				))}
			</div>
		</div>
	);
};
