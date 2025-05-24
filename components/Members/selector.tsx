import { UserApi } from "@/api";
import { useDebounce, useHttpClient } from "@/hooks";
import { Input } from "@/library";
import IconButton from "@/library/Button/icon";
import { useGodownStore } from "@/store";
import { IUser } from "@/types";
import { stylesConfig } from "@/utils";
import React, { useEffect, useState } from "react";
import { FiMail, FiSearch, FiUsers } from "react-icons/fi";
import BulkEditor from "./bulk-editor";
import MembersPlaceholder from "./placeholder";
import { MemberIcon, MemberRow } from "./single";
import styles from "./styles.module.scss";

type IMembersSelectorProps = {
	selectedMembers: Array<IUser>;
	enableBulkEditor?: boolean;
	setSelectedMembers?: (_: Array<IUser>) => void;
	onAddMember: (_: IUser) => void;
	onRemoveMember: (_: IUser) => void;
};

const classes = stylesConfig(styles, "members-selector");

const MembersSelector: React.FC<IMembersSelectorProps> = ({
	selectedMembers,
	setSelectedMembers,
	enableBulkEditor,
	onAddMember,
	onRemoveMember,
}) => {
	const { friends, isLoading: searchingForFriends } = useGodownStore();
	const [searchResults, setSearchResults] = useState<Array<IUser>>([]);
	const [openBulkEditor, setOpenBulkEditor] = useState(false);
	const { loading: searching, call: api } = useHttpClient<Array<IUser>>([]);
	const [searchStr, debouncedSearchStr, setSearchStr] = useDebounce<string>(
		"",
		1000
	);

	const handleSearch = async (searchStr: any) => {
		const res = await api(UserApi.searchForUsers, searchStr);
		setSearchResults(res);
	};

	const handleMemberClick = (user: IUser) => {
		const isSelected = selectedMembers.map((m) => m.id).includes(user.id);
		if (isSelected) {
			onRemoveMember(user);
		} else {
			onAddMember(user);
		}
	};

	useEffect(() => {
		if (debouncedSearchStr && debouncedSearchStr.length >= 3) {
			handleSearch(debouncedSearchStr);
		} else {
			setSearchResults([]);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedSearchStr]);

	return (
		<div className={classes("")}>
			<form className={classes("-search-form")}>
				{openBulkEditor && enableBulkEditor && setSelectedMembers ? (
					<BulkEditor
						members={selectedMembers}
						setMembers={setSelectedMembers}
					/>
				) : (
					<Input
						name="email"
						placeholder="Search by email"
						leftIcon={<FiSearch />}
						size="small"
						value={searchStr}
						onChange={(e: any) => setSearchStr(e.target.value)}
					/>
				)}
				{enableBulkEditor ? (
					<IconButton
						icon={openBulkEditor ? <FiMail /> : <FiUsers />}
						title={
							openBulkEditor
								? "Switch to Search by Email"
								: "Switch to Bulk editor"
						}
						type="button"
						onClick={(e: any) => {
							e.preventDefault();
							setOpenBulkEditor((p) => !p);
						}}
					/>
				) : null}
			</form>
			{selectedMembers.length > 0 ? (
				<div className={classes("__selected")}>
					{selectedMembers.map((user) => (
						<MemberIcon
							user={user}
							key={`members-selector-selected-user-${user.id}`}
							onSelect={() => onRemoveMember(user)}
						/>
					))}
				</div>
			) : null}
			<div className={classes("__list")}>
				{debouncedSearchStr.length > 0 ? (
					searching ? (
						<MembersPlaceholder
							loading={true}
							searchStr={searchStr}
						/>
					) : searchResults.length > 0 ? (
						searchResults.map((user) => (
							<MemberRow
								user={user}
								key={`members-selector-searched-user-${user.id}`}
								isSelected={selectedMembers
									.map((m) => m.id)
									.includes(user.id)}
								onSelect={() => handleMemberClick(user)}
							/>
						))
					) : (
						<MembersPlaceholder
							loading={false}
							searchStr={searchStr}
							onInvited={onAddMember}
						/>
					)
				) : searchingForFriends ? (
					<MembersPlaceholder loading={true} searchStr="" />
				) : friends.length > 0 ? (
					friends.map((user) => (
						<MemberRow
							user={user}
							key={`members-selector-friends-user-${user.id}`}
							isSelected={selectedMembers
								.map((m) => m.id)
								.includes(user.id)}
							onSelect={() => handleMemberClick(user)}
						/>
					))
				) : (
					<MembersPlaceholder loading={false} searchStr="" />
				)}
			</div>
		</div>
	);
};

export default MembersSelector;
