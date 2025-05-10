import React from "react";

export interface PaneProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	title?: string;
	onClose: () => void;
	onEdit?: () => void;
	onDelete?: () => void;
	primaryAction?: any;
	secondaryAction?: any;
	showHeader?: boolean;
	width?: number | string;
	height?: number | string;
	style?: React.CSSProperties;
	loading?: boolean;
	direction?: "left" | "right" | "top" | "bottom";
	styles?: {
		header?: React.CSSProperties;
		body?: React.CSSProperties;
		footer?: React.CSSProperties;
	};
}

export type IconProps = React.SVGProps<SVGSVGElement> & {};
