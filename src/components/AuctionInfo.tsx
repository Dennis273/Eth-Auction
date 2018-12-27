import { Button, InputNumber, Skeleton } from 'antd';
import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { IAuction } from '../types';

const { useState, useEffect } = React

interface IRouteProps {
  address: string,
}
interface IProps extends RouteComponentProps<IRouteProps> {

}

function AuctionInfo(props: IProps) {
  const [auction, setAuction] = useState<IAuction | null>(null)
  const [bidPrice, setBidPrice] = useState<number>(100)
  const [pending, setPending] = useState<boolean>(false)
  useEffect(() => {
    // TODO: Get Auction info hear
    setAuction({ address: props.match.params.address, currentPrice: 1 })
  }, [props.match.params.address])
  if (auction == null) {
    return (
      <Skeleton loading>
        <div style={{ height: '100%' }} />
      </Skeleton>
    )
  }
  const handlePriceChange = (value: number) => {
    setBidPrice(value)
  }
  const handleBid = () => {
    setPending(true)
    // TODO: Bid here
    alert('handleBid')
  }
  const handleCancel = () => {
    setPending(true)
    // TODO: cancel bid
    alert("hanldeCancel")
  }
  const handleQuit = () => {
    setPending(true)
    // TODO: quit bid
    alert("handleQuit")
  }
  return (
    <>
      <h1>{props.match.params.address}</h1>
      <div>
        <InputNumber
          min={1}
          defaultValue={100}
          onChange={handlePriceChange}
        />
        <Button
          onClick={handleBid}
          disabled={pending}
        >
          投标
        </Button>
      </div>
      <div>
        <Button
          onClick={handleQuit}
          disabled={pending}
        >
          退出
        </Button>
      </div>
      <div>
        <Button
          onClick={handleCancel}
          disabled={pending}
        >
          取消
        </Button>
      </div>
    </>
  )
}

export default AuctionInfo