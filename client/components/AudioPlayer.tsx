import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';
import { styled } from 'nativewind';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const AudioPlayer = ({ url }) => {
  const playSound = () => {
    const sound = new Sound(url, null, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      sound.play();
    });
  };

  return (
    <StyledTouchableOpacity onPress={playSound} tw="mt-2 bg-blue-500 py-2 px-4 rounded">
      <StyledText tw="text-white font-bold">Play Track</StyledText>
    </StyledTouchableOpacity> 
  );
};

export default AudioPlayer;
