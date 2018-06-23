import emptyImage from '../common/EmptyImage.png';
import { connect } from 'react-redux';

import { changeShowProduct } from '../../actions/products';

import { Image, Segment, Button } from 'semantic-ui-react';

import calculatePrice from '../common/commonFunctions/calculatePrice';

import './Product.sass';


@connect(null, { changeShowProduct })
export default class Product extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: ''
        };
    };

    editProduct = data => {
        this.props.editProduct({...this.props})
    };

    hideButton = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({ loading: true });
        this.props.changeShowProduct(this.props._id, this.props.category)
            .then(() => {
                this.setState({ loading: false });
            })
            .catch(err => {
                this.setState({
                    loading: false,
                    error: err.response ? err.response.data.error : err.message
                });
            })
    };

    render() {

        const discount = (
            <div className="wrapper"></div>
        );

        return (
            <Segment className="Product" onClick={this.editProduct}>
                <div className="left-block">

                    <div className="image">
                        {!!this.props.discount && (
                            <div className="discount">
                                {discount}
                                <p>{`${this.props.discount}%`}</p>
                            </div>
                        )}

                        <Image src={this.props.imagePath || emptyImage} alt={this.props.title || 'No image'}/>
                    </div>

                </div>

                <div className="right-block">
                    <div className="category">Category: {this.props.category}</div>
                    <h3>{this.props.title || 'No title'}</h3>
                    <p>{this.props.description ? (this.props.description.slice(0, 100) + '...') : 'No description'}</p>
                    <p className="price">Цена: {`${calculatePrice(this.props.price, this.props.discount)} руб.`}</p>

                    {this.props.show ?
                        <Button disabled={this.state.loading} negative onClick={this.hideButton}>Hide</Button> :
                        <Button disabled={this.state.loading} positive onClick={this.hideButton}>Show</Button>
                    }
                    {this.state.error && <div className="error">{this.state.error}</div>}
                </div>

            </Segment>
        );
    };
};