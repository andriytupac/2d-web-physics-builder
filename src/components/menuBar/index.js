import React, { useState, useEffect } from 'react';
import {
	Menu,
	Checkbox,
	Dropdown,
	Container,
	Label,
	Responsive,
	Sidebar,
	Segment,
	Icon,
	Image,
} from 'semantic-ui-react';
import { useStoreActions, useStoreState } from 'easy-peasy';
import { useHistory, useRouteMatch, Link } from 'react-router-dom';

import logo from '../../img/phbm192.png';

const exampleOptions = [
	{ key: 'emptyArea', text: 'Empty Area', value: 'emptyArea' },
	{ key: 'ballPool', text: 'Ball Pool', value: 'ballPool' },
	{ key: 'bridge', text: 'Bridge', value: 'bridge' },
	{ key: 'catapult', text: 'Catapult', value: 'catapult' },
	{ key: 'chains', text: 'Chains', value: 'chains' },
	{ key: 'concave', text: 'Concave', value: 'concave' },
	{ key: 'constraints', text: 'Constraints', value: 'constraints' },
	{ key: 'manipulation', text: 'Manipulation', value: 'manipulation' },
	{ key: 'pyramid', text: 'Pyramid', value: 'pyramid' },
	{ key: 'restitution', text: 'Restitution', value: 'restitution' },
	{ key: 'sprites', text: 'Sprites', value: 'sprites' },
	{ key: 'wreckingBall', text: 'Wrecking Ball', value: 'wreckingBall' },
];
const newModels = [
	{ key: 'excavator', text: 'Excavator', value: 'excavator' },
	{ key: 'bulldozer', text: 'Bulldozer', value: 'bulldozer' },
	{ key: 'tractor', text: 'Tractor', value: 'tractor' },
	{ key: 'dumpTruck', text: 'Dump truck', value: 'dumpTruck' },
	{ key: 'mobileCrane', text: 'Mobile crane', value: 'mobileCrane' },
	{ key: 'forklift', text: 'Forklift', value: 'forklift' },
	{ key: 'excavatorTractor', text: 'Excavator Tractor', value: 'excavatorTractor' },
	{ key: 'jsLanguages', text: 'Js Languages', value: 'jsLanguages' },
];

const getWidth = () => {
	const isSSR = typeof window === 'undefined';

	return isSSR ? Responsive.onlyTablet.minWidth : window.innerWidth;
};

const MenuBar = props => {
	const { children } = props;
	const menuLeft = useStoreState(state => state.general.menuLeft);

	const history = useHistory();

	const mashValue = useRouteMatch('/examples/:id');
	const selectExample = mashValue && mashValue.isExact ? mashValue.params.id : '';

	const mashModelValue = useRouteMatch('/new-models/:id');
	const selectModel = mashModelValue && mashModelValue.isExact ? mashModelValue.params.id : '';

	const turnMenuLeft = useStoreActions(actions => actions.general.turnMenuLeft);

	const home = useRouteMatch('/');

	useEffect(() => {
		localStorage.setItem('leftMenu', menuLeft);
	}, [menuLeft]);

	const [sidebarOpened, setSidebarOpened] = useState(false);
	const [example, setExample] = useState(1);
	const [model, setModel] = useState(2);

	const handleItemClick = (e, { name }) => {
		history.push(name);
	};

	const handlerChooseExample = (event, data) => {
		history.push(`/examples/${data.value}`);
		setExample(1);
		setModel(0);
	};
	const handlerChooseModel = (event, data) => {
		// console.log(data)
		history.push(`/new-models/${data.value}`);
		setExample(0);
		setModel(1);
	};
	const handlerMobileMenu = () => {
		setSidebarOpened(!sidebarOpened);
	};

	return (
		<>
			<Responsive getWidth={getWidth} minWidth={Responsive.onlyTablet.minWidth}>
				<Menu size="large">
					<Container>
						<Menu.Item style={{ padding: '5px' }}>
							<Link to="/">
								<Image style={{ width: '40px' }} src={logo} size="tiny" />
							</Link>
						</Menu.Item>
						<Menu.Item as="a" target="_blank" href="https://github.com/andriytupac/2d-web-physics-builder">
							Github
						</Menu.Item>
						<Menu.Item as="a" target="_blank" href="https://brm.io/matter-js/">
							Matte.js
						</Menu.Item>
						<Menu.Item name="examples">
							<Dropdown
								key={example}
								button
								className="icon"
								floating
								labeled
								icon="random"
								options={exampleOptions}
								search
								defaultValue={selectExample}
								text="Select example"
								onChange={handlerChooseExample}
							/>
						</Menu.Item>
						<Menu.Item name="new-model">
							<Dropdown
								key={model}
								button
								className="icon"
								floating
								labeled
								icon="truck"
								options={newModels}
								search
								defaultValue={selectModel}
								text="Select model"
								onChange={handlerChooseModel}
							/>
						</Menu.Item>
						{!home.isExact && (
							<Menu.Item position="right">
								<Label>Menu Editor</Label>
								<Checkbox
									onChange={() => {
										turnMenuLeft(!menuLeft);
									}}
									toggle
									checked={menuLeft}
								/>
							</Menu.Item>
						)}
					</Container>
				</Menu>
				{children}
			</Responsive>
			<Responsive as={Sidebar.Pushable} getWidth={getWidth} maxWidth={Responsive.onlyMobile.maxWidth}>
				<Sidebar
					as={Menu}
					animation="push"
					inverted
					// onHide={handlerMobileMenu}
					vertical
					visible={sidebarOpened}
				>
					<Menu.Item name="/" onClick={handleItemClick}>
						Home
					</Menu.Item>
					<Menu.Item as="a" target="_blank" href="https://github.com/andriytupac/2d-web-physics-builder">
						Github
					</Menu.Item>
					<Menu.Item as="a" target="_blank" href="https://brm.io/matter-js/">
						Matte.js
					</Menu.Item>
					{!home.isExact && (
						<Menu.Item position="right">
							<Label>Menu Editor</Label>
							<Checkbox
								onChange={() => {
									turnMenuLeft(!menuLeft);
								}}
								toggle
								checked={menuLeft}
							/>
						</Menu.Item>
					)}
				</Sidebar>

				<Sidebar.Pusher>
					<Segment inverted textAlign="center" style={{ padding: '1em 0em' }} vertical>
						<Container>
							<Menu inverted pointing secondary size="large">
								<Menu.Item onClick={handlerMobileMenu} style={{ alignSelf: 'center' }}>
									<Icon name="sidebar" />
								</Menu.Item>
								<Menu.Item position="right" style={{ display: 'block' }}>
									<Dropdown
										key={example}
										button
										className="icon"
										floating
										labeled
										icon="random"
										options={exampleOptions}
										search
										defaultValue={selectExample}
										text="Select example"
										onChange={handlerChooseExample}
										style={{ display: 'block' }}
									/>
									<Dropdown
										key={model}
										button
										className="icon"
										floating
										labeled
										icon="truck"
										options={newModels}
										search
										defaultValue={selectModel}
										text="Select model"
										onChange={handlerChooseModel}
										style={{ display: 'block' }}
									/>
								</Menu.Item>
							</Menu>
						</Container>
					</Segment>

					{children}
				</Sidebar.Pusher>
			</Responsive>
		</>
	);
};

export default MenuBar;
