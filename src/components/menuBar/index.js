import React, { useState } from 'react'
import { Menu, Segment, Checkbox } from 'semantic-ui-react';
import {useStoreActions, useStoreState} from "easy-peasy";

function MenuBar() {

  const menuLeft = useStoreState(state => state.general.menuLeft);

  const turnMenuLeft = useStoreActions(
    actions => actions.general.turnMenuLeft
  );

  const [activeItem, setActiveItem] = useState(false);
  const handleItemClick = (e, { name }) => setActiveItem(name);

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
       name='editorials'
       active={activeItem === 'editorials'}
       onClick={handleItemClick}
     >
       Editorials
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
