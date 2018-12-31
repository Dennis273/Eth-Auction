import './App.css';
import 'antd/dist/antd.css';

import { message } from 'antd';
import * as React from 'react';

import Container from './components/Container';
import { auctionDispatcherABI } from './contracts/auctionDispatcher';
import { Web3Context } from './web3Context';

let Web3 = require('web3')

declare global {
  interface Window { web3: any; }
}

const { useState, useEffect } = React;

function App() {
  const [metamaskInject, setMetamaskInject] = useState<boolean | undefined>(undefined)
  const [currentUser, setCurrentUser] = useState<string | undefined>(undefined)
  useEffect(() => {
    let web3 = window.web3
    if (web3 === undefined) {
      setMetamaskInject(false)
    } else {
      message.success(messages.web3detected)
      window.web3.currentProvider.enable().then(() => {
        message.success(messages.providerLoginSuccess)
      })
      setMetamaskInject(true)
    }
  }, [window.web3])

  if (metamaskInject === undefined) {
    return (
      <div>
        {messages.loading}
      </div>
    )
  }
  if (!metamaskInject) {
    return (
      <div>
        {messages.web3NotDetected}
      </div>
    )
  }
  let web3js = new Web3(window.web3.currentProvider)
  let dispatcher = new web3js.eth.Contract(auctionDispatcherABI, "0x3781fb537553828d29c5f5e25793d27b2fd88b01")
  useEffect(() => {
    let timerId: number;
    if (currentUser !== undefined) {
      timerId = window.setInterval(() => {
        web3js.eth.getAccounts().then((accounts: string[]) => {
          if (currentUser !== accounts[0]) {
            message.warn(messages.userChange)
            setCurrentUser(accounts[0])
          }
        })
      }, 1000)
    } else {
      web3js.eth.getAccounts().then((accounts: string[]) => {
        setCurrentUser(accounts[0])
      })
    }
    return () => {
      if (timerId !== undefined) {
        window.clearInterval(timerId)
      }
    }
  }, [currentUser])

  return (
    <Web3Context.Provider value={{ web3: web3js, currentUser: currentUser as string, dispatcher }}>
      <Container />
    </Web3Context.Provider>
  )
}

const messages = {
  web3detected: "检测到Web3注入！",
  web3NotDetected: "未检测到Web3注入！",
  providerLoginSuccess: "成功访问用户账户！",
  providerLoginFail: "访问用户账户失败！",
  userChange: "检测到用户变化！",
  loading: "检测中...",
}
export default App;
