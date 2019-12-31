import React, { Component } from 'react';
import { CharacterContext } from '../contexts/CharacterContext';

class CharacterSelection extends Component {
  static contextType = CharacterContext;

  handleChange(e){
    const { selectCharacter } = this.context;
    selectCharacter(e.target.value);
  }
  
  render() { 
    return ( 
      <div className="charSelection">
        Character:
        <select onChange={this.handleChange.bind(this)}>
          <option value="Slick">Slick</option>
          <option value="Kah_Mei">Kah-Mei</option>
        </select>
      </div>
     );
  }
}
 
export default CharacterSelection;