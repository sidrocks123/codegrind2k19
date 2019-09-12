import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

class SearchResult extends Component {

  handleCardClick = (dispute) => {
    this.props.handleModal(dispute, this.props.custList)
  }

  render () {
    const { CustID, CName, AcctNo, DisputeID, Email } = this.props.custList
    return (
      <div>
        <Card
          border="danger"
          style={{
            width: '20rem',
            height: '15rem',
          }}
        >
          <Card.Header>
            Customer ID: {CustID}
          </Card.Header>
          <Card.Body>
            <Card.Title>Customer Name: {CName}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              Account Number: {AcctNo}
            </Card.Subtitle>
            <Card.Subtitle className="mb-2 text-muted">
              Email: {Email}
            </Card.Subtitle>
            {
              DisputeID &&
              DisputeID.map((dispute) => {
                return(
                  <a style={{ cursor: 'pointer' }} onClick={() => this.handleCardClick(dispute)}>
                    <Card.Link href="#">{`${dispute}`}</Card.Link>&nbsp;
                  </a>
                )
              })
            }
          </Card.Body>
        </Card>
      </div>
    )
  }
}

export default SearchResult
