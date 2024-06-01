let playerPowers = JSON.parse(localStorage.getItem('playerPowers')) || ['炎']; // 初期超能力をローカルストレージから取得、なければ炎
let currentPowerIndex = 0;
let playerHealth = 100;
let enemyHealth = [];
let enemyHealthBars = [];
let currentStage = 1;
let items = [];
let turnCount = 0;
let selectedEnemyIndex = -1;
let titleClickCount = 0;
let previousScreen = 'home-screen';

const powerTechniques = {
    '炎': [
        { name: 'ファイヤーボール', baseDamage: 10, level: 1, progress: 0, type: '通常攻撃', usage: 20, target: 'single' },
        { name: 'フレイムスロー', baseDamage: 20, level: 1, progress: 0, type: '技攻撃', usage: 15, target: 'single' },
        { name: '火炎放射', baseDamage: 40, level: 1, progress: 0, type: '特大攻撃', usage: 5, target: 'all' },
        { name: 'インフェルノ', baseDamage: 80, level: 1, progress: 0, type: '必殺攻撃', usage: 1, target: 'single' }
    ],
    '氷': [
        { name: 'アイスボルト', baseDamage: 10, level: 1, progress: 0, type: '通常攻撃', usage: 20, target: 'single' },
        { name: 'フロストブレス', baseDamage: 20, level: 1, progress: 0, type: '技攻撃', usage: 15, target: 'single' },
        { name: 'ブリザード', baseDamage: 40, level: 1, progress: 0, type: '特大攻撃', usage: 5, target: 'all' },
        { name: 'アイスエイジ', baseDamage: 80, level: 1, progress: 0, type: '必殺攻撃', usage: 1, target: 'single' }
    ],
    '雷': [
        { name: 'サンダーボルト', baseDamage: 10, level: 1, progress: 0, type: '通常攻撃', usage: 20, target: 'single' },
        { name: 'ライトニング', baseDamage: 20, level: 1, progress: 0, type: '技攻撃', usage: 15, target: 'single' },
        { name: 'サンダーストーム', baseDamage: 40, level: 1, progress: 0, type: '特大攻撃', usage: 5, target: 'all' },
        { name: 'エレクトロボム', baseDamage: 80, level: 1, progress: 0, type: '必殺攻撃', usage: 1, target: 'single' }
    ],
    '風': [
        { name: 'ウィンドカッター', baseDamage: 10, level: 1, progress: 0, type: '通常攻撃', usage: 20, target: 'single' },
        { name: 'トルネード', baseDamage: 20, level: 1, progress: 0, type: '技攻撃', usage: 15, target: 'single' },
        { name: 'エアブレード', baseDamage: 40, level: 1, progress: 0, type: '特大攻撃', usage: 5, target: 'all' },
        { name: 'ストームブラスト', baseDamage: 80, level: 1, progress: 0, type: '必殺攻撃', usage: 1, target: 'single' }
    ],
    '地': [
        { name: 'ロックパンチ', baseDamage: 10, level: 1, progress: 0, type: '通常攻撃', usage: 20, target: 'single' },
        { name: 'アースクエイク', baseDamage: 20, level: 1, progress: 0, type: '技攻撃', usage: 15, target: 'single' },
        { name: 'ストーンエッジ', baseDamage: 40, level: 1, progress: 0, type: '特大攻撃', usage: 5, target: 'all' },
        { name: 'グランドスラム', baseDamage: 80, level: 1, progress: 0, type: '必殺攻撃', usage: 1, target: 'single' }
    ]
};

const levelRequirements = [1, 2, 4, 8, 20]; // 各レベルアップに必要なアイテム数
const titles = JSON.parse(localStorage.getItem('titles')) || {
    stageClear: new Array(10).fill(false),
    firstClear: false,
    totalClears: 0,
    defeats: 0,
    battles: 0,
    powerTitles: {
        fire: false,
        ice: false,
        thunder: false,
        wind: false,
        earth: false,
    },
    itemUses: 0,
    levelUps: 0,
    progress: 0,
    allPowers: false,
    victories: 0 // 勝利カウントを追加
};

