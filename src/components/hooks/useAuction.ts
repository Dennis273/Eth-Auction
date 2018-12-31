import { useContext, useEffect, useState } from 'react';

import { auctionABI } from '../../contracts/auction';
import { IAuctionInfo } from '../../types';
import { IWeb3Context, Web3Context } from '../../web3Context';

export default function useAuction(address: string) {
  const [auction, setAuction] = useState<IAuctionInfo | null>(null)
  const [refresh, setRefresh] = useState<{}>({})
  const { web3, currentUser } = useContext(Web3Context) as IWeb3Context
  useEffect(() => {
    if (!web3.utils.isAddress(address)) return
    if (!currentUser) return
    const contract = new web3.eth.Contract(auctionABI, address)
    Promise.all([
      contract.methods.holder().call(),
      contract.methods.highestbidder().call(),
      contract.methods.endTime().call(),
      contract.methods.deposit().call(),
      contract.methods.isInit().call(),
      contract.methods.valid().call(),
      contract.methods.isCancel().call(),
    ]).then(([
      holder,
      highestbidder,
      endTime,
      deposit,
      isInit,
      valid,
      isCancel,
    ]) => {
      Promise.all([
        contract.methods.price(highestbidder).call(),
        contract.methods.price(currentUser).call(),
      ]).then(([
        highestPrice,
        currentUserPrice
      ]) => {
        setAuction({
          holder, highestbidder, endTime, highestPrice, deposit, valid, isInit, address, isCancel, currentUserPrice
        })
      })
    }).catch(err => {
      console.log(address)
      console.log(err)
      setAuction(null)
    })
  }, [address, refresh, currentUser])
  useEffect(() => {
    const contract = new web3.eth.Contract(auctionABI, address)
    let subscription = contract.events.allEvents()
    subscription.on('data', (event) => {
      setRefresh({})
    })
    return () => {
      let s = subscription as any
      s.unsubscribe()
    }
  }, [address])
  return auction
}