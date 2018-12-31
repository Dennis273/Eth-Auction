import './AuctionControl.css';

import { Button, Card, DatePicker, InputNumber, message, TimePicker } from 'antd';
import * as moment from 'moment';
import * as React from 'react';

import { auctionABI } from '../contracts/auction';
import { IAuctionInfo } from '../types';
import { IWeb3Context, Web3Context } from '../web3Context';

const { useState, useContext } = React

interface IAuctionControlHolderProps {
  auctionInfo: IAuctionInfo;
}
export default function AuctionControlHolder(props: IAuctionControlHolderProps) {
  const [pending, setPending] = useState<boolean>(false)
  const [inputDateTime, setInputDateTime] = useState<number | null>(null)
  const [deposite, setDeposite] = useState<number>(0)
  const { web3, currentUser } = useContext(Web3Context) as IWeb3Context
  const { valid, isInit, address, endTime } = props.auctionInfo
  const contract = new web3.eth.Contract(auctionABI, address)
  const handleInitAuction = () => {
    if (inputDateTime === null) return
    message.info('交易确认中...')
    setPending(true)
    contract.methods.init(inputDateTime).send({
      from: currentUser,
      gas: 300000,
      value: web3.utils.toWei(deposite.toString())
    })
    const subscription = contract.events.signal({ filter: { message: 'init' } })
    subscription.on('data', (event) => {
      message.success(`成功开始拍卖${address}`)
      setPending(false)
      let s = subscription as any
      s.unsubscribe()
    })
  }
  const handleCancel = () => {
    setPending(true)
    contract.methods.auctionCancel().send({ from: currentUser, gas: 300000 })
    const subscription = contract.events.signal({ filter: { message: 'cancel' } })
    subscription.on('data', (event) => {
      message.success(`拍卖${address}已取消`)
      setPending(false)
      let s = subscription as any
      s.unsubscribe()
    })
  }
  const handleEnd = () => {
    setPending(true)
    contract.methods.auctionCancel().send({ from: currentUser, gas: 300000 })
    const subscription = contract.events.signal({ filter: { message: 'end' } })
    subscription.on('data', (event) => {
      message.success(`拍卖${address}已结束`)
      setPending(false)
      let s = subscription as any
      s.unsubscribe()
    })
  }
  const pendingButton = (
    <Button loading>
      确认中...
    </Button>
  )
  const initButton = (
    <Button type="primary" onClick={handleInitAuction} className="control">
      开始拍卖
    </Button>
  )
  const cancelButton = (
    <Button type="danger" onClick={handleCancel} className="control">
      取消交易
    </Button>
  )
  const endButton = (
    <Button type="primary" onClick={handleEnd} className="control">
      结束交易
    </Button>
  )
  const initializer = (<>
    <div>
      押金: <InputNumber
        className="control"
        value={deposite}
        min={0}
        step={1}
        precision={4}
        onChange={(val) => setDeposite(val as number)}
      /> ether
    </div>
    <div>
      结束时间：{ValidDateTimePicker((date) => {
        if (date) setInputDateTime(date.unix())
        else setInputDateTime(null)
      })}
    </div>
    {pending ? pendingButton : initButton}
  </>)
  const controller = (<>
    {pending ? pendingButton : cancelButton}
    {endTime * 1000 > Date.now() ? null : endButton}
  </>)
  return <>
    {isInit ? valid ? controller : null : initializer}
  </>
}

const ValidDateTimePicker = (f: (date: any) => void) => {
  return (
    <DatePicker
      format="YYYY-MM-DD HH:mm:ss"
      disabledDate={(d) => {
        let m = moment()
        m = m.subtract(1, 'day')
        return d.isBefore(m)
      }}
      disabledTime={(cur) => {
        if (cur === undefined || cur.isAfter(new Date())) {
          return {}
        }
        return {
          disabledHours: () => {
            const now = moment().hour()
            const t = []
            for (let i = 0; i <= now + 1; i++) t.push(i)
            return t
          },
        }
      }}
      showTime={true}
      onChange={f}
    />
  )
}