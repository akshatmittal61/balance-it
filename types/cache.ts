export type CacheParameter = "USER";
export type CachePayloadGenerator<T extends CacheParameter> = T extends "USER"
	? { token: string }
	: never;
