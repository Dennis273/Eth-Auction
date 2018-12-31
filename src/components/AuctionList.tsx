import './AuctionList.css';

import { Button, Card, Checkbox, Collapse, List, message, Pagination, Skeleton } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';

import AuctionInfoCard from './AuctionInfoCard';
import AuctionInfoLoader from './AuctionInfoLoader';
import useAuctions, { IAuctionFilter } from './hooks/useAuctions';

const { useState } = React

export default function AuctionList() {
  const [opt, setOpt] = useState<IAuctionFilter[]>([])
  const [validAuction, refresh] = useAuctions(opt)
  const loading = validAuction === null
  const src = validAuction ? validAuction : dummy
  const controlZone = (
    <Collapse>
      <Collapse.Panel header="筛选" key='0'>
        <Checkbox.Group
          options={filterOptions}
          onChange={(checked) => {
            setOpt(checked as IAuctionFilter[])
          }}
        />
      </Collapse.Panel>
    </Collapse>
  )
  const refreshButton = (
    <Button
      loading={loading}
      onClick={() => {
        refresh()
      }}
      className="refresh-btn"
    >
      刷新
    </Button>
  )
  if (validAuction === null) {
    return (
      <Skeleton loading />
    )
  }
  return (
    <>
      {controlZone}
      {refreshButton}
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={src}
        pagination={{
          hideOnSinglePage: true,
          pageSize: 10,
          total: validAuction.length
        }}
        renderItem={(address: string) => {
          if (address === null) {
            return <Skeleton loading={true} />
          } else return (
            <List.Item>
              <Card
                title={<Link to={`/auctions/${address}`}>{address}</Link>}
              >
                <AuctionInfoLoader address={address}>
                  <AuctionInfoCard />
                </AuctionInfoLoader>
              </Card>
            </List.Item>
          )
        }}
      />
    </>
  )
}
const filterOptions = [
  { label: "有效", value: "valid" },
  { label: "已开始", value: "isInit" },
  { label: "由自己发起", value: "isOwner" },
]
const dummy = [null, null, null, null]