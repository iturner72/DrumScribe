import React from 'react';
import { withExpoSnack } from 'nativewind';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View)
const StyledText = styled(Text)

const App: React.FC = () => {
  return (
    <StyledView className="flex-1 items-center justify-center bg-slate-900">
      <StyledText className="text-2xl text-red-400">Hello World!</StyledText>
    </StyledView>
  );
};

export default withExpoSnack(App);
