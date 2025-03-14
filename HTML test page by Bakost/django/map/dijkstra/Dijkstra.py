import heapq
import os

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Путь к корневой директории проекта
f = os.path.join(base_dir, 'dijkstra', 'graph.init')

def dijkstra(graph: dict, start):
    distances = { v: float("inf") for v in graph }
    distances[start] = 0

    # приоритетная очередь вершин
    queue = [ (0, start) ]
    while queue:
        # текущая вершина и ее расстояние
        current_distance, current_vertex = heapq.heappop(queue)

        # если повторно смотрим на вершину с уже меньшим расстоянием
        if current_distance > distances[current_vertex]:
            continue

        # проход по всем соседям
        for neighbor, weight in graph[current_vertex].items():
            distance = current_distance + weight

            # pushing next verticle in queue
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))
    return distances


def find_shortest_path(graph: dict, start, end) -> (float, list):
    """
    It finds optimal path to reach from start point to end point.
    """
    distances = dijkstra(graph, start)
    if distances[end] == float("inf"):
        return None
    current_vertex = end
    path = [end]
    while current_vertex != start:
        for neigbor, weight in graph[current_vertex].items():
            if distances[current_vertex] == distances[neigbor] + weight:
                current_vertex = neigbor
                path.append(current_vertex)
                break
    path.reverse()
    return distances[end], path


def import_graph() -> dict:
	with open(f, "r") as file:
		vertices = file.readline().strip().split()
		graph = dict.fromkeys(vertices)
		for v in vertices:
			graph[v] = {}
		row = 0
		for text_line in file:
			tracks = list(map(lambda c: 0 if c == '-' else float(c), text_line.strip().split()))

			# скип пустых строк
			if not tracks:
				continue

			# такие пределы, т.к. путь в неориентированом графе обладает свойством симметричности,
			# поэтому таблица симметрична, и тем более из вершины А можно попасть в вершину А
			# поэтому удаляем нижнетреугольную часть матрицы смежности
			for col in range(row + 1, len(vertices)):
				index = col - row - 1
				if tracks[index] != 0:
					# матрица смежности симметрична
					graph[vertices[row]][vertices[col]] = tracks[index]
					graph[vertices[col]][vertices[row]] = tracks[index]
			row += 1
			"""for col in range(row + 1, len(vertices)):
				col = row + 1 + i
				if tracks[index] != 0:
					# матрица смежности симметрична
					graph[vertices[row]][vertices[col]] = tracks[index]
					graph[vertices[col]][vertices[row]] = tracks[index]"""

	return graph

import_graph()