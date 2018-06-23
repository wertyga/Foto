import { connect } from 'react-redux';
import axios from 'axios';
import { Link } from 'react-router-dom';

import { fetchCategory } from '../../actions/products';
import { setGlobalError } from '../../../../client/actions/errors';

import { Button, Dropdown, Loader } from 'semantic-ui-react';

import loadFunc from '../common/commonFunctions/loading';
import clearError from '../common/commonFunctions/clearError';

import Product from '../Product/Product';
import ModalProduct from '../ModalProduct/ModalProduct';
import Option from '../common/Option/Option';

import './AdminPage.sass';



function mapStateToProps(state) {
    return {
        globalError: state.globalError,
        products: state.adminProductsPage
    }
};

@connect(mapStateToProps, { fetchCategory, setGlobalError })

export default class Admin extends React.Component {

    constructor(props) {
        super(props);

        this.loadFunc = loadFunc.bind(this);
        this.clearError = clearError.bind(this);
        this.initialState = {
            showModal: false,
            modal: {
                title: '',
                description: '',
                image: '',
                price: '',
                discount: '',
                category: '',
                productId: ''
            },
            categories: [],
            chosenCategory: '',
            products: this.props.products,
            loading: false,
            loadingCats: false,
            errors: {}
        }

        this.state = this.initialState;
    };

    async componentDidMount() {
        this.props.setGlobalError('');
        this.setState({
            loadingCats: true
        });
        axios.post('/admin/fetch-categories')
            .then(res => {
                this.setState({
                    categories: res.data.categories,
                    chosenCategory: res.data.categories[0].title,
                    loadingCats: false
                });
            })
            .catch(err => {
                this.setState({
                    loadingCats: false
                });
            })
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.products !== prevProps.products) {
            this.setState({
                products: this.props.products
            });
        };

        if(this.props.globalError !== prevProps.globalError) {
            this.setState({
                errors: {
                    ...this.state.errors,
                    globalError: this.props.globalError
                }
            });
        };

        if(this.state.chosenCategory !== prevState.chosenCategory) {
            this.setState({ loading: true });
            this.fetchCategory();
        }
    };

    fetchCategory = () => {
        this.props.fetchCategory(this.state.chosenCategory)
            .then(() => this.setState({ loading: false }))
            .catch(() =>  this.setState({ loading: false }))
    };

    selectChange = (value) => {
        this.setState({
            chosenCategory: value
        });
    };

    addProduct() {
        this.setState({
            showModal: true,
            modal: this.initialState.modal
        });
    };

    editProduct = data => {
        const { title, description, imagePath, price, discount, _id, category } = data;
        this.setState({
            showModal: true,
            modal: {
                productId: _id,
                title,
                description,
                image: imagePath,
                price,
                discount,
                category: this.state.categories.find(item => item.name === category).title
            },
        });
    };

    render() {

        const loading = (
            <div className="loading">
                <Loader active>Loading...</Loader>
            </div>
        );

        return (
            <div className="Admin">
                <Button
                    className="btn btn-primary"
                    children={<Link to="/admin/orders">Go to orders page</Link>}
                />
                <Button
                    content={<Link to="/admin/params">Go to set params page</Link>}
                 />
                <h1>Admin page</h1>
                {this.state.errors.globalError && <div name="globalError" className="global-error" onClick={this.clearError}>{this.state.errors.globalError}</div>}
                <div className="header">
                        <ModalProduct
                            onClose={() => this.setState({ showModal: false })}
                            showModal={this.state.showModal}
                            onClick={this.addProduct.bind(this)}
                            categories={this.state.categories}
                            {...this.state.modal}
                        />

                    <Option
                        value={this.state.chosenCategory}
                        label="Выбор категории:"
                        items={this.state.categories}
                        onClick={this.selectChange}
                        loading={this.state.loadingCats}
                    />


                </div>

                <div className="content">
                    {this.state.loading ? loading :
                        (
                            this.state.products.length < 1 ?
                                <div className="empty-products">No items...</div> :
                                this.state.products.map((item, i) => {
                                    return (
                                        <Product
                                            key={i}
                                            editProduct={this.editProduct}
                                            {...item}
                                            categoryTitle={item.category}
                                        />
                                    )
                                })
                        )
                    }
                </div>
            </div>
        );
    }
};