import UpperMenu from '../client/components/UpperMenu/UpperMenu';
import DropMenu from '../client/components/DropMenu/DropMenu';
import ButterMenu from '../client/common/ButterMenu/ButterMenu';
import App from '../client/components/App/App';

describe.only('#UpperMenu', () => {
    it('Open DropMenu', () => {
        const upperMenu = shallow(<UpperMenu />);

        upperMenu.find(ButterMenu).simulate('click');
        expect(upperMenu.state('openMenu')).to.equal(true);
        expect(upperMenu.find(DropMenu).length).to.equal(1);
    });
});