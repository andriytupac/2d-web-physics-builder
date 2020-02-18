import React from 'react';
import { Segment, Sidebar } from 'semantic-ui-react';

const Page404 = () => {
	return (
		<Sidebar.Pushable as={Segment}>
			<Sidebar.Pusher>
				<Segment basic>
					<h1>Page not Found 404</h1>
				</Segment>
			</Sidebar.Pusher>
		</Sidebar.Pushable>
	);
};

export default Page404;
