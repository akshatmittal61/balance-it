import { fallbackAssets } from "@/constants";
import { Avatar, IconButton, MaterialIcon, Typography } from "@/library";
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
	onRemove,
}) => {
	return (
		<div className={classes("-member")} key={`member-${member.id}`}>
			<Avatar
				src={member.avatar || fallbackAssets.avatar}
				alt={member.name || member.email}
				size={32}
			/>
			<div className={classes("-member-details")}>
				<Typography size="md" className={classes("-member-name")}>
					{member.name || member.email.split("@")[0]}
				</Typography>
				<Typography size="s" className={classes("-member-email")}>
					{member.email}
				</Typography>
			</div>
			{distributionMethod === distributionMethods.equal ? (
				<EqualDistribution member={member} />
			) : distributionMethod === distributionMethods.percentage ? (
				<PercentageDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.percentage)
					}
				/>
			) : distributionMethod === distributionMethods.fraction ? (
				<FractionDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.fraction)
					}
				/>
			) : distributionMethod === distributionMethods.custom ? (
				<CustomDistribution
					member={member}
					onChange={(value) =>
						onChange(value, distributionMethods.custom)
					}
				/>
			) : null}
			{onRemove ? (
				<IconButton
					onClick={onRemove}
					icon={<MaterialIcon icon="close" />}
				/>
			) : (
				<span className={classes("-remove-placeholder")} />
			)}
		</div>
	);
};
