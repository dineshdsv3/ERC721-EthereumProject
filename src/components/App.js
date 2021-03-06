import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Color from '../abis/Color.json';

class App extends Component {
	state = {
		account: '',
		contract: null,
		colors: [],
		totalSupply: 0,
		color: '',
	};

	async componentWillMount() {
		await this.loadWeb3();
		await this.loadBlockchainData();
	}

	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum);
			await window.ethereum.enable();
		} else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider);
		} else {
			window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!');
		}
	}

	async loadBlockchainData() {
		const web3 = window.web3;
		// Load account
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });

		const networkId = await web3.eth.net.getId();
		const networkData = Color.networks[networkId];
		if (networkData) {
			const abi = Color.abi;
			const address = networkData.address;
			const contract = new web3.eth.Contract(abi, address);
			this.setState({ contract });
			console.log(this.state.contract);
			const totalSupply = await contract.methods.totalSupply().call();
			this.setState({ totalSupply });
			console.log(this.state.totalSupply);

			for (var i = 0; i < totalSupply; i++) {
				const color = await contract.methods.colors(i).call();
				this.setState({
					colors: [...this.state.colors, color],
				});
				// console.log(this.state.colors)
			}
		} else {
			window.alert('Smart contract not deployed to detected network.');
		}
	}

	mint = (color) => {
		this.state.contract.methods
			.mint(color)
			.send({ from: this.state.account })
			.once('receipt', (receipt) => {
				this.setState({
					colors: [...this.state.colors, color],
				});
				window.location.reload();
			});
	};

	handleInput = (e) => {
		e.preventDefault();
		this.setState({ color: e.target.value });
	};

	render() {
		return (
			<div>
				<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
					<a
						className="navbar-brand col-sm-3 col-md-2 mr-0"
						href=""
						target="_blank"
						rel="noopener noreferrer"
					>
						ERC 721 Sample Color Token DApp
					</a>
					<ul className="navbar-nav px-2">
						<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
							<small className="text-white">Total tokens generated is {this.state.colors.length}</small>
						</li>
					</ul>
					<ul className="navbar-nav px-3">
						<li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
							<small className="text-white">
								<span id="account">{this.state.account}</span>
							</small>
						</li>
					</ul>
				</nav>
				<div className="container-fluid mt-5">
					<div className="row">
						<main role="main" className="col-lg-12 d-flex text-center">
							<div className="content mr-auto ml-auto">
								<h1>Issue Token</h1>
								<form
									onSubmit={(event) => {
										event.preventDefault();
										const color = this.state.color;
										this.mint(color);
									}}
								>
									<input
										type="color"
										className="form-control mb-1"
										name="color"
										onChange={this.handleInput}
									/>
									<input type="submit" className="btn btn-block btn-primary" value="MINT" />
								</form>
							</div>
						</main>
					</div>
					<div className="row text-center">
						{this.state.colors.map((color, key) => {
							return (
								<div key={key} className="col-md-3 mb-3">
									<div className="token" style={{ backgroundColor: color }}></div>
									<div>{color}</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