const titleDescriptions = {
    "ステージ１をクリア": "ステージ１をクリアするともらえる称号",
    "ステージ２をクリア": "ステージ２をクリアするともらえる称号",
    "ステージ３をクリア": "ステージ３をクリアするともらえる称号",
    "ステージ４をクリア": "ステージ４をクリアするともらえる称号",
    "ステージ５をクリア": "ステージ５をクリアするともらえる称号",
    "ステージ６をクリア": "ステージ６をクリアするともらえる称号",
    "ステージ７をクリア": "ステージ７をクリアするともらえる称号",
    "ステージ８をクリア": "ステージ８をクリアするともらえる称号",
    "ステージ９をクリア": "ステージ９をクリアするともらえる称号",
    "ステージ１０をクリア": "ステージ１０をクリアするともらえる称号",
    "１～１０をクリア": "全てのステージをクリアするともらえる称号",
    "初めての敗北": "初めてステージを負けるともらえる称号",
    "三度目の正直": "二回目ステージを負けるともらえる称号",
    "仏の顔も、、、": "３回ステージを負けるともらえる称号",
    "１０回目の敗北": "１０回ステージを負けるともらえる称号",
    "３０回目の敗北": "３０回ステージを負けるともらえる称号",
    "敗北のスペシャリスト": "５０回ステージを負けるともらえる称号",
    "初めての戦闘": "初めてステージをプレイするともらえる称号",
    "３回目の戦闘": "３回ステージをプレイするともらえる称号",
    "１０回目の戦闘": "１０回ステージをプレイするともらえる称号",
    "３０回目の戦闘": "３０回ステージをプレイするともらえる称号",
    "戦闘の権化": "５０回ステージをプレイするともらえる称号",
    "超能力 炎": "超能力 炎を獲得するともらえる称号",
    "超能力 氷": "超能力 氷を獲得するともらえる称号",
    "超能力 雷": "超能力 雷を獲得するともらえる称号",
    "超能力 風": "超能力 風を獲得するともらえる称号",
    "超能力 地": "超能力 地を獲得するともらえる称号",
    "超能力 全て": "超能力を全て獲得するともらえる称号",
    "初めてのアイテム": "初めてアイテムを使用するともらえる称号",
    "１０回目のアイテム": "１０回アイテムを使用するともらえる称号",
    "３０回目のアイテム": "３０回アイテムを使用するともらえる称号",
    "アイテムの使い魔": "５０回アイテムを使用するともらえる称号",
    "初めてのレベルアップ": "初めて技レベルをあげるともらえる称号",
    "１０回目のレベルアップ": "10回目技レベルをあげるともらえる称号",
    "３０回目のレベルアップ": "３０回目技レベルをあげるともらえる称号",
    "レベルマックス": "５０回目技レベルをあげるともらえる称号"
};

const progressTitles = [
    "３０％達成",
    "５０％達成",
    "７０％達成",
    "９０％達成",
    "９９％達成",
    "１００％達成"
];

function saveTitles() {
    localStorage.setItem('titles', JSON.stringify(titles));
}

function savePlayerPowers() {
    localStorage.setItem('playerPowers', JSON.stringify(playerPowers));
}

function startQuest() {
    previousScreen = 'home-screen';
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('stage-screen').classList.remove('hidden');
}

function viewItems() {
    previousScreen = 'home-screen';
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('item-screen').classList.remove('hidden');
    updateItems();
    updateTechniquesList();
}

function viewTitles() {
    previousScreen = 'home-screen';
    document.getElementById('home-screen').classList.add('hidden');
    document.getElementById('title-screen').classList.remove('hidden');
    displayTitles();
}

