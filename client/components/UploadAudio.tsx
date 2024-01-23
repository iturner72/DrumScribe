import React, { useState, useEffect } from 'react';
import { TouchableOpacity, Alert, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import { styled, tw } from 'nativewind';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import AudioPlayer from './AudioPlayer'; 
import TrackItem from './TrackItem';
import axios from 'axios';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const UploadAudio: React.FC = () => {
  const [uploadedSong, setUploadedSong] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedSongId, setUploadedSongId] = useState<number | null>(null);
  const [separatedTracks, setSeparatedTracks] = useState([]);
  const [showTracksView, setShowTracksView] = useState(false);

  const getTrackTitlebyIndex = (index) => {
    switch(index) {
      case 0: return 'Drums';
      case 1: return 'Bass';
      case 2: return 'Guitar';
      case 3: return 'Vocals';
      default: return 'Unknown';
    }
  };

  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      const pickedFile = res[0];
      console.log('Picked file:', pickedFile);

      let fileURI = decodeURIComponent(pickedFile.uri);
      if (fileURI.startsWith('file://')) {
        fileURI = fileURI.substring(7);
      }
      console.log('Corrected File URI:', fileURI);

      const fileBlob = {
        uri: fileURI,
        type: pickedFile.type,
        name: pickedFile.name,
      }; 
      console.log('File blob:', fileBlob);

      const formData = new FormData();
      formData.append('title', pickedFile.name);
      formData.append('audio', fileBlob);
      console.log('FormData:', formData);

      // Send the request
      const response = await axios.post('http://localhost:8000/audio/upload/', formData);
      console.log('Upload response:', response.data);

      if (response.data && response.data.message === 'File uploaded successfully!') {
        setUploadedSong(pickedFile.name);
        setUploadedSongId(response.data.id);
        console.log('ID set:', response.data.id)
      }

    } catch (err) {
      console.error('Error during file selection or upload:', err);
      Alert.alert('Error', 'An error occurred while picking the file.');
    }
  };

  const handleGenerateDrumChart = async () => {
    setIsProcessing(true);

    try {
      if (uploadedSongId !== null) {
        const response = await axios.post('http://localhost:8000/audio/separate_drums/', { 
            audio_file_id: uploadedSongId 
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Separation response:', response.data);
            if (response.data.urls) {
                setSeparatedTracks(response.data.urls);
            }
      } else {
        console.error('No audio file ID available for drum separation');
      }
    } catch (error) {
      console.error('Error during drum separation:', error);
    }

    console.log('Generating drum chart for', uploadedSong);
  };

  useEffect(() => {
    console.log('processing status:', isProcessing);
    if (isProcessing) {
      sleep(12000).then(() => setIsProcessing(false));
    }
  }, [isProcessing]);

  return (
    <StyledView className="flex-1 justify-center items-center p-4 bg-slate-800 h-full w-full">
      {isProcessing && (
        <>
        {console.log('Rendering Lottie Animation')}
        <LottieView
          style={{width: 200, height: 200}}
          source={require('./../utils/notes_animation.json')}
          autoPlay
          loop
        />
        </>
      )}
      <StyledTouchableOpacity title="Upload Audio" onPress={handleSelectFile} tw="bg-4 bg-teal-700 py-2 px-4 rounded w-medium">
        <StyledText tw="text-white font-bold">Upload Audio 🔊</StyledText>
      </StyledTouchableOpacity>
      {uploadedSong && (
        <>
          <StyledView className="mt-4 p-2 bg-slate-700 rounded-lg w-medium">
            <StyledText className="text-slate-300 font-semibold">
              {uploadedSong}
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity onPress={handleGenerateDrumChart} tw="mt-4 bg-rose-400 text-rose-100 font-bold py-2 px-4 rounded w-medium">
            <StyledText tw="text-rose-100 text-lg font-bold">Generate Drum Chart 🥁</StyledText>
          </StyledTouchableOpacity> 
        </>
      )}
      <StyledView tw="p-4 flex-row flex-wrap justify-center">
        {separatedTracks.map((trackUrl, index) => (
          <TrackItem
            key={index}
            url={trackUrl}
            title={getTrackTitlebyIndex(index)}
          />
        ))}
      </StyledView>
    </StyledView>
  );
};

export default UploadAudio;
