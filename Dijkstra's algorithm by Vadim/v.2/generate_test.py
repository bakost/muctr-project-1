from random import randint
from Dijkstra import find_shortest_path
from timeit import default_timer as clock

def truncate_table(table : list, n_verticles: int) -> list:
	_out = [0] * (n_verticles - 1)
	for i in range(len(_out)):
		_out[i] = [0] * (len(_out) - i)
		for j in range(len(_out) - i):
			_out[i][j] = table[i][i + j + 1]
	return _out

def import_sgraph(file_name: str) -> dict:
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

def import_fgraph(file_name: str) -> dict:
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
			"""for col in range(row + 1, len(vertices)):
				col = row + 1 + i
				if tracks[index] != 0:
					# матрица смежности симметрична
					graph[vertices[row]][vertices[col]] = tracks[index]
					graph[vertices[col]][vertices[row]] = tracks[index]"""

	return graph

def save_graph(graph: dict, file_path: str):
	with open(file_path, "w") as file:
		# keys list
		file.write(" ".join(graph.keys()) + "\n")
		for i1, key1 in enumerate(graph.keys()):
			for i2, key2 in enumerate(graph.keys()):
				if i2 > i1:
					__out = (graph.get(key1) and graph.get(key1).get(key2)) or "-"
					file.write(f"{__out} ")
			file.write("\n")

def new_randgraph(n_verticles: int, file_name: str, fill_rate: int):
	matrix = [0] * n_verticles
	for row in range(n_verticles):
		matrix[row] = [0] * n_verticles

	with open(file_name, "w") as file:
		for row in range(n_verticles - 1):

			for col in range(n_verticles - row - 1):
				value = randint(0, 10) * (0 if randint(1, 100) <= (100 - fill_rate) else 1)
				file.write(f"{value} ")
				matrix[row][col + row + 1] = value
				matrix[col + row + 1][row] = value
			file.write("\n")
	with open("graph examples/test_full_matrix_incidence.init", "w") as file:
		file.writelines(map(lambda x: ' '.join(map(str, x)) + '\n', matrix))


if __name__ == "__main__":
	g = import_fgraph('graph_full.init')
	print(g)
	print(find_shortest_path(g, '419', '426'))