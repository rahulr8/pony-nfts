import { useEffect, useState } from "react";
import { useNFTCollection, useChainId, ChainId } from "@thirdweb-dev/react";
import { NftItem } from "components";
import { withProtected } from "utils/withProtected";
import { Grid } from "@mantine/core";

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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "5rem",
        }}
      >
        <h2>Please connect to the Rinkeby Testnet</h2>
      </div>
    );
  }

  if (fetchedNfts) {
    return (
      <Grid columns={3} gutter="md" justify="center">
        {nftMetadata?.map((nft: any) => (
          <NftItem
            key={nftMetadata.indexOf(nft)}
            nft={nft}
            nftCollection={nftCollection}
          />
        ))}
      </Grid>
    );
  } else {
    return <h1>Loading...</h1>;
  }
};

export const Gallery = withProtected(GalleryComponent);
