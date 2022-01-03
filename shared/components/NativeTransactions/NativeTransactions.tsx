import React, {useEffect} from "react";
import {getEllipsisTxt} from "../../helpers/formatters";
import 'antd/dist/antd.css';
import {Skeleton, Table} from 'antd'
import styles from "./styles";

function NativeTransactions() {
  const columns = [
    {
      title: 'From',
      dataIndex: 'from_address',
      key: 'from_address',
      render: from => (
        getEllipsisTxt(from, 5)
      )
    },
    {
      title: 'To',
      dataIndex: 'to_address',
      key: 'to_address',
      render: to => (
        getEllipsisTxt(to, 5)
      )
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Hash',
      dataIndex: 'hash',
      key: 'hash',
    }
  ]

  let key = 0;
  return (
    <div>
      <h1 style={styles.title}>💸Native Transactions</h1>
      <Skeleton loading={false}>
        <Table
          columns={columns}
          rowKey={(record) => {
            key++;
            return `${record.transaction_hash}-${key}`;
          }}
        />
      </Skeleton>
    </div>
  );
}

export default NativeTransactions;
