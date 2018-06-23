import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import products from '../../../server/data/products';

import { fetchProducts } from '../../actions/products';

import Product from '../Product/Product';
import Loading from '../Loading/Loading';
import Modal from '../Modal/Modal';

import './ProductsContent.sass';



class ProductsSort extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
           modal: {
               title: '',
               category: '',
               description: '',
               price: '',
               discount: '',
               imagePath: ''
           }
        };
    };

    showModal = (data) => {
       if(!data) {
           this.setState({
               openModal: false
           });
       } else {
           this.setState({
               modal: {...data},
               openModal: true
           });
       }
    };

    render() {
        return (
            <div
                className="content-wrapper-item"
                style={{ width: this.props.width }}
            >
                {this.props.products.map((item, i) =>
                    <Product
                        product={item}
                        key={i}
                        showModal={this.showModal}
                    />
                )}
                {this.state.openModal &&
                    ReactDOM.createPortal(
                        <Modal
                            title={this.state.modal.title}
                            categoryName={this.state.modal.category}
                            description={this.state.modal.description}
                            price={this.state.modal.price}
                            discount={this.state.modal.discount}
                            imagePath={this.state.modal.imagePath}
                            showModal={this.showModal}
                        />,
                        document.getElementsByClassName('ProductWrapper')[0]
                    )
                }
            </div>
        );
    };
};


const mapState = state => {
    return {
        products: state.products
    }
};


@connect(mapState, { fetchProducts })
export default class ProductsContent extends React.Component {
    constructor(props) {
        super(props);

        this.initialTransition = 'transform .3s';

        this.state = {
            name: 'all',
            currentPage: 0,
            totalPages: 0,
            loading: false,
            products: [],
            viewCount: 6,
            width: window.innerWidth,
            groupItemWidth: window.innerWidth,
            translate: 0,
            startMouseMove: 0,
            transition: this.initialTransition,
            cursor: 'initial',
            error: ''
        };
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.calculate);
        window.removeEventListener('keyup', this.pagination);
    };

    componentDidMount() {
        this.fetchCategory(this.props.title);
        window.addEventListener('resize', this.calculate);
        window.addEventListener('keyup', this.pagination);
    };
    
    componentDidUpdate(prevProps, prevState) {
        if(this.props.title !== prevProps.title) {
            this.fetchCategory(this.props.title);
        };
    };



    fetchCategory = (title) => {
        this.setState({
            loading: true
        });
        this.props.fetchProducts(title)
            .then(() => {
                this.calculate();
                this.setState({
                    loading: false
                });
            })
            .catch(err => this.setState({
                error: err.response ? err.response.data.error : err.message,
                loading: false
            }));
    };

    calculate = async () => {
        await this.updateViewCount();
        this.steps = await Math.ceil(this.props.products.length / this.state.viewCount);
        let result = await [];
        for(let i = 0; i < this.steps; i++) {
            const arr = await this.props.products.slice(i * this.state.viewCount, i * this.state.viewCount + this.state.viewCount);
            await result.push(arr);
        };
        this.setState({
            currentPage: 1,
            totalPages: this.steps,
            translate: 0,
            products: result
        });
        this.updateWidth();
    };

    updateWidth = () => {
        if(!this.mainRef) return;
        this.setState({
            width: this.mainRef.offsetWidth * (this.steps || 1),
            groupItemWidth: this.mainRef.offsetWidth
        });
    };

    updateViewCount = () => {
        this.setState({
            viewCount: window.innerWidth < 1000 ?
                (window.innerWidth < 600 ? 2 : 4) : 6
        });
    };

    pagination = async e => {
        let leftDirection;
        if(!e.keyCode) {
            leftDirection = await (e.target.getAttribute('data-value') === 'left') ? 'left' : 'right';
        } else {
            leftDirection = await e.keyCode === 37 ? 'left' : (e.keyCode === 39 ? 'right' : null);
        }
        if(leftDirection) {
            leftDirection = leftDirection === 'left';
            if((leftDirection && this.state.currentPage <= 1) || (!leftDirection && this.state.currentPage >= this.state.totalPages)) {
                return;
            };
            await this.setState({
                currentPage: leftDirection ? this.state.currentPage - 1 : this.state.currentPage + 1
            });
            this.setTranslateItems();
        }
    };

    setTranslateItems = () => {
        this.setState({
            translate: -(this.state.currentPage - 1) * this.state.groupItemWidth
        });
    };

    render() {

        const emptyList = (
            <div className="empty-list">
                В этой категории, пока, товаров нет!
            </div>
        );

        const main = (
            <div
                className="products-content"
                style={{
                    width: this.state.width,
                    transform: `translateX(${this.state.translate}px)`,
                    minHeight: commonHeight,
                    transition: this.state.transition,
                    cursor: this.state.cursor
                }}
                ref={node => this.contentWrapper = node}
            >
                {this.state.products.length < 1 ? emptyList :
                    this.state.products.map((item, i) =>
                        <ProductsSort
                            products={item}
                            key={i}
                            width={this.state.groupItemWidth}
                            totalPages={this.state.totalPages}
                        />
                    )
                }
            </div>
        );

        const pagination = (
            <div className="pages" style={{ width: this.state.groupItemWidth }}>
                <div className="wrapper-pages">
                    {this.state.currentPage > 1 && <i onClick={this.pagination} className="fa fa-angle-left" data-value="left"/>}
                    <div className="pagination">{this.state.currentPage} / {this.state.totalPages}</div>
                    {this.state.currentPage < this.state.totalPages && <i onClick={this.pagination} className="fa fa-angle-right" data-value="right"/>}
                </div>
            </div>
        );

        const commonHeight = '40vh';

        return (
            <div className="ProductsContent" style={{ minHeight: commonHeight }} ref={node => this.mainRef = node}>

                {this.state.products.length > 0 && pagination}

                {this.state.loading ? <Loading style={{ height: commonHeight, position: 'relative', backgroundColor: 'transparent' }}/> :
                    (this.state.error ? <div className="error" style={{ height: commonHeight }}>{this.state.error}</div> :
                        main
                    )
                }

                {this.state.products.length > 0 && pagination}

            </div>
        );
    };
};