import { random } from './rng';
import { Player, Contract, ContractType, Manufacturer } from '../../types';

const CONTRACT_TEMPLATES = [
  { type: 'hunt' as ContractType, title: 'Limpeza de Setor', desc: 'Elimine Aberrações Genéticas para a OmniCorp.', targetId: 'aberracao_genetica', issuer: 'OmniCorp' as Manufacturer, goalBase: 3, goldMulti: 150 },
  { type: 'hunt' as ContractType, title: 'Recolhimento de Drones', desc: 'Desative Drones Defeituosos para a Kinetix.', targetId: 'drone_defeituoso', issuer: 'Kinetix' as Manufacturer, goalBase: 5, goldMulti: 120 },
  { type: 'reach_floor' as ContractType, title: 'Mapeamento Profundo', desc: 'Sobreviva até o andar especificado e retorne dados topográficos.', issuer: 'Sistema', goalBase: 10, goldMulti: 200 },
  { type: 'collect_materials' as ContractType, title: 'Extração de Matéria-Prima', desc: 'A AeroDynamics precisa de fragmentos comuns para novos chassis.', issuer: 'AeroDynamics' as Manufacturer, goalBase: 10, goldMulti: 50 },
  { type: 'catalog' as ContractType, title: 'Pesquisa Ambiental', desc: 'Registre aberrações distintas da Refinaria Tóxica no Arquivo de Ameaças.', sectorId: 'toxic_refinery', issuer: 'Sistema', goalBase: 3, goldMulti: 100 },
  { type: 'catalog' as ContractType, title: 'Levantamento Glacial', desc: 'Registre anomalias distintas do Data-Core Congelado no Arquivo.', sectorId: 'frozen_datacore', issuer: 'Sistema', goalBase: 3, goldMulti: 100 },
  { type: 'catalog' as ContractType, title: 'Amostragem Térmica', desc: 'Registre entidades da Fornalha de Plasma no Arquivo de Ameaças.', sectorId: 'plasma_furnace', issuer: 'Sistema', goalBase: 3, goldMulti: 100 },
];

export function generateRandomContracts(playerLevel: number): Contract[] {
  const contracts: Contract[] = [];
  const numContracts = 3;
  
  for (let i = 0; i < numContracts; i++) {
    const template = CONTRACT_TEMPLATES[Math.floor(random() * CONTRACT_TEMPLATES.length)];
    
    let goal = template.goalBase;
    let rewardGold = template.goalBase * template.goldMulti;
    let rewardMaterials = {};
    
    if (template.type === 'reach_floor') {
      goal = Math.max(10, Math.floor((playerLevel + 5) / 5) * 5); // Multiplo de 5 acima do lvl atual
      rewardGold = goal * 30;
      rewardMaterials = { rare: 1 };
    } else if (template.type === 'hunt') {
      goal = Math.floor(random() * 3) + 2; // 2 a 4
      rewardGold = goal * 150;
      rewardMaterials = { common: 2 };
    } else if (template.type === 'collect_materials') {
      goal = Math.floor(random() * 10) + 5; // 5 a 14
      rewardGold = goal * 50;
      rewardMaterials = { rare: 1 };
    } else if (template.type === 'catalog') {
      goal = Math.floor(random() * 3) + 3; // 3 a 5
      rewardGold = goal * 150;
      rewardMaterials = { epic: 1 };
    }

    contracts.push({
      id: `contract_${Date.now()}_${i}`,
      type: template.type,
      title: template.title,
      description: template.desc,
      targetId: template.targetId,
      sectorId: 'sectorId' in template ? template.sectorId : undefined,
      goal,
      progress: 0,
      completed: false,
      issuer: template.issuer as Manufacturer | 'Sistema',
      reward: {
        gold: rewardGold,
        materials: rewardMaterials
      }
    });
  }
  
  return contracts;
}

export function updateHuntContracts(player: Player, monsterId: string): Player {
  let updated = false;
  const newContracts = player.contracts.map(c => {
    // monsterId usually comes like "parasita_acido_f12". The targetId is "parasita_acido"
    if (!c.completed && c.type === 'hunt' && c.targetId && monsterId.includes(c.targetId)) {
      updated = true;
      const progress = Math.min(c.goal, c.progress + 1);
      return { ...c, progress, completed: progress >= c.goal };
    }
    return c;
  });
  
  if (updated) {
    return { ...player, contracts: newContracts };
  }
  return player;
}

