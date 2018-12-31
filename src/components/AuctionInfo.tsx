import { Button, Card, InputNumber, Skeleton } from 'antd';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IWeb3Context, Web3Context } from '../web3Context';
import AuctionControlBidder from './AuctionControlBidder';
import AuctionControlHolder from './AuctionControlHolder';
import AuctionInfoCard from './AuctionInfoCard';
import useAuction from './hooks/useAuction';

const { useState, useEffect, useContext } = React

interface IRouteProps {
  address: string,
}
interface IAuctionInfoProps extends RouteComponentProps<IRouteProps> {

}

function AuctionInfo(props: IAuctionInfoProps) {
  const [bidPrice, setBidPrice] = useState<number>(100)
  const [pending, setPending] = useState<boolean>(false)
  const { web3, currentUser } = useContext(Web3Context) as IWeb3Context
  const auction = useAuction(props.match.params.address)
  if (auction == null) {
    return (
      <Skeleton loading>
      </Skeleton>
    )
  }
  const { holder, valid } = auction
  const controlHolder = <AuctionControlHolder auctionInfo={auction} />
  const controlBidder = <AuctionControlBidder auctionInfo={auction} />
  return (
    <>
      <h1>拍卖：{auction.address}</h1>
      <Card>
        <AuctionInfoCard auctionInfo={auction} />
      </Card>
      {currentUser === holder ? controlHolder : valid ? controlBidder : null}
    </>
  )
}

export default AuctionInfo