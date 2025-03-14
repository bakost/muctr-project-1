from generate_test import import_sgraph, import_fgraph, save_graph
from Dijkstra import find_shortest_path

def is_float(element: any) -> bool:
	if element is None:
		return False
	try:
		float(element)
		return True
	except ValueError:
		return False

try:
	#filePath = input("Enter file path > ")
	filePath = "graph.init"
	graph = import_sgraph(filePath)
	print(graph)
except FileNotFoundError as err:
	print(f"File not found. Got {err.filename}.")

while True:
	__in = input("> ")
	words = __in.strip().split()
	if len(words) == 0:
		continue
	cmd, *args = words
	cmd = cmd.lower()
	del words
	if cmd == "exit":
		save_graph(graph, filePath)
		break
	if cmd == "keys":
		print(list(graph.keys()))
	if cmd == "add":
		if len(args) != 3:
			print(f"Expected 3 arguments. Got {len(args)}.")
			continue
		if not(is_float(args[2])):
			print(f"3rd argument is expected to be a number!")
			continue
		v = float(args[2])
		if args[0] not in graph:
			graph[args[0]] = {}
		if args[1] not in graph:
			graph[args[1]] = {}
		graph[args[0]][args[1]], graph[args[1]][args[0]] = v, v
	if cmd == "del":
		if len(args) != 2:
			print(f"Expected 2 arguments. Got {len(args)}.")
			continue
		del graph[args[0]][args[1]], graph[args[1]][args[0]]
	if cmd == "save":
		_outPath = filePath
		if len(args) >= 1:
			_outPath = args[0]
		save_graph(graph, _outPath)
		print("Saved!")
	if cmd == "what":
		if len(args) != 2:
			print(f"Expected 2 arguments. Got {len(args)}")
			continue
		if (args[0] not in graph) or (args[1] not in graph[args[0]]):
			print(f"Pair ({args[0]}, {args[1]}) has not been found in graph.")
			continue
		print(f"({args[0]}, {args[1]}) = {graph[args[0]][args[1]]}.")
	if cmd == "path":
		if len(args) != 2:
			print(f"Expected 2 arguments. Got {len(args)}")
			continue
		if args[0] not in graph:
			print(f"{args[0]} has not been found in graph.")
			continue
		if args[1] not in graph:
			print(f"{args[1]} has not been found in graph.")
			continue
		print(find_shortest_path(graph, args[0], args[1]))