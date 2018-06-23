import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import shortId from 'short-id';

import { fetchFotoParams, addFotoParams } from '../../actions/params';
import { uploadFotos, clearFileList } from '../../actions/upload';
import { setGlobalError } from '../../actions/errors';

import Transport from '../../common/commonFunctions/transport';
import { checkFileType } from '../../common/commonFunctions/checkFileType';
import { images } from '../../common/commonFunctions/checkFileType';
import { archives } from '../../common/commonFunctions/checkFileType';

import Image from '../Image/Image';
import Modal from '../Modal/Modal';
import FotoFormats from '../FotoFotmats/FotoFotmats';
import Loading from '../Loading/Loading';
import Option from '../../common/Option/Option';

import prices from '../../../server/data/prices';

import './ShowImages.sass';


const enter = {
    from: {
        transform: 'translateY(-20%)',
        opacity: 0
    },
    to: {
        transform: 'translateY(0)',
        opacity: 1
    }
};
const leave = {
    from: {
        transform: 'translateY(0)',
        opacity: 1

    },
    to: {
        transform: 'translateY(-20%)',
        opacity: 0
    }
};


const mapState = state => {
    return {
        fotoParams: state.fotoParams,
        fotoList: state.fotoList,
        globalError: state.globalError,
        user: state.user
    };
};


@connect(mapState, { fetchFotoParams, addFotoParams, uploadFotos, clearFileList, setGlobalError })
export default class ShowImages extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            orderName: '',
            preview: [],
            files: [],
            zoomImage: false,
            params: [],
            modal: {},
            error: '',
            loading: false,
            loadProgress: 0,
            contacts: '',
            contactsError: '',
            sendedOrder: false,
            orderType: 'fotoPrint'
        };
    };
    
    componentDidMount() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
        this.props.fetchFotoParams()
            .catch(err => this.setState({ error: err.response ? err.response.data : err.message }));
    };

    componentDidUpdate(prevProps, prevState) {
        if((this.props.fotoList !== prevProps.fotoList) && this.props.fotoList.length < 1) {
            this.setState({
                contacts: '',
                zoomImage: false,
                modal: {}
            });
            this.fileInput.value = '';
        };

        if(this.state.preview !== prevState.preview) {
            if(this.state.preview.length > 0) {
                this.mainRef.style.minHeight = this.preview.offsetHeight + 'px';
            } else {
                this.mainRef.style.minHeight = 'initial'
            }
        };
    };

    componentWillUnmount() {
        this.clearFileList();
        this.props.setGlobalError('');
    };

    onChangeFiles = (e) => {
        this.setState({ error: '' });
        let arr = [];
        let availablePaper = this.props.fotoParams.find(item => item.paperType.find(type => type.value === true));
        for(let i = 0; i < e.target.files.length; i++) {
            const fileType = e.target.files[i].name.split('.')[1].toLowerCase();
            if(e.target.files[i].size < 10 ** 9 && (images.indexOf(fileType) !== -1 || archives.indexOf(fileType) !== -1)) {
                const fileObj = {
                    id: shortId.generate(),
                    file: e.target.files[i],
                    fileType: e.target.files[i].name.split('.')[1].toLowerCase(),
                    format: availablePaper ? availablePaper.title : '',
                    paper: availablePaper ? availablePaper.paperType[0].title : '',
                    amount: 1
                };
                arr.push(fileObj);
            }
        };

        this.props.addFotoParams(arr)
            .then(() => { this.fileInput.value = '' })
    };

    onUploadProgress = data => {
        const loadProgress = Math.round(data.loaded / (data.total / 100));

        this.setState({
            loadProgress
        });
    };

    sendFiles = () => {
        if(this.state.orderType !== 'fotoPrint' && !this.state.contacts) {
            this.setState({
                contactsError: 'Введите описание заказа'
            });
            return;
        };
        if(!this.props.user.phone && !this.props.user.email) {
            if(!this.state.contacts) {
                this.setState({
                     contactsError: 'Введите контактные данные'
                });
                return;
            }
        };

        const upload = Transport({
            self: this,
            files: this.props.fotoList,
            sendFiles: this.props.uploadFotos,
            uploadProgress: this.onUploadProgress,
            user: this.props.user.username || '',
            orderName: this.state.orderName,
            contacts: this.state.contacts
        });

        this.setState({
            loading: true
        });

        upload.onSubmit()
            .then(res => {
                this.setState({
                    loading: false,
                    preview: [],
                    previewSending: false,
                    sendedOrder: true,
                    contacts: ''
                });
            })
            .catch(err => {
                if(err.response && err.response.data.error.contactsError) {
                    this.setState({
                        loading: false,
                        contactsError: err.response.data.error.contactsError
                    });
                } else if(err.response && !err.response.data.error.globalError) {
                    this.setState({
                        loading: false,
                        preview: [],
                        previewSending: false,
                        error: err.response ? err.response.data.error : err.message
                    });
                    this.clearFileList();
                } else {
                    this.setState({
                        loading: false,
                        preview: [],
                        previewSending: false
                    });
                };

            })
    };

    zoomImage = (data) => {
        this.setState({
            zoomImage: !this.state.zoomImage,
            modal: data
        });
    };

    clearFileList = async () => {
        this.setState({
            contacts: ''
        });
        if(this.fileInput) this.fileInput.value = '';
        this.props.clearFileList();
    };

    calculate = () => {
        let calculatedObj = {};

        this.props.fotoList.forEach(item => {
            const formatPrice = parseFloat(prices[0].content.find(prices => prices.title === item.format).value);
            if(calculatedObj[item.format] && calculatedObj[item.format][item.paper]) {
                calculatedObj[item.format][item.paper] += item.amount;
            } else {
                calculatedObj[item.format] = {
                    ...calculatedObj[item.format],
                    [item.paper]: item.amount
                }
            };
        });

        const arrayCalc = Object.keys(calculatedObj).map(item => {
            const totalAmount = Object.keys(calculatedObj[item]).reduce((a, b) => {
                return a + +calculatedObj[item][b];
            }, 0);
            const totalSum = (parseFloat(prices[0].content
                .find(price => price.title === item).value) * totalAmount).toFixed(2);
            return {
                format: item,
                paper: calculatedObj[item],
                totalAmount,
                totalSum
            }
        });

        this.setState({
            orderName: shortId.generate(),
            preview: arrayCalc
        });

        window.addEventListener('keydown', this.cancelingSendFiles);
    };

    previewSending = () => {
        this.setState({
            orderName: shortId.generate(),
            previewSending: true
        });
        window.addEventListener('keydown', this.cancelingSendFiles);
    };

    onChangeInput = e => {
        this.setState({
            error: '',
            contactsError: '',
            [e.target.name]: e.target.value
        });
    };

    cancelingSendFiles = (e) => {
        if(e && e.keyCode && e.keyCode !== 27) return;
        this.setState({
            previewSending: false,
            preview: [],
            error: '',
            contacts: ''
        });
        window.removeEventListener('keydown', this.cancelingSendFiles);
    };

    fetchData = (title) => {
        this.setState({
            orderType: title
        });

    };

    render() {

        const progressLoad = ReactDOM.createPortal(
            <div className="progress-load">
                <Loading>
                    <p style={{ transform: 'translate(9%, 50%)' }}>{this.state.loadProgress} %</p>
                </Loading>
            </div>,
            document.getElementsByClassName('CommonPage')[0]
        );

        const simpleLoading = (
            <Loading />
        );

        const previewSending = (
            <div className="preview" ref={node => this.preview = node}>
                <h3>Сведения о заказе:</h3>
                <div className="description">
                    <h5>Номер заказа:</h5>
                    <div>{this.state.orderName}</div>
                </div>
                <textarea
                    name="contacts"
                    placeholder="Контактные данные и описание заказа(если считаете необходимым)..."
                    onChange={this.onChangeInput}
                    value={this.state.contacts}
                    className="custom-input"
                />
                {this.state.contactsError && <div className="error" style={{ textAlign: 'left' }}>{this.state.contactsError}</div>    }
                <div className="buttons">
                    <div className="btn" onClick={this.cancelingSendFiles}>Отменить</div>
                    <div className="btn" onClick={this.sendFiles}>Подтвердить</div>
                </div>
            </div>
        );

        const preview = (
            <div className="preview" ref={node => this.preview = node}>
                <h3>Сведения о заказе:</h3>
                <div className="description">
                    <h4>Номер заказа:</h4>
                    <div>{this.state.orderName}</div>
                    {this.state.preview.map((item, i) =>
                        <div className="wrapper" key={item + i}>
                            <div className="wrapper-item">
                                <h6>Формат: </h6>
                                <div>{item.format}</div>
                            </div>
                            <div className="wrapper-item">
                                <h6>Количество:</h6>
                                <div>{item.totalAmount}</div>
                            </div>
                            <div className="wrapper-item sum">
                                <h6>Сумма:</h6>
                                <div>
                                    {item.totalSum} руб.
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className="total-sum">
                    <h6>Общая стоимость:</h6>
                    <div>{this.state.preview.reduce((a, b) => +a + +b.totalSum, 0).toFixed(2)} руб.</div>
                </div>
                <textarea
                    name="contacts"
                    placeholder="Контактные данные и описание заказа(если считаете необходимым)..."
                    onChange={this.onChangeInput}
                    value={this.state.contacts}
                    className="custom-input"
                />
                {this.state.contactsError && <div className="error" style={{ textAlign: 'left' }}>{this.state.contactsError}</div>    }
                <div className="buttons">
                    <div className="btn" onClick={this.cancelingSendFiles}>Отменить</div>
                    <div className="btn" onClick={this.sendFiles}>Подтвердить</div>
                </div>
            </div>
        );

        const sendedOrder = (
            <div className="send-order">
                <div className="main">
                    <div className="header">
                        <h3>Заказ оформлен</h3>
                    </div>
                    <div className="main-content">
                        <h4>Номер: <span>{this.state.orderName}</span></h4>
                    </div>
                    <div className="btn" onClick={() => this.setState({ sendedOrder: false })}>Ok</div>
                </div>
            </div>
        );

        return (
            <div className="ShowImages" ref={node => this.mainRef = node}>
                {/*{this.state.simpleLoading && simpleLoading}*/}
                {this.state.loading && progressLoad}
                {/*{this.state.preview.length > 0 && preview}*/}
                {this.state.previewSending && previewSending}
                {this.state.sendedOrder && sendedOrder}
                {this.props.globalError && <h3 className="error">{this.props.globalError}</h3>}
                <div className="upper-labels">
                    <div className="left-btns">
                        <Option
                            items={[{ title: 'fotoPrint', name: 'Печать фотографий'}, { title: 'souvenir', name: 'Сувенирная продукция'}]}
                            value={this.state.orderType}
                            label='Тип услуги:'
                            onClick={this.fetchData}
                        />
                        <label className="btn" htmlFor="file-input" style={{ cursor: 'pointer' }}>Добавить файл...</label>
                        <input
                            ref={input => this.fileInput = input}
                            multiple={true}
                            type="file"
                            id="file-input"
                            style={{ display: 'none'}}
                            onChange={this.onChangeFiles}
                        />
                        {/*<div className="no-foto-order">Если ваш заказ не предпологает печать фотографий,*/}
                            {/*а иную услугу, просто игнорируйте формат и бумагу при описании кождого фото и*/}
                            {/*укажите в описании какую именно услугу хотите заказать</div>*/}
                    </div>
                    <div className="right-btns">
                        <button
                            className="btn send"
                            disabled={this.props.fotoList.length < 1 || this.state.error}
                            onClick={this.previewSending}
                        >
                            Отправить...
                        </button>
                        <button
                            className="btn"
                            disabled={this.props.fotoList.length < 1}
                            onClick={this.clearFileList}
                        >
                            Очистить
                        </button>
                    </div>
                </div>

                {!this.state.error ? this.props.fotoList.map((item, i) =>
                    <Image
                        key={item.id}
                        orderType={this.state.orderType}
                        {...item}
                        onClick={this.zoomImage}
                        deleteClick={this.deleteImage}
                    />
                ) :
                    <div className="error">{this.state.error}</div>
                }

                {this.state.zoomImage &&
                ReactDOM.createPortal(
                    <Modal
                        showModal={this.zoomImage}
                        title={this.state.modal.name || ''}
                        imagePath={this.state.modal.dataImage || ''}
                    >
                        <div className="data-image">
                            <FotoFormats
                                id={this.state.modal.id}
                                format={this.state.modal.format}
                                paper={this.state.modal.paper}
                                amount={this.state.modal.amount || 1}
                                name={this.state.modal.name}
                            />
                            
                        </div>

                    </Modal>,
                    document.getElementsByClassName('ShowImages')[0]
                )}

            </div>
        );
    }
};

//
// if(e.target.files[i].type.split('/')[0] === 'image' && e.target.files[i].size < 50000000) {
//     const fileObj = {
//         id: shortId.generate(),
//         file: e.target.files[i],
//         format: availablePaper ? availablePaper.title : '',
//         paper: availablePaper ? availablePaper.paperType[0].title : '',
//         amount: 1
//     };
//     arr.push(fileObj);
// }



