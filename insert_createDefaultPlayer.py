with open('src/App.tsx', 'r') as f:
    lines = f.readlines()

code = """
  const createDefaultPlayer = (): Player => ({
    level: 1,
    currentXp: 0,
    currentClassId: 'tecno_aprendiz',
    gold: 0,
    inventory: [
      ITEMS_DATABASE['weapon_common_classless_1'], 
      ITEMS_DATABASE['weapon_common_classless_2'],    
      ITEMS_DATABASE['accessory_common_classless_1'],
      ITEMS_DATABASE['accessory_common_classless_2'] 
    ].filter(Boolean),
    learnedSkills: [],
    equipment: {
      weapon: ITEMS_DATABASE['weapon_common_classless_3'],
      armor: ITEMS_DATABASE['armor_common_classless_1']
    },
    highestFloorUnlocked: 1,
    matrixPoints: 0,
    unlockedNodes: ['core_start'],
    materials: { common: 0, rare: 0, epic: 0 },
    soulShards: 0,
    relics: {},
    achievements: [],
    name: 'Operador',
    avatar: '🤖',
    originId: 'ciborgue_foragido',
    isAutoBattleActive: false,
    isFarmActive: false,
    autoBattleSettings: {
      usePotions: false,
      useSkills: true,
      stopOnBoss: true,
      stopOnLowHp: true,
      conditions: []
    },
    totalPlaytimeSeconds: 0,
    runStats: { goldSpent: 0, totalTurns: 0 }
  });
"""

for i in range(len(lines)):
    if '  const [player, setPlayer] = useState<Player>(() => {' in lines[i]:
        lines.insert(i, code)
        break

with open('src/App.tsx', 'w') as f:
    f.writelines(lines)
