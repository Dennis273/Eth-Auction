import './AuctionControl.css';

import { Button, Card, DatePicker, InputNumber, message, TimePicker } from 'antd';
import * as React from 'react';

import { auctionABI } from '../contracts/auction';
import { IAuctionInfo } from '../types';
import { IWeb3Context, Web3Context } from '../web3Context';

const { useState, useContext } = React

interface IAuctionControlBidderProps {
  auctionInfo: IAuctionInfo;
}
export default function AuctionControlBidder(props: IAuctionControlBidderProps) {
  const [pending, setPending] = useState<boolean>(false)
  const [price, setPrice] = useState<number>(0)
  const { endTime, address, valid, currentUserPrice, highestPrice, highestbidder } = props.auctionInfo
  const { web3, currentUser } = useContext(Web3Context) as IWeb3Context
  let contract = new web3.eth.Contract(auctionABI, address)
  const handleBid = () => {
    if (price + currentUserPrice < highestPrice) {
      message.error('当前价格低于最高出价')
      return
    }
    setPending(true)
    contract.methods.bid().send({
      from: currentUser,
      gas: 300000,
      value: web3.utils.toWei(price.toString())
    })
    const subscription = contract.events.signal({ filter: { user: currentUser, message: 'bid' } })
    subscription.on('data', (event) => {
      message.success(`竞标成功！`)
      setPending(false)
      let s = subscription as any
      s.unsubscribe()
    })
  }
  const handleQuit = () => {
    setPending(true)
    contract.methods.quit().send({ from: currentUser, gas: 300000 })
    const subscription = contract.events.signal({ filter: { user: currentUser, message: 'bid' } })
    subscription.on('data', (event) => {
      message.success(`退出成功！`)
      setPending(false)
      let s = subscription as any
      s.unsubscribe()
    })
  }
  const handleNumberChange = (val: number) => setPrice(val)

  const pendingButton = <Button className="control" type='default' loading>确认中...</Button>

  const quitButton = <Button className="control" type='danger' onClick={handleQuit}>退出拍卖</Button>

  const bidButton = <Button className="control" type='primary' onClick={handleBid}>竞标</Button>

  const numberInput = (
    <InputNumber
      className="control"
      value={price}
      onChange={handleNumberChange}
      min={Number(web3.utils.fromWei((highestPrice - currentUserPrice + 1).toString()))}
      step={1}
      precision={4}
    />
  )
  const control = <>
    {numberInput}
    {pending ? pendingButton : bidButton}
    {pending ? pendingButton : quitButton}
  </>
  return <>
    <p>当前出价：{web3.utils.fromWei(currentUserPrice.toString())} ether</p>
    {endTime * 1000 > Date.now() ? control : null}
  </>
}