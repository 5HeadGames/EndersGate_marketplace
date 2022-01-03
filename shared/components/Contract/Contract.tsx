import { Button, Card, Input, Typography, Form, notification } from "antd";
import { useMemo, useState } from "react";
import contractInfo from "@shared/contracts/contractInfo.json";
import Address from "@shared/components/Address/Address";
import { getEllipsisTxt } from "@shared/helpers/formatters";
import { useEffect } from "react";

const { Text } = Typography;

export default function Contract() {
  const { contractName, networks, abi } = contractInfo;
  const [responses, setResponses] = useState({});
  const contractAddress = networks[1337].address;

  const displayedContractFunctions = useMemo(() => {
    if (!abi) return [];
    return abi.filter((method) => method["type"] === "function");
  }, [abi]);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  return (
    <div style={{ margin: "auto", display: "flex", gap: "20px", marginTop: "25", width: "70vw" }}>
      <Card
        title={
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            Your contract: {contractName}
            <Address avatar="left" copyable address={contractAddress} size={8} />
          </div>
        }
        size={"large" as any}
        style={{
          width: "60%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        <Form.Provider
          onFormFinish={async (name, { forms }) => {
            const params = forms[name].getFieldsValue();

            let isView = false;

            for (let method of abi) {
              if (method.name !== name) continue;
              if (method.stateMutability === "view") isView = true;
            }

            const options = {
              contractAddress,
              functionName: name,
              abi,
              params,
            };

          }}
        >
          {displayedContractFunctions &&
            displayedContractFunctions.map((item, key) => (
              <Card
                title={`${key + 1}. ${item?.name}`}
                size="small"
                style={{ marginBottom: "20px" }}
              >
                <Form layout="vertical" name={`${item.name}`}>
                  {item.inputs.map((input, key) => (
                    <Form.Item
                      label={`${input.name} (${input.type})`}
                      name={`${input.name}`}
                      required
                      style={{ marginBottom: "15px" }}
                    >
                      <Input placeholder="input placeholder" />
                    </Form.Item>
                  ))}
                  <Form.Item style={{ marginBottom: "5px" }}>
                    <Text style={{ display: "block" }}>
                      {responses[item.name]?.result &&
                        `Response: ${JSON.stringify(responses[item.name]?.result)}`}
                    </Text>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={responses[item?.name]?.isLoading}
                    >
                      {item.stateMutability === "view" ? "Read🔎" : "Transact💸"}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            ))}
        </Form.Provider>
      </Card>
      <Card
        title={"Contract Events"}
        size={"large" as any}
        style={{
          width: "40%",
          boxShadow: "0 0.5rem 1.2rem rgb(189 197 209 / 20%)",
          border: "1px solid #e7eaf3",
          borderRadius: "0.5rem",
        }}
      >
        {
          //data.map((event, key) => (
          //<Card title={"Transfer event"} size="small" style={{ marginBottom: "20px" }}>
            //{getEllipsisTxt(event.attributes.transaction_hash, 14)}
          //</Card>
        //))
        }
      </Card>
    </div>
  );
}
