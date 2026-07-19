/**
 * Stable category-based translation keys for the internationalization system.
 * Format: "category.identifier" or "category.subcategory.identifier"
 */

export enum I18nKeys {
  // Main Menu & UI Buttons
  UI_BUTTON_CONFIRM = "ui.button.confirm",
  UI_BUTTON_CANCEL = "ui.button.cancel",
  UI_BUTTON_BACK = "ui.button.back",
  UI_BUTTON_CONTINUE = "ui.button.continue",
  UI_BUTTON_START = "ui.button.start",
  UI_BUTTON_RESTART = "ui.button.restart",
  UI_BUTTON_SETTINGS = "ui.button.settings",
  UI_BUTTON_CHANGELOG = "ui.button.changelog",
  UI_BUTTON_BUY = "ui.button.buy",
  UI_BUTTON_SELL = "ui.button.sell",
  UI_BUTTON_UPGRADE = "ui.button.upgrade",
  UI_BUTTON_REFINE = "ui.button.refine",
  UI_BUTTON_SCRAP = "ui.button.scrap",
  UI_BUTTON_WELD = "ui.button.weld",
  UI_BUTTON_REMOVE = "ui.button.remove",
  UI_BUTTON_EQUIP = "ui.button.equip",
  UI_BUTTON_UNEQUIP = "ui.button.unequip",
  UI_BUTTON_USE = "ui.button.use",
  UI_BUTTON_FLEE = "ui.button.flee",

  // Core Stats
  STAT_LEVEL = "stat.level",
  STAT_HP = "stat.hp",
  STAT_MP = "stat.mp",
  STAT_ATTACK = "stat.attack",
  STAT_DEFENSE = "stat.defense",
  STAT_SPEED = "stat.speed",
  STAT_GOLD = "stat.gold",
  STAT_CRIT = "stat.crit",
  STAT_DODGE = "stat.dodge",
  STAT_ARMOR = "stat.armor",
  STAT_DAMAGE = "stat.damage",
  STAT_HEAL = "stat.heal",
  STAT_EXP = "stat.exp",
  STAT_FLOOR = "stat.floor",

  // Navigation
  NAV_MAIN_DASHBOARD = "ui.nav.main_dashboard",
  NAV_SPIRE_NAVIGATION = "ui.nav.spire_navigation",
  NAV_BLACK_MARKET = "ui.nav.black_market",
  NAV_RECYCLING = "ui.nav.recycling",
  NAV_INVENTORY = "ui.nav.inventory",
  NAV_NEURAL_MATRIX = "ui.nav.neural_matrix",
  NAV_BESTIARY = "ui.nav.bestiary",
  NAV_CONTRACTS = "ui.nav.contracts",
  NAV_PROFILE = "ui.nav.profile",

  // Sample Items (as requested in format)
  ITEM_WEAPON_RUSTY_COMMON = "item.weapon.rusty_common",
  ITEM_WEAPON_MONOMOLECULAR_BLADE = "item.weapon.monomolecular_blade",

  // Sample Skills
  SKILL_EMERGENCY_REPAIR_NAME = "skill.emergency_repair.name",
  SKILL_EMERGENCY_REPAIR_DESC = "skill.emergency_repair.desc",

  // Alerts & Messages
  MSG_GAME_SAVED = "msg.game_saved",
  MSG_GAME_SAVED_DESC = "msg.game_saved_desc",
  MSG_SUCCESS = "msg.success",
  MSG_FAILURE = "msg.failure",
}

export type I18nKey =
  | "ui.button.confirm"
  | "ui.button.cancel"
  | "ui.button.back"
  | "ui.button.continue"
  | "ui.button.start"
  | "ui.button.restart"
  | "ui.button.settings"
  | "ui.button.changelog"
  | "ui.button.buy"
  | "ui.button.sell"
  | "ui.button.upgrade"
  | "ui.button.refine"
  | "ui.button.scrap"
  | "ui.button.weld"
  | "ui.button.remove"
  | "ui.button.equip"
  | "ui.button.unequip"
  | "ui.button.use"
  | "ui.button.flee"
  | "stat.level"
  | "stat.hp"
  | "stat.mp"
  | "stat.attack"
  | "stat.defense"
  | "stat.speed"
  | "stat.gold"
  | "stat.crit"
  | "stat.dodge"
  | "stat.armor"
  | "stat.damage"
  | "stat.heal"
  | "stat.exp"
  | "stat.floor"
  | "ui.nav.main_dashboard"
  | "ui.nav.spire_navigation"
  | "ui.nav.black_market"
  | "ui.nav.recycling"
  | "ui.nav.inventory"
  | "ui.nav.neural_matrix"
  | "ui.nav.bestiary"
  | "ui.nav.contracts"
  | "ui.nav.profile"
  | "item.weapon.rusty_common"
  | "item.weapon.monomolecular_blade"
  | "skill.emergency_repair.name"
  | "skill.emergency_repair.desc"
  | "msg.game_saved"
  | "msg.game_saved_desc"
  | "msg.success"
  | "msg.failure";
