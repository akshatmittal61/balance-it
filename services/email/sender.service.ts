import { googleEmailConfig } from "@/config";
import { AppSeo } from "@/constants";
import { T_EMAIL_TEMPLATE } from "@/types";
import { createTransport } from "nodemailer";
import { getEmailTemplate } from "./template";

export const sendEmailService = async (
	to: string,
	subject: string,
	html: string
) => {
	const transportOptions: any = {
		service: "gmail",
		auth: {
			user: googleEmailConfig.email,
			pass: googleEmailConfig.password,
		},
	};
	const smtpTransport = createTransport(transportOptions);
	const mailOptions = {
		from: {
			name: AppSeo.title || "",
			address: googleEmailConfig.email,
		},
		to,
		subject,
		html,
	};
	await smtpTransport.sendMail(mailOptions);
};

export const sendBulkEmailService = async (
	to: string[],
	subject: string,
	html: string
) => {
	const transportOptions: any = {
		service: "gmail",
		auth: {
			user: googleEmailConfig.email,
			pass: googleEmailConfig.password,
		},
	};
	const smtpTransport = createTransport(transportOptions);
	await smtpTransport.sendMail({
		from: googleEmailConfig.email,
		bcc: to,
		subject,
		html,
	});
};

export const sendEmailTemplate = async (
	to: string,
	subject: string,
	template: T_EMAIL_TEMPLATE,
	data: any
) => {
	const html = getEmailTemplate(template, data);
	await sendEmailService(to, subject, html);
};

export const sendBulkEmailTemplate = async (
	to: string[],
	subject: string,
	template: T_EMAIL_TEMPLATE,
	data: any
) => {
	const html = getEmailTemplate(template, data);
	await sendBulkEmailService(to, subject, html);
};
