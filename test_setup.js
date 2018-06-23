import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { expect } from 'chai';
import toJson from 'enzyme-to-json';

global.shallow = shallow;
global.expect = expect;
global.render = render;
global.mount = mount;
global.React = React;
global.toJson = toJson;
// Обрушим тест при любой ошибке
console.error = message => {
    throw new Error(message);
};

configure({ adapter: new Adapter() });
