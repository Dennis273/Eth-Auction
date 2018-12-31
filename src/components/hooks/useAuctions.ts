import { message } from 'antd';
import { useContext, useEffect, useState } from 'react';

import { auctionABI } from '../../contracts/auction';
import { IWeb3Context, Web3Context } from '../../web3Context';

export type IAuctionFilter = "valid" | "isInit" | "isOwner"

let AuctionFilter = async (contract: any, filter: IAuctionFilter[], selfAddress: string): Promise<boolean> => {
  let filters = {
    valid: (): Promise<boolean> => {
      return contract.methods.valid().call()
    },
    isInit: (): Promise<boolean> => {
      return contract.methods.isInit().call()
    },
    isOwner: async () => {
      let holder = await contract.methods.holder().call()
      console.log(holder)
      return holder == selfAddress
    },
  }
  const filterFunc = filter.map(f => filters[f]())
  return Promise.all(filterFunc).then((val) => {
    return val.reduce((prev, cur) => prev && cur, true)
  })
}
export default function useAuctions(filter?: IAuctionFilter[]): [string[] | null, () => void] {
  const [auctions, setAuctions] = useState<string[] | null>(null)
  const [_, set] = useState({})
  const { web3, dispatcher, currentUser } = useContext(Web3Context) as IWeb3Context
  useEffect(() => {
    dispatcher.methods.getAuctions().call().then((auctions: string[]) => {
      if (filter) {
        const ValidPromise = auctions.map(address => {
          let contract = new web3.eth.Contract(auctionABI, address)
          return AuctionFilter(contract, filter, currentUser)
        })
        Promise.all(ValidPromise).then(valid => {
          setAuctions(auctions.filter((_, i) => valid[i]))
        }).catch(err => {
          message.error('获取数据失败！')
          setAuctions(null)
        })
      } else {
        setAuctions(auctions)
      }
    })
  }, [filter, _, currentUser])
  // useEffect(() => {
  //   const subscription = dispatcher.events.NewAuction({})
  //   subscription.on('data', (event) => {
  //     if (auctions) {
  //       set({})
  //     }
  //   })
  //   return () => {
  //     let s = subscription as any
  //     // web3 typing seems to have some mistake
  //     s.unsubscribe()
  //   }
  // }, filter)
  const refresh = () => {
    set({})
    setAuctions(null)
  }
  return [auctions, refresh]
}