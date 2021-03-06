import { AuthorizationContext } from "../../AuthorizationContext";
import React, { useState, useEffect, useContext } from "react";
import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { Table, Alert } from "react-bootstrap";

import { CD_OFFERINGS } from "../../ResourceEndpoints";

function CDOfferingList() {
  const [store, setStore] = useContext(AuthorizationContext);
  const isLoggedIn = store.isLoggedIn;
  const role = store.role;
  const jwt = store.jwt;
  const history = useHistory();
  const [cdOfferings, setCDOfferings] = useState([]);
  const successMessage = store.successMessage;

  if (successMessage !== "") {
    setTimeout(() => setStore({ ...store, successMessage: "" }), 2000);
  }
  useEffect(() => {
    showAOfferings();
  }, []);

  async function showAOfferings() {
    axios
      .get(CD_OFFERINGS, {
        headers: {
          Authorization: `Bearer ` + jwt,
        },
      })
      .then((res) => {
        setCDOfferings(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.error(cdOfferings);
      });
  }

  const deleteOffering = (id) => {
    const myHeaders = {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    };

    const raw = JSON.stringify({
      id: id,
    });

    const requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("https://merit-bank.herokuapp.com/api/CDOfferings", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        showAOfferings();
        setStore({
          ...store,
          successMessage: "CD Offerubg deleted Successfully!",
        });
      })
      .catch((error) => console.log("error", error));
  };

  if (!isLoggedIn && role !== "[ROLE_ADMIN]") {
    return <Redirect to="/user" />;
  }

  return (
    <div className="container">
      {successMessage && <Alert variant="success">{successMessage}</Alert>}
      <h3 className="component-header">CD Offerings</h3>
      <div className="wrapper">
        <Table
          style={{ backgroundColor: "white", textAlign: "center" }}
          className="table table-striped table-bordered"
        >
          <thead>
            <tr>
              <th>
                <i
                  className="fas fa-plus text-primary"
                  style={{ cursor: "pointer" }}
                  onClick={() => history.push("/admin/addcdofferomg")}
                ></i>
              </th>
              <th>ID</th>
              <th>Interest Rate</th>
              <th>Term</th>
            </tr>
          </thead>
          <tbody>
            {cdOfferings.map((cdOffering) => (
              <tr key={cdOffering.id}>
                <td>
                  <i
                    className="far fa-trash-alt text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete the offering?`
                        )
                      ) {
                        deleteOffering(cdOffering.id);
                      }
                    }}
                  ></i>
                </td>
                <td>{cdOffering.id}</td>
                <td>{cdOffering.interestRate}</td>
                <th>{cdOffering.term} Years</th>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default CDOfferingList;
