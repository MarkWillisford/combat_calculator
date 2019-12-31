import React, { createContext, Component } from 'react';

export const CharacterContext = createContext();

class CharacterContextProvider extends Component {
  state = { 
    name: "Slick",
  }

  selectCharacter = (charName) => {
    this.setState({ name: charName });
  }

  render() { 
    return ( 
      <CharacterContext.Provider value={{...this.state, selectCharacter: this.selectCharacter}}>
        {this.props.children}
      </CharacterContext.Provider>
     );
  }
}
 
export default CharacterContextProvider;