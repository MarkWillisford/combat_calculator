import React from 'react';

function ToggleSwitch(props){
  const owned = props.owned ? props.owned.itemSlots[props.slot.toLowerCase()] : null;
  return ( 
    <div className="gearButtonDiv" id={props.slot}>
      <div>{!props.item ? props.slot : ""}</div>
      <div>{
        !props.item ? "None" : (props.item.isArray === true ? "None" : props.item.name)
      }</div>
      <div className="el-checkbox el-checkbox-lg">
        <label className="el-switch">
          <input type="checkbox" name="switch" onClick={props.cb} 
            disabled={owned ? false : true} 
            item={props.item} checked={props.item ? true : false}></input>
          <span className="el-switch-style"></span>
        </label>
      </div>
    </div>
   );
}

export default ToggleSwitch;