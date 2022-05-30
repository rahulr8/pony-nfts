import {
  Box,
  SimpleGrid,
  Button,
  Flex,
  Image,
  Heading,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  useAddress,
  useNFTCollection,
  useMetamask,
  useChainId,
  ChainId,
} from "@thirdweb-dev/react";

const Nfts = () => {
  const [loading, setLoading] = useState(false);
  const [nftMetadata, setNftMetadata] = useState([null]);
  const [fetchedNfts, setFetchedNfts] = useState(false);

  const fetchNfts = async () => {
    try {
      const response = await fetch("/api/get-pony-nfts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setNftMetadata(data);
      setFetchedNfts(true);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchNfts();
  }, [loading]);

  const nftCollectionAddress = process.env.CONTRACT_ADDRESS;
  const nftCollection = useNFTCollection(nftCollectionAddress);

  // Function which generates signature and mints NFT
  const mintNft = async (id: number) => {
    setLoading(true);
    connectWithMetamask;

    try {
      // Call API to generate signature and payload for minting
      const response = await fetch("/api/get-pony-nfts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, address }),
      });

      if (response) {
        connectWithMetamask;
        const data = await response.json();
        const mintInput = {
          signature: data.signature,
          payload: data.payload,
        };
        console.log("mintInput", mintInput);
        console.log("signature", nftCollection?.signature);
        const mint = await nftCollection?.signature.mint(mintInput);
        console.log("mint", mint);
        alert("NFT successfully minted!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      console.log(error);
      alert("Failed to mint NFT!");
    }
  };

  const address = useAddress();
  const connectWithMetamask = useMetamask();

  const chainId = useChainId();

  if (chainId !== ChainId.Rinkeby) {
    return (
      <Flex mt="5rem" alignItems="center" flexDir="column">
        <Heading fontSize="md">Please connect to the Rinkeby Testnet</Heading>
      </Flex>
    );
  }

  if (fetchedNfts) {
    return (
      <SimpleGrid m="2rem" justifyItems="center" columns={3} spacing={10}>
        {nftMetadata?.map((nft: any) => (
          <Box
            key={nftMetadata.indexOf(nft)}
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
          >
            <Image
              width="30rem"
              height="15rem"
              src={nft?.url}
              alt="NFT image"
            />

            <Flex p="1rem" alignItems="center" flexDir="column">
              <Box
                mt="1"
                fontWeight="bold"
                lineHeight="tight"
                fontSize="20"
                m="0.5rem"
              >
                {nft?.name}
              </Box>

              <Box fontSize="16" m="0.5rem">
                {nft?.description}
              </Box>
              <Box fontSize="16" m="0.5rem">
                {nft?.price}
              </Box>
              {loading ? (
                <p>Minting... You will need to approve 1 transaction</p>
              ) : nft?.minted ? (
                <b>This NFT has already been minted</b>
              ) : (
                <Button
                  colorScheme="purple"
                  m="0.5rem"
                  onClick={() => mintNft(nft?.id)}
                >
                  Mint
                </Button>
              )}
            </Flex>
          </Box>
        ))}
      </SimpleGrid>
    );
  } else {
    return <Heading>Loading...</Heading>;
  }
};

export default Nfts;
