import './Container.css';

import { Card, Layout, Menu } from 'antd';
import * as React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AuctionInfo from './AuctionInfo';
import AuctionList from './AuctionList';

const { Header, Content } = Layout
const { useState, useEffect } = React
export default function Container() {
  const [metamaskInject, setMetamaskInject] = useState(null)
  useEffect(() => {
    // TODO: Check Metamask injection
  })

  return (
    <>
      <Router>
        <Layout className="layout">
          <Header>
            <Menu>
              <div>
                Eth-Auction
              </div>
            </Menu>
          </Header>
          <Content>
            <Card className="container">
              <Route path='/' exact component={AuctionList} />
              <Route path='/new' />
              <Route path='/auctions' exact component={AuctionList} />
              <Route path='/auctions/:address' exact component={AuctionInfo} />
            </Card>
          </Content>
        </Layout>
      </Router>
    </>
  )
}