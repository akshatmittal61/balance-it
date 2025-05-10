export type T_USER_ROLE = "ADMIN" | "MEMBER" | "GUEST";
export type T_USER_STATUS = "JOINED" | "INVITED";
export type T_OTP_STATUS = "PENDING" | "EXPIRED";
export type T_EXPENSE_TYPE = "PAID" | "RECEIVED" | "SELF";
export type T_MEMBER_STATUS = "JOINED" | "PENDING" | "LEFT" | "INVITED";
export type T_MEMBER_ROLE = "OWNER" | "ADMIN" | "MEMBER";
export type T_EXPENSE_METHOD = "UPI" | "CASH" | "CARD" | "NETBANKING";
export type T_COMPONENT_THEME = "info" | "success" | "warning" | "error";

export type T_NODE_ENV = "development" | "test" | "production";
export type T_EMAIL_TEMPLATE =
	| "OTP"
	| "NEW_USER_ONBOARDED"
	| "USER_INVITED"
	| "USER_ADDED_TO_GROUP";

export type GOOGLE_MAIL_SERVICE_KEYS = "email" | "password";
