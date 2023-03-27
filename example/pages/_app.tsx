import "./index.css";

import type { AppProps } from "next/app";
import ProviderExample from "../components/ProviderExample";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ProviderExample>
      <Component {...pageProps} />
    </ProviderExample>
  );
}
