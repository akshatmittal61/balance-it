import "@/styles/globals.scss";
import { Wrapper } from "@/components";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
	return (
		<Wrapper {...pageProps}>
			<Component {...pageProps} />
		</Wrapper>
	);
}
