import React, { Component } from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends Component {

    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.logout = this.logout.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.state = {
            uid: null,
            owner: null
        };
    }

    componentDidMount() {
        base.onAuth((user) => {
            if (user) {
                this.authHandler(null, { user });
            }
        })
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        const updatedFish = {...fish, [e.target.name]: e.target.value};
        this.props.updateFish(key, updatedFish);
    }

    removeFish(e, key) {
        this.props.deleteFish(key);
    }

    authenticate(provider) {
        console.log(`Trying to log in with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logout() {
        base.unauth();
        this.setState({ uid: null });
    }

    authHandler(err, authData) {
        if (err) {
            console.error(err);
        }

        const storeRef = base.database().ref(this.props.storeId);

        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            console.log(data);
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                })
            }

            console.log(authData);
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            });

            console.log(this.state);
        })
    }

    renderLogin() {
        return (
            <nav className="login">
                <h2>Inventory</h2>
                <p>Sign In to manage store's inventory</p>
                <button className="github" onClick={() => this.authenticate('github')}> Log In with Github</button>
                <button className="facebook" onClick={() => this.authenticate('facebook')}> Log In with Facebook</button>
                <button className="twitter" onClick={() => this.authenticate('twitter')}> Log In with Twitter</button>
            </nav>
        )
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className='fish-edit' key={key}>
                <input type="text" name="name" value={fish.name} placeholder="Fish Name" onChange={(e) => this.handleChange(e, key)} />
                <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)} />
                <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)} >
                    <option value="available">Fresh</option>
                    <option value="unavailable">Sold Out!</option>
                </select>
                <textarea type="text" name="desc" value={fish.desc} placeholder="fish Description" onChange={(e) => this.handleChange(e, key)}></textarea>
                <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)} />
                <button onClick={(e) => this.removeFish(e, key)}>Remove Fish</button>
            </div>
        );
    }

    render() {
        const logout = <button onClick={this.logout}>Log Out!</button>

        // check if they are not logged in at all
        if (!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        // check if they are the owner of the current store
        if(this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry you aren't the owner of this store!</p>
                    <div>{logout}</div>
                </div>
            )
        }

        return (
            <div>
                <h2>Inventory</h2>
                {logout}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish} />
                <button onClick={this.props.defaultFishes}>Load Sample Fishes</button>
            </div>
        );
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    deleteFish: React.PropTypes.func.isRequired,
    defaultFishes: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
};
export default Inventory;