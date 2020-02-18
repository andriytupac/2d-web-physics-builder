import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import './style.css';

import { Message } from 'semantic-ui-react';

const Toast = () => {
	const { toastInfo } = useStoreState(state => state.general);
	const { updateToast } = useStoreActions(actions => actions.general);
	const handleDismiss = () => {
		updateToast({ show: false, title: '', message: '' });
	};
	return (
		<div className="toast-container">
			{toastInfo.show && (
				<Message onDismiss={handleDismiss} header={toastInfo.title} content={toastInfo.message} positive />
			)}
		</div>
	);
};

export default Toast;
