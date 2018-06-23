import Loadable from 'react-loadable';

import LoadingComponent from '../Loading/Loading';

export const HowToSetOrderPage = Loadable({
    loader: () => import('../HowToSetOrderPage/HowToSetOrderPage'),
    loading() {
    return <LoadingComponent />
}
});
export const userOrder = Loadable({
    loader: () => import('../userOrder/userOrder'),
    loading() {
        return <LoadingComponent />
    }
});
export const OrderPage = Loadable({
    loader: () => import('../OrderPage/OrderPage'),
    loading() {
        return <LoadingComponent />
    }
});
export const ContactsPage = Loadable({
    loader: () => import('../ContactsPage/ContactsPage'),
    loading() {
        return <LoadingComponent />
    }
});
export const Contacts = Loadable({
    loader: () => import('../Contacts/Contacts'),
    loading() {
        return <LoadingComponent />
    }
});
export const LoginForm = Loadable({
    loader: () => import('../LoginForm/LoginForm'),
    loading() {
        return <LoadingComponent />
    }
});
export const MainPage = Loadable({
    loader: () => import('../MainPage/MainPage'),
    loading() {
        return <LoadingComponent />
    }
});
export const About = Loadable({
    loader: () => import('../About/About'),
    loading() {
        return <LoadingComponent />
    }
});
export const ShowImages = Loadable({
    loader: () => import('../ShowImages/ShowImages'),
    loading() {
        return <LoadingComponent />
    }
});
export const Prices = Loadable({
    loader: () => import('../Prices/Prices'),
    loading() {
        return <LoadingComponent />
    }
});
export const ProductWrapper = Loadable({
    loader: () => import('../ProductWrapper/ProductWrapper'),
    loading() {
        return <LoadingComponent />
}
});