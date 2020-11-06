import React from 'react';
import {Navbar} from 'react-bootstrap';
import API from './API/API';
import ServiceList from './components/ServiceListPage';
import TicketDetails from './components/TicketDetailsPage';
import {Switch, Route, Redirect, withRouter} from 'react-router-dom';
import LoginPage from './components/LoginPage';
class App extends React.Component {

  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      user: null,
      loginError: false,
      services: [],
      tickets: [],
      differentCounterIds: [],
    };
  }

  componentDidMount() {
    API.getServices().then((services) => {
      this.setState({ services: services });
    });
    API.getCountersIds().then((countersIds) => {
      this.setState({ differentCounterIds: countersIds });
    });
    API.getTickets().then((tickets) => {
      this.setState({ tickets: tickets });
    });
  }

  updateMode = (mode) => {
    this.setState({ mode: mode });
  }

  updateTicketList = () => {
    API.getTickets().then((tickets) => {
      this.setState({ tickets: tickets });
    });
  }
  
  login = async (username, password) => {
    try{
      const user = await API.login(username, password);
      this.setState({user, loginError: false});
      this.props.history.push('/ticketdetails');
    }
    catch(e){
      console.log(e);
      this.setState((state)=> {return {...state, user: null, loginError: true}});
    }
  }

  render() {
    return (
      <>
        <Navbar bg="dark" variant="dark">
          <Navbar.Brand>Office queue</Navbar.Brand>
        </Navbar>
        <Switch>
          <Route path='/servicelist'>
            <ServiceList serviceList = {this.state.services} selectServiceFunction={API.addTicket} updateTicketList={this.updateTicketList}/>
          </Route>
          <Route path="/ticketdetails">
            {
              !this.state.user ? <Redirect to='/login'/> : <TicketDetails tickets={this.state.tickets} differentCounterIds = {this.state.differentCounterIds} 
                callNextCustomerFunction={API.callNextCustomer} updateTicketList={this.updateTicketList}/>
            }
          </Route>
          <Route path="/login">
            <LoginPage login={this.login} error={this.state.loginError}/>
          </Route>
        </Switch>
      </>
    );
  }
}
export default withRouter(App);
