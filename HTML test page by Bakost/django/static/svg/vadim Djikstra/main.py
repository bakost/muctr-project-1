from Dijkstra import find_shortest_path

def import_graph(file_name: str) -> dict:
	with open(file_name, "r") as file:
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
				if tracks[col] != 0:
					# матрица смежности симметрична
					graph[vertices[row]][vertices[col]] = tracks[col]
					graph[vertices[col]][vertices[row]] = tracks[col]
			row += 1
	return graph

g = import_graph('graph.init')
print(g)
print(find_shortest_path(g, 'K', '429'))