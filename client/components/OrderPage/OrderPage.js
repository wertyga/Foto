import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import path from 'path';

import isEmpty from 'lodash/isEmpty';

import FlipMove from 'react-flip-move';

import { fetchOrders, deleteOrder } from '../../actions/products';
import { setGlobalError } from '../../actions/errors';

import  Loading from '../Loading/Loading';

import './OrderPage.sass';


const mapState = state => {
    return {
        user: state.user,
        orders: state.orders,
        globalError: state.globalError
    }
};

@connect(mapState, { fetchOrders, deleteOrder, setGlobalError })
export default class OrderPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            ordersDates: {},
            showOrder: '',
            orderDescription: {},
            modal: {
                show: false
            }
        };
    };

    componentDidMount() {
        if(this.props.globalError) {
            this.props.setGlobalError('');
        };
        if(isEmpty(this.props.user)) {
            this.props.history.push('/');
        } else {
            this.setState({ loading: true });

            this.props.fetchOrders(this.props.match.params._id)
                .then(() => {
                    this.compileOrdersDate();
                    this.setState({ loading: false })
                })
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.state.showOrder !== prevState.showOrder) {
            if(this.state.showOrder) {
                this.calculateFiles();
            };
        };
        if((this.props.user !== prevProps.user) && isEmpty(this.props.user)) {
            this.props.history.push('/');
        };

        if(this.props.orders !== prevProps.orders) {
            this.setState({ showOrder: '' });
            this.compileOrdersDate();
        };
    };


    compileOrdersDate = () => {
        let ordersDates = {};
        this.props.orders.forEach(item => {
            ordersDates[item.datePath] = ordersDates[item.datePath] ? [...ordersDates[item.datePath], item.orderName] : [item.orderName]
        });
        this.setState({
            ordersDates
        });
    };

    showOrder = order => {
        this.setState({
            showOrder: order
        });
    };

    calculateFiles = () => {
        const order = this.props.orders.find(item => item.orderName === this.state.showOrder);

        let orderDescr = {};
        order.files.forEach(file => {
            orderDescr[file.format] = orderDescr[file.format] ? orderDescr[file.format] + file.amount : file.amount
        });

        this.setState({
            orderDescription: {
                ...orderDescr,
                status: order.status
            }
        });
    };

    removeShowOrder = (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.setState({
            showOrder: ''
        });
        return false;
    };

    showModal = () => {
        this.setState({
            modal: {
                show: true
            }
        });
    };

    deleteOrder = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if(!this.state.showOrder) return;

        this.setState({ loading: true });
        this.props.deleteOrder(this.state.showOrder)
            .then(() => this.setState({ loading: false }))
            .catch((err) => {
                this.setState({ loading: false });
                if(err.response.status === 409) {
                    location.reload();
                };
            });
    };

    render() {

        const progressBtn = <div
            className={this.state.orderDescription.status}>
            <div className="spiner-progress"></div>
            Выполняется...
        </div>;
        const notReadyBtn = <div
            className={this.state.orderDescription.status}>
            <i className='fa fa-times' />
            Ждет выполнения
        </div>;
        const doneBtn = <div
            className={this.state.orderDescription.status}>
            <i className="fa fa-check" aria-hidden="true" />
            Выполнен
        </div>;

        const orderDescript = (
            <Link className="order-description" to={`/user/user-order/${this.props.match.params._id}/${this.state.showOrder}`}>


                <i className="fa fa-times close" onClick={this.removeShowOrder}/>

                <div className="bottom-description">
                    <div className="status"><p>Статус:</p> {this.state.orderDescription.status === 'await' ?
                        notReadyBtn :
                        (this.state.orderDescription.status === 'progress' ? progressBtn : doneBtn)
                    }
                        </div>
                    <button
                        className="btn"
                        onClick={this.deleteOrder}
                        disabled={this.state.orderDescription.status === 'progress' || !this.state.showOrder}
                    >
                        {this.state.orderDescription.status === 'done' ? 'Удалить заказ из базы' : 'Отменить заказ'}
                    </button>
                </div>
            </Link>
        );

        return (
            <FlipMove appearAnimation="fade" className="OrderPage">
                <div className="main-content">
                    {this.state.loading && <Loading />}
                    <h1>Мои заказы</h1>
                    {this.props.globalError && <h3 className="error">{this.props.globalError}</h3>}

                    <FlipMove className="orders-date-list" enterAnimation='fade' leaveAnimation="none">
                        {Object.keys(this.state.ordersDates).length < 1 && <div className="empty">Нет заказов</div>}
                        {Object.keys(this.state.ordersDates).map((item, i) =>
                            <div className="order-date" key={item}>
                                <div className="left-content">
                                    <div className="date">Дата: {item}</div>
                                    {this.state.ordersDates[item].map(order =>
                                        <div className={this.state.showOrder === order ? 'orders-names active' : 'orders-names'}
                                             key={order}
                                             onClick={() => this.showOrder(order)}
                                        >
                                            Номер: {order}
                                        </div>
                                    )}
                                </div>

                                <div
                                    className={this.state.ordersDates[item].indexOf(this.state.showOrder) !== -1 ?
                                        'right-content show' :
                                        'right-content'}
                                >
                                    {orderDescript}
                                </div>

                            </div>
                        )}

                    </FlipMove>

                </div>
            </FlipMove>
        );
    }
};

{/*<FlipMove duration={300} className="right-content" enterAnimation="fade" leaveAnimation="fade">*/}
    {/*{this.renderDescription()}*/}
{/*</FlipMove>*/}