function displayTitles() {
    const titlesDiv = document.getElementById('titles');
    titlesDiv.innerHTML = '';

    const clearTitles = [
        "ステージ１をクリア",
        "ステージ２をクリア",
        "ステージ３をクリア",
        "ステージ４をクリア",
        "ステージ５をクリア",
        "ステージ６をクリア",
        "ステージ７をクリア",
        "ステージ８をクリア",
        "ステージ９をクリア",
        "ステージ１０をクリア",
        "１～１０をクリア"
    ];

    const defeatTitles = [
        "初めての敗北",
        "三度目の正直",
        "仏の顔も、、、",
        "１０回目の敗北",
        "３０回目の敗北",
        "敗北のスペシャリスト"
    ];

    const battleTitles = [
        "初めての戦闘",
        "３回目の戦闘",
        "１０回目の戦闘",
        "３０回目の戦闘",
        "戦闘の権化"
    ];

    const powerTitles = [
        "超能力 炎",
        "超能力 氷",
        "超能力 雷",
        "超能力 風",
        "超能力 地",
        "超能力 全て"
    ];

    const itemTitles = [
        "初めてのアイテム",
        "１０回目のアイテム",
        "３０回目のアイテム",
        "アイテムの使い魔"
    ];

    const levelTitles = [
        "初めてのレベルアップ",
        "１０回目のレベルアップ",
        "３０回目のレベルアップ",
        "レベルマックス"
    ];

    const categories = [
        { title: "クリア称号", titles: clearTitles },
        { title: "敗北称号", titles: defeatTitles },
        { title: "戦闘称号", titles: battleTitles },
        { title: "超能力称号", titles: powerTitles },
        { title: "アイテム称号", titles: itemTitles },
        { title: "技レベル称号", titles: levelTitles },
    ];

    categories.forEach(category => {
        titlesDiv.innerHTML += `<div class="title-category">${category.title}</div>`;
        let rowDiv = document.createElement('div');
        rowDiv.className = 'title-row';
        titlesDiv.appendChild(rowDiv);

        category.titles.forEach((name, i) => {
            const earned = checkTitleEarned(category.title, i);
            const className = earned ? 'title earned' : 'title';
            const progress = earned ? 100 : getTitleProgress(category.title, i);

            if (i % 5 === 0 && i !== 0) {
                rowDiv = document.createElement('div');
                rowDiv.className = 'title-row';
                titlesDiv.appendChild(rowDiv);
            }

            rowDiv.innerHTML += `
                <div class="${className}" onclick="showPopup('${name}', ${progress})">
                    <div class="title-icon">${name.charAt(0)}</div>
                    <div class="title-name">${name}</div>
                </div>`;
        });
    });
}

function checkTitleEarned(category, index) {
    switch (category) {
        case "クリア称号":
            if (index === 10) return titles.stageClear.every(clear => clear);
            return titles.stageClear[index];
        case "敗北称号": return titles.defeats >= [1, 2, 3, 10, 30, 50][index];
        case "戦闘称号": return titles.battles >= [1, 3, 10, 30, 50][index];
        case "超能力称号":
            if (index === 5) return titles.allPowers;
            return playerPowers.includes(Object.keys(powerTechniques)[index]);
        case "アイテム称号": return titles.itemUses >= [1, 10, 30, 50][index];
        case "技レベル称号": return titles.levelUps >= [1, 10, 30, 50][index];
        default: return false;
    }
}

function getTitleProgress(category, index) {
    switch (category) {
        case "クリア称号":
            if (index === 10) return (titles.stageClear.filter(Boolean).length / 10) * 100;
            return (titles.stageClear.filter(Boolean).length / 10) * 100;
        case "敗北称号": return (titles.defeats / [1, 2, 3, 10, 30, 50][index]) * 100;
        case "戦闘称号": return (titles.battles / [1, 3, 10, 30, 50][index]) * 100;
        case "超能力称号":
            if (index === 5) return (playerPowers.length / Object.keys(powerTechniques).length) * 100;
            return playerPowers.includes(Object.keys(powerTechniques)[index]) ? 100 : 0;
        case "アイテム称号": return (titles.itemUses / [1, 10, 30, 50][index]) * 100;
        case "技レベル称号": return (titles.levelUps / [1, 10, 30, 50][index]) * 100;
        default: return 0;
    }
}

function getTitleValue(titles, key) {
    const keys = key.split('.');
    let value = titles;
    keys.forEach(k => {
        value = value[k];
    });
    return value;
}

function goHome() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById('home-screen').classList.remove('hidden');
}

function goBack() {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.add('hidden'));
    document.getElementById(previousScreen).classList.remove('hidden');
}

