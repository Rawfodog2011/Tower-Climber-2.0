with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

out = []
skip = False
for i in range(len(lines)):
    if 'const createDefaultPlayer = (): Player => ({' in lines[i]:
        skip = True
    if skip and '});' in lines[i] and 'runStats:' in lines[i-1]:
        skip = False
        continue
    if skip:
        continue
    out.append(lines[i])

lines = out
out = []
skip = False
for i in range(len(lines)):
    if 'const [player, setPlayer] = useState<Player>(() => {' in lines[i]:
        skip = True
    if skip and '});' in lines[i] and 'return createDefaultPlayer();' in lines[i-1]:
        skip = False
        continue
    if skip:
        continue
    
    if "import { loadGame } from './core/engine/saveGame';" in lines[i]:
        out.append(lines[i])
        out.append("import { usePlayerStore } from './store/usePlayerStore';\n")
        continue

    if "const pStatsMemo = useMemo(() => calculatePlayerStats(player), [player]);" in lines[i]:
        out.append("  const { player, setPlayer, loadPlayer } = usePlayerStore();\n")
        out.append("  useEffect(() => {\n    loadPlayer();\n  }, []);\n")
        out.append(lines[i])
        continue
    
    out.append(lines[i])

with open('src/App.tsx', 'w') as f:
    f.writelines(out)
