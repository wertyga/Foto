import './cross.sass';

const cross = props => {
    return (
        <div className="cross" onClick={props.onClick}>
            <div className="upperBlock">
                <div></div>
                <div></div>
            </div>
            <div className="lowerBlock">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};

export default cross;