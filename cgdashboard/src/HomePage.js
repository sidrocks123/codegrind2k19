import React, { Component } from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import SearchResult from './SearchResult'
import CardGroup from 'react-bootstrap/CardGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

class HomePage extends Component {

  state = {
    searchText: '',
    currentCust: {},
    isDisputeModalShowing: false,
    currentDispute: {},
    custList: {},
  }

  temp = {
   "1000" : {"CName":"Rohin Satija","Email":"rohinsatija2410@gmail.com","Custid":1000 , "AcctNo": 4617325565841234, "DisputeId": ["0001", "0006"]},
   "2000" : {"CName":"Aprysta","Email":"apry@gmail.com","Custid":2000 , "AcctNo": 4617325565845634, "DisputeId": ["0002"]},
   "3000" : {"CName":"Khanooja","Email":"khanu@gmail.com","Custid":3000 , "AcctNo": 4617325565846534 , "DisputeId": ["0003"]},
   "4000" : {"CName":"sarthak","Email":"sarthak@gmail.com","Custid":4000 , "AcctNo": 4617325565845462, "DisputeId": ["0004"]},
   "5000" : {"CName":"Divisha","Email":"divu@gmail.com","Custid":5000 , "AcctNo": 4617325565846537, "DisputeId": []}
  }

 dispListTemp = {
   "1000" : {"DisputeId": "0001","ProbCases":["Charegeback","Lost&Stolen"],"Probabilities":[0.75,0.63]},
   "2000" : {"DisputeId": "0002","ProbCases":["Duplicate Payment"],"Probabilities":[0.92]},
   "3000" : {"DisputeId": "0003","ProbCases":["Fradulent Transaction","ForgotPin"],"Probabilities":[0.82,0.53]},
   "4000" : {"DisputeId": "0004","ProbCases":["Chargeback"],"Probabilities":[0.96]},
   "5000" : {"DisputeId": "0005","ProbCases":["ForgotPin","Chargeback"],"Probabilities":[0.80,0.76]}
 }

 searchInMainCustList = (event) => {
   return event.target.value === '' ? {} : Object.values(this.temp).filter(cust =>
     cust.CName.includes(event.target.value)
     || cust.Email.includes(event.target.value)
     || cust.Custid.toString().includes(event.target.value)
     || cust.DisputeId.includes(event.target.value)
     || cust.AcctNo.toString().includes(event.target.value)
   )
 }

  handleChange = (event) => {
    const custList = this.searchInMainCustList(event)
    this.setState({
      searchText: event.target.value,
      custList,
    })
  }

  findDispute = (clickedDisputeID) =>{
    return Object.values(this.dispListTemp).filter(dispute => (
      dispute.DisputeId === clickedDisputeID
    ))
  }

  showDisputeModal = (clickedDisputeID, currentCust) => {
    let x = this.findDispute(clickedDisputeID)
    x = x.length > 0 ? x : console.log("Make API call");
    this.setState({
      isDisputeModalShowing: true,
      currentCust,
      currentDispute: x[0],
    })
  }

  hideDisputeModal = () => {
    this.setState({
      isDisputeModalShowing: false,
      currentDispute: {},
      currentCust: {}
    })
  }

  getResolutionDetails = (caseType) => {
    switch (caseType) {
      case "Duplicate Payment":
        return "Verify the transaction details of the customer for transaction dated 24/10/2019. If duplicate payment found, initiate a refund to the customer."
      case "ForgotPin":
        return "Send the reset pin link to the customer's email address"
      case "Charegeback":
        return "Raise a ticket against merchant and initiate the chargeback."
      case "Lost&Stolen":
        return "Customer's plastic card lost or stolen. Block the existing card. Initiate process for new card."
      default:
        return "New case. No case found. Please check manually."
    }
  }

  render () {
    const { searchText, isCustDetailModalShowing, isDisputeModalShowing, currentDispute, currentCust, custList } = this.state
    let caseAndProbArray = []
    if (currentDispute.length !== {} && currentDispute.ProbCases && currentDispute.Probabilities) {
      for (let x = 0; x < currentDispute.ProbCases.length; x++) {
        let subArray = []
        subArray.push(currentDispute.ProbCases[x])
        subArray.push(currentDispute.Probabilities[x])
        subArray.push(this.getResolutionDetails(currentDispute.ProbCases[x]))
        caseAndProbArray.push(subArray)
      }
    }
    return (
      <div>
        <InputGroup className='search-box' size="lg">
          <FormControl
            aria-label="Large"
            aria-describedby="inputGroup-sizing-sm"
            placeholder="Search by Customer Name, Customer ID, Dispute"
            onChange={this.handleChange}
          />
        </InputGroup>
        <div className="search-results">
        <CardGroup>
          {
            Object.values(custList).map(cust => (
                <SearchResult
                  custList={cust}
                  handleModal={this.showDisputeModal}
                />
            ))
          }
          </CardGroup>
        </div>

        <Modal show={isDisputeModalShowing} onHide={this.hideDisputeModal}>
          <Modal.Header closeButton>
            <Modal.Title>Dispute {currentDispute.DisputeId} Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>Customer ID: </b> {currentCust.Custid}<br/>
            <b>Customer Name: </b> {currentCust.CName}<br/><br/>
            <b>Possible Cases: </b>
            {
              currentDispute.length !== {}
              && currentDispute.ProbCases
              && currentDispute.ProbCases.join(", ")
            }
            <br/>
            <br/>
            {
              caseAndProbArray !== []
              && caseAndProbArray.map(caseAndProb => (
                <div>
                  <b>Chances of {caseAndProb[0]} case: </b> {caseAndProb[1]*100}%<br/>
                  <b>Resolution for {caseAndProb[0]}: </b> {caseAndProb[2]}<br/><br/>
                </div>
              ))
            }


          </Modal.Body>
          <Modal.Footer>
            <Button variant="danger" onClick={this.hideDisputeModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default HomePage
