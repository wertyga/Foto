import lists from '../../../server/data/menuList';

export default function(e) {
    let pathname = window.location.pathname;
    return lists.find(item => item.route === pathname) ? lists.find(item => item.route === pathname).title : '';
};