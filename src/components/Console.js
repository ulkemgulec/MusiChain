import React, { Component } from "react";
import logo from "./logo.png";
import Web3 from "web3";
import "./Console.css";
import Contract from "../abis/Musichain.json";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
    host: "ipfs.infura.io",
    port: "5001",
    protocol: "https",
});

class Console extends Component {
    async componentWillMount() {
        await this.loadWeb3();
        await this.loadBlockchainData();
        await this.getSongs();
    }

    async loadBlockchainData() {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();
        this.setState({ account: accounts[0] });
        const address = "0xbe513Aba700a184E3Df88c14F6Ed4d5b12D42910";
        if (address) {
            const abi = Contract;
            const contract = new web3.eth.Contract(abi, address);
            this.setState({ contract });
        } else {
            window.alert("Smart contract not deployed to detect network!");
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            account: "",
            buffer: null,
            contract: null,
            songHash: "",
        };
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
            await window.ethereum.enable();
            console.log("girdim1");
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
            console.log("girdim2");
        } else {
            window.alert(
                "Non-Ethereum browser detected. You should consider trying MetaMask!"
            );
            window.location.reload();
        }
    }

    async getSongs() {
        const songCount = await this.state.contract.methods
            .getSongCount()
            .call();
        var gett = await this.state.contract.methods.getTrip().call();
        console.log(gett);
        const x = document.querySelector(".container");
        for (var i = 0; i < songCount; i++) {
            const newdiv = document.createElement("div");
            newdiv.classList.add("row");
            newdiv.classList.add("small");
            newdiv.classList.add("files-row");
            const newnewdiv = document.createElement("div");
            newnewdiv.classList.add("col");
            newnewdiv.classList.add("rounded");
            newnewdiv.classList.add("p-3");
            newnewdiv.classList.add("mb-5");
            newnewdiv.classList.add("shadow");
            newnewdiv.classList.add("bg-white");
            newdiv.appendChild(newnewdiv);
            const rowdiv = document.createElement("div");
            rowdiv.classList.add("row");
            newnewdiv.appendChild(rowdiv);
            const typediv = document.createElement("div");
            typediv.classList.add("col");
            const namediv = document.createElement("div");
            namediv.classList.add("col");
            const hashdiv = document.createElement("div");
            hashdiv.classList.add("col-7");
            const linkdiv = document.createElement("div");
            linkdiv.classList.add("col");
            const linkadiv = document.createElement("a");
            const hashdata = gett[i][1];
            const name = gett[i][2];
            const type = gett[i][3];
            linkadiv.href = "https://ipfs.infura.io/ipfs/" + hashdata;
            linkadiv.innerText = "Click!";
            hashdiv.innerText = hashdata;
            typediv.innerText = type;
            namediv.innerText = name;
            rowdiv.appendChild(typediv);
            rowdiv.appendChild(namediv);
            rowdiv.appendChild(hashdiv);
            rowdiv.appendChild(linkdiv);
            linkdiv.appendChild(linkadiv);
            x.appendChild(newdiv);
        }
    }

    captureFile = (event) => {
        event.preventDefault();
        console.log("file captured.");
        const file = event.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(file);
        reader.onloadend = () => {
            this.setState({ buffer: Buffer.from(reader.result) });
        };
    };

    onSubmit = (event) => {
        event.preventDefault();
        const songName = document.querySelector(".input-fileName").value;
        const songType = document.querySelector(".input-reportType").value;
        console.log("Submitting file to ipfs...");
        ipfs.add(this.state.buffer, (error, result) => {
            console.log("Ipfs result", result);
            const songHash = result[0].hash;
            this.setState({ songHash });
            if (error) {
                console.error(error);
                return;
            }
            this.state.contract.methods
                .createSong(songHash, songName, songType)
                .send({ from: this.state.account })
                .on("confirmation", (r) => {
                    this.setState({ songHash });
                    window.location.reload();
                });
        });
    };

    render() {
        const { data } = this.props.location;
        return (
            <div
                className="bg-danger main"
                style={{
                    height: "750px",
                    backgroundImage:
                        "url(" +
                        "https://static.vecteezy.com/system/resources/previews/001/207/912/original/guitar-png.png" +
                        ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                }}
            >
                <nav className="navbar navbar-dark bg-white flex-md-nowrap p-0 shadow">
                    <div className="auto">
                        <a
                            className="navbar-brand col-sm-3 col-md-2 text-dark"
                            href="http://localhost:3000/"
                            rel="noopener noreferrer"
                        >
                            <img src={logo} className="logo" />
                            <span>&nbsp;&nbsp;</span> MUSICHAIN
                        </a>
                    </div>
                </nav>

                <div className="auto">
                    <div className="container">
                        <div className="row">
                            <div className="col rounded shadow p-3 mb-5 bg-white col-first">
                                <div className="row">
                                    <div className="col">Musichain</div>
                                    <div className="col small">
                                        <span className="float-right">
                                            IPFS Version:{" "}
                                            <span className="font-italic">
                                                0.9.1
                                            </span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <span className="small">
                                            Account:{" "}
                                            <span>{this.state.account}</span>
                                        </span>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col">
                                        <span className="small">
                                            Status:{" "}
                                            <span class="text-success">
                                                Online
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="col rounded shadow p-3 mb-5 bg-white small">
                                <form onSubmit={this.onSubmit}>
                                    <select
                                        class="float-right input-reportType"
                                        name="filetypetext"
                                    >
                                        <option value="0">Select genre:</option>
                                        <option value="Rock">Rock</option>
                                        <option value="Rap">Rap</option>
                                        <option value="Pop">Pop</option>
                                    </select>
                                    <label
                                        class="form-label filetypetext float-right"
                                        for="filetypetext"
                                    >
                                        Song Genre:
                                    </label>
                                    <label class="form-label" for="fname">
                                        Song Name:
                                    </label>
                                    <input
                                        type="text"
                                        class="float-right input-fileName"
                                        name="fname"
                                    />
                                    <br />
                                    <label for="lname">Choose File:</label>
                                    <input
                                        type="file"
                                        class="float-right"
                                        onChange={this.captureFile}
                                    />
                                    <br />
                                    <input
                                        type="submit"
                                        class="d-inline-block"
                                    />
                                </form>
                            </div>
                        </div>

                        <div className="row files-title">
                            <div className="col rounded p-3 mb-5 shadow bg-white">
                                <div class="row ">
                                    <div class="col">
                                        <div className="border-bottom">
                                            Genre
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div className="border-bottom">
                                            Name
                                        </div>
                                    </div>
                                    <div class="col-7">
                                        <div className="border-bottom">
                                            Hash
                                        </div>
                                    </div>
                                    <div class="col">
                                        <div className="border-bottom">
                                            Link
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Console;
