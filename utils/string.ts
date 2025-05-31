export class StringUtils {
	public static isEmpty(s: string) {
		return s === undefined || s === null || s === "";
	}
	public static isNotEmpty(s: string) {
		return !StringUtils.isEmpty(s);
	}
}
