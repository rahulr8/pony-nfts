import { SimpleGrid, Flex, Heading } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNFTCollection, useChainId, ChainId } from "@thirdweb-dev/react";
import { NftItem } from "components";
import { withProtected } from "utils/withProtected";

const GalleryComponent: React.FC = () => {
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

  const nftCollectionAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  const nftCollection = useNFTCollection(nftCollectionAddress);

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
          <NftItem
            key={nftMetadata.indexOf(nft)}
            nft={nft}
            nftCollection={nftCollection}
          />
        ))}
      </SimpleGrid>
    );
  } else {
    return <Heading>Loading...</Heading>;
  }
};

export const Gallery = withProtected(GalleryComponent);
