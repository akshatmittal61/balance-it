import { FriendRow, MembersPlaceholder } from "@/components";
import { navigationMap } from "@/constants";
import { Responsive } from "@/layouts";
import { Loader } from "@/library";
import { useGodownStore, useHeader } from "@/store";
import styles from "@/styles/pages/Friends.module.scss";
import { stylesConfig } from "@/utils";
import React from "react";

const classes = stylesConfig(styles, "friends");

const Friends: React.FC = () => {
	const { friends, isLoading } = useGodownStore({ syncOnMount: true });
	useHeader([navigationMap.home]);
	return (
		<main className={classes("")}>
			{friends.length > 0 ? (
				<Responsive.Row>
					{friends
						.sort((a, b) => {
							// sort by a.strings and b.strings
							if (a.strings < b.strings) return 1;
							if (a.strings > b.strings) return -1;
							// if not, sort by a.name and b.name by local comparison
							return (a.name || "").localeCompare(b.name || "");
						})
						.map((user) => (
							<Responsive.Col
								key={`members-selector-friends-user-${user.id}`}
								xlg={50}
								lg={50}
								md={50}
								sm={100}
								xsm={100}
							>
								<FriendRow friend={user} />
							</Responsive.Col>
						))}
				</Responsive.Row>
			) : isLoading ? (
				<Loader.Spinner />
			) : (
				<MembersPlaceholder loading={false} searchStr="" />
			)}
		</main>
	);
};

export default Friends;
