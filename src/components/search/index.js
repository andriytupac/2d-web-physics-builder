import React from 'react';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { Button, Icon, Input, Popup } from 'semantic-ui-react';
import './style.scss';

const Search = props => {
	const { search, searchChange, keyboard } = props;
	const { activeOpacity } = useStoreState(state => state.general);
	const { updateInfoModal, changeActiveOpacity } = useStoreActions(actions => actions.general);
	/* const handleDismiss = () =>{
        updateToast({show:false, title:'', message:''})
    }; */
	const clearSearch = () => {
		searchChange('', { value: '' });
	};
	const openInfoModal = () => {
		updateInfoModal({
			show: true,
			title: 'Keyboard info',
			elements: [
				{ name: 'Left Control + Mouse Click', description: 'Find Element in left menu.' },
				{ name: 'Left Shift + Mouse Click', description: 'Get mouse position.' },
				{ name: 'Q', description: 'Turn on driving mode.' },
			],
		});
	};
	const changeOpacity = () => {
		changeActiveOpacity(!activeOpacity);
	};
	const showKeyboardInfo = () => {
		updateInfoModal({
			show: true,
			title: 'Keyboard info',
			elements: [...keyboard],
		});
	};
	return (
		<div>
			<Input
				className="search-input"
				icon="search"
				value={search}
				placeholder="Search..."
				size="mini"
				onChange={searchChange}
			/>
			<Popup
				trigger={
					<Button type="button" color="orange" icon size="mini" onClick={clearSearch}>
						<Icon name="eraser" />
					</Button>
				}
				content="Clear search"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button type="button" color="blue" icon size="mini" onClick={openInfoModal}>
						<Icon name="info circle" />
					</Button>
				}
				content="Keyboard info"
				position="top center"
				size="tiny"
				inverted
			/>
			<Popup
				trigger={
					<Button
						// className="opacity-button"
						type="button"
						color="teal"
						icon
						size="mini"
						onClick={changeOpacity}
					>
						<Icon name={!activeOpacity ? 'eye' : 'eye slash'} />
					</Button>
				}
				content="Transparent menu"
				position="top center"
				size="tiny"
				inverted
			/>
			{keyboard && (
				<Popup
					trigger={
						<Button
							// className="opacity-button"
							type="button"
							color="teal"
							icon
							size="mini"
							onClick={showKeyboardInfo}
						>
							<Icon name="keyboard" />
						</Button>
					}
					content="Keyboard control"
					position="top right"
					size="tiny"
					inverted
				/>
			)}
		</div>
	);
};

export default Search;
