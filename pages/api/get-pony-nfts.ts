import { PONIES } from "../../utils/ponies";
import type { NextApiRequest, NextApiResponse } from "next";
import {
  ThirdwebSDK,
  NFTMetadataOwner,
  PayloadToSign721,
} from "@thirdweb-dev/sdk";
import dotenv from "dotenv";

dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const nfts = PONIES;

  // Connect to thirdweb SDK
  const sdk = ThirdwebSDK.fromPrivateKey(
    process.env.NEXT_PUBLIC_PRIVATE_KEY as string,
    "rinkeby"
  );

  const nftCollectionAddress = process.env
    .NEXT_PUBLIC_CONTRACT_ADDRESS as string;
  const nftCollection = sdk.getNFTCollection(nftCollectionAddress);

  switch (req.method) {
    case "GET":
      try {
        const mintedNfts: NFTMetadataOwner[] = await nftCollection?.getAll();

        if (!mintedNfts) {
          res.status(200).json(nfts);
        }

        // TODO: This is a pretty cursory way of doing this. Can use a UUID instead

        mintedNfts.forEach((nft) => {
          if (nft.metadata.attributes) {
            // @ts-expect-error
            const positionInMetadataArray = nft.metadata.attributes.id;
            nfts[positionInMetadataArray].minted = true;
          }
        });
      } catch (error) {
        console.error(error);
      }
      res.status(200).json(nfts);
      break;

    case "POST":
      // Get ID of the NFT to mint and address of the user from request body
      const { id, address } = req.body;

      // Ensure that the requested NFT has not yet been minted
      if (nfts[id].minted === true) {
        res.status(400).json({ message: "Invalid request" });
      }

      // Allow the minting to happen anytime from now
      const startTime = new Date(0);

      // Find the NFT to mint in the array of NFT metadata using the ID
      const nftToMint = nfts[id];

      // Set up the NFT metadata for signature generation
      const metadata: PayloadToSign721 = {
        metadata: {
          name: nftToMint.name,
          description: nftToMint.description,
          image: nftToMint.url,
          // Set the id attribute which we use to find which NFTs have been minted
          attributes: { id },
        },
        mintStartTime: startTime,
        to: address,
      };

      try {
        const response = await nftCollection?.signature.generate(metadata);

        // Respond with the payload and signature which will be used in the frontend to mint the NFT
        res.status(201).json({
          payload: response?.payload,
          signature: response?.signature,
        });
      } catch (error) {
        res.status(500).json({ error });
        console.error(error);
      }
      break;

    default:
      res.status(200).json(nfts);
  }
}
