import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@mantine/core";
import {
  ADAPTER_EVENTS,
  SafeEventEmitterProvider,
  CHAIN_NAMESPACES,
} from "@web3auth/base";
import type { Web3Auth, Web3AuthOptions } from "@web3auth/web3auth";

function Login() {
  const [web3AuthInstance, setWeb3AuthInstance] = useState<Web3Auth | null>(
    null
  );
  const [provider, setProvider] = useState<SafeEventEmitterProvider | null>(
    null
  );

  useEffect(() => {
    const init = async () => {
      try {
        const web3AuthCtorParams = {
          clientId: process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x1",
          },
        };
        const { Web3Auth } = await import("@web3auth/web3auth");
        const web3AuthInstance = new Web3Auth(
          web3AuthCtorParams as Web3AuthOptions
        );

        // Subscribe to events from Web3Auth
        subscribeAuthEvents(web3AuthInstance);
        setWeb3AuthInstance(web3AuthInstance);
        await web3AuthInstance.initModal();
      } catch (error) {
        console.error(error);
      }

      //   TODO: Clean up the subscriptions here
    };

    const subscribeAuthEvents = (web3AuthInstance: Web3Auth) => {
      // Can subscribe to all ADAPTER_EVENTS and LOGIN_MODAL_EVENTS
      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTED, (data: unknown) => {
        console.log("Yeah!, you are successfully logged in", data);
      });

      web3AuthInstance.on(ADAPTER_EVENTS.CONNECTING, () => {
        console.log("connecting");
      });

      web3AuthInstance.on(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("disconnected");
      });

      web3AuthInstance.on(ADAPTER_EVENTS.ERRORED, (error) => {
        console.error("some error or user has cancelled login request", error);
      });
    };

    init();
  }, []);

  /**
   * Logs user in and redirects them to the NFT collection page
   * @returns {Promise<void>}
   */
  const login = async () => {
    if (!web3AuthInstance) {
      console.log("web3auth not initialized yet");
      return;
    }
    const provider = await web3AuthInstance.connect();
    setProvider(provider);

    // TODO: Then send user to the NFTs page
    // router.push("/");
  };

  /**
   * Logs the user out
   * @returns {Promise<void>}
   */
  const logout = async () => {
    if (!web3AuthInstance) {
      console.log("web3auth not initialized yet");
      return;
    }
    await web3AuthInstance.logout();
    setProvider(null);
  };

  const router = useRouter();

  const loggedInView = (
    <Button color="red" onClick={logout}>
      Log Out
    </Button>
  );

  const unloggedInView = (
    <div
      style={{
        flexDirection: "column",
        alignItems: "center",
        height: "200px",
      }}
    >
      <h1 style={{ paddingBottom: "20px" }}>
        Welcome to the Pony NFT app. Please login
      </h1>
      <Button onClick={login}>Login</Button>
    </div>
  );

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "500px",
      }}
    >
      <div>{provider ? loggedInView : unloggedInView}</div>
    </div>
  );
}

export default Login;
