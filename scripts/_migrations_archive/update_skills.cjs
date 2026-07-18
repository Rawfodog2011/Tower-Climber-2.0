const fs = require('fs');

let skillsContent = fs.readFileSync('src/core/entities/skills.ts', 'utf-8');

const newSkills = `  fortaleza_biomecanica: {
    id: 'fortaleza_biomecanica',
    name: 'Fortaleza Biomecânica',
    description: 'Protocolo de Colosso ativado. Cura 30% do HP Máximo e mitiga dano passivamente.',
    mpCost: 40,
    cooldown: 4,
    multiplier: 0.3,
    type: 'heal',
    allowedClassId: 'todas' // Pode ser usado por qualquer classe que desbloquear a adaptação
  },
  golpe_fantasma: {
    id: 'golpe_fantasma',
    name: 'Golpe Fantasma',
    description: 'Assassino do Fio da Navalha. Um ataque letal indetectável que causa 350% de dano.',
    mpCost: 25,
    cooldown: 3,
    multiplier: 3.5,
    type: 'damage',
    allowedClassId: 'todas'
  },
  exaustao_termica: {
    id: 'exaustao_termica',
    name: 'Exaustão Térmica',
    description: 'Purga o calor acumulado num raio destruidor, causando 450% de dano. Aplica Superaquecimento.',
    mpCost: 80,
    cooldown: 5,
    multiplier: 4.5,
    type: 'damage',
    allowedClassId: 'todas',
    applyStatus: { type: 'overheat', duration: 3, chance: 1.0 }
  },`;

skillsContent = skillsContent.replace(
  "export const SKILLS_DATABASE: Record<string, Skill> = {",
  "export const SKILLS_DATABASE: Record<string, Skill> = {\n" + newSkills
);

// We need to modify canClassUseSkill to always allow skills with 'todas' or if the player has the fused adaptation skill
skillsContent = skillsContent.replace(
  "export function canClassUseSkill(playerClassId: string, skill: Skill): boolean {",
  "export function canClassUseSkill(playerClassId: string, skill: Skill): boolean {\n  if (skill.allowedClassId === 'todas') return true;"
);

fs.writeFileSync('src/core/entities/skills.ts', skillsContent);
console.log("Updated skills.ts");
