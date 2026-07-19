import { I18nKeys } from './keys';

export const enTranslations: Record<I18nKeys, string> = {
  // Main Menu & UI Buttons
  [I18nKeys.UI_BUTTON_CONFIRM]: "Confirm",
  [I18nKeys.UI_BUTTON_CANCEL]: "Cancel",
  [I18nKeys.UI_BUTTON_BACK]: "Back",
  [I18nKeys.UI_BUTTON_CONTINUE]: "Continue Cycle",
  [I18nKeys.UI_BUTTON_START]: "Start System",
  [I18nKeys.UI_BUTTON_RESTART]: "Restart System (New Game)",
  [I18nKeys.UI_BUTTON_SETTINGS]: "Settings",
  [I18nKeys.UI_BUTTON_CHANGELOG]: "Changelog",
  [I18nKeys.UI_BUTTON_BUY]: "Buy",
  [I18nKeys.UI_BUTTON_SELL]: "Sell",
  [I18nKeys.UI_BUTTON_UPGRADE]: "Upgrade",
  [I18nKeys.UI_BUTTON_REFINE]: "Refine",
  [I18nKeys.UI_BUTTON_SCRAP]: "Scrap",
  [I18nKeys.UI_BUTTON_WELD]: "Weld",
  [I18nKeys.UI_BUTTON_REMOVE]: "Remove",
  [I18nKeys.UI_BUTTON_EQUIP]: "Equip",
  [I18nKeys.UI_BUTTON_UNEQUIP]: "Unequip",
  [I18nKeys.UI_BUTTON_USE]: "Use",
  [I18nKeys.UI_BUTTON_FLEE]: "Flee",

  // Core Stats
  [I18nKeys.STAT_LEVEL]: "Level",
  [I18nKeys.STAT_HP]: "HP",
  [I18nKeys.STAT_MP]: "MP",
  [I18nKeys.STAT_ATTACK]: "Attack",
  [I18nKeys.STAT_DEFENSE]: "Defense",
  [I18nKeys.STAT_SPEED]: "Speed",
  [I18nKeys.STAT_GOLD]: "Gold",
  [I18nKeys.STAT_CRIT]: "Crit",
  [I18nKeys.STAT_DODGE]: "Dodge",
  [I18nKeys.STAT_ARMOR]: "Armor",
  [I18nKeys.STAT_DAMAGE]: "Damage",
  [I18nKeys.STAT_HEAL]: "Heal",
  [I18nKeys.STAT_EXP]: "Exp",
  [I18nKeys.STAT_FLOOR]: "Floor",

  // Navigation
  [I18nKeys.NAV_MAIN_DASHBOARD]: "Main Dashboard",
  [I18nKeys.NAV_SPIRE_NAVIGATION]: "Spire Navigation",
  [I18nKeys.NAV_BLACK_MARKET]: "Black Market",
  [I18nKeys.NAV_RECYCLING]: "Recycling Center",
  [I18nKeys.NAV_INVENTORY]: "Inventory",
  [I18nKeys.NAV_NEURAL_MATRIX]: "Neural Matrix",
  [I18nKeys.NAV_BESTIARY]: "Bestiary",
  [I18nKeys.NAV_CONTRACTS]: "Contracts",
  [I18nKeys.NAV_PROFILE]: "Profile",

  // Sample Items
  [I18nKeys.ITEM_WEAPON_RUSTY_COMMON]: "Rusty Sword",
  [I18nKeys.ITEM_WEAPON_MONOMOLECULAR_BLADE]: "Mono-Molecular Blade",

  // Sample Skills
  [I18nKeys.SKILL_EMERGENCY_REPAIR_NAME]: "Emergency Repair",
  [I18nKeys.SKILL_EMERGENCY_REPAIR_DESC]: "Restores part of HP using nanites",

  // Alerts & Messages
  [I18nKeys.MSG_GAME_SAVED]: "Game Saved",
  [I18nKeys.MSG_GAME_SAVED_DESC]: "Your explorer's progress was synchronized with the Spire's local server.",
  [I18nKeys.MSG_SUCCESS]: "SUCCESS",
  [I18nKeys.MSG_FAILURE]: "FAILURE",
};
