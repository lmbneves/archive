import React from 'react';
import { SafeAreaView, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList  } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Archive'>;

const ArchiveScreen: React.FC<Props> = ({ route }) => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View>
          <Text>{ route.params.archive.name }</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default ArchiveScreen;
