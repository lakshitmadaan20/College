import React, { Component } from 'react';
import Web3 from 'web3'
import './App.css';
import College from '../abis/College.json'
import Navbar from './Navbar'
import Spinner from './Spinner'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = College.networks[networkId]
    if(networkData) {
      const college = web3.eth.Contract(College.abi, networkData.address)
      this.setState({ college })
      const studentCount = await college.methods.studentCount().call()
      this.setState({ studentCount })
      // Load students
      for (var i = 1; i <= studentCount; i++) {
        const student = await college.methods.students(i).call()
        this.setState({
          students: [...this.state.students, student]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('College contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      studentCount: 0,
      students: [],
      loading: true
    }

    this.addStudent = this.addStudent.bind(this)
  }

  addStudent(name, image, rollno, _class) {
    this.setState({ loading: true })

    this.state.college.methods.createStudent(name, image, rollno, _class)
    .send({ from: this.state.account })
    .once('recipt', (receipt) => {
      this.setState({ loading: false})
    })    
    
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <br/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="container">
              { this.state.loading
                ? <div> <Spinner/> </div>
                : <Main
                  
                  students={this.state.students}
                  addStudent={this.addStudent}   
                  />
                  
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
