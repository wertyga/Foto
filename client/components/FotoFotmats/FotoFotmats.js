import { connect } from 'react-redux';

import { addFotoParams } from '../../actions/params';

import Option from '../../common/Option/Option';

import './FotoFormats.sass';



const mapState = state => {
    return {
        fotoParams: state.fotoParams
    }
};

@connect(mapState, { addFotoParams })
export default class FotoFormats extends React.Component {
    constructor(props) {
        super(props);

        const { format, paper } = this.props;

        let firstAvailableFormat;
        let firstAvailablePaperTypes ;

        // if(!format) {
        //     firstAvailableFormat = this.props.fotoParams.find(item => item.paperType.find(type => type.value === true));
        //     firstAvailablePaperTypes = firstAvailableFormat.paperType.find(item => item.value === true);
        //
        // };

        const availableTypes = this.props.fotoParams.find(item => item.title === format).paperType
            .filter(type => type.value === true);

        this.state = {
            format,
            paper,
            paperTypes: availableTypes,
            amount: this.props.amount
        };
    };

    componentDidUpdate(prevProps, prevState) {
        if(this.state.format !== prevState.format) {
            this.updateFormat();
        };
    };

    componentWillUnmount() {
        this.props.addFotoParams({
            id: this.props.id,
            format: this.state.format,
            amount: this.state.amount,
            paper: this.state.paper
        })
    };

    updateFormat = () => {
        const availableTypes = this.props.fotoParams.find(item => item.title === this.state.format)
            .paperType.filter(type => type.value === true);
        this.setState({
            paper: availableTypes.length > 0 ? availableTypes[0].title : [],
            paperTypes: availableTypes
        });
    };

    changeFormat = (format) => {
        this.setState({
            format
        });
    };

    changePaperType = paper => {
        this.setState({
            paper
        });
    };

    amountClick = e => {
        const count = e.target.getAttribute('data-value') === '+';
        let nowAmount = count ? this.state.amount + 1 : this.state.amount -1;
        if(nowAmount < 1 || nowAmount > 99) return;
        this.setState({
            amount: nowAmount
        });
    };

    render() {

        const availableFormats = this.props.fotoParams
            .map(format => { return { name: format.title, title: format.title, paperType: format.paperType } })
            .filter(type => type.paperType.filter(paper => paper.value === true).length > 0);

        return (
            <div className="FotoFormats" style={this.props.style}>
                {this.state.format ?
                    <Option
                        //Formats
                        items={availableFormats}
                        value={this.state.format}
                        onClick={this.changeFormat}
                        label="Формат: "
                        iconStyle={{
                            marginTop: 7,
                            width: 15
                        }}
                    /> :
                    <p>Нет выбора</p>
                }
                {this.state.paperTypes ?
                    <Option
                        //Paper types
                        items={this.state.paperTypes}
                        value={this.state.paper}
                        onClick={this.changePaperType}
                        label="Бумага: "
                        className="paper-types"
                        iconStyle={{
                            marginTop: 7,
                            width: 15
                        }}
                    /> :
                    <p>Нет выбора</p>
                }

                <div className="amount">
                    <h3>Колличество:</h3>
                    <div className="buttons">
                        <div className="btn" data-value="-" onClick={this.amountClick}>-</div>
                        <div className="counter">{this.state.amount}</div>
                        <div className="btn" data-value="+" onClick={this.amountClick}>+</div>
                    </div>
                </div>
            </div>
        );
    };
};