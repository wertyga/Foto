
import products from '../../../server/data/products';

import Option from '../../common/Option/Option';
import ProductsContent from '../ProductsContent/ProductsContent';

import './ProductWrapper.sass';



export default class ProductWrapper extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectValue: 'all'
        };
    };

    componentWillMount() {
        this.products = [...products, { title: 'all', name: 'Все' }];
    };

    componentDidMount() {};

    selectClick = (value) => {
        this.setState({
            selectValue: value
        });
    };

    render() {

        return (
            <div className="ProductWrapper">
                <h1>Продукты</h1>
                <div className="products-menu">
                    <div className="select-wrapper">
                        <div className="title">{this.products.find(item => item.title === this.state.selectValue).name}</div>
                        <Option
                            value={this.state.selectValue}
                            label="Выбор категории:"
                            items={this.products}
                            onClick={this.selectClick}
                        />
                    </div>

                    <ProductsContent
                        title={this.state.selectValue}
                        items={this.products}
                    />
                </div>
            </div>
        );
    };
};

