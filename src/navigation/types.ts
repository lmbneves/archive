import { Archive } from "../models";

export type RootStackParamList = {
  Home: undefined,
  Archive: { archive: Archive }; 
};