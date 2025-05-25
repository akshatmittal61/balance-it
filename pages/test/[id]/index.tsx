import { useRouter } from "next/router";
import React from "react";

const RandomPage: React.FC = () => {
	const router = useRouter();
	return (
		<main className="w-full h-screen flex justify-center items-center">
			<pre>{JSON.stringify(router.query, null, 2)}</pre>
		</main>
	);
};

export default RandomPage;
