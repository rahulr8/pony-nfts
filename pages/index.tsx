import { Button } from "@mantine/core";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import type { NextPage } from "next";
import { Gallery, Header } from "components";

const Home: NextPage = () => {
  // Use address and connect with metamask
  const address = useAddress();
  const connectWithMetamask = useMetamask();

  return (
    <div>
      <Header />
      {address ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          <h1 style={{ marginBottom: "2.5rem" }}>Select a pony NFT to mint!</h1>
          <Gallery />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: "5rem",
          }}
        >
          <Button size="lg" onClick={connectWithMetamask}>
            Connect with Metamask
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
