export class StringUtils {
	public static isEmpty(s: string | null | undefined) {
		return s === undefined || s === null || s === "";
	}
	public static isNotEmpty(s: string | null | undefined) {
		return !StringUtils.isEmpty(s);
	}
}
