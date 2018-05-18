import React, { Component } from 'react';
import { formatPrice } from '../helpers'

class Order extends Component {

    constructor() {
        super();
        this.renderOrder = this.renderOrder.bind(this);
        this.removeFishFromOrder = this.removeFishFromOrder.bind(this);
    }

    removeFishFromOrder(e, key) {
        this.props.removeFromOrder(key)
    }
    
    renderOrder(key) {
        const fish = this.props.fishes[key];
        const count = this.props.order[key];

        if (!fish || fish.status === 'unavailable') {
            return <li key={key}>Sorry, {fish ? fish.name : 'Fish'} is no longer available </li>
        }

        return (
            <li key={key}>
                <span>{count}lbs {fish.name} <button onClick={(e) => this.removeFishFromOrder(e, key)}>x</button></span>
                <span className="price">{formatPrice(count * fish.price)}</span>
            </li>
        );
    }

    render() {
        const orderIds = Object.keys(this.props.order);
        const total = orderIds.reduce((prevTotal, key) => {
            const fish = this.props.fishes[key];
            const count = this.props.order[key];
            const isAvailable = fish && fish.status === 'available';
            if (isAvailable) {
                return prevTotal + (count * fish.price || 0);
            }
            return prevTotal;
        }, 0);
        return (
            <div className="order-wrap">
                <h2>Your Order</h2>
                <ul className="order">
                    {orderIds.map(this.renderOrder)}
                    <li className="total">
                        <strong>Total: </strong>
                        {formatPrice(total)}
                    </li>
                </ul>
            </div>
        );
    }
}

Order.propTypes = {
    removeFromOrder: React.PropTypes.func.isRequired,
    fishes: React.PropTypes.object.isRequired,
    order: React.PropTypes.object.isRequired
};

export default Order;