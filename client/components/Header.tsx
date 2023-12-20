import React from 'react';
import { View, Text } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);

interface HeaderProps {
  title:string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <StyledView className="w-full pt-6 pb-4 bg-gray-900 items-center justify-center">
      <StyledText className="text-red-500 text-2xl">{title}</StyledText>
    </StyledView>
  );
};

export default Header;
