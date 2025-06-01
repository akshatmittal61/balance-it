import { useOnClickOutside } from "@/hooks";
import { Typography } from "@/library";
import { Notify, stylesConfig } from "@/utils";
import React, { useRef, useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import styles from "./styles.module.scss";
import { AddTagProps, TagProps } from "./types";

const classes = stylesConfig(styles, "expense-wizard");

export const Tag: React.FC<TagProps> = ({
	tag,
	active = true,
	onClick,
	onRemove,
	className = "",
}) => {
	return (
		<span
			className={classes(
				"-tag",
				{
					"-tag--active": active,
					"-tag--interactive": onClick !== undefined,
				},
				className
			)}
			onClick={onClick}
		>
			{tag}
			{onRemove ? <FiX onClick={onRemove} /> : null}
		</span>
	);
};

export const AddTag: React.FC<AddTagProps> = ({ onAdd }) => {
	const [showNewTagButton, setShowNewTagButton] = useState(true);
	const [newTag, setNewTag] = useState("");
	const newTagFormRef = useRef<HTMLFormElement>(null);

	const handleAddNewTag = () => {
		setShowNewTagButton(true);
		onAdd(newTag);
		setNewTag("");
	};

	useOnClickOutside(newTagFormRef, () => {
		handleAddNewTag();
	});

	return showNewTagButton ? (
		<button
			className={classes("-tag", "-tag--add")}
			onClick={() => setShowNewTagButton(false)}
		>
			<FiPlus />
			<Typography size="sm">Add tag</Typography>
		</button>
	) : (
		<form
			className={classes("-tag", "-tag--form")}
			ref={newTagFormRef}
			onSubmit={(e) => {
				e.preventDefault();
				if (newTag.length === 0) {
					return Notify.error("Please enter some text");
				} else if (newTag.length > 50) {
					return Notify.error(
						"Tag should be less than 50 characters"
					);
				} else handleAddNewTag();
			}}
		>
			<input
				type="text"
				placeholder="Tag"
				id="new-tag"
				name="new-tag"
				title="Press 'Enter' when you're done"
				value={newTag}
				onChange={(e) => {
					setNewTag(e.target.value.trim().replace(/\s+/g, "-"));
				}}
				autoFocus
			/>
		</form>
	);
};
