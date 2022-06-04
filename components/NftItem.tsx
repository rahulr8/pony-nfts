import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useAddress, useMetamask } from "@thirdweb-dev/react";
import { useState } from "react";

interface NftItemProps {
  nft: any;
  nftCollection: any;
}

export const NftItem: React.FC<NftItemProps> = ({ nft, nftCollection }) => {
  const [loading, setLoading] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<number | null>(null);

  const address = useAddress();
  const connectWithMetamask = useMetamask();

  // Function which generates signature and mints NFT
  const mintNft = async (id: number) => {
    setSelectedNFT(id);
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

        const mint = await nftCollection?.signature.mint(mintInput);
        alert("NFT successfully minted!");
        setLoading(false);
      }
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      alert("Failed to mint NFT!");
    }
  };

  return (
    <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
      <Image width="30rem" height="15rem" src={nft?.url} alt="NFT image" />

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
          selectedNFT === nft.id && (
            <p>Mint in progress. Please approve transaction</p>
          )
        ) : nft?.minted ? (
          <b>Someone already owns this pony</b>
        ) : (
          <Button
            colorScheme="purple"
            m="0.5rem"
            onClick={() => mintNft(nft?.id)}
          >
            Mint pony!
          </Button>
        )}
      </Flex>
    </Box>
  );
};
