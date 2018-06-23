import { Route, Switch } from 'react-router-dom';

import AdminLogin from '../AdminLogin/AdminLogin';
import AdminPage from '../AdminPage/AdminPage';
import AdminOrders from '../AdminOrders/AdminOrders';
import FotoParams from '../FotoParams/FotoParams';

import './Admin.sass';

class App extends React.Component {
    render() {
        return (
            <div className="container ui" style={{ paddingTop: '10%' }}>
                <Switch>
                    <Route exact path="/admin" component={AdminPage}/>
                    <Route exact path="/admin/login" component={AdminLogin}/>
                    <Route exact path="/admin/orders" component={AdminOrders}/>
                    <Route exact path="/admin/params" component={FotoParams}/>
                </Switch>
            </div>
        );
    }
}

export default App;

