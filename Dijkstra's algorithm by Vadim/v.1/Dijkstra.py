import heapq

def dijkstra(graph, start):
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

            # запихиваем в очередь след. вершину и обновляем расстояние
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(queue, (distance, neighbor))
    return distances

def find_shortest_path(graph, start, end):
    distances = dijkstra(graph, start)

    current_vertex = end
    path = [end]
    while current_vertex != start:
        for neigbor, weight in graph[current_vertex].items():
            if distances[current_vertex] == distances[neigbor] + weight:
                current_vertex = neigbor
                path.append(current_vertex)
                break
    path.reverse()
    return (distances[end], path)


N = 13
graph = {}
for n in range(N):
    graph[n] = {}

f = open("graph.init", "r")

with f as file:
#with open("/Users/bakost/Documents/GitHub/muctr-project-1/algothitm/graph.init", "r") as file:
    for n in range(N - 1):
        text_line = file.readline().strip("\n")
        tracks = list(map(int, text_line.split(" ")))

        # такие пределы, т.к. путь в неориентированом графе обладает свойством симметричности,
        # поэтому таблица симметрична, и тем более из вершины А можно попасть в вершину А
        # поэтому удаляем нижнетреугольную часть матрицы  смежности
        for k in range(N - n - 1):
            if tracks[k] != 0:

                # матрица смежности симметрична
                graph[n][k + n + 1] = tracks[k]
                graph[k + n + 1][n] = tracks[k]
# for debug:
print(*graph.items(), sep='\n')

print("Result: ", find_shortest_path(graph, 7, 4))
