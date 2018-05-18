import React from 'react'

import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import sampleFishes from '../sample-fishes'
import Fish from './Fish';
import Base from '../base';

class App extends React.Component {

    constructor() {
        super();
        // this.loadSamples = this.loadSamples.bind(this);
        this.addFish = this.addFish.bind(this);
        this.updateFish = this.updateFish.bind(this);
        this.deleteFish = this.deleteFish.bind(this);
        this.addToOrder = this.addToOrder.bind(this);
        this.removeFromOrder = this.removeFromOrder.bind(this);
        this.state = {
            fishes: {},
            order: {}
        }
    }

    getStorageKey() {
        return `order-${this.props.params.storeId}`;
    }

    componentWillMount() {
        this.ref = Base.syncState(
            `${this.props.params.storeId}/fishes`,
            { 
                context: this,
                state: 'fishes'
            }
        );
        const order = localStorage.getItem(this.getStorageKey());
        if (order) {
            this.setState({
                order: JSON.parse(order)
            });
        }
    }

    componentWillUnmount() {
        Base.removeBinding(this.ref);
    }

    componentWillUpdate() {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(this.state.order));
    }

    loadSamples = () => {
        this.setState({
            fishes: sampleFishes
        });
    }

    addFish(fish) {
        const fishes = {...this.state.fishes};
        const timestamp = Date.now();
        fishes[`fish-${timestamp}`] = fish;
        this.setState({ fishes })
    }

    updateFish(key, fish) {
        const fishes = {...this.state.fishes};
        fishes[key] = fish;
        this.setState({ fishes });
        
    }

    deleteFish(key) {
        const fishes = {...this.state.fishes};
        fishes[key] = null;
        this.setState({ fishes });
    }

    addToOrder(key) {
        const order = {...this.state.order};
        order[key] = order[key] + 1 || 1;
        this.setState({ order });
    }

    removeFromOrder(key) {
        const order = {...this.state.order};
        delete order[key];
        this.setState({ order });
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Fresh Seafood Market" />
                    <ul className="list-of-fishes">
                        {Object
                            .keys(this.state.fishes)
                            .map(key => 
                                <Fish 
                                    key={key} 
                                    index={key} 
                                    details={this.state.fishes[key]} 
                                    addToOrder={this.addToOrder} 
                                />
                            )
                        }
                    </ul>
                </div>
                <Order 
                    fishes={this.state.fishes} 
                    order={this.state.order}
                    params={this.props.params}
                    removeFromOrder={this.removeFromOrder}
                />
                <Inventory 
                    fishes={this.state.fishes}
                    addFish={this.addFish}
                    defaultFishes={this.loadSamples}
                    updateFish={this.updateFish}
                    deleteFish={this.deleteFish}
                    storeId={this.props.params.storeId}
                />
            </div>
        );
    }
}

App.propTypes = {
    params: React.PropTypes.object.isRequired
};

export default App;