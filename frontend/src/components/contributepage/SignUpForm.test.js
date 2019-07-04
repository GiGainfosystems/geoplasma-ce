import React from 'react';
import { shallow } from 'enzyme';
import SignUpForm from './SignUpForm';

const singupform = shallow(
  <SignUpForm fetching={{formRequest: {
      form: 'test'
  }}} />
);

test('Writing something into username field and deleting it again will result in warnign', () => {

    const event = {target: {name: 'username', value: 'test'}};
    const event2 = {target: {name: 'username', value: ''}};

    const input = singupform.find('input[name="username"]');
    input.simulate('change', event);
    expect(singupform.state().errors.username).toEqual(false);
    input.simulate('change', event2);
    expect(singupform.state().errors.username).toEqual(true);
})


test('Changing the email to a non-valid email will result in warning, changing to valid email will make the warning disappear', () => {

    const event = {target: {name: 'email', value: 'abc'}};
    const event2 = {target: {name: 'email', value: 'abc@def.de'}};

    const input = singupform.find('input[name="email"]');
    input.simulate('change', event);
    expect(singupform.state().errors.email).toEqual(true);
    input.simulate('change', event2);
    expect(singupform.state().errors.email).toEqual(false);
})

test('Writing something into password field and deleting it again will result in warnign', () => {

    const event = {target: {name: 'password', value: 'test'}};
    const event2 = {target: {name: 'password', value: ''}};

    const input = singupform.find('input[name="password"]');
    input.simulate('change', event);
    expect(singupform.state().errors.password).toEqual(false);
    input.simulate('change', event2);
    expect(singupform.state().errors.password).toEqual(true);
})

test('Not having matching passwords will result in warning, matching -> no error', () => {

    const event = {target: {name: 'password', value: 'not'}};
    const event2 = {target: {name: 'confirmPassword', value: 'matching'}};
    const event3 = {target: {name: 'confirmPassword', value: 'not'}};

    const input = singupform.find('input[name="password"]');
    input.simulate('change', event);

    const input2 = singupform.find('input[name="confirmPassword"]');
    input2.simulate('change', event2);

    expect(singupform.state().errors.confirmPassword).toEqual(true);

    input2.simulate('change', event3);
    expect(singupform.state().errors.confirmPassword).toEqual(false);
})

test('Submitting an empty form will result in error messages', () => {

    const input = singupform.find('form');

    const event = {preventDefault: function() {}};

    input.simulate('submit', event);

    expect(singupform.state().errorMessages.length).toEqual(2);
})
