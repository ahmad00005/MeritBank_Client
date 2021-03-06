import { AuthorizationContext } from "../../AuthorizationContext";
import React, { useState, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";

function DepositTransaction() {
  const [store, setStore] = useContext(AuthorizationContext);
  const isLoggedIn = store.isLoggedIn;
  const role = store.role;
  const jwt = store.jwt;
  const history = useHistory();
  const [targetAccount, setTargetAccount] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmmount] = useState("");
  const [type, setType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const myHeaders = {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    };

    const payload = JSON.stringify({
      targetAccountNum: targetAccount,
      description: description,
      amount: amount,
      transactionType: type,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: payload,
      redirect: "follow",
    };

    fetch("https://merit-bank.herokuapp.com/api/deposit", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        setStore({
          ...store,
          successMessage: "Deposit transaction successfull!",
        });
        history.push("/admin/transactions");
      })
      .catch((error) => console.log("error", error));
  };

  if (!isLoggedIn && role !== "[ROLE_ADMIN]") {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <h3 className="transfer-header">
        <i class="fas fa-chevron-circle-right"></i> Deposit
      </h3>
      <Form onSubmit={handleSubmit} className="wrapper">
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2}>
            Target Account
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              placeholder="Target Account"
              value={targetAccount}
              onChange={(e) => setTargetAccount(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2}>
            Description
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          className="mb-3"
          controlId="formHorizontalPassword"
        >
          <Form.Label column sm={2}>
            Amount
          </Form.Label>
          <Col sm={10}>
            <Form.Control
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmmount(e.target.value)}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm={2}>
            Transaction Type
          </Form.Label>
          <select
            className="form-select"
            onChange={(e) => setType(e.target.value)}
          >
            <option disabled>Select</option>
            <option>Cash</option>
            <option>Check</option>
            <option>ATM</option>
            <option>Admin</option>
          </select>
        </Form.Group>
        <Form.Group as={Row} className="mb-3">
          <Col sm={{ span: 10, offset: 2 }}>
            <Button variant="dark" type="submit">
              Submit
            </Button>
            <Button
              variant="warning"
              onClick={() => history.push("/admin")}
              style={{ marginLeft: "20px" }}
            >
              Cancel
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default DepositTransaction;
