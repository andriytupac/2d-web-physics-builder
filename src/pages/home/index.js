import React from 'react';
import { Container, Divider, Grid, Header, Image, List, Menu, Segment } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import animation from '../images/animation.gif';
import './style.scss';

const importAll = r => {
	return r.keys().map(r);
};

const images = importAll(require.context('../images/', false, /\.(png|jpe?g|svg)$/));

const HomepageHeading = () => (
	<div className="header-container">
		<Container text>
			<Image src={animation} />
		</Container>
	</div>
);

const exampleOptions = [
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
];

const getImageUrl = name => {
	return images.find(el => {
		return el.match(name);
	});
};

const HomepageLayout = () => {
	const history = useHistory();

	const handleNewModel = value => {
		history.push(`/new-models/${value}`);
	};
	const handleOldModel = value => {
		history.push(`/examples/${value}`);
	};
	return (
		<>
			<HomepageHeading />

			<Segment style={{ padding: '0em' }} vertical>
				<Grid celled="internally" columns="equal" stackable>
					<Grid.Row textAlign="center">
						<Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
							<Header as="h3" style={{ fontSize: '3em' }}>
								Simple models
							</Header>
							<div className="left-block-ex">
								{exampleOptions.map(obj => {
									return (
										<div className="example-block" key={obj.key}>
											<span>{obj.text}</span>
											<Image
												onClick={() => {
													handleOldModel(obj.value);
												}}
												src={getImageUrl(obj.value)}
												size="small"
												verticalAlign="middle"
											/>
											<Divider />
										</div>
									);
								})}
							</div>
						</Grid.Column>
						<Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
							<Header as="h3" style={{ fontSize: '3em' }}>
								Machine models
							</Header>
							<div className="right-block-ex">
								{newModels.map(obj => {
									return (
										<div className="example-block" key={obj.key}>
											<Image
												onClick={() => {
													handleNewModel(obj.value);
												}}
												src={getImageUrl(obj.value)}
												size="small"
												verticalAlign="middle"
											/>
											<span>{obj.text}</span>
											<Divider />
										</div>
									);
								})}
							</div>
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>

			<Segment inverted vertical style={{ padding: '5em 0em' }}>
				<Container>
					<Grid divided inverted stackable>
						<Grid.Row>
							<Grid.Column width={16}>
								<Header inverted as="h4" content="About" />
								<List link inverted>
									<List.Item as="a" href="mailto:andriytupac@gmail.com">
										Contact Me
									</List.Item>
									<List.Item
										as="a"
										target="_blank"
										href="https://github.com/andriytupac/matter-features"
									>
										Github
									</List.Item>
									<Menu.Item as="a" target="_blank" href="https://brm.io/matter-js/">
										Matte.js
									</Menu.Item>
								</List>
							</Grid.Column>
						</Grid.Row>
					</Grid>
				</Container>
			</Segment>
		</>
	);
};

export default HomepageLayout;