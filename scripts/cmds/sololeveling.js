const sessions = {}; // Stockage des joueurs par senderID

module.exports = {
  config: {
    name: "sololeveling",
    version: "3.0",
    author: "SoloLevelingRPG",
    shortDescription: "Mini-jeu Solo Leveling interactif Messenger",
    longDescription: "Mini-jeu complet avec combats, donjons, armée d'ombres, boss, loot et progression de rang. Menu interactif par numéro.",
    category: "Solo Leveling"
  },

  onStart: async function({ event, api }) {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    // Initialiser joueur si session inexistante
    if (!sessions[event.senderID]) {
      sessions[event.senderID] = {
        rank: "E",
        level: 1,
        xp: 0,
        hp: 100,
        maxHp: 100,
        gold: 100,
        crystals: 10,
        shadows: [],
        items: []
      };
    }

    const player = sessions[event.senderID];

    const ranks = ["E","D","C","B","A","S"];
    const xpNeeded = [0,50,150,300,500,800];

    const monsters = [
      {name:"Orc", hp:30, dmg:[5,15], gold:[20,50], xp:[10,20]},
      {name:"Gobelin", hp:20, dmg:[2,10], gold:[10,30], xp:[5,15]},
      {name:"Troll", hp:50, dmg:[10,25], gold:[50,100], xp:[20,35]},
      {name:"Chevalier Déchu", hp:70, dmg:[15,30], gold:[80,150], xp:[30,50]},
      {name:"Spectre", hp:60, dmg:[10,25], gold:[60,120], xp:[25,40]}
    ];

    const bosses = [
      {name:"Dragon de Feu", hp:500, dmg:[40,70], gold:1000, crystals:50},
      {name:"Chevalier Noir", hp:400, dmg:[30,60], gold:800, crystals:40},
      {name:"Géant des Ombres", hp:600, dmg:[50,80], gold:1200, crystals:60},
      {name:"Démon Ancien", hp:800, dmg:[60,100], gold:1500, crystals:80}
    ];

    const shadowsList = ["Soldat d’Ombre","Chevalier d’Ombre","Archer d’Ombre","Assassin d’Ombre"];
    const randInt = (min,max) => Math.floor(Math.random()*(max-min+1))+min;

    const rankUpCheck = () => {
      let idx = ranks.indexOf(player.rank);
      if(player.xp >= xpNeeded[idx+1]){
        player.rank = ranks[idx+1];
        api.sendMessage(`✨ Félicitations ! Tu montes au rang **${player.rank}** !`, event.threadID);
      }
    };

    const showStats = () => {
      return `📊 Stats\nHP: ${player.hp}/${player.maxHp}\nXP: ${player.xp} | Rang: ${player.rank}\nOr: ${player.gold} 💰 | Cristaux: ${player.crystals} 💎\nOmbres: ${player.shadows.length>0?player.shadows.join(", "):"Aucune"}\nInventaire: ${player.items.length>0?player.items.join(", "):"Vide"}`;
    };

    const showMenu = () => {
      let menu = "💡 Choisis une action:\n1️⃣ Hunt - Chasser un monstre\n2️⃣ Dungeon - Entrer dans un donjon\n3️⃣ Shadow - Invoquer une ombre\n4️⃣ Rest - Se reposer\n5️⃣ Boss - Affronter un boss\n6️⃣ TrainShadow - Entraîner tes ombres\n7️⃣ FusionShadow - Fusionner deux ombres\n8️⃣ SacrificeShadow - Sacrifier une ombre\nRéponds avec le **numéro**.";
      api.sendMessage(menu, event.threadID);
    };

    const combatMonster = async () => {
      let monster = random(monsters);
      let mhp = monster.hp;
      let log = `⚔️ Combat contre ${monster.name}\n`;
      while(mhp>0 && player.hp>0){
        let pdmg = randInt(10,35); mhp -= pdmg;
        log += `💥 Tu infliges ${pdmg}. HP ${monster.name}: ${mhp>0?mhp:0}\n`;
        if(mhp<=0) break;
        let mdmg = randInt(monster.dmg[0],monster.dmg[1]); player.hp -= mdmg;
        log += `💔 ${monster.name} inflige ${mdmg}. HP toi: ${player.hp>0?player.hp:0}\n`;
        if(player.hp<=0) break;
      }
      if(player.hp>0){
        let gold = randInt(monster.gold[0],monster.gold[1]);
        let xp = randInt(monster.xp[0],monster.xp[1]);
        let crystals = Math.floor(xp/10);
        player.gold += gold; player.xp += xp; player.crystals += crystals;
        log += `🏆 Vaincu ! 💰${gold} Or 💎${crystals} Cristaux XP:${xp}`;
      } else { player.hp = Math.floor(player.maxHp/2); log += "\n💀 Tu as été vaincu.";}
      log += `\n\n${showStats()}`; rankUpCheck();
      api.sendMessage(log, event.threadID); showMenu();
    };

    const enterDungeon = async () => {
      let count = randInt(3,8);
      let log = `🏰 Donjon: ${count} monstres\n`; let gold=0, xp=0, crystals=0;
      for(let i=0;i<count;i++){
        let m = random(monsters);
        let dmgM = randInt(m.dmg[0], m.dmg[1]);
        let dmgP = randInt(15,40); player.hp -= dmgM;
        let g = randInt(m.gold[0],m.gold[1]); gold+=g;
        let x = randInt(m.xp[0],m.xp[1]); xp+=x; crystals+=Math.floor(x/10);
        log += `💥 ${m.name} inflige ${dmgM}, tu infliges ${dmgP}\n`;
        if(player.hp<=0){ log += "💀 Vaincu dans le donjon"; player.hp=Math.floor(player.maxHp/2); break; }
      }
      player.gold+=gold; player.xp+=xp; player.crystals+=crystals;
      log += `🏆 Donjon terminé 💰${gold} 💎${crystals} XP:${xp}\n${showStats()}`; rankUpCheck(); api.sendMessage(log,event.threadID); showMenu();
    };

    const summonShadow = async () => {
      let s = random(shadowsList); player.shadows.push(s);
      api.sendMessage(`🌑 Invoqué: ${s}\nOmbres: ${player.shadows.join(", ")}`, event.threadID);
      api.sendMessage(showStats(), event.threadID); showMenu();
    };

    const restPlayer = async () => {
      let r = randInt(20,50); player.hp+=r; if(player.hp>player.maxHp) player.hp=player.maxHp;
      api.sendMessage(`🛌 Reposé: +${r} HP, actuel: ${player.hp}\n${showStats()}`, event.threadID); showMenu();
    };

    const fightBoss = async () => {
      let b = random(bosses); let bhp=b.hp; let log = `🔥 Boss ${b.name} HP:${bhp}\n`;
      while(bhp>0 && player.hp>0){
        let pd=randInt(30,70); bhp-=pd; log += `💥 Tu infliges ${pd}. Boss HP:${bhp>0?bhp:0}\n`;
        if(bhp<=0) break; let bd=randInt(b.dmg[0],b.dmg[1]); player.hp-=bd; log+=`💔 Boss inflige ${bd}. HP toi:${player.hp>0?player.hp:0}\n`;
        if(player.hp<=0) break;
      }
      if(player.hp>0){ player.gold+=b.gold; player.crystals+=b.crystals; player.xp+=b.crystals*2; log+=`🏆 Boss vaincu 💰${b.gold} 💎${b.crystals} XP:${b.crystals*2}`;}
      else { player.hp=Math.floor(player.maxHp/2); log+="💀 Vaincu par le boss";}
      log += `\n${showStats()}`; rankUpCheck(); api.sendMessage(log,event.threadID); showMenu();
    };

    const trainShadows = async () => {
      if(player.shadows.length==0){ api.sendMessage("❌ Aucune ombre à entraîner", event.threadID);}
      else { let x=randInt(10,30); player.xp+=x; api.sendMessage(`💪 Entraînement +${x} XP`,event.threadID); rankUpCheck();}
      api.sendMessage(showStats(),event.threadID); showMenu();
    };

    const fusionShadows = async () => {
      if(player.shadows.length<2){ api.sendMessage("❌ Besoin de 2 ombres",event.threadID);}
      else { let s1=player.shadows.pop(); let s2=player.shadows.pop(); let fused=`Elite ${s1.split(" ")[0]}-${s2.split(" ")[0]}`; player.shadows.push(fused);
        api.sendMessage(`🌑 Fusion: ${fused}\nOmbres: ${player.shadows.join(", ")}`,event.threadID);}
      api.sendMessage(showStats(),event.threadID); showMenu();
    };

    const sacrificeShadow = async () => {
      if(player.shadows.length==0){ api.sendMessage("❌ Aucune ombre à sacrifier",event.threadID);}
      else { let s=player.shadows.pop(); let g=randInt(50,150); let c=randInt(5,15); player.gold+=g; player.crystals+=c;
        api.sendMessage(`🔥 Sacrifice: ${s} 💰${g} 💎${c}`,event.threadID);}
      api.sendMessage(showStats(),event.threadID); showMenu();
    };

    // -------------------- LISTENER GLOBAL pour fb-chat-api --------------------
    if(!global.GoatBotMessageListenerRegistered){
      global.GoatBotMessageListenerRegistered = true;
      api.listenMqtt((err, messageEvent) => {
        if(err) return console.error(err);
        const id = messageEvent.senderID;
        if(sessions[id]){
          let choice = messageEvent.body.trim();
          switch(choice){
            case "1": combatMonster(); break;
            case "2": enterDungeon(); break;
            case "3": summonShadow(); break;
            case "4": restPlayer(); break;
            case "5": fightBoss(); break;
            case "6": trainShadows(); break;
            case "7": fusionShadows(); break;
            case "8": sacrificeShadow(); break;
            default: api.sendMessage("❌ Choix invalide, réponds 1-8", id); showMenu();
          }
        }
      });
    }

    // -------------------- INTRO --------------------
    let intro = "🌌 Bienvenue Chasseur ! Rang E devant une porte mystique.\nTon aventure Solo Leveling commence...\n\n🔹 Stats initiales:\n" + showStats() + "\n";
    api.sendMessage(intro,event.threadID,()=>showMenu());
  }
};
