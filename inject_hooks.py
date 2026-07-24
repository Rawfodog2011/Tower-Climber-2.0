import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

imports = """import { useInventory } from './hooks/useInventory';
import { useCrafting } from './hooks/useCrafting';
"""

# Insert imports
if 'useInventory' not in content:
    content = re.sub(r"import \{ HubScene \} from '\./pages/HubScene';", imports + "import { HubScene } from './pages/HubScene';", content)

# Insert hook calls inside App
hook_calls = """
  const {
    handleAutoEquip,
    handleEquip,
    handleUnequip,
    handleDismantle,
    handleSell,
    handleDismantleBatch,
    handleSellBatch
  } = useInventory(player, setPlayer, setInventoryMessage);

  const {
    handleCraft,
    handleConvertMaterials,
    handleUpgradeRelic,
    handleSocketModule,
    handleMergeChips,
    handleUnsocketModule
  } = useCrafting(player, setPlayer, setInventoryMessage, triggerToast);
"""

if 'handleAutoEquip' not in content:
    content = re.sub(r"  const logContainerRef = useRef<HTMLDivElement>\(null\);", "  const logContainerRef = useRef<HTMLDivElement>(null);\n" + hook_calls, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

