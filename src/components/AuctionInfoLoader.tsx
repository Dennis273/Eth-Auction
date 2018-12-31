import * as React from 'react';
import { IAuctionInfo } from 'src/types';

import { IAuctionInfoCardProps } from './AuctionInfoCard';
import useAuction from './hooks/useAuction';

interface IAuctionInfoLoaderProps {
  address: string;
  children: React.ReactNode;
}
export interface IAuctionInfoWrap {
  auctionInfo?: IAuctionInfo | null;
}
export default function AuctionInfoLoader(props: IAuctionInfoLoaderProps) {
  const auction = useAuction(props.address)
  const childrenWithAuctionInfo = React.Children.map(props.children, (child: React.ReactElement<IAuctionInfoWrap>) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { auctionInfo: auction })
    } else return child
  })
  console.log(props.children)
  return (
    <>
      {childrenWithAuctionInfo}
    </>
  )
}