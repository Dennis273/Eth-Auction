import { Card, List, Skeleton } from 'antd';
import * as moment from 'moment';
import * as React from 'react';

import { IWeb3Context, Web3Context } from '../web3Context';
import AuctionControlHolder from './AuctionControlHolder';
import { IAuctionInfoWrap } from './AuctionInfoLoader';

const web3 = require('web3')

export interface IAuctionInfoCardProps extends IAuctionInfoWrap {
}

export default function AuctionInfoCard(props: IAuctionInfoCardProps) {
  const auction = props.auctionInfo

  if (!auction) {
    return (
      <Card bordered={false}>
        <Skeleton loading />
      </Card>
    )
  }
  const { holder, highestPrice, highestbidder, isInit, valid, endTime, deposit, } = auction
  let timeLeft = moment().to(moment(endTime * 1000))

  const priceIndicator = highestPrice == 0 ? <p>尚未有人出价 </p> : <>
    <p>最高出价：{web3.utils.fromWei(highestPrice.toString())} ether</p>
    <p>最高出价者：{highestbidder} </p>
  </>
  const timeIndicator = endTime * 1000 > Date.now() ? <p>剩余时间：{timeLeft}</p> : <p>已结束</p>
  return (
    <Card bordered={false}>
      <Skeleton loading={auction === null}>
        <p>发起者： {holder}</p>
        {isInit ? <>
          <p>押金：{web3.utils.fromWei(deposit.toString())} ether</p>
          {
            valid ? <>
              {priceIndicator}
              {timeIndicator}
            </> : <p>已过期</p>
          }
        </> : <p>尚未开始</p>
        }
      </Skeleton>
    </Card>
  )
}