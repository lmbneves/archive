import React from 'react';
import { Archive } from '../models';

export interface AppState {
  archives?: Archive[];
  updateState: (newState: Partial<AppState>) => void;
}

const defaultState: AppState = {
  archives: [],
  updateState: (newState?: Partial<AppState>) => {},
}

export const AppContext = React.createContext<AppState>(defaultState)