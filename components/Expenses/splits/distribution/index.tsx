import { fallbackAssets } from "@/constants";
import { useDevice } from "@/hooks";
import { Avatar, Typography } from "@/library";
import React from "react";
import { classes, distributionMethods } from "./assets";
import { CustomDistribution } from "./custom";
import { EqualDistribution } from "./equal";
import { FractionDistribution } from "./fraction";
import { PercentageDistribution } from "./percentage";
import { DistributionMemberProps } from "./types";

export const DistributionMember: React.FC<DistributionMemberProps> = ({
	member,
	distributionMethod,
	onChange,
}) => {
	const { device } = useDevice();
	return (
		<div className={classes("-member")} key={`member-${member.id}`}>
			<Avatar
				src={member.avatar || fallbackAssets.avatar}
				alt={member.name || member.email}
				size={device === "mobile" ? 32 : 48}
			/>
			<div className={classes("-member-details")}>
				<Typography size="md" className={classes("-member-name")}>
					{member.name || member.email.split("@")[0]}
				</Typography>
				<Typography size="sm" className={classes("-member-email")}>
					{member.email}
				</Typography>
			</div>
			{distributionMethod === distributionMethods.equal.id ? (
				<EqualDistribution member={member} />
			) : distributionMethod === distributionMethods.percentage.id ? (
				<PercentageDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.percentage.id)
					}
				/>
			) : distributionMethod === distributionMethods.fraction.id ? (
				<FractionDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.fraction.id)
					}
				/>
			) : distributionMethod === distributionMethods.custom.id ? (
				<CustomDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.custom.id)
					}
				/>
			) : null}
		</div>
	);
};
