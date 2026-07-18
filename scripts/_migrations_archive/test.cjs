const { compile } = require('child_process');
const fs = require('fs');

const tsCode = `
import { CLASSES } from './src/core/entities/classes';
import { SKILLS_DATABASE, canClassUseSkill } from './src/core/entities/skills';

console.log(canClassUseSkill('operador_drones', SKILLS_DATABASE['mira_laser_calibrada']));
`;

fs.writeFileSync('test_run.ts', tsCode);