function chooseStage(stage) {
    previousScreen = 'stage-screen';
    currentStage = stage;
    turnCount = 0;
    enemyHealth = [];
    selectedEnemyIndex = -1;
    const enemyBarsDiv = document.getElementById('enemy-bars');
    enemyBarsDiv.innerHTML = '<div><p>敵の体力:</p></div>';
    
    const enemyCount = getEnemyCount(stage);
    for (let i = 0; i < enemyCount; i++) {
        const difficultyMultiplier = getDifficultyMultiplier(stage);
        enemyHealth.push(100 + (stage - 1) * 10 * difficultyMultiplier);
        const healthBar = document.createElement('div');
        healthBar.className = 'health-bar';
        healthBar.innerHTML = `<div class="enemy-health health" id="enemy-health-${i}" onclick="selectEnemy(${i})">${enemyHealth[i]}%</div>`;
        enemyBarsDiv.appendChild(healthBar);
    }

    currentPowerIndex = 0; // 最初の超能力でスタート
    choosePower(playerPowers[currentPowerIndex]);
    
    document.getElementById('stage-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    document.getElementById('techniques').classList.remove('hidden');
    updateHealthBars();

    // 戦闘回数をカウント
    titles.battles++;
    saveTitles();
}

function getEnemyCount(stage) {
    if (stage === 1) return 1;
    if (stage === 2 || stage === 3) return 2;
    if (stage === 4 || stage === 5) return 3;
    if (stage === 7 || stage === 8) return 2;
    return 1;
}

function getDifficultyMultiplier(stage) {
    if (stage <= 3) return 1; // Easy
    if (stage <= 7) return 1.5; // Normal
    return 2; // Hard
}

function choosePower(power) {
    playerPower = power;
    techniques = powerTechniques[power];
    document.getElementById('player-power').innerText = 'あなたの選んだ超能力: ' + playerPower;
    updateTechniques();
}

function updateTechniques() {
    document.getElementById('technique-1').innerText = `${techniques[0].name} (${techniques[0].type}) Lv${techniques[0].level} 使用可能: ${techniques[0].usage}`;
    document.getElementById('technique-2').innerText = `${techniques[1].name} (${techniques[1].type}) Lv${techniques[1].level} 使用可能: ${techniques[1].usage}`;
    document.getElementById('technique-3').innerText = `${techniques[2].name} (${techniques[2].type}) Lv${techniques[2].level} 使用可能: ${techniques[2].usage}`;
    document.getElementById('technique-4').innerText = `${techniques[3].name} (${techniques[3].type}) Lv${techniques[3].level} 使用可能: ${techniques[3].usage}`;
}

function updateTechniquesList() {
    const techniquesList = document.getElementById('techniques-list');
    techniquesList.innerHTML = '';
    playerPowers.forEach(power => {
        powerTechniques[power].forEach((technique, index) => {
            const progress = getProgress(technique);
            const techniqueDiv = document.createElement('div');
            techniqueDiv.className = 'technique-item';
            techniqueDiv.innerHTML = `
                <div>${technique.name} (${technique.type}) Lv${technique.level} 使用可能: ${technique.usage}</div>
                <div class="technique-progress">
                    <div class="progress" style="--progress-width: ${progress}%"></div>
                </div>
            `;
            techniqueDiv.id = `technique-item-${power}-${index}`;
            techniqueDiv.ondragover = (event) => event.preventDefault();
            techniqueDiv.ondrop = (event) => dropItem(event, power, index);
            techniquesList.appendChild(techniqueDiv);
        });
    });
}

function getProgress(technique) {
    const currentLevel = technique.level - 1;
    const currentProgress = technique.progress;
    const requiredItems = levelRequirements[currentLevel];
    return (currentProgress / requiredItems) * 100;
}

function updateHealthBars() {
    document.getElementById('player-health').style.width = playerHealth + '%';
    document.getElementById('player-health').innerText = playerHealth + '%';
    enemyHealth.forEach((health, index) => {
        const enemyHealthBar = document.getElementById(`enemy-health-${index}`);
        enemyHealthBar.style.width = health + '%';
        enemyHealthBar.innerText = health + '%';
        if (index === selectedEnemyIndex) {
            if (!document.getElementById(`selected-${index}`)) {
                const selectedMark = document.createElement('div');
                selectedMark.className = 'selected-enemy';
                selectedMark.id = `selected-${index}`;
                selectedMark.innerText = '♥';
                enemyHealthBar.parentNode.appendChild(selectedMark);
            }
        } else {
            const selectedMark = document.getElementById(`selected-${index}`);
            if (selectedMark) selectedMark.remove();
        }
    });
}

function selectEnemy(index) {
    selectedEnemyIndex = index;
    updateHealthBars();
}

function showDamageEffect(target, damage) {
    const effect = document.createElement('div');
    effect.className = 'damage-effect';
    effect.innerText = `-${damage}`;
    target.appendChild(effect);
    setTimeout(() => target.removeChild(effect), 1000);
}

function attack(technique) {
    if (technique.usage <= 0) {
        alert('この技はもう使用できません');
        return;
    }

    if (technique.target === 'single') {
        if (selectedEnemyIndex === -1) {
            selectedEnemyIndex = enemyHealth.findIndex(health => health > 0);
        }
        attackSingle(technique, selectedEnemyIndex);
    } else if (technique.target === 'all') {
        attackAll(technique);
    }
}

function attackSingle(technique, index) {
    turnCount++;
    technique.usage--;
    const playerDamage = technique.baseDamage + technique.level * 5;
    let enemyDamage = Math.floor(Math.random() * (10 + currentStage * 2)) + currentStage * 2;

    if (enemyHealth[index] <= 0) {
        alert('その敵はすでに倒されています');
        return;
    }

    enemyHealth[index] -= playerDamage;
    showDamageEffect(document.getElementById(`enemy-health-${index}`), playerDamage);

    if (currentStage >= 6 && turnCount % 3 === 0) {
        const randomHealing = Math.floor(Math.random() * 20) + 10;
        enemyHealth = enemyHealth.map(health => Math.min(health + randomHealing, 100));
    }

    if (currentStage >= 9 && turnCount % 5 === 0) {
        enemyDamage += playerDamage;
    }

    if (currentStage === 10 && Math.random() < 0.2) {
        enemyDamage = 0;
        alert('敵が攻撃をかわした！');
    } else {
        playerHealth -= enemyDamage;
        showDamageEffect(document.getElementById('player-health'), enemyDamage);
    }

    if (enemyHealth.every(health => health <= 0)) {
        alert('勝利！ステージクリア！');
        addClearTitle();
        addItem();
        addPower();
        resetGame();
        returnToHomeScreen(); // 追加
    } else if (playerHealth <= 0) {
        if (currentPowerIndex < playerPowers.length - 1) {
            currentPowerIndex++;
            playerHealth = 100;
            choosePower(playerPowers[currentPowerIndex]);
            updateHealthBars();
            alert('あなたの超能力が変わった！');
        } else {
            alert('あなたは倒された…敗北！');
            titles.defeats++;
            saveTitles();
            resetGame();
            returnToHomeScreen(); // 追加
        }
    } else {
        updateHealthBars();
    }
}

function attackAll(technique) {
    turnCount++;
    technique.usage--;
    const playerDamage = technique.baseDamage + technique.level * 5;
    let enemyDamage = Math.floor(Math.random() * (10 + currentStage * 2)) + currentStage * 2;

    enemyHealth.forEach((health, index) => {
        if (health > 0) {
            enemyHealth[index] -= playerDamage;
            showDamageEffect(document.getElementById(`enemy-health-${index}`), playerDamage);
        }
    });

    if (currentStage >= 6 && turnCount % 3 === 0) {
        const randomHealing = Math.floor(Math.random() * 20) + 10;
        enemyHealth = enemyHealth.map(health => Math.min(health + randomHealing, 100));
    }

    if (currentStage >= 9 && turnCount % 5 === 0) {
        enemyDamage += playerDamage;
    }

    if (currentStage === 10 && Math.random() < 0.2) {
        enemyDamage = 0;
        alert('敵が攻撃をかわした！');
    } else {
        playerHealth -= enemyDamage;
        showDamageEffect(document.getElementById('player-health'), enemyDamage);
    }

    if (enemyHealth.every(health => health <= 0)) {
        alert('勝利！ステージクリア！');
        addClearTitle();
        addItem();
        addPower();
        resetGame();
        returnToHomeScreen(); // 追加
    } else if (playerHealth <= 0) {
        if (currentPowerIndex < playerPowers.length - 1) {
            currentPowerIndex++;
            playerHealth = 100;
            choosePower(playerPowers[currentPowerIndex]);
            updateHealthBars();
            alert('あなたの超能力が変わった！');
        } else {
            alert('あなたは倒された…敗北！');
            titles.defeats++;
            saveTitles();
            resetGame();
            returnToHomeScreen(); // 追加
        }
    } else {
        updateHealthBars();
    }
}

function returnToHomeScreen() {
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('stage-screen').classList.add('hidden');
    document.getElementById('home-screen').classList.remove('hidden');
}

function addItem() {
    const item = { name: '技の書', description: '技のレベルを上げるためのアイテム' };
    items.push(item);
    updateItems();
}

function addClearTitle() {
    if (!titles.stageClear[currentStage - 1]) {
        titles.stageClear[currentStage - 1] = true;
        checkAllClears();
        showNotification('新しい称号を獲得しました！');
    }
    titles.victories += 1; // 勝利カウントを増加
    titles.totalClears += 1;
    saveTitles();
}

function addPower() {
    let newPower = '';
    switch (currentStage) {
        case 3:
            newPower = '氷';
            break;
        case 5:
            newPower = '雷';
            break;
        case 6:
            newPower = '風';
            break;
        case 8:
            newPower = '地';
            break;
    }

    if (newPower && !playerPowers.includes(newPower)) {
        playerPowers.push(newPower);
        titles.powerTitles[newPower.toLowerCase()] = true;
        checkAllPowers();
        savePlayerPowers();
        saveTitles();
        showNotification(`新しい超能力を獲得しました: ${newPower}`);
    }
}

function checkAllPowers() {
    if (playerPowers.length === Object.keys(powerTechniques).length) {
        titles.allPowers = true;
        showNotification('新しい称号を獲得しました！超能力 全て');
    }
}

function checkAllClears() {
    if (titles.stageClear.every(clear => clear)) {
        showNotification('新しい称号を獲得しました！１～１０をクリア');
    }
}

function updateItems() {
    const itemsDiv = document.getElementById('items');
    itemsDiv.innerHTML = '';
    items.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerText = item.name;
        itemDiv.draggable = true;
        itemDiv.ondragstart = (event) => dragItem(event, index);
        itemsDiv.appendChild(itemDiv);
    });
}

