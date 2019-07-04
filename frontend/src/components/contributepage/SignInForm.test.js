import React from 'react';
import { shallow } from 'enzyme';
import SignInForm from './SignInForm';

const signinform = shallow(
  <SignInForm fetching={{formRequest: {
      form: 'test'
  }}} />
);

test('Writing something into email field and deleting it again will result in warning', () => {

    const event = {target: {name: 'email', value: 'test@test.de'}};
    const event2 = {target: {name: 'email', value: ''}};

    const input = signinform.find('input[name="email"]');
    input.simulate('change', event);
    expect(signinform.state().errors.email).toEqual(false);
    input.simulate('change', event2);
    expect(signinform.state().errors.email).toEqual(true);
})


test('Changing the email to a non-valid email will result in warning, changing to valid email will make the warning disappear', () => {

    const event = {target: {name: 'email', value: 'abc'}};
    const event2 = {target: {name: 'email', value: 'abc@def.de'}};

    const input = signinform.find('input[name="email"]');
    input.simulate('change', event);
    expect(signinform.state().errors.email).toEqual(true);
    input.simulate('change', event2);
    expect(signinform.state().errors.email).toEqual(false);
})

test('Writing something into password field and deleting it again will result in warnign', () => {

    const event = {target: {name: 'password', value: 'test'}};
    const event2 = {target: {name: 'password', value: ''}};

    const input = signinform.find('input[name="password"]');
    input.simulate('change', event);
    expect(signinform.state().errors.password).toEqual(false);
    input.simulate('change', event2);
    expect(signinform.state().errors.password).toEqual(true);
})


test('Submitting an empty form will result in error messages', () => {

    const input = signinform.find('form');

    const event = {preventDefault: function() {}};

    input.simulate('submit', event);

    expect(signinform.state().errorMessages.length).toEqual(1);
})
