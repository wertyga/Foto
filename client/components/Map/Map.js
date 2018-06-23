const key = 'AIzaSyACURhTIfjvlJumntmEPqDfLYnsOux9nq8';

import './Map.sass';

export default class Map extends React.Component {

    componentDidMount() {
        this.loadJS(`https://maps.googleapis.com/maps/api/js?key=${key}&callback=initMap`);
        window.initMap = this.initMap;

    };

    loadJS = (src) => {
        const ref = window.document.getElementsByTagName("script")[0];
        const script = window.document.createElement("script");
        script.src = src;
        script.id = 'map';
        script.async = true;
        ref.parentNode.insertBefore(script, ref);
    };

    initMap = () => {
        const pod = {lat: 53.8814256, lng: 27.5539121};
        const map = new google.maps.Map(this.mainRef, {
            zoom: 17,
            center: pod
        });
        const marker = new google.maps.Marker({
            position: pod,
            map: map
        });
    };

    render() {
        return (
            <div
                style={{
                    height: this.props.open ? '45vh' : 0
                }}
                className="Map"
                ref={node => this.mainRef = node}
            ></div>
        );
    };
};

//API key for Google maps: AIzaSyACURhTIfjvlJumntmEPqDfLYnsOux9nq8
//src string: https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap