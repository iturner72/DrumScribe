import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';
import Header from './components/Header';
import UploadAudio from './components/UploadAudio';

const StyledView = styled(View)
const StyledText = styled(Text)

const App: React.FC = () => {
  return (
    <StyledView className="flex-1 items-center bg-slate-900">
      <Header title="DrumScribe" />
      <UploadAudio />
    </StyledView>
  );
};

export default withExpoSnack(App);
