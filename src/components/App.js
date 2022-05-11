import React, { Component } from "react";
import Web3 from "web3";
import "./App.css";
import Console from "./Console";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
    async componentWillMount() {
        await this.loadWeb3();
    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            buffer: null,
            contract: null,
        };
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
        }
    }

    render() {
        return (
            <div>
                <Router>
                    <div className="App">
                        <Switch>
                            <Route path="/" exact component={Console} />
                        </Switch>
                    </div>
                </Router>
            </div>
        );
    }
}

export default App;
