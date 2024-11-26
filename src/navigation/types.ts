import { Archive, Item } from "../models";

export type RootStackParamList = {
  Home: undefined;
  Archive: { archive: Archive };
  Item: { item: Item };
};