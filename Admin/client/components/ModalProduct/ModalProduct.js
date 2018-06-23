import { connect } from 'react-redux';
import axios from 'axios';

import emptyImage from '../common/EmptyImage.png';

import { saveProduct, deleteProduct } from '../../actions/products';

import { Modal, Button, Header, Image, Dropdown } from 'semantic-ui-react';

import clearError from '../common/commonFunctions/clearError';
import loading from '../common/commonFunctions/loading';
import Option from '../common/Option/Option';

import Cross from '../common/cross/cross';
import Input from '../common/Input/Input';

import './ModalProduct.sass';


@connect(null, { saveProduct, deleteProduct })

export default class ModalProduct extends React.Component {
    constructor(props) {
        super(props);

        this.clearError = clearError.bind(this);
        this.loading = loading.bind(this);

        this.initialState = {
            title: this.props.title || '',
            description: this.props.description || '',
            price: this.props.price || '',
            discount: this.props.discount || '',
            image: this.props.image || '',
            loading: false,
            categoryChosen: this.props.category,
            oldCategory: '',
            productId: this.props.productId || '',
            errors: {}
        };
        
        this.state = this.initialState
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.showModal !== prevProps.showModal) {
            if(!this.props.showModal) {
                if(this.source) this.source.cancel('user canceled');
            } else {
                this.setState({
                    title: this.props.title || '',
                    description: this.props.description || '',
                    price: this.props.price || 0,
                    discount: this.props.discount || 0,
                    image: this.props.image,
                    productId: this.props.productId,
                    oldCategory: this.props.category,
                    categoryChosen: this.props.category || this.props.categories.filter(item => item.title !== 'all')[0].title
              });
            }
        }
    };

    onChange = e => {
        if(this.state.errors[e.target.name]) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    [e.target.name]: ''
                }
            });
        };
        if(e.target.type === 'file') {
            this.productImage = e.target.files[0];
            if(this.productImage.type.split('/')[0] !== 'image') {
                this.setState({
                    errors: { image: 'Only images support' }
                });
            } else if(this.productImage.size > 10**7) {
                this.setState({
                    errors: { image: 'Too large file' }
                });
            } else {
                const fr = new FileReader();

                fr.onload = () => {
                    this.setState({
                        image: fr.result
                    });
                };

                fr.readAsDataURL(this.productImage);
            }
        } else {
            this.setState({
                [e.target.name]: e.target.value
            });
        };
    };

    selectChange = (value) => {
        this.setState({
            categoryChosen: value,
            errors: {
                ...this.state.errors,
                categoryChosen: ''
            }
        });
    };

    submitData = () => {
        if(!this.state.categoryChosen) {
            this.setState({
                errors: {
                    categoryChosen: 'Choose product category'
                }
            });
            return;
        };
        let CancelToken = axios.CancelToken;
        this.source = CancelToken.source();

        this.loading(true);

        let form = new FormData();
        form.append('title', this.state.title);
        form.append('description', this.state.description);
        form.append('category', this.props.categories.find(item => item.title === this.state.categoryChosen).name);
        form.append('price', this.state.price);
        form.append('discount', this.state.discount);
        form.append('image', this.productImage || this.state.image);
        if(this.state.oldCategory !== this.state.chosenCategory) {
            form.append('oldCategory',  this.state.oldCategory);
        }
        form.append('productId', this.state.productId);

        this.props.saveProduct({data: form, cancelToken: this.source.token }, this.state.productId)
            .then(() => {
                this.onClose();
                this.props.filterProducts();
            })
            .catch(err => this.onClose() )
    };

    onClose = () => {
        this.productImage = null;
        this.setState({ ...this.initialState});
        this.props.onClose();
    };

    deleteProduct = () => {
        this.loading(true);
        this.props.deleteProduct({
            id: this.state.productId,
            category: this.props.category
        });
        this.loading();
        this.props.onClose();
    };

    onChangeDigital = e => {
        if(e.target.value.match(/^[0-9]+$/)) {
            this.onChange(e)
        } else {
            return;
        };

    };

    render() {
        return (
            <Modal
                className="ModalProduct"
                closeIcon={true}
                onClose={this.onClose}
                open={this.props.showModal}
                trigger={<Cross onClick={this.props.onClick} className='add-product'/>}
            >
                <Modal.Header>Add/Edit product</Modal.Header>
                <Modal.Content image>

                    <div className="image">
                        <Input
                            type="file"
                            label="Product image..."
                            hidden={true}
                            onChange={this.onChange.bind(this)}
                            name="image"
                        />
                        {this.state.errors.image &&
                            <div className="global-error" name='image' onClick={this.clearError}>{this.state.errors.image}</div>
                        }
                        <Image wrapped size='medium' src={this.state.image || emptyImage} />
                    </div>

                    <Modal.Description style={{ width: '100%' }}>
                        <Header>

                            <Option
                                value={this.state.categoryChosen}
                                label="Выбор категории:"
                                items={this.props.categories || []}
                                onClick={this.selectChange}
                                ignore={['all']}
                            />

                            <Input
                                value={this.state.title}
                                placeholder="Title..."
                                label="Product title"
                                name="title"
                                onChange={this.onChange}
                                disabled={this.state.loading}
                            />
                            <Input
                                value={this.state.description}
                                textarea
                                label="Product description"
                                name="description"
                                onChange={this.onChange}
                                disabled={this.state.loading}
                            />
                            <Input
                                value={this.state.price}
                                placeholder="Price..."
                                label="Product price"
                                name="price"
                                onChange={this.onChange}
                                disabled={this.state.loading}
                            />
                            <Input
                                value={this.state.discount}
                                placeholder="Discount..."
                                label="Product discount"
                                name="discount"
                                onChange={this.onChange}
                                disabled={this.state.loading}
                            />

                            {this.state.errors.categoryChosen &&
                                <div style={{ fontSize: 13 }} className="error">{this.state.errors.categoryChosen}</div>
                            }
                        </Header>
                    </Modal.Description>

                </Modal.Content>
                <Modal.Header>
                    <div className="Modal-footer">
                        {this.state.productId && <Button className="delete-product" disabled={this.state.loading} negative onClick={this.deleteProduct}>Delete product</Button>}
                        <Button disabled={this.state.loading} negative onClick={this.onClose}>Cancel</Button>
                        <Button disabled={this.state.loading} positive onClick={this.submitData}>Add/Edit</Button>
                    </div>
                </Modal.Header>
            </Modal>
        );
    }
};




//
// <Dropdown
//     placeholder="--Choose category--"
//     options={this.props.categories.filter(category => category.value !== 'all')}
//     onChange={this.selectChange}
//     loading={this.state.loading}
//     className="select"
//     disabled={this.state.loading}
//     error={!!this.state.errors.categoryChosen}
//     value={this.state.categoryChosen}
// />