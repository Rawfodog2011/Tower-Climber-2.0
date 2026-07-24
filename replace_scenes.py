import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# Replace HubScene
hub_pattern = r"\{scene === 'hub' \? \(\s*<div className=\"flex flex-col gap-6 w-full\">.*?\) : scene === 'combat' \? \("
hub_replacement = """{scene === 'hub' ? (
          <HubScene
            hubTab={hubTab}
            setHubTab={setHubTab}
            player={player}
            CLASSES={CLASSES}
            handleEvolveClass={handleEvolveClass}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            handleStartDive={handleStartDive}
            setPlayer={setPlayer}
            handleAutoEquip={handleAutoEquip}
            pStatsMemo={pStatsMemo}
            inventoryMessage={inventoryMessage}
            handleEquip={handleEquip}
            handleUnequip={handleUnequip}
            canClassEquipItem={canClassEquipItem}
            getItemIcon={getItemIcon}
            getRarityStyle={getRarityStyle}
            getRarityGradient={getRarityGradient}
            renderManufacturerBadge={renderManufacturerBadge}
            handleCraft={handleCraft}
            handleConvertMaterials={handleConvertMaterials}
            handleDismantle={handleDismantle}
            handleSell={handleSell}
            handleDismantleBatch={handleDismantleBatch}
            handleSellBatch={handleSellBatch}
            handleSocketModule={handleSocketModule}
            handleUnsocketModule={handleUnsocketModule}
            handleMergeChips={handleMergeChips}
            handleUpgradeRelic={handleUpgradeRelic}
            ACHIEVEMENTS_DATABASE={ACHIEVEMENTS_DATABASE}
            playerCombatSkills={playerCombatSkills}
          />
        ) : scene === 'combat' ? ("""

content = re.sub(hub_pattern, hub_replacement, content, flags=re.DOTALL)

# Replace CombatScene
combat_pattern = r"\) : scene === 'combat' \? \(\s*<div className=\{\`flex flex-col lg:flex-row gap-6.*?\) : scene === 'event' && activeEvent \? \("
combat_replacement = """) : scene === 'combat' ? (
          <CombatScene
            player={player}
            combatState={combatState}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            dmgPopups={dmgPopups}
            attackerAnimating={attackerAnimating}
            combatSpeed={combatSpeed}
            setCombatSpeed={setCombatSpeed}
            combatLogFilter={combatLogFilter}
            setCombatLogFilter={setCombatLogFilter}
            showMonsterInfo={showMonsterInfo}
            setShowMonsterInfo={setShowMonsterInfo}
            combatEndMessage={combatEndMessage}
            handleCombatAction={handleCombatAction}
            handleStartDive={handleStartDive}
            handleReturnToHub={handleReturnToHub}
            playerCombatSkills={playerCombatSkills}
            handleImageError={handleImageError}
            logContainerRef={logContainerRef}
          />
        ) : scene === 'event' && activeEvent ? ("""

content = re.sub(combat_pattern, combat_replacement, content, flags=re.DOTALL)

# Replace EventScene
event_pattern = r"\) : scene === 'event' && activeEvent \? \(\s*<div className=\"flex flex-col items-center justify-center h-full min-h-\[500px\]\">.*?\) : scene === 'puzzle' && activePuzzle \? \("
event_replacement = """) : scene === 'event' && activeEvent ? (
          <EventScene
            activeEvent={activeEvent}
            eventLog={eventLog}
            handleEventOption={handleEventOption}
            selectedFloor={selectedFloor}
            setSelectedFloor={setSelectedFloor}
            handleStartDive={handleStartDive}
            handleReturnToHub={handleReturnToHub}
          />
        ) : scene === 'puzzle' && activePuzzle ? ("""

content = re.sub(event_pattern, event_replacement, content, flags=re.DOTALL)

# Replace PuzzleScene
puzzle_pattern = r"\) : scene === 'puzzle' && activePuzzle \? \(\s*<div className=\"flex flex-col items-center justify-center h-full min-h-\[500px\]\">.*?\) : scene === 'ending' \? \("
puzzle_replacement = """) : scene === 'puzzle' && activePuzzle ? (
          <PuzzleScene
            activePuzzle={activePuzzle}
            handlePuzzleSelect={handlePuzzleSelect}
            handleSkipPuzzle={handleSkipPuzzle}
          />
        ) : scene === 'ending' ? ("""

content = re.sub(puzzle_pattern, puzzle_replacement, content, flags=re.DOTALL)

# Replace EnvIntroScene
env_pattern = r"\) : scene === 'env_intro' && introSector \? \(\s*<div className=\"flex flex-col items-center justify-center w-full min-h-\[550px\].*?\) : null\}"
env_replacement = """) : scene === 'env_intro' && introSector ? (
          <EnvIntroScene
            player={player}
            setPlayer={setPlayer}
            introSector={introSector}
            introStep={introStep}
            setIntroStep={setIntroStep}
            pendingDiveParams={pendingDiveParams}
            setPendingDiveParams={setPendingDiveParams}
            proceedWithDive={proceedWithDive}
            setIntroSector={setIntroSector}
            setScene={setScene}
          />
        ) : null}"""

content = re.sub(env_pattern, env_replacement, content, flags=re.DOTALL)

with open('src/App.tsx', 'w') as f:
    f.write(content)