function updateFloorContracts(player: Player, currentFloor: number): Player {
  let updated = false;
  const newContracts = player.contracts.map(c => {
    if (!c.completed && c.type === 'reach_floor') {
      if (currentFloor >= c.goal) {
        updated = true;
        return { ...c, progress: c.goal, completed: true };
      } else if (currentFloor > c.progress) {
        updated = true;
        return { ...c, progress: currentFloor };
      }
    }
    return c;
  });
  
  if (updated) {
    return { ...player, contracts: newContracts };
  }
  return player;
}

function updateCollectContracts(player: Player): Player {
   // Material count update
   let updated = false;
   const newContracts = player.contracts.map(c => {
     if (!c.completed && c.type === 'collect_materials') {
        // Just checking common materials for now based on template
        if (player.materials.common >= c.goal) {
          updated = true;
          return { ...c, progress: c.goal, completed: true };
        } else if (player.materials.common !== c.progress) {
          updated = true;
          return { ...c, progress: player.materials.common };
        }
     }
     return c;
   });
   
   if (updated) return { ...player, contracts: newContracts };
   return player;
}

export function claimContractReward(player: Player, contractId: string): { success: boolean, message: string, updatedPlayer: Player } {
  const contract = player.contracts.find(c => c.id === contractId);
  if (!contract) return { success: false, message: 'Contrato não encontrado.', updatedPlayer: player };
  if (!contract.completed) return { success: false, message: 'Contrato incompleto.', updatedPlayer: player };
  
  const updatedPlayer = {
    ...player,
    gold: player.gold + (contract.reward.gold || 0),
    materials: {
      common: player.materials.common + (contract.reward.materials?.common || 0),
      rare: player.materials.rare + (contract.reward.materials?.rare || 0),
      epic: player.materials.epic + (contract.reward.materials?.epic || 0),
    },
    contracts: player.contracts.filter(c => c.id !== contractId) // Remove after claiming
  };
  
  return {
    success: true,
    message: `Recompensa resgatada: ${contract.reward.gold || 0}G.`,
    updatedPlayer
  };
}

export function claimAllCompletedContracts(player: Player): { success: boolean, message: string, updatedPlayer: Player } {
  const completedContracts = player.contracts.filter(c => c.completed);
  if (completedContracts.length === 0) {
    return { success: false, message: 'Nenhum contrato concluído para reivindicar.', updatedPlayer: player };
  }

  let totalGold = 0;
  let totalCommon = 0;
  let totalRare = 0;
  let totalEpic = 0;

  completedContracts.forEach(contract => {
    totalGold += contract.reward.gold || 0;
    totalCommon += contract.reward.materials?.common || 0;
    totalRare += contract.reward.materials?.rare || 0;
    totalEpic += contract.reward.materials?.epic || 0;
  });

  const completedIds = completedContracts.map(c => c.id);

  const updatedPlayer = {
    ...player,
    gold: player.gold + totalGold,
    materials: {
      common: player.materials.common + totalCommon,
      rare: player.materials.rare + totalRare,
      epic: player.materials.epic + totalEpic,
    },
    contracts: player.contracts.filter(c => !completedIds.includes(c.id))
  };

  const parts: string[] = [];
  if (totalGold > 0) parts.push(`+${totalGold} CRD`);
  if (totalCommon > 0) parts.push(`+${totalCommon} Fragmentos Comuns`);
  if (totalRare > 0) parts.push(`+${totalRare} Essências Raras`);
  if (totalEpic > 0) parts.push(`+${totalEpic} Núcleos Épicos`);

  const rewardMsg = parts.length > 0 ? parts.join(', ') : 'Nenhuma recompensa';

  return {
    success: true,
    message: `Todos os contratos concluídos foram reivindicados! Recompensas recebidas: ${rewardMsg}`,
    updatedPlayer
  };
}

export function updateCatalogContracts(player: Player, sectorId: string): Player {
  let updated = false;
  const newContracts = player.contracts.map(c => {
    if (!c.completed && c.type === 'catalog' && c.sectorId === sectorId) {
      updated = true;
      const progress = Math.min(c.goal, c.progress + 1);
      return { ...c, progress, completed: progress >= c.goal };
    }
    return c;
  });
  if (updated) return { ...player, contracts: newContracts };
  return player;
}