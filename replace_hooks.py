import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace socket module
content = re.sub(r'  const handleSocketModule = \([^}]*?triggerToast\(`Módulo instalado com sucesso!`\);\n    return updatedItem;\n  };', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleMergeChips = \([^}]*?triggerToast\(`Fusão concluída! \$\{baseItem\.name\} evoluiu para Nv\. \$\{\(baseItem\.level \|\| 1\) \+ 1\}\.`\);\n  };', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleUnsocketModule = \([^}]*?triggerToast\(`Módulo removido com sucesso!`\);\n    return updatedItem;\n  };', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleAutoEquip = \(\) => \{[^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleEquip = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleUnequip = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleDismantle = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleSell = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleDismantleBatch = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleSellBatch = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleCraft = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleConvertMaterials = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3500\);\n  \};', '', content, flags=re.DOTALL)
content = re.sub(r'  const handleUpgradeRelic = \([^}]*?setTimeout\(\(\) => setInventoryMessage\(null\), 3000\);\n  \};', '', content, flags=re.DOTALL)

imports = """import { useInventory } from './hooks/useInventory';
import { useCrafting } from './hooks/useCrafting';
"""

# Insert imports
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

content = re.sub(r"  const logContainerRef = useRef<HTMLDivElement>\(null\);", "  const logContainerRef = useRef<HTMLDivElement>(null);\n" + hook_calls, content)

with open('src/App.tsx', 'w') as f:
    f.write(content)

