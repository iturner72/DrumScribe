import React, { useState } from 'react';
import { TouchableOpacity, Alert, Text, View } from 'react-native';
import { styled, tw } from 'nativewind';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

const StyledTouchableOpacity = styled(TouchableOpacity);
const StyledView = styled(View);
const StyledText = styled(Text);

const UploadAudio: React.FC = () => {
  const [uploadedSong, setUploadedSong] = useState<string | null>(null);

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
      }

    } catch (err) {
      console.error('Error during file selection or upload:', err);
      Alert.alert('Error', 'An error occurred while picking the file.');
    }
  };

  const handleGenerateDrumChart = () => {
    console.log('Generating drum chart for', uploadedSong);
  };

  return (
    <StyledView className="flex-1 justify-center items-center p-4">
      <StyledTouchableOpacity title="Upload Audio" onPress={handleSelectFile} tw="bg-4 bg-blue-500 py-2 px-4 rounded">
        <StyledText tw="text-white font-bold">Upload Audio</StyledText>
      </StyledTouchableOpacity>
      {uploadedSong && (
        <>
          <StyledView className="mt-4 p-2 bg-slate-700 rounded-lg">
            <StyledText className="text-slate-300 text-lg font-semibold">
              {uploadedSong}
            </StyledText>
          </StyledView>
          <StyledTouchableOpacity onPress={handleGenerateDrumChart} tw="mt-4 bg-rose-400 text-rose-100 font-bold py-2 px-4 rounded">
            <StyledText tw="text-rose-100 font-bold">Generate Drum Chart</StyledText>
          </StyledTouchableOpacity> 
        </>
      )}
    </StyledView>
  );
};

export default UploadAudio;
