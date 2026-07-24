import re

with open('src/App.tsx', 'r') as f:
    c = f.read()

c = c.replace("import { usePlayerStore } from './store/usePlayerStore';", "import { usePlayerStore } from './store/usePlayerStore';\nimport { useGameUIStore } from './store/useGameUIStore';")

c = re.sub(r"const \[savedPlayerPreview, setSavedPlayerPreview\] = useState.*?\n", "", c)
c = re.sub(r"const \[scene, setScene\] = useState.*?\n", "", c)
c = re.sub(r"const \[isContinueRun, setIsContinueRun\] = useState.*?\n", "", c)
c = re.sub(r"const \[hubTab, setHubTab\] = useState.*?\n", "", c)
c = re.sub(r"const \[inventoryMessage, setInventoryMessage\] = useState.*?\n", "", c)
c = re.sub(r"const \[activeEvolutionNarrative, setActiveEvolutionNarrative\] = useState.*?\n", "", c)
c = re.sub(r"const \[activeMemoryKey, setActiveMemoryKey\] = useState.*?\n", "", c)
c = re.sub(r"const \[introSector, setIntroSector\] = useState.*?\n", "", c)
c = re.sub(r"const \[introStep, setIntroStep\] = useState.*?\n", "", c)
c = re.sub(r"const \[showMonsterInfo, setShowMonsterInfo\] = useState.*?\n", "", c)

store_call = """
  const {
    scene, setScene, hubTab, setHubTab, inventoryMessage, setInventoryMessage,
    activeEvolutionNarrative, setActiveEvolutionNarrative, activeMemoryKey, setActiveMemoryKey,
    introSector, setIntroSector, introStep, setIntroStep, showMonsterInfo, setShowMonsterInfo,
    savedPlayerPreview, setSavedPlayerPreview, isContinueRun, setIsContinueRun
  } = useGameUIStore();
"""

c = c.replace("const [justCompletedAll, setJustCompletedAll] = useState<boolean>(false);", store_call + "\n  const [justCompletedAll, setJustCompletedAll] = useState<boolean>(false);")

with open('src/App.tsx', 'w') as f:
    f.write(c)

