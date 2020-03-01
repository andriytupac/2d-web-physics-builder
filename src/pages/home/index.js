import React from 'react';
import { Container, Divider, Grid, Header, Image, List, Menu, Segment } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import animation from '../images/animation.mp4';
import animationPlaceholder from '../images/placeholder.png';
import './style.scss';

const importAll = r => {
	return r.keys().map(r);
};

const images = importAll(require.context('../images/', false, /\.(png|jpe?g|svg)$/));

const HomepageHeading = () => (
	<div className="header-container">
		<Container text>
			{/* eslint-disable-next-line jsx-a11y/media-has-caption */}
			<video autoPlay loop muted poster={animationPlaceholder}>
				<source src={animation} type="video/mp4" />
			</video>
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
	{ key: 'tractor', text: 'Tractor', value: 'tractor' },
	{ key: 'dumpTruck', text: 'Dump Truck', value: 'dumpTruck' },
	{ key: 'mobileCrane', text: 'Mobile Crane', value: 'mobileCrane' },
	{ key: 'mobileCrane', text: 'Mobile Crane', value: 'mobileCrane' },
	{ key: 'forklift', text: 'Forklift', value: 'forklift' },
	{ key: 'excavatorTractor', text: 'Excavator Tractor', value: 'excavatorTractor' },
];

const getImageUrl = name => {
	return images.find(el => {
		return el.match(name);
	});
};

const HomepageLayout = () => {
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
											<Link to={`/examples/${obj.value}`}>
												<Image
													src={getImageUrl(obj.value)}
													size="small"
													verticalAlign="middle"
													alt={obj.text}
												/>
											</Link>
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
											<Link to={`/new-models/${obj.value}`}>
												<Image
													src={getImageUrl(obj.value)}
													size="small"
													verticalAlign="middle"
													alt={obj.text}
												/>
											</Link>
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
