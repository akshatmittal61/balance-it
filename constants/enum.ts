import {
	AppTheme,
	NavigationId,
	T_API_METHODS,
	T_EMAIL_TEMPLATE,
	T_EXPENSE_METHOD,
	T_EXPENSE_TYPE,
	T_MEMBER_ROLE,
	T_MEMBER_STATUS,
	T_NODE_ENV,
	T_OTP_STATUS,
	T_USER_ROLE,
	T_USER_STATUS,
} from "@/types";
import { getEnumeration } from "@/utils";

export const USER_ROLE = getEnumeration<T_USER_ROLE>([
	"ADMIN",
	"GUEST",
	"MEMBER",
]);

export const USER_STATUS = getEnumeration<T_USER_STATUS>(["INVITED", "JOINED"]);
export const OTP_STATUS = getEnumeration<T_OTP_STATUS>(["PENDING", "EXPIRED"]);

export const EXPENSE_TYPE = getEnumeration<T_EXPENSE_TYPE>([
	"PAID",
	"RECEIVED",
	"SELF",
]);
export const EXPENSE_METHOD = getEnumeration<T_EXPENSE_METHOD>([
	"UPI",
	"CASH",
	"CARD",
	"NETBANKING",
]);

export const MEMBER_STATUS = getEnumeration<T_MEMBER_STATUS>([
	"JOINED",
	"PENDING",
	"LEFT",
	"INVITED",
]);
export const MEMBER_ROLE = getEnumeration<T_MEMBER_ROLE>([
	"OWNER",
	"ADMIN",
	"MEMBER",
]);

export const emailTemplates = getEnumeration<T_EMAIL_TEMPLATE>([
	"OTP",
	"NEW_USER_ONBOARDED",
	"USER_INVITED",
	"USER_ADDED_TO_GROUP",
]);

export const NODE_ENV = getEnumeration<T_NODE_ENV>([
	"development",
	"test",
	"production",
]);

export const apiMethods = getEnumeration<T_API_METHODS>([
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
]);

export const appTheme = getEnumeration<AppTheme>(["light", "dark"]);

export const navigationIds = getEnumeration<NavigationId>([
	"home",
	"summary",
	"friends",
	"calendar",
]);
