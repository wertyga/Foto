import { Link } from 'react-router-dom';

import './MainContentBlock.sass';

export default class MainContentBlock extends React.Component {
    constructor() {
        super();

        this.state = {
            appear: false
        };
    };


    componentDidMount() {
        this.appearScroll()
        window.addEventListener('scroll', this.appearScroll);
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.appearScroll);
    };

    appearScroll = () => {
        const showInAt = (window.scrollY + window.innerHeight) - (this.mainRef.offsetHeight / 2);
        const topOfTheElement = this.mainRef.offsetTop;
        if(showInAt > topOfTheElement ) {
            this.setState({
                appear: true
            });
        }
    };

    render() {

        let style = {
            image: {
                order: this.props.right ? '1' : '0'
            },
            content: {
                order: this.props.right ? '0' : '1'
            }
        };

        return (
            <div
                className={this.state.appear ? 'MainContentBlock appear' : 'MainContentBlock'}
                ref={node => this.mainRef = node}
                onScroll={this.appearScroll}
            >
                <Link to={this.props.to}>
                    {this.props.image &&
                        <div className="images" style={style.image}>
                            <img src={this.props.image} alt="image"/>
                        </div>
                    }
                    <div className="main-block-content" style={style.content}>
                        <h3>{this.props.title}</h3>
                        {this.props.children}
                    </div>
                </Link>
            </div>
        );
    }
};

MainContentBlock.propTypes = {
    image: PropTypes.string, // image for left or right side content of the element
    right: PropTypes.bool, //align content from left to right or from right to left
    title: PropTypes.string, // h3 of the element block
};