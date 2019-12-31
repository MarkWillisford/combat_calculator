import React from 'react';
import '../css/actionButtons.css';
import { CharacterContext } from '../contexts/CharacterContext';

function ActionButtons() {
  return (
    <CharacterContext.Consumer>{(context) => {
      const { name } = context;
      return(
        <div className="actionButtons">
          <div class="actionButtonWrapper" >
            <button class="actionButton" id="attk_Button">Attack</button>
          </div>
          <div class="actionButtonWrapper" >
            <button class="actionButton" id="fullattk_Button">Full Attack</button></div>
          <div class="actionButtonWrapper" >
            <button class="actionButton" id="charge_Button">Charge</button></div>
        </div>
      )
    }}</CharacterContext.Consumer>
  );
}

export default ActionButtons;