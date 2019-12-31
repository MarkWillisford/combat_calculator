import React from 'react';
import ProfileImage from './profileImage';
import ActionButtons from './actionButtons';
import LowerDisplayPane from './lowerDisplayPane';
import '../css/centerDisplayPane.css';
import CharacterSelection from './characterSelection';

function CenterDisplayPane() {
  return (
    <div className="centerDisplayPane">
      <ProfileImage />
      <CharacterSelection />
      <ActionButtons />
      <LowerDisplayPane />
    </div>
  );
}

export default CenterDisplayPane;