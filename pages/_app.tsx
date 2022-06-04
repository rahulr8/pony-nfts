import type { AppProps } from "next/app";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";

import { MantineProvider } from "@mantine/core";

const activeChainId = ChainId.Rinkeby;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThirdwebProvider
      desiredChainId={activeChainId}
      sdkOptions={{
        gasless: {
          openzeppelin: {
            relayerUrl: String(process.env.NEXT_PUBLIC_OPENZEPPELIN_URL),
          },
        },
      }}
    >
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Component {...pageProps} />
      </MantineProvider>
    </ThirdwebProvider>
  );
}

export default MyApp;
