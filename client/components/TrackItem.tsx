import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import Sound from 'react-native-sound';
import { styled } from 'nativewind';
import drumsArtwork from '../assets/drums.png';
import vocalsArtwork from '../assets/vocals.png';
import bassArtwork from '../assets/bass.png';
import guitarArtwork from '../assets/guitar.png';

const StyledView = styled(View);
const StyledImage = styled(Image);
const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledText = styled(Text);

const getArtworkForTrack = (title) => {
  switch (title) {
    case 'Drums':
      return drumsArtwork;
    case 'Vocals':
      return vocalsArtwork;
    case 'Bass':
      return bassArtwork;
    case 'Guitar':
      return guitarArtwork;
  }
};

const TrackItem = ({ url, title }) => {
  const artwork = getArtworkForTrack(title);
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
    <StyledView tw="m-2">
      <StyledTouchableOpacity onPress={playSound} tw="items-center">
        <StyledImage source={artwork} style={{ width: 100, height: 100 }} />
        <StyledText tw="text-white mt-2">{title}</StyledText>
      </StyledTouchableOpacity>
    </StyledView>
  );
};

export default TrackItem;
