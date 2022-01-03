import React from "react";
import {Table, Tag, Space} from "antd";
import {PolygonCurrency} from "../../shared/components/Chains/Logos";

const styles = {
  table: {
    margin: "0 auto",
    width: "1000px",
  },
};

function NFTMarketTransactions() {
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Item",
      key: "item",
      render: (text, record) => (
        <Space size="middle">
          <span>#{record.item}</span>
        </Space>
      ),
    },
    {
      title: "Collection",
      key: "collection",
      render: (text, record) => (
        <Space size="middle">
        </Space>
      ),
    },
    {
      title: "Transaction Status",
      key: "tags",
      dataIndex: "tags",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "geekblue";
            let status = "BUY";
            if (tag === false) {
              color = "volcano";
              status = "waiting";
            } else if (tag === true) {
              color = "green";
              status = "confirmed";
            }
            if (tag === 'walletAddress') {
              status = "SELL";
            }
            return (
              <Tag color={color} key={tag}>
                {status.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Price",
      key: "price",
      dataIndex: "price",
      render: (e) => (
        <Space size="middle">
          <PolygonCurrency />
          <span>{e}</span>
        </Space>
      ),
    }
  ];

  return (
    <>
      <div>
        <div style={styles.table}>
          <Table columns={columns} dataSource={[]} />
        </div>
      </div>
    </>
  );
}

export default NFTMarketTransactions;
