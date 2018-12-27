import { List, Skeleton } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { IAuction } from '../types';

const { useState, useEffect } = React

export default function AuctionList() {
  const [auctions, setAuctions] = useState<IAuction[] | null>(null)
  useEffect(() => {
    // TODO: get auctions here
    new Promise(resolve => {
      setTimeout(() => {
        resolve()
      }, 2000)
    }).then(() => {
      const a: IAuction[] = []
      for (let i = 0; i < 3; i++) {
        a.push(test)
      }
      setAuctions(a)
    })
  })
  const src = auctions ? auctions : dummy
  return (
    <List
      itemLayout="horizontal"
      dataSource={src}
      renderItem={listItem}
    />
  )
}
const listItem = (auction?: IAuction) => {
  if (auction) {
    return (
      <List.Item>
        <List.Item.Meta
          title={<a href={`/auctions/${auction.address}`}>{auction.address}</a>}
          description="Descript of this auction"
        />
      </List.Item>
    )
  } else {
    return (
      <Skeleton loading>
        <List.Item />
      </Skeleton>
    )
  }
}
const dummy = [null, null, null]
const test: IAuction = {
  address: 'afasfafafaf',
  currentPrice: 3999,
}