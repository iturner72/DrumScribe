from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import AudioFile
from .forms import AudioFileForm


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