function dragItem(event, itemIndex) {
    event.dataTransfer.setData('text/plain', itemIndex);
}

function dropItem(event, power, techniqueIndex) {
    const itemIndex = event.dataTransfer.getData('text/plain');
    useItem(itemIndex, power, techniqueIndex);
}

function useItem(itemIndex, power, techniqueIndex) {
    const item = items[itemIndex];
    if (item && item.name === '技の書') {
        const technique = powerTechniques[power][techniqueIndex];
        const requiredItems = levelRequirements[technique.level - 1];
        technique.progress += 1;
        
        if (technique.progress >= requiredItems) {
            technique.level += 1;
            technique.progress = 0;
            titles.levelUps += 1;
            showNotification('新しい称号を獲得しました！');
            alert(`${technique.name} のレベルが上がりました！`);
        }
        
        items.splice(itemIndex, 1);
        titles.itemUses++; // アイテム使用回数をカウント
        saveTitles();
        updateItems();
        updateTechniquesList();
        updateTechniques();
    }
}

function resetGame() {
    currentPowerIndex = 0;
    playerHealth = 100;
    enemyHealth = [];
    currentStage = 1;
    turnCount = 0;
    selectedEnemyIndex = -1;
    document.getElementById('home-screen').classList.remove('hidden');
    document.getElementById('stage-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('techniques').classList.add('hidden');
    updateHealthBars();
}

function changePower() {
    currentPowerIndex = (currentPowerIndex + 1) % playerPowers.length;
    choosePower(playerPowers[currentPowerIndex]);
}

function incrementTitleClick() {
    titleClickCount++;
    if (titleClickCount >= 7) {
        resetLocalStorage();
    }
}

function resetLocalStorage() {
    localStorage.removeItem('titles');
    localStorage.removeItem('playerPowers');
    alert('ローカルデータが初期化されました');
    location.reload();
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.classList.remove('hidden');
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

function showPopup(title, progress) {
    const popup = document.getElementById('popup');
    const popupContent = document.getElementById('popup-content');
    popupContent.innerText = `${titleDescriptions[title]}\n現在の達成度: ${progress}%`;
    popup.classList.remove('hidden');
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}
