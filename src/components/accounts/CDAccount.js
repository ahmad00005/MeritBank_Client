import { AuthorizationContext } from "../../AuthorizationContext";
import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";

function CDAccount() {
  const [balance, setBalance] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cdOfferingID, setCDOfferingID] = useState("");

  const [store, setStore] = useContext(AuthorizationContext);
  const jwt = store.jwt;
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();

    const myHeaders = {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    };

    const payload = JSON.stringify({
      balance: balance,
      cdOffering: {
        id: cdOfferingID,
      },
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: payload,
      redirect: "follow",
    };

    fetch(
      `https://merit-bank.herokuapp.com/api/accountholders/${accountNumber}/cdAccounts`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setStore({ ...store, successMessage: "Account Created Successfully!" });
        history.push("/admin/accounts");
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div className="">
      <h4 className="transfer-header">
        <i class="fas fa-chevron-circle-right"></i> Add Certificate of Deposit
        Account
      </h4>
      <div className="form-container">
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2}>
              Account Holders ID
            </Form.Label>
            <Col sm={4}>
              <Form.Control
                type="number"
                placeholder="Account Holders ID"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column sm={2}>
              {" "}
              Amount
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="number"
                placeholder="Amount"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group
            as={Row}
            className="mb-3"
            controlId="formHorizontalPassword"
          >
            <Form.Label column sm={2}>
              CD Offering ID
            </Form.Label>
            <Col sm={3}>
              <Form.Control
                type="number"
                placeholder="CD Offering ID"
                value={cdOfferingID}
                onChange={(e) => setCDOfferingID(e.target.value)}
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            <Col sm={{ span: 10, offset: 2 }}>
              <Button variant="dark" type="submit">
                Submit
              </Button>
              <Button
                variant="warning"
                onClick={() => history.push("/admin/accounts")}
                style={{ marginLeft: "20px" }}
              >
                Cancel
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default CDAccount;
