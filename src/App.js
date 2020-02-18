import React from 'react';
import './App.scss';
import MenuBar from './components/menuBar';
import RootRoute from './components/routes/RootRouter';

function App() {
	return (
		<div className="App">
			<MenuBar />
			<RootRoute />
		</div>
	);
}

export default App;
