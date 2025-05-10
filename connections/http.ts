import { apiMethods, backendBaseUrl, HTTP } from "@/constants";
import { Logger } from "@/log";
import { T_API_METHODS } from "@/types";
import { sleep } from "@/utils";
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

class HttpWrapper {
	public http: AxiosInstance;
	private retryConfig: {
		retryCount: number;
		retryDelay: number;
	};

	constructor(http: AxiosInstance) {
		this.http = http;
		this.retryConfig = {
			retryCount: 3,
			retryDelay: 2,
		};
	}

	public async get<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		config?: AxiosRequestConfig<D>
	): Promise<R> {
		return this.makeRequest(apiMethods.GET, url, { config });
	}

	public async post<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R> {
		return this.makeRequest(apiMethods.POST, url, { data, config });
	}

	public async put<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R> {
		return this.makeRequest(apiMethods.PUT, url, { data, config });
	}

	public async patch<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R> {
		return this.makeRequest(apiMethods.PATCH, url, { data, config });
	}

	public async delete<T = any, R = AxiosResponse<T>, D = any>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig<D>
	): Promise<R> {
		return this.makeRequest(apiMethods.DELETE, url, { data, config });
	}

	private async makeRequest<T = any, R = AxiosResponse<T>, D = any>(
		method: T_API_METHODS,
		url: string,
		{ data, config }: { data?: D; config?: AxiosRequestConfig<D> } = {}
	): Promise<R> {
		try {
			let response!: R;
			if (method === apiMethods.GET) {
				response = await this.http.get(url, config);
			} else if (method === apiMethods.POST) {
				response = await this.http.post(url, data, config);
			} else if (method === apiMethods.PUT) {
				response = await this.http.put(url, data, config);
			} else if (method === apiMethods.PATCH) {
				response = await this.http.patch(url, data, config);
			} else if (method === apiMethods.DELETE) {
				response = await this.http.delete(url, config);
			}
			return response;
		} catch (error: any) {
			const statusCode = +error?.response?.status || 0;
			if (statusCode === HTTP.status.SERVICE_UNAVAILABLE) {
				if (this.retryConfig.retryCount > 0) {
					this.retryConfig.retryCount--;
					await sleep(this.retryConfig.retryDelay);
					Logger.debug(
						`Retrying ${method} ${url}...`,
						`Retries left: ${this.retryConfig.retryCount}`
					);
					return await this.makeRequest(method, url, {
						data,
						config,
					});
				} else {
					throw error;
				}
			} else {
				throw error;
			}
		}
	}
}

export const http = new HttpWrapper(
	axios.create({
		baseURL: backendBaseUrl + "/api/v1",
		headers: {
			"Content-Type": "application/json",
		},
		withCredentials: true,
		timeout: 10000,
	})
);
