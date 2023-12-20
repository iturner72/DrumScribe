import React from 'react';
import { Button, Alert } from 'react-native';
import { styled } from 'nativewind';
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import axios from 'axios';

const StyledButton = styled(Button);

const UploadAudio: React.FC = () => {
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

    } catch (err) {
      console.error('Error during file selection or upload:', err);
      Alert.alert('Error', 'An error occurred while picking the file.');
    }
  };

  return (
    <StyledButton title="Upload Audio" onPress={handleSelectFile} />
  );
};

export default UploadAudio;
