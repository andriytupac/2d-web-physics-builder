import React, { useState } from 'react'
import { Menu, Checkbox, Dropdown } from 'semantic-ui-react';
import { useStoreActions, useStoreState } from "easy-peasy";
import { useHistory, useRouteMatch } from "react-router-dom";

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

function MenuBar() {

  const menuLeft = useStoreState(state => state.general.menuLeft);

  const history = useHistory();

  const mashValue = useRouteMatch('/examples/:id');
  const selectExample = mashValue && mashValue.isExact ? mashValue.params.id : '';

  const turnMenuLeft = useStoreActions(
    actions => actions.general.turnMenuLeft
  );

  const [activeItem, setActiveItem] = useState(false);
  const handleItemClick = (e, { name }) => {
    setActiveItem(name);
    history.push(name)
  };

  const handlerChooseExample = (event, data) => {
    history.push(`/examples/${data.value}`);
  };

  return (
   <Menu>
     <Menu.Item>
         <Checkbox
           onChange = {event => {turnMenuLeft(!menuLeft)}}
           toggle
           checked={menuLeft}
         />
     </Menu.Item>
     <Menu.Item
       name=''
       active={activeItem === ''}
       onClick={handleItemClick}
     >
       <Dropdown
         button
         className='icon'
         floating
         labeled
         icon='random'
         options={exampleOptions}
         search
         defaultValue={selectExample}
         text='Select example'
         onChange={handlerChooseExample}
       />
     </Menu.Item>

     <Menu.Item
       name='reviews'
       active={activeItem === 'reviews'}
       onClick={handleItemClick}
     >
       Reviews
     </Menu.Item>

     <Menu.Item
       name='upcomingEvents'
       active={activeItem === 'upcomingEvents'}
       onClick={handleItemClick}
     >
       Upcoming Events
     </Menu.Item>
   </Menu>
  )

}
export default MenuBar;
