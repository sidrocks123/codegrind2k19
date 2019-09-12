import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'

class SearchResult extends Component {

  handleCardClick = (dispute) => {
    this.props.handleModal(dispute, this.props.custList)
  }

  render () {
    const { Custid, CName, AcctNo, DisputeId, Email } = this.props.custList
    return (
      <div>
        <Card
          border="danger"
          style={{
            margin: '1%',
          }}
        >
          <Card.Header>
            Customer ID: {Custid}
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
              DisputeId &&
              DisputeId.map((dispute) => {
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
