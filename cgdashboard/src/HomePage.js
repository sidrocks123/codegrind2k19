import React, { Component } from 'react'
import InputGroup from 'react-bootstrap/InputGroup'
import FormControl from 'react-bootstrap/FormControl'
import SearchResult from './SearchResult'
import CardGroup from 'react-bootstrap/CardGroup'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import JSONResponseD from './data/data.json'
import JSONResponseF from './data/final.json'

class HomePage extends Component {

  state = {
    currentCust: {},
    isDisputeModalShowing: false,
    currentDispute: {},
    custList: {},
  }

  temp = JSONResponseD;

 dispListTemp = JSONResponseF;

 searchInMainCustList = (event) => {
   return event.target.value === '' ? {} : Object.values(this.temp).filter(cust =>
     cust.CName.includes(event.target.value)
     || cust.Email.includes(event.target.value)
     || cust.CustID.toString().includes(event.target.value)
     || cust.DisputeID.includes(event.target.value)
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
      dispute.DisputeID === clickedDisputeID
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
      case "Forgot PIN":
        return "Send the reset pin link to the customer's email address"
      case "Chargeback":
        return "Raise a ticket against merchant and initiate the chargeback."
      case "Lost&Stolen":
        return "Customer's plastic card lost or stolen. Block the existing card. Initiate process for new card."
      default:
        return "New case. No case found. Please check manually."
    }
  }

  render () {

    const { isDisputeModalShowing, currentDispute, currentCust, custList } = this.state

    let isProbablity1 = false

    let caseAndProbArray = []
    if (currentDispute.length !== {} && currentDispute.ProbCases && currentDispute.Probabilities) {
      for (let x = 0; x < currentDispute.ProbCases.length; x++) {
        let subArray = []
        if (currentDispute.Probabilities[x] === 1) {
          caseAndProbArray = []
          isProbablity1 = true
        }
        subArray.push(currentDispute.ProbCases[x])
        subArray.push(currentDispute.Probabilities[x])
        subArray.push(this.getResolutionDetails(currentDispute.ProbCases[x]))
        caseAndProbArray.push(subArray)
        if (currentDispute.Probabilities[x] === 1) break
      }
    }
    let caseDisplay = isProbablity1
      ? caseAndProbArray[0][0]
      : currentDispute.length !== {} && currentDispute.ProbCases ? currentDispute.ProbCases.join(", ") : ""

    let urgencyDisplay
    if (currentDispute.Polarity === "Positive")
      urgencyDisplay = "Low Priority"
    else if (currentDispute.Polarity === "Negative")
      urgencyDisplay = "Max Priority"
    else
      urgencyDisplay = "Medium Priority"
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
            <Modal.Title>Dispute {currentDispute.DisputeID} Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <b>Customer ID: </b> {currentCust.CustID}<br/>
            <b>Customer Name: </b> {currentCust.CName}<br/><br/>
            <b>Possible Cases: </b>{caseDisplay}<br/><br/>
            {
              caseAndProbArray !== []
              && caseAndProbArray.map(caseAndProb => (
                caseAndProb[1] === 1 ? (
                  <div>
                    <b>Resolution for {caseAndProb[0]}: </b> {caseAndProb[2]}<br/><br/>
                  </div>
                ) : (
                  <div>
                    <b>Chances of {caseAndProb[0]} case: </b> {caseAndProb[1]*100}%<br/>
                    <b>Resolution for {caseAndProb[0]}: </b> {caseAndProb[2]}<br/><br/>
                  </div>
                )
              ))
            }
            <b>Urgency of Case: </b>{urgencyDisplay}<br/><br/>
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
