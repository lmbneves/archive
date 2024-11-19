import React, { useState } from 'react';
import { AppState, AppContext } from './app-context';

interface Props {
  children: React.ReactNode
}

export const AppContextProvider: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
  /**
   * Set the default state
   */
  const [state, setState] = useState({})

  /**
   * Declare the update state method that will handle state values
   */
  const updateState = (newState: Partial<AppState>) => {
    setState({ ...state, ...newState })
  }

  /**
   * Context wrapper that will provide the state values to all its children nodes
   */
  return (
    <AppContext.Provider value={{ ...state, updateState }}>{props.children}</AppContext.Provider>
  )
}