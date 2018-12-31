import { Button, message, Modal } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { IWeb3Context, Web3Context } from '../web3Context';

const { useState, useContext } = React;

export default function NewAuction() {
  const [pending, setPending] = useState<boolean>(false)
  const [auctionAddress, setAuctionAddress] = useState<string | null>(null)
  const [modalState, setModalState] = useState<boolean>(false)
  let { dispatcher, currentUser } = useContext(Web3Context) as IWeb3Context

  const handleConfirm = () => {
    setPending(true)
    message.info("交易确认中...")
    dispatcher.methods.newAuction().send({ from: currentUser, gas: "3000000" })
    let subscription = dispatcher.events.NewAuction()
    subscription.on('data', (event) => {
      message.success(`成功发起拍卖${event.returnValues.auctionAddress}`)
      setPending(false)
      setAuctionAddress(event.returnValues.auctionAddress)
      let s = subscription as any
      s.unsubscribe()
    })
    // dispatcher.methods.getNewId().call().then(val => {

    // })
  }
  const handleCancel = () => {
    if (!pending) {
      setAuctionAddress(null)
      setModalState(false)
    }
  }
  const handleNewAuctionClick = () => {
    if (pending) {
      message.error('有未确认交易！')
    } else {
      setModalState(true)
    }
  }
  const footer = auctionAddress ? [

    <Link to={`/auctions/${auctionAddress}`} onClick={handleCancel}>跳转至拍卖</Link>
  ] : [
      <Button key="cancel" disabled={pending} onClick={handleCancel}>返回</Button>,
      <Button key="confirm" type="primary" loading={pending} onClick={handleConfirm}>{pending ? '确认中' : '确认'}</Button>
    ]
  return (
    <>
      <Button
        onClick={handleNewAuctionClick}
        type="primary"
        shape="circle"
        className="new-auction-button"
        icon="plus"
      />
      {
        modalState ? <Modal
          maskClosable={auctionAddress === null}
          destroyOnClose={true}
          visible={true}
          footer={footer}
          title={auctionAddress ? auctionAddress : '确定要发起拍卖？'}
          onCancel={handleCancel}
        >
          <p>成功发起买卖后可以设定结束时间以及押金</p>
        </Modal> : null
      }
    </>
  )
}