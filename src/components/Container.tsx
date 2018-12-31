import './Container.css';

import { Button, Card, Layout, Menu, Modal } from 'antd';
import * as React from 'react';
import { BrowserRouter as Router, Link, Route } from 'react-router-dom';

import { IWeb3Context, Web3Context } from '../web3Context';
import AuctionInfo from './AuctionInfo';
import AuctionList from './AuctionList';
import NewAuction from './NewAuction';

const { Header, Content } = Layout
const { useState, useEffect, useContext } = React


export default function Container() {
  const { currentUser } = useContext(Web3Context) as IWeb3Context
  return (
    <>
      <Router>
        <Layout className="layout">
          <Header>
            <Menu
              mode="horizontal"
              theme="dark"
              style={{ lineHeight: '64px' }}
            >
              <Menu.Item key="1">
                <Link to='/auctions'>拍卖</Link>
              </Menu.Item>
            </Menu>
            <div className="address">
              <p>{currentUser}</p>
            </div>
          </Header>
          <Content>
            <Card className="container">
              <Route path='/' exact component={AuctionList} />
              <Route path='/auctions' exact component={AuctionList} />
              <Route path='/auctions/:address' exact component={AuctionInfo} />
            </Card>
          </Content>
          <NewAuction />
        </Layout>
      </Router>
    </>
  )
}