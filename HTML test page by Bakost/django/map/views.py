from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.template import loader
from django.shortcuts import render
from .models import Weight
from map.dijkstra.Dijkstra import find_shortest_path, import_graph
import json

import logging

logger = logging.getLogger(__name__)

def map(request):
    return render(request, 'map/index.html')

def about(request):
    return render(request, 'map/about.html')

def some_view(request):
    weights = Weight.objects.all()
    return render(request, 'map/template.html', {'weights': weights})

def calculate_route(request):
    if request.method == 'POST':
        try:
            # Получаем параметры из POST запроса
            data = json.loads(request.body)
            start = str(data.get('start'))
            end = str(data.get('end'))
        except (TypeError, ValueError):
            return HttpResponseBadRequest("Invalid 'start' or 'end' value")

        # Загружаем граф (предполагая, что эта функция определена и работает корректно)
        graph = import_graph()
        #print(graph)

        try:
            # Находим кратчайший путь
            #print(graph)
            path = find_shortest_path(graph, start, end)
        except KeyError:
            return HttpResponseBadRequest("Invalid nodes in the graph")
        
        # Возвращаем путь в формате JSON
        return JsonResponse({'path': path})
    
    # Если метод запроса не POST, возвращаем ошибку
    return HttpResponseBadRequest("Invalid request method")
