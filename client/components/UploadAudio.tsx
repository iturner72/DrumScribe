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

      const simpleBlob = new Blob(['Simple text file'], { type: 'text/plain' });

      const pickedFile = res[0];
      console.log('Picked file:', pickedFile);

      // Log the full file URI
      console.log('File URI:', pickedFile.uri);

      const decodedURI = decodeURIComponent(pickedFile.uri);
      console.log('Decoded URI:', decodedURI);
      const fileData = await RNFetchBlob.fs.readFile(decodedURI.replace('file://', ''), 'base64');
      console.log('Creating blob from file data');
      const blob = await RNFetchBlob.polyfill.Blob.build(fileData, { type: `${pickedFile.type};BASE64` });
      console.log('Blob created successfully');
      console.log('Blob:', blob);

      const formData = new FormData();
      formData.append('title', pickedFile.name);
      formData.append('audio', blob, pickedFile.name);
      console.log('FormData:', formData)

      console.log('FormData prepared, attempting to upload');

      // Send the request
      const response = await axios.post('http://localhost:8000/audio/upload/', formData);

      console.log(response.data);

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
