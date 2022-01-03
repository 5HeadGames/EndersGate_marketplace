import React from "react";
import {Card, Image, Tooltip, Modal, Input, Alert, Spin, Button} from "antd";

const styles = {
  NFTs: {
    display: "flex",
    flexWrap: "wrap",
    WebkitBoxPack: "start",
    justifyContent: "flex-start",
    margin: "0 auto",
    maxWidth: "1000px",
    gap: "10px",
  },
};

function NFTBalance() {
  const [visible, setVisibility] = React.useState(false);
  const [nftToSend, setNftToSend] = React.useState(null);
  const [price, setPrice] = React.useState(1);
  const [loading, setLoading] = React.useState(false);
  const listItemFunction = "createMarketItem";

  return (
    <>
      <div style={styles.NFTs as any}>
      </div>

      <Modal
        title={`List ${nftToSend?.name} #${nftToSend?.token_id} For Sale`}
        visible={visible}
        onCancel={() => setVisibility(false)}
        //onOk={() => list(nftToSend, price)}
        okText="List"
        footer={[
          <Button onClick={() => setVisibility(false)}>
            Cancel
          </Button>,
          <Button
            //onClick={() => approveAll(nftToSend)}
            type="primary">
            Approve
          </Button>,
          <Button
            //onClick={() => list(nftToSend, price)}
            type="primary">
            List
          </Button>
        ]}
      >
        <Spin spinning={loading}>
          <img
            src={`${nftToSend?.image}`}
            style={{
              width: "250px",
              margin: "auto",
              borderRadius: "10px",
              marginBottom: "15px",
            }}
          />
          <Input
            autoFocus
            placeholder="Listing Price in MATIC"
          //onChange={(e) => setPrice(e.target.value)}
          />
        </Spin>
      </Modal>
    </>
  );
}

export default NFTBalance;
