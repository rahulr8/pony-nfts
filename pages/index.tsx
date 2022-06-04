import { Flex, Heading, Button } from "@chakra-ui/react";
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
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <Heading mb="2.5rem">Select a pony NFT to mint!</Heading>
          <Gallery />
        </Flex>
      ) : (
        <Flex mt="5rem" alignItems="center" flexDir="column">
          <Button size="lg" colorScheme="pink" onClick={connectWithMetamask}>
            Connect with Metamask
          </Button>
        </Flex>
      )}
    </div>
  );
};

export default Home;
