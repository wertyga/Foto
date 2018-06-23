import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { setUser } from '../../actions/auth';

import setTokenHeader from '../../common/commonFunctions/setTokenHeader';
import setLocalStorage from '../../common/commonFunctions/setLocalStorage';

import ButterMenu from '../../common/ButterMenu/ButterMenu';
import VertIcon from '../../common/VertBubbles/VertBubbles';

import DropMenu from '../DropMenu/DropMenu';
import getNavigateTitle from '../../common/commonFunctions/getNavigateTitle';

import './UpperMenu.sass';


const mapState = state => {
    return {
        user: state.user
    }
};

@connect(mapState, { setUser })
export default class UpperMenu extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            titleString: getNavigateTitle(),
            location: window.location.href,
            mobile: window.innerWidth < 660 ? true : false,
            mobileSocialOpen: false,
            tooltip: '',
            tooltipPosition: {}
        };
    };

    componentDidMount() {
        this.mainDOM = ReactDOM.findDOMNode(this);
        window.addEventListener('scroll', this.windowScroll)
        window.addEventListener('resize', e => {
            if(window.innerWidth < 660 && !this.state.mobile) {
                this.setState({
                    mobile: true
                });
            } else if(window.innerWidth > 660 && this.state.mobile && this.mainDOM.offsetHeight > window.scrollY) {
                this.setState({
                    mobile: false
                });
            };
        })
    };

    componentDidUpdate(prevProps, prevState) {
        if(prevState.location !== window.location.href) {
            this.setState({
                location: window.location.href,
                titleString: getNavigateTitle(window.location.href)
            });
        }
    };

    windowScroll = e => {
        const logo = ReactDOM.findDOMNode(this.logoRef);
        if(this.mainDOM.offsetHeight < window.scrollY) {
            this.setState({
                mobile: true
            });
            logo.style.marginLeft = `${-logo.offsetWidth + 20}px`
        } else if(window.innerWidth > 660){
            this.setState({
                mobile: false
            });
            logo.style.marginLeft = `0px`;
        }
    };

    bodyClose = e => {
        // DropMenu
        if(e.target.classList.contains('ButterMenu') ||
            e.target.parentElement.classList.contains('ButterMenu') ||
            e.target.classList.contains('Icon') ||
            e.target.parentElement.classList.contains('Icon')
        ) return;
        if(!e.target.classList.contains('DropMenu') ||
            (e.keyCode && e.keyCode === 27)) {
                this.props.openMenu(false)
        };
        if(this.state.mobile) {
            this.setState({
                mobileSocialOpen: false
            });
        };
        document.body.removeEventListener('click', this.bodyClose);
        document.body.removeEventListener('keyup', this.bodyClose);
    };

    onClickOpenMenu = async () => {
        const index = await this.props.open;
        await this.props.openMenu(!index);
        if(this.props.open) {
            document.body.addEventListener('click', this.bodyClose);
            document.body.addEventListener('keyup', this.bodyClose);
        };
    };


    mobileSocialClick = async () => {
        if(this.state.mobile) {
            await this.setState({
                mobileSocialOpen: !this.state.mobileSocialOpen
            });
            if(this.state.mobileSocialOpen) {
                document.body.addEventListener('click', this.bodyClose);
                document.body.addEventListener('keyup', this.bodyClose);
            }
        }
    };

    logoClick = () => {
        this.props.openMenu(false);
    };

    linkClick = titleString => this.setState({ titleString });

    showTooltip  = (text) => {
        if(text) {
            this.timer = setTimeout(() => {
                this.setState({
                    tooltip: text
                });
            }, 300)
        } else {
            this.setState({
                tooltip: ''
            });
            clearTimeout(this.timer);
        };
        
    };

    logOut = async () => {
        this.props.setUser();
        setTokenHeader();
        setLocalStorage();
    };

    render() {

        const login = (
            <div className="login">
                <Link
                    className="fa fa-sign-in"
                    aria-hidden="true"
                    onMouseOver={() => this.showTooltip('Войти')}
                    onMouseLeave={() => this.showTooltip()}
                    to="/login"
                />
                <Link
                    className="fa fa-user-plus"
                    aria-hidden="true"
                    onMouseOver={() => this.showTooltip('Регистрация')}
                    onMouseLeave={() => this.showTooltip()}
                    to="/register"
                />
            </div>
        );
        const logout = (
            <div className="login">
                <i 
                    className="fa fa-sign-out" 
                    aria-hidden="true"
                    onMouseOver={() => this.showTooltip('Выйти')}
                    onMouseLeave={() => this.showTooltip()}
                    onClick={this.logOut}
                />
                <Link
                    to='/user/contacts-page'
                    className="fa fa-user-circle-o"
                    aria-hidden="true"
                    onMouseOver={() => this.showTooltip('Контакты')}
                    onMouseLeave={() => this.showTooltip()}
                    onClick={this.goToUserPage}
                />
            </div>
        );

        return (
            <div className={this.state.mobile ? 'UpperMenu mobile' : 'UpperMenu'} ref={this.props.refProp}>

                <div className="left-content">
                    <ButterMenu
                        barHeight={3}
                        open={this.props.open}
                        onClick={this.onClickOpenMenu}
                    />
                    <div className="middle-left-content">
                        <Link to="/" className='logo' ref={node => this.logoRef = node}>Podsolnux</Link>
                        <div className="navigate">{this.state.titleString}</div>
                    </div>
                </div>

                <div className='right-content' ref="rightContent"
                     style={{
                        transform: this.state.mobile && (this.state.mobileSocialOpen ? 'translateX(0)' : 'translateX(74px)')
                      }}
                >
                    {this.props.user.username && <div className="username">{this.props.user.username }</div>}
                    <VertIcon
                            countBubbles={4}
                            size={3}
                            onClick={this.mobileSocialClick}
                        />
                        <div className='social-block'>
                            {this.state.tooltip && <div className="tooltip">{this.state.tooltip}</div>}
                            {this.props.user.username  ? logout : login}
                        </div>
                </div>

            </div>
        );
    }
};