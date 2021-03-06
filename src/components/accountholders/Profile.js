import React, { useState, useEffect, useContext } from "react";
import { AuthorizationContext } from "../../AuthorizationContext";
import { useHistory, useParams } from "react-router-dom";
import { Card, CardDeck, Button } from "react-bootstrap";

function Profile() {
  let { id } = useParams();
  const [store] = useContext(AuthorizationContext);
  const jwt = store.jwt;
  const history = useHistory();
  const [accountHolder, setAccountHolder] = useState({});

  useEffect(() => {
    const myHeaders = {
      Authorization: "Bearer " + jwt,
      "Content-Type": "application/json",
    };

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://merit-bank.herokuapp.com/api/accountholders/${id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setAccountHolder(result);
        console.log("profile mounted: ", result);
      })
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <React.Fragment>
      <h3 className="component-header">
        {accountHolder.firstName} {accountHolder.lastName}'s Profile
      </h3>
      <div className="wrapper">
        <CardDeck>
          <Card>
            <Card.Body>
              <Card.Title
                style={{ padding: "10px 0", borderBottom: "3px solid grey" }}
              >
                {accountHolder.firstName}'s' Contact
              </Card.Title>
              <Card.Text>
                Phone: <b>{accountHolder.phone}</b>
              </Card.Text>
              <Card.Text>
                Email: <b>{accountHolder.email}</b>
              </Card.Text>
              <Card.Text>
                Address: <b>{accountHolder.address}</b>
              </Card.Text>
              <Card.Text>
                Date of birth: <b>{accountHolder.dob}</b>
              </Card.Text>
            </Card.Body>
          </Card>
          {/* <Card>
                        <Card.Body>
                            <Card.Title style={{ padding: '10px 0', borderBottom: '3px solid grey' }}>Accounts</Card.Title>
                            <Card.Text>Savings balance:<br /><code>$ {accountHolder.savingsAccounts == null ? 0 : accountHolder.savingsAccounts[0].balance}</code></Card.Text>
                            <Card.Text>Personal Checking balance: <br /><code>$1000</code></Card.Text>
                            <Card.Text>Certificate of Deposit balance: <br /><code>$1000</code></Card.Text>
                        </Card.Body>
                    </Card> */}
          <Card>
            <Card.Body>
              <Card.Title
                style={{ padding: "10px 0", borderBottom: "3px solid grey" }}
              >
                User Info
              </Card.Title>
              {accountHolder.user == null ? (
                <div>
                  <Card.Text>
                    {accountHolder.firstName} does not have a user yet
                  </Card.Text>
                  <Button
                    variant="info"
                    onClick={() => {
                      history.push(`/admin/create-user/${accountHolder.id}`);
                    }}
                  >
                    Create User
                  </Button>
                </div>
              ) : (
                <div>
                  <Card.Text>
                    User Name: <br />
                    <code>{accountHolder.user.userName}</code>
                  </Card.Text>
                  <Card.Text>
                    User Name: <br />
                    <code>******</code>
                  </Card.Text>
                  <Button
                    variant="warning"
                    onClick={() => {
                      history.push(
                        `/admin/udate-user/${accountHolder.user.id}`
                      );
                    }}
                  >
                    Update User Credentials
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </CardDeck>
        <p
          onClick={() => history.push("/admin/accountholders")}
          style={{ color: "blue", cursor: "pointer", marginTop: "40px" }}
        >
          <i class="fas fa-chevron-left"></i> Go Back
        </p>
      </div>
    </React.Fragment>
  );
}

export default Profile;
