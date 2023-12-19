import React from 'react';
import { Button, Alert } from 'react-native';
import { styled } from 'nativewind';
import DocumentPicker from 'react-native-document-picker';

const StyledButton = styled(Button);

const UploadAudio: React.FC = () => {
  const handleSelectFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio],
      });

      // Process the selected file
      console.log(
        res.uri,
        res.type,
        res.name,
        res.size
      );
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        Alert.alert('Error', 'An error occured while picking the file.');
      }
    }
  };

  return (
    <StyledButton title="Upload Audio" onPress={handleSelectFile} />
  );
};

export default UploadAudio;
