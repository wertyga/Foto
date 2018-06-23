import { findDOMNode } from 'react-dom';

import BlankImage from '../../common/EmptyImage.png';

import calculatePrice from '../../common/commonFunctions/calculatePrice';


import './Product.sass';


export default class Product extends React.Component {

    showModal = () => {
        this.props.showModal({...this.props.product})
    };

    render() {
        const { product }= this.props;

        const price = calculatePrice(product.price, product.discount)

        return (
            <div className="Product"
                 ref={this.props.productRef}
                 style={this.props.style}
                 onClick={this.showModal}
            >
                <div className="wrapper">
                <img src={product.imagePath || BlankImage} className="imagePath" alt="image"/> 

                <div className="product-content">

                    <div className="title"><h6>Название: </h6><span>{product.title}</span></div>
                    <div className="category"><h6>Категория: </h6><span>{product.category}</span></div>

                    <div className="price"><h6>Цена:</h6> <span>{Math.round(price) ? `${price} руб.` : 'Нет на складе'}</span></div>

                    { !!Math.round(product.discount) && <div className="discount"><h6>Скидка: </h6><span>{product.discount} %</span></div> }

                </div>
                </div>
            </div>
        );
    };
};

// <div className="description">Описание: {product.description}</div>