import PropTypes from 'prop-types';

import FlipMove from 'react-flip-move';

import blankImage from '../../common/EmptyImage.png';

import calculatePrice from '../../common/commonFunctions/calculatePrice';

import './Modal.sass';


export default class Modal extends React.Component {
    constructor() {
        super();

        this.state = {
            top: 0
        };
    };

    componentDidMount() {
        this.parentEl = this.mainRef.parentElement;
        const top = this.parentEl.getBoundingClientRect().top < 0
            ? -this.parentEl.getBoundingClientRect().top + 53
            : 0;

        this.setState({
            top
        });
        document.body.addEventListener('keyup', this.closeModal);
        setTimeout(() => {
            const height = this.parentEl.offsetHeight +
                (this.mainRef.getBoundingClientRect().bottom - this.parentEl.getBoundingClientRect().bottom);

            this.parentEl.style.minHeight = height + 'px';
        }, 10)

    };

    componentWillUnmount() {
        document.body.removeEventListener('keyup', this.closeModal);
        this.parentEl.style.minHeight = 'initial';
    };

    closeModal = (e) => {
        if(e.keyCode) {
            if(e.keyCode !== 27) return;
        }
        this.props.showModal(false)
    };

    render() {

        const appear = {
            from: {
                transform: 'translateY(-100%)'
            },
            to: {
                transform: 'translateY(0)'
            }
        };

        return (
            <div className="Modal" ref={node => this.mainRef = node} style={{ top: this.state.top }}>
                <FlipMove appearAnimation="fade" duration={300}>
                <div className="modal-wrapper">
                    <div className="img-block">

                        <img src={this.props.imagePath || blankImage} alt={this.props.title || 'none'}/>

                    </div>
                    <div className="modal-content">
                        {!!this.props.title &&
                            <div className="title"><h2>Название: {this.props.title}</h2></div>
                        }
                        {!!this.props.category &&
                            <div className="category"><h4 style={{ display: 'inline-block', marginRight: 20 }}>
                                Категория:</h4>{this.props.categoryName}</div>
                        }
                        {!!this.props.description &&
                            <div className="description"><h4>Описание:</h4> {this.props.description}</div>
                        }
                        {!!this.props.price &&
                            <div className="price">Цена: {calculatePrice(this.props.price, this.props.discount)} руб.</div>
                        }
                        {!!this.props.discount &&
                            <div className="discount">Скидка: {this.props.discount} %</div>
                        }
                        {this.props.children && this.props.children}
                    </div>
                </div>
                </FlipMove>

                <div className="btn" ref={node => this.btn = node} onClick={this.closeModal}>Закрыть</div>
            </div>
        );
    };
};

Modal.propTypes = {
    showModal: PropTypes.func.isRequired, // Show or hide modal
    imagePath: PropTypes.string, // Image link or base64-format
    title: PropTypes.string, //H2 header
    category: PropTypes.string, //Product category name (H4)
    price: PropTypes.number, // Pric of product
    discount: PropTypes.number //Discount of product
};