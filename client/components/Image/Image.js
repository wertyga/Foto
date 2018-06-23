import { connect } from 'react-redux';

import { addFotoParams, deleteUserFoto } from '../../actions/params';

import { checkFileType } from '../../common/commonFunctions/checkFileType';
import { archives } from '../../common/commonFunctions/checkFileType';
import { images } from '../../common/commonFunctions/checkFileType';

import FlipMove from 'react-flip-move';
import Loading from '../Loading/Loading';
import rarImage from '../../common/rar.jpg';
import blankImage from '../../common/EmptyImage.png';

import './Image.sass';


const mapState = state => {
    return {
        fotoList: state.fotoList,
        fotoParams: state.fotoParams
    }
};

@connect(mapState, { addFotoParams, deleteUserFoto })
export default class Image extends React.Component {
    constructor(props) {
        super(props);

        let availablePaper = this.props.fotoParams.map(item => {
            return {
                ...item,
                paperType: item.paperType.filter(type => !!type.value)
            };
        })[0];

        this.state = {
            dataImage: '',
            id: '',
            name: '',
            format: availablePaper ? availablePaper.title : '',
            paper: availablePaper ? availablePaper.paperType[0].title : '',
            amount: 1,
            loading: false
        };
    };

    componentDidMount() {
            if(!this.props.filePath) {
                let fr = new FileReader();
                if(images.indexOf(this.props.fileType) !== -1) {
                    fr.readAsDataURL(this.props.file);
                    fr.onload = () => {
                        let data = fr.result;
                        this.setState({
                            dataImage: data,
                            name: this.props.file.name
                        });
                    };
                } else if(archives.indexOf(this.props.fileType) !== - 1){
                    this.setState({
                        dataImage: rarImage,
                        name: this.props.file.name
                    });
                }
            } else {
                const fileType = checkFileType(this.props.filePath);
                const type = fileType === 'image' ? this.props.filePath : (fileType === 'archive' ? rarImage : blankImage);
                this.setState({
                    id: this.props.id,
                    name: this.props.name,
                    dataImage: type,
                    format: this.props.format,
                    amount: this.props.amount,
                    paper: this.props.paper
                });
            }

    };

    componentDidUpdate(prevProps, prevState) {
        if(this.props.fotoList !== prevProps.fotoList) {
            const needItem = this.props.fotoList.find(item => item.id === this.props.id);
            if(!needItem) return;

            this.setState({
                format: needItem.format,
                paper: needItem.paper,
                amount: needItem.amount
            });
        };
    };

    onClick = (e) => {
        this.props.onClick({
            id: this.props.id,
            name: this.state.name,
            dataImage: this.state.dataImage,
            format: this.state.format,
            amount: this.state.amount,
            paper: this.state.paper
        })
    };

    deleteClick = () => {
        this.props.deleteUserFoto(this.props.id)
    };

    render() {
        const appear = {
            from: {
                transform: 'translateY(-50%)',
                opacity: 0
            },
            to: {
                transform: 'translateY(0)',
                opacity: 1
            }
        };

        const main  = (
            <FlipMove className="user-image" appearAnimation="fade">
                <i className="fa fa-times" onClick={this.deleteClick}/>

                <div className="img" onClick={this.onClick}>
                    <img src={this.state.dataImage} alt=""/>
                </div>

                {this.props.orderType === 'fotoPrint' &&
                    <div className="main-content">
                        <div className="header"><h6>Формат: </h6><span>{this.state.format || 'Пусто'}</span></div>
                        <div className="header"><h6>Бумага: </h6>
                            <span>{this.props.fotoParams.find(item => item.title === this.state.format)
                                .paperType.find(type => type.title === this.state.paper).name || 'Пусто'}</span></div>
                        <div className="header"><h6>Колличество: </h6><span>{this.state.amount || 'Пусто'}</span></div>
                    </div>
                }

            </FlipMove>
        );
        return (
            <div className="Image" style={{ borderRight: !this.state.dataImage && 'none' }}>
                {(this.state.dataImage && !this.state.loading) ?
                    main :
                    <Loading style={{ position: 'absolute', backgroundColor: 'transparent' }}/>}
            </div>
        );
    }
};