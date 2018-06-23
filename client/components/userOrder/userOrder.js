import { connect } from 'react-redux';
import path from 'path';

import { checkFileType } from '../../common/commonFunctions/checkFileType';

import isEmpty from 'lodash/isEmpty';

import { fetchOrders } from '../../actions/products';
import { fetchFotoParams, addFotoParams, deleteUserFoto } from '../../actions/params';

import Loading from '../Loading/Loading';
import blankImage from '../../common/EmptyImage.png';
import rarFile from '../../common/rar.jpg';

import './userOrder.sass';


const mapState = state => {
    return {
        user: state.user,
        orders: state.orders,
        fotoParams: state.fotoParams,
        globalError: state.globalError
    }
};

@connect(mapState, { fetchOrders, addFotoParams, fetchFotoParams, deleteUserFoto })
export default class userOrder extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            userId: this.props.match.params.userId || '',
            orderId: this.props.match.params.orderId || '',
            currentOrder: {},
            error: ''
        }
    };

    componentWillMount() {
        this.setState({ loading: true });
        if(isEmpty(this.props.user)) {
            this.props.history.push('/');
        } else {
            this.props.fetchFotoParams();
            this.props.fetchOrders(this.props.match.params.userId)
                .then(() => {
                    this.setState({
                        loading: false,
                        currentOrder:  this.props.orders.find(order => order.orderName === this.state.orderId)
                    });
                    if(isEmpty(this.state.currentOrder)) {
                        this.setState({
                            error: 'Заказ уже удален'
                        });
                        this.props.deleteUserFoto(this.state.orderId);
                        return;
                    };
                })
        }
    };

    componentDidUpdate(prevProps, prevState) {
        if((this.props.user !== prevProps.user) && isEmpty(this.props.user)) {
            this.props.history.push('/')
        };
    };

    showImages = () => {
        const ModalFiles = (
            <div className="user-order-files">
                {!this.state.error && !isEmpty(this.state.currentOrder) && this.state.currentOrder.files.map(file =>
                    {
                        const fileType = checkFileType(file.filePath);
                        return (<div className="item-wrapper" key={file.id}>
                        <div className="image" >
                            <img
                                key={file.id}
                                src={fileType === 'image' ? file.filePath : (fileType === 'archive' ? rarFile : blankImage)}
                                alt={file.id}
                            />
                        </div>

                        <div className="right-content-user-order-item">
                            <div>Формат: {file.format}</div>
                            <div>Бумага: {this.props.fotoParams.find(item => item.title === file.format) && this.props.fotoParams.find(item => item.title === file.format)
                                .paperType.find(paper => paper.title === file.paper).name}
                            </div>
                            <div>Количество: {file.amount}</div>
                        </div>

                    </div>)}
                )}
            </div>
        );
        return ModalFiles;
    };

    sendNewOrder = () => {
        if(!isEmpty(this.state.currentOrder)) {
            const fetchOrder = this.state.currentOrder.files.map(file => {
                const fileArr = file.filePath.split('\\');
                return {
                    ...file,
                    dataImage: path.join('/', this.state.currentOrder.datePath, file.filePath),
                    name: fileArr[fileArr.length - 1]

                };
            });

            this.props.addFotoParams(fetchOrder)
                .then(() => this.props.history.push('/private'))
        };
    };

    render() {
        return (
            <div className="userOrder">
                <h1>Заказ №: {this.state.orderId}</h1>
                <div className="btn-wrapper">
                    <button
                        disabled={this.props.globalError || this.state.error}
                        className="btn"
                        onClick={this.sendNewOrder}
                    >
                        Разместить заказ на основе существующего
                    </button>
                </div>
                {this.props.globalError && <div className="error">{this.props.globalError}</div>}
                {this.state.error && <div className="error">{this.state.error}</div>}
                {this.state.loading ? <Loading /> : this.showImages()}

            </div>
        );
    }
};