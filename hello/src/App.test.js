import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import renderer from 'react-test-renderer';

import App from './App';
import HelloWorld from './HelloWorld';
import HelloWorldList from './HelloWorldList';
import AddGreeter from './AddGreeter';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<App />, div);
	ReactDOM.unmountComponentAtNode(div);
});

describe(HelloWorld, () => {
	const name = 'Person';
	const mockRemoveGreeting = jest.fn();
	const component = shallow(
		<HelloWorld name={name} removeGreeting={mockRemoveGreeting} />
	);

	it('renders and matches our snapshot', () => {
		const component = renderer.create(
			<HelloWorld name="Person" />
		);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('contains the supplied name', () => {
		expect(component.text()).toContain(name);
	});

	it('modifies the greeting when frenchify is clicked', () => {
		component.find('button.frenchify').simulate('click');
		expect(component.text()).toContain('Bonjour');
	});
	
	it('calls the passed in removeGreeting function when remove button is clicked', () => {
		component.find('button.remove').simulate('click');
		expect(mockRemoveGreeting).toBeCalled();
	});
});

describe(HelloWorldList, () => {
	const component = shallow(
		<HelloWorldList />
	);

	it('renders and matches our snapshot', () => {
		const component = renderer.create(
			<HelloWorldList />
		);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('contains an AddGreeter subcomponent', () => {
		expect(component.find(AddGreeter)).toHaveLength(1);
	});

	it('contains the same number of HelloWorld components as greetings', () => {
		const helloWorlds = component.find(HelloWorld).length;
		const greetings = component.state('greetings').length;
		expect(helloWorlds).toEqual(greetings);
	});

	it('adds another greeting when the add greeting function is called', () => {
		const before = component.find(HelloWorld).length;
		component.instance().addGreeting('Sample');
		component.update();
		const after = component.find(HelloWorld).length;
		expect(after).toBeGreaterThan(before);
	});

	it('removes a greeting from the list when the remove greeting function is called', () => {
		const before = component.find(HelloWorld).length;
		const removeMe = component.state('greetings')[0];
		component.instance().removeGreeting(removeMe);
		component.update();
		const after = component.find(HelloWorld).length;
		expect(after).toBeLessThan(before);
	});
});

describe(AddGreeter, () => {
	const mockAddGreeter = jest.fn();
	const component = shallow(
		<AddGreeter addGreeting={mockAddGreeter} />
	);

	it('renders and matches our snapshot', () => {
		const component = renderer.create(
			<AddGreeter />
		);
		const tree = component.toJSON();
		expect(tree).toMatchSnapshot();
	});

	it('contains the form', () => {
		expect(component.find('input')).toHaveLength(1);
		expect(component.find('button')).toHaveLength(1);
	});

	it('calls the passed in addGreeting function when add button is clicked', () => {
		component.find('button').simulate('click');
		expect(mockAddGreeter).toBeCalled();
	});

	it('updates the form when keys are pressed', () => {
		const updateKey = 'foo';
		component.instance().handleUpdate({ target: { value: updateKey }});
		expect(component.state('greetingName')).toEqual(updateKey);
	});

	it('blanks out the greetingName when the button is clicked', () => {
		const updateKey = 'a';
		component.instance().handleUpdate({ target: { value: updateKey } });
		expect(component.state('greetingName')).toEqual(updateKey);
		component.find('button').simulate('click');
		expect(component.state('greetingName')).toHaveLength(0);
	});
});
