import { stylesConfig } from "@/utils";
import styles from "./styles.module.scss";
export * from "./distribution/assets";

export const classes = stylesConfig(styles, "splits");
