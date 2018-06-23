import FlipMove from 'react-flip-move';

import './Descr.sass'

export default class Descr extends React.Component {

    componentDidMount() {
        window.scroll({
            top: 0,
            behavior: 'smooth'
        })
    };

    render() {
        return (
            <FlipMove appearAnimation='fade' className="Descr">
                <h1>{this.props.title}</h1>
                {this.props.children}
            </FlipMove>
        );
    }
};