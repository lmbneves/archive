import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Item'>;

const ItemScreen: React.FC<Props> = ({ navigation, route }) => {
  const item = route.params.item;

  return (
    <SafeAreaView>
      <Text>{item.name}</Text>
    </SafeAreaView>
  );
}

export default ItemScreen;