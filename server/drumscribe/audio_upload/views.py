from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import AudioFile
from .forms import AudioFileForm
import torch


@csrf_exempt
def upload_audio(request):
    print(request.FILES)
    print(request.POST)
    if request.method == 'POST':
        form = AudioFileForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'message': 'File uploaded successfully!'})
        else:
            return JsonResponse({'errors': form.errors}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)

@csrf_exempt
def separate_drums(request):
    if request.method == 'POST':

        audio_file = request.FILES.get('audio')

        demucs = torch.hub.load('facebookresearch/demucs', 'demucs')

        separated_tracks = demucs.separate(audio_file)

        return JsonResponse({'message': 'Drum track separated successfully!'})
    return JsonResponse({'error': 'Invalid request'}, status=400)
