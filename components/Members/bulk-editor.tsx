import { UserApi } from "@/api";
import { useDebounce, useHttpClient } from "@/hooks";
import { Textarea } from "@/library";
import { ApiResponses, IUser } from "@/types";
import { Notify, stylesConfig } from "@/utils";
import React, { useEffect } from "react";
import styles from "./styles.module.scss";

type BulkEditorProps = {
	members: Array<IUser>;
	setMembers: (_: Array<IUser>) => void;
};

const classes = stylesConfig(styles, "members-bulk-editor");

export const BulkEditor: React.FC<BulkEditorProps> = ({
	members,
	setMembers,
}) => {
	const [editorEmails, debouncedEditorEmails, setEditorEmails] =
		useDebounce<string>(members.map((user) => user.email).join(", "), 1000);
	const { call } = useHttpClient<ApiResponses.BulkUserSearch>();

	const handleSearchInBulkEditor = async (value: string) => {
		const response = await call(UserApi.searchInBulk, value);
		if (response.message) {
			Notify.success(response.message);
		}
		setMembers(response.users);
	};

	useEffect(() => {
		if (debouncedEditorEmails.length > 0) {
			handleSearchInBulkEditor(debouncedEditorEmails);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedEditorEmails]);

	useEffect(() => {
		setEditorEmails(members.map((user) => user.email).join(", "));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [members]);

	return (
		<div className={classes("-bulk-editor")}>
			<Textarea
				type="text"
				value={editorEmails}
				onChange={(e: any) => setEditorEmails(e.target.value)}
			/>
		</div>
	);
};
