from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from demucs import pretrained
from demucs.apply import apply_model
from demucs import separate
import demucs.api
from .models import AudioFile
from .forms import AudioFileForm
from django.conf import settings
import os
import torchaudio
import torch
import json
import subprocess
from pathlib import Path


@csrf_exempt
def upload_audio(request):
    print(request.FILES)
    print(request.POST)
    if request.method == 'POST':
        form = AudioFileForm(request.POST, request.FILES)
        if form.is_valid():
            audio_file = form.save()

            original_path = audio_file.audio.path
            if original_path.endswith('.mp3'):
                wav_path = original_path.replace('.mp3', '.wav')
                subprocess.run(['ffmpeg', '-i', original_path, wav_path])
                audio_file.audio = wav_path
                audio_file.save()

            return JsonResponse({'message': 'File uploaded successfully!', 'id': audio_file.id})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def separate_drums(request):
    if request.method == 'POST':
        try:
            print("Request Body:", request.body)

            data = json.loads(request.body.decode('utf-8'))
            audio_file_id = data.get('audio_file_id')

            print("Audio file ID:", audio_file_id)

            audio_file_obj = AudioFile.objects.get(id=audio_file_id)
            file_path = audio_file_obj.audio.path
            print("attempting to load file from:", file_path)

            separator = demucs.api.Separator(model="mdx")

            _, sample_rate = torchaudio.load(file_path)
            print("File loaded successfully")

            _, separated = separator.separate_audio_file(file_path)

            output_dir = os.path.join(settings.BASE_DIR, 'media', 'separated_tracks')
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)

            save_separated_tracks(separated, output_dir, sample_rate)

            return JsonResponse({'message': 'Drum track separated successfully!'})
        except AudioFile.DoesNotExist:
            return JsonResponse({'error': 'Audio file not found'}, status=404)
        except Exception as e:
            print(f"Error during drum separation: {str(e)}")
            return JsonResponse({'error': str(e)}, status=500)
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)


def convert_mp3_to_tensor(file_path):
    waveform, sample_rate = torchaudio.load(file_path)

    target_sample_rate = 44100
    if sample_rate != target_sample_rate:
        resampler = torchaudio.transforms.Resample(orig_freq=sample_rate, new_freq=target_sample_rate)
        waveform = resampler(waveform)

    return waveform, sample_rate


def save_separated_tracks(separated_tracks, output_dir, sample_rate):
    for track_name, track_data in separated_tracks.items():
        output_path = Path(output_dir) / f"{track_name}.wav"
        torchaudio.save(output_path, track_data, sample_rate)
