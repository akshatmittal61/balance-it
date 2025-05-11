import { UserApi } from "@/api";
import { useDebounce, useHttpClient } from "@/hooks";
import { Textarea } from "@/library";
import { IUser } from "@/types";
import { Notify } from "@/utils";
import React, { useEffect } from "react";
import { classes } from "./assets";
import { BulkEditorProps } from "./types";

export const BulkEditor: React.FC<BulkEditorProps> = ({
	selectedMembers,
	setSelectedMembers,
}) => {
	const [editorEmails, debouncedEditorEmails, setEditorEmails] =
		useDebounce<string>(
			selectedMembers.map((user) => user.email).join(", "),
			1000
		);
	const { call: api } = useHttpClient<{
		message: string;
		users: Array<IUser>;
	}>();

	const handleSearchInBulkEditor = async (value: string) => {
		const response = await api(UserApi.searchInBulk, value);
		if (response.message) {
			Notify.success(response.message);
		}
		setSelectedMembers(response.users);
	};

	useEffect(() => {
		if (debouncedEditorEmails.length > 0)
			handleSearchInBulkEditor(debouncedEditorEmails);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedEditorEmails]);

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
