import { TbGeometry } from 'react-icons/tb';
import { PiCow, PiGenderIntersex } from 'react-icons/pi';
import { RiHealthBookFill } from 'react-icons/ri';

const menuItem = [
    {
        path:"/",
        name:"Geofencing",
        icon:<TbGeometry />    
    },
    {
        path:"/animal",
        name:"Animal",
        icon:<PiCow />   
    },
    {
        path:"/healthrecord",
        name:"HealthRecord",
        icon:<RiHealthBookFill />  
    },
    {
        path:"/reproduction",
        name:"Reproduction",
        icon:<PiGenderIntersex />
    }
];

export default menuItem;