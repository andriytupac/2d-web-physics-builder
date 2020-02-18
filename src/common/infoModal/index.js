import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Modal, Header, Button, Icon, Label, List } from 'semantic-ui-react';

import './style.scss';

const InfoModal = () => {
	const { infoModal } = useStoreState(state => state.general);
	const { updateInfoModal } = useStoreActions(actions => actions.general);

	const handleDismiss = () => {
		updateInfoModal({ show: false, title: '', elements: [] });
	};
	return (
		<Modal open={infoModal.show} onClose={handleDismiss} basic size="small">
			<Header icon="browser" content={infoModal.title} />
			<Modal.Content>
				{infoModal.elements.map((obj, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<List className="list-container" key={index} divided selection>
						<List.Item>
							<Label color="green" horizontal>
								{obj.name}
							</Label>
							- {obj.description}
						</List.Item>
					</List>
				))}
			</Modal.Content>
			<Modal.Actions>
				<Button color="green" onClick={handleDismiss} inverted>
					<Icon name="checkmark" /> Got it
				</Button>
			</Modal.Actions>
		</Modal>
	);
};

export default InfoModal;
