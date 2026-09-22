// Données du RP — villages, clans, trame du prologue, missions.
// Fidèles aux éléments de l'œuvre ; écriture originale, style rapport de mission.

export const STATS = [
  { k: "nin", nom: "Ninjutsu", abbr: "NIN" },
  { k: "tai", nom: "Taijutsu", abbr: "TAI" },
  { k: "gen", nom: "Genjutsu", abbr: "GEN" },
  { k: "cha", nom: "Chakra", abbr: "CHA" },
  { k: "vit", nom: "Vitesse", abbr: "VIT" },
  { k: "int", nom: "Stratégie", abbr: "INT" },
  { k: "fur", nom: "Furtivité", abbr: "FUR" },
  { k: "vol", nom: "Volonté", abbr: "VOL" }
];

export const RANGS = ["Élève", "Genin", "Chūnin", "Jōnin", "ANBU", "Jōnin d'élite", "Conseil", "Kage"];

export const VILLAGES = [
  {
    id: "konoha", nom: "Konohagakure", pays: "Pays du Feu", kage: "Hokage", jouable: true,
    bijuu: "Kurama — Kyūbi (neuf queues)",
    devise: "La Volonté du Feu",
    resume: "Village fondé par l'accord Senju–Uchiha. Doctrine de camaraderie, forte densité de clans héréditaires, mémoire des morts entretenue comme institution.",
    bonus: { nin: 1, vol: 1 },
    corps: ["Corps d'Interception", "Racine (Ne)", "ANBU", "Département de cryptographie"]
  },
  {
    id: "suna", nom: "Sunagakure", pays: "Pays du Vent", kage: "Kazekage", jouable: true,
    bijuu: "Shukaku — Ichibi (une queue)",
    devise: "Le vent efface les traces",
    resume: "Village le plus pauvre des cinq grands, dépendant des subsides du daimyō. École de marionnettes réputée, économie de l'eau, tolérance basse à l'échec.",
    bonus: { vit: 1, fur: 1 },
    corps: ["Brigade des marionnettistes", "Unité de reconnaissance des dunes", "Garde du Kazekage"]
  },
  {
    id: "kiri", nom: "Kirigakure", pays: "Pays de l'Eau", kage: "Mizukage", jouable: true,
    bijuu: "Isobu — Sanbi (trois queues) · Saiken — Rokubi (six queues)",
    devise: "Le brouillard ne rend rien",
    resume: "Surnommé le Village du Sang. Purges des lignées à kekkei genkai, tradition des Sept Épéistes, examens létaux encore dans la mémoire vive d'une génération.",
    bonus: { tai: 1, cha: 1 },
    corps: ["Sept Épéistes de la Brume", "Unité de chasse aux déserteurs", "Garde du Mizukage"]
  },
  { id: "kumo", nom: "Kumogakure", pays: "Pays de la Foudre", kage: "Raikage", jouable: false, bijuu: "Matatabi — Nibi · Gyūki — Hachibi", resume: "Doctrine de force brute, sceaux de foudre, contrôle strict des jinchūriki.", bonus: {}, corps: [] },
  { id: "iwa", nom: "Iwagakure", pays: "Pays de la Terre", kage: "Tsuchikage", jouable: false, bijuu: "Son Gokū — Yonbi · Kokuō — Gobi", resume: "Défensive, hiérarchique, rancunes longues issues de la Troisième Guerre.", bonus: {}, corps: [] },
  { id: "taki", nom: "Takigakure", pays: "Pays de la Cascade", kage: "Chef de village", jouable: false, bijuu: "Chōmei — Nanabi", resume: "Village mineur, isolé derrière ses chutes, gardien d'un arbre à chakra.", bonus: {}, corps: [] },
  { id: "ame", nom: "Amegakure", pays: "Pays de la Pluie", kage: "Chef de village", jouable: false, bijuu: "—", resume: "État tampon ravagé par les guerres des grandes puissances. Sous contrôle d'une organisation non déclarée.", bonus: {}, corps: [] },
  { id: "oto", nom: "Otogakure", pays: "Pays du Riz", kage: "Chef de village", jouable: false, bijuu: "—", resume: "Village artificiel, laboratoire déguisé en puissance militaire.", bonus: {}, corps: [] },
  { id: "kusa", nom: "Kusagakure", pays: "Pays de l'Herbe", kage: "Chef de village", jouable: false, bijuu: "—", resume: "Terrain de passage des trois grandes armées. Neutralité vendue au plus offrant.", bonus: {}, corps: [] },
  { id: "yu", nom: "Yugakure", pays: "Pays des Sources Chaudes", kage: "—", jouable: false, bijuu: "—", resume: "Village shinobi devenu station thermale. Force militaire dissoute.", bonus: {}, corps: [] }
];

export const CLANS = [
  // — Konoha
  { id: "uchiha", nom: "Uchiha", village: "konoha", trame: true, spec: "Sharingan (kekkei genkai oculaire)", tech: ["Katon · Boule de feu suprême", "Sharingan — un tomoe"], bonus: { gen: 2, nin: 1 }, contrainte: "Surveillé par le village. Réputation plafonnée tant que le clan est suspecté.", resume: "Descendants d'Indra. Œil qui copie, lit le mouvement et porte le genjutsu. Le pouvoir s'éveille dans la perte." },
  { id: "senju", nom: "Senju", village: "konoha", trame: true, spec: "Vitalité et réserve de chakra hors norme ; mokuton latent", tech: ["Suiton · Balle d'eau", "Endurance du bois"], bonus: { cha: 2, vol: 1 }, contrainte: "Attentes écrasantes : on te compare aux fondateurs à chaque échec.", resume: "Clan de la forêt, dit clan aux mille techniques. Lignée des Hokage, doctrine du village avant le sang." },
  { id: "nara", nom: "Nara", village: "konoha", trame: true, spec: "Kagemane — manipulation des ombres", tech: ["Kagemane no jutsu", "Analyse tactique"], bonus: { int: 3 }, contrainte: "Le kagemane coûte du chakra et échoue sans ombre portée.", resume: "Stratèges héréditaires, gardiens de la forêt aux cerfs et de la pharmacopée militaire." },
  { id: "hyuga", nom: "Hyūga", village: "konoha", trame: false, spec: "Byakugan ; Jūken (poing souple)", tech: ["Jūken — frappe des méridiens", "Byakugan"], bonus: { tai: 2, int: 1 }, contrainte: "Système Sōke/Bunke : ta place dans la maison est décidée à ta naissance.", resume: "Œil qui voit le réseau de chakra et le point aveugle du corps." },
  { id: "akimichi", nom: "Akimichi", village: "konoha", trame: false, spec: "Baika no jutsu — multiplication corporelle", tech: ["Baika no jutsu", "Char humain"], bonus: { cha: 2, tai: 1 }, contrainte: "Les pilules du clan brûlent la vie contre la puissance." , resume: "Force lourde de la formation Ino-Shika-Chō." },
  { id: "yamanaka", nom: "Yamanaka", village: "konoha", trame: false, spec: "Shintenshin — transfert d'esprit", tech: ["Shintenshin no jutsu", "Sondage mental"], bonus: { gen: 2, int: 1 }, contrainte: "Corps sans défense pendant le transfert.", resume: "Renseignement et interrogatoire ; troisième membre d'Ino-Shika-Chō." },
  { id: "aburame", nom: "Aburame", village: "konoha", trame: false, spec: "Kikaichū — symbiose avec des insectes dévoreurs de chakra", tech: ["Nuée de kikaichū", "Insecte traceur"], bonus: { fur: 2, int: 1 }, contrainte: "On te craint. Approche sociale difficile.", resume: "Le corps est une ruche depuis la naissance ; contrat tenu sans un mot." },
  { id: "inuzuka", nom: "Inuzuka", village: "konoha", trame: false, spec: "Combat en tandem avec un nin-ken", tech: ["Gatsūga — double croc", "Odorat augmenté"], bonus: { vit: 2, tai: 1 }, contrainte: "Instinct avant calcul : malus aux situations d'attente.", resume: "Meute avant hiérarchie. Le chien n'est pas un outil, c'est un membre du clan." },
  { id: "sarutobi", nom: "Sarutobi", village: "konoha", trame: false, spec: "Polyvalence des cinq natures ; pacte des singes", tech: ["Katon · Cendres brûlantes", "Pacte d'invocation"], bonus: { nin: 2, vol: 1 }, contrainte: "Service du village d'abord — tes choix personnels seront jugés.", resume: "Clan de professeurs et de Hokage. Volonté du Feu prise au mot." },
  { id: "uzumaki", nom: "Uzumaki", village: "konoha", trame: false, spec: "Fūinjutsu héréditaire, longévité, chakra dense", tech: ["Sceau de contention", "Chaînes de chakra (latent)"], bonus: { cha: 2, vol: 2 }, contrainte: "Uzushio est tombé : réfugié sans terre, méfiance des anciens.", resume: "Cousins des Senju, maîtres des sceaux — ceux qui savent enfermer un bijū." },
  { id: "hatake", nom: "Hatake", village: "konoha", trame: false, spec: "Chakra blanc ; lame courte de garde", tech: ["Lame blanche", "Raiton · Décharge"], bonus: { vit: 2, nin: 1 }, contrainte: "Clan réduit à presque rien : aucun appui familial.", resume: "Petit clan, grande réputation technique." },
  { id: "kurama_clan", nom: "Kurama", village: "konoha", trame: false, spec: "Genjutsu si puissant qu'il altère le réel", tech: ["Illusion incarnée"], bonus: { gen: 3 }, contrainte: "Le don est instable ; le clan enferme ceux qu'il dépasse.", resume: "Lignée d'illusionnistes surveillée par sa propre maison." },
  { id: "yuhi", nom: "Yūhi", village: "konoha", trame: false, spec: "Genjutsu de nature végétale et de perception", tech: ["Magen · Arbre captif"], bonus: { gen: 2, fur: 1 }, contrainte: "Faible constitution physique.", resume: "Spécialistes de l'illusion de terrain." },
  { id: "sansclan_konoha", nom: "Sans clan (Konoha)", village: "konoha", trame: false, spec: "Aucun héritage — aucun plafond imposé", tech: ["Trois techniques d'académie"], bonus: { vol: 2, int: 1 }, contrainte: "Rien ne t'est donné ; tout doit être gagné à l'entraînement.", resume: "Fils de civils, d'artisans, de morts de guerre. Le talent sans le nom." },

  // — Suna
  { id: "sabaku", nom: "Sabaku", village: "suna", trame: true, spec: "Contrôle du sable ; lignée porteuse du jiton (magnétisme)", tech: ["Sabaku · Vague de sable", "Armure de sable"], bonus: { nin: 2, cha: 1 }, contrainte: "Famille du Kazekage : ta vie est un instrument politique.", resume: "Maison dirigeante de Suna. Le sable obéit au sang, et le sang obéit au village." },
  { id: "akasuna", nom: "Akasuna", village: "suna", trame: false, spec: "Marionnettes de combat, poisons", tech: ["Kugutsu no jutsu", "Poison des dunes"], bonus: { int: 2, nin: 1 }, contrainte: "Dépendance à l'équipement : sans marionnette, tu es nu.", resume: "École du corps remplacé par l'artefact. Art et chirurgie confondus." },
  { id: "hoki", nom: "Hōki", village: "suna", trame: false, spec: "Fūton de précision, lecture des tempêtes", tech: ["Fūton · Lame de vent"], bonus: { vit: 2, int: 1 }, contrainte: "Clan mineur sans siège au conseil.", resume: "Éclaireurs du désert, cartographes des vents." },
  { id: "sansclan_suna", nom: "Sans clan (Suna)", village: "suna", trame: false, spec: "Aucun héritage — endurance apprise à la dure", tech: ["Trois techniques d'académie"], bonus: { vol: 2, fur: 1 }, contrainte: "Rations et eau comptées en dernier.", resume: "Les enfants des quartiers extérieurs, là où le sable entre par les murs." },

  // — Kiri
  { id: "kaguya_clan", nom: "Kaguya", village: "kiri", trame: true, spec: "Shikotsumyaku — manipulation de l'ossature (kekkei genkai)", tech: ["Danse de la fougère", "Lame d'os"], bonus: { tai: 2, cha: 1 }, contrainte: "Lignée traquée pendant les purges : ton nom est un motif d'arrestation.", resume: "Clan presque éteint. Le squelette devient arme, armure et piège." },
  { id: "yuki", nom: "Yuki", village: "kiri", trame: false, spec: "Hyōton — libération de glace (kekkei genkai)", tech: ["Hyōton · Miroirs de glace", "Suiton · Brume"], bonus: { nin: 2, gen: 1 }, contrainte: "Caché depuis les purges : révéler ta nature déclenche la chasse.", resume: "Deux natures fondues en une. La glace ne négocie pas." },
  { id: "hozuki", nom: "Hōzuki", village: "kiri", trame: false, spec: "Hydrification du corps", tech: ["Corps liquide", "Suiton · Balle-canon"], bonus: { cha: 2, vit: 1 }, contrainte: "Le raiton te déchire ; vulnérabilité connue de tous.", resume: "Chair devenue eau. Difficile à tuer, difficile à aimer." },
  { id: "terumi", nom: "Terumī", village: "kiri", trame: false, spec: "Yōton (lave) et futton (vapeur brûlante)", tech: ["Yōton · Coulée", "Futton · Nuage corrosif"], bonus: { nin: 2, vol: 1 }, contrainte: "Deux kekkei genkai : convoité par tous les camps.", resume: "Lignée rare, protégée et exploitée à la fois." },
  { id: "hoshigaki", nom: "Hoshigaki", village: "kiri", trame: false, spec: "Réserve de chakra monstrueuse, affinité aquatique, traits requins", tech: ["Suiton · Prison d'eau", "Absorption de chakra"], bonus: { cha: 3 }, contrainte: "Apparence : peur immédiate, aucune discrétion sociale.", resume: "Candidats naturels aux Sept Épéistes. Le sang dit la mer." },
  { id: "karatachi", nom: "Karatachi", village: "kiri", trame: false, spec: "Kenjutsu de la Brume, sceaux de silence", tech: ["Kenjutsu · Coupe en brume"], bonus: { tai: 1, fur: 2 }, contrainte: "Clan loyal au bureau du Mizukage — on te confie les basses œuvres.", resume: "Épées de service. Peu de gloire, beaucoup de dossiers clos." },
  { id: "chinoike", nom: "Chinoike", village: "kiri", trame: false, spec: "Ketsuryūgan — œil du dragon de sang", tech: ["Contrôle du fer sanguin", "Genjutsu du regard"], bonus: { gen: 2, vol: 1 }, contrainte: "Exilé, haï, chassé par plusieurs pays.", resume: "Lignée maudite dont l'œil retourne le sang de l'adversaire." },
  { id: "sansclan_kiri", nom: "Sans clan (Kiri)", village: "kiri", trame: false, spec: "Aucun héritage — survivant de la promotion sanglante", tech: ["Trois techniques d'académie"], bonus: { tai: 1, vol: 2 }, contrainte: "Tu n'as ni nom ni protecteur ; seulement un dossier.", resume: "Ceux que les purges ont laissés indemnes parce qu'ils n'avaient rien à purger." }
];

const T = (stat, seuil) => ({ stat, seuil });

// Nœuds du prologue. `auto` redirige, `cond` filtre un choix, `test` déclenche un jet d20.
export const NODES = {
  depart: {
    titre: "Bureau des inscriptions",
    lieu: "Académie — guichet 3",
    texte: [
      "Une salle basse, deux lampes, une file de onze enfants. L'instructeur remplit une fiche par candidat : nom, clan, affinité présumée, personne à prévenir en cas de décès.",
      "Il ne lève pas les yeux. « Nom. Clan. Et ne me fais pas répéter. »"
    ],
    choix: [
      { txt: "Poser le sceau du clan sur la fiche, bien visible.", effets: { rep: 6, moral: 2, journal: "A affiché son nom de clan dès l'inscription." }, next: "cours_kunai" },
      { txt: "Donner le nom, rien de plus. Rester une ligne parmi d'autres.", effets: { fur: 1, journal: "S'est inscrit sans se faire remarquer." }, next: "cours_kunai" },
      { txt: "Mentir sur son âge pour entrer dans la promotion supérieure.", test: T("int", 13), reussite: { effets: { int: 1, noto: 4, journal: "A falsifié son âge à l'inscription — et n'a pas été pris." }, next: "cours_kunai" }, echec: { effets: { rep: -8, journal: "Pris en flagrant mensonge au guichet." }, next: "cours_kunai" } }
    ]
  },

  cours_kunai: {
    titre: "Premier exercice",
    lieu: "Terrain d'entraînement de l'académie",
    texte: [
      "Dix cibles de bois, dix kunai, une seule consigne : ne pas réfléchir plus longtemps que le geste.",
      "L'instructeur marque les résultats au tableau. Les noms restent affichés une semaine."
    ],
    choix: [
      { txt: "Lancer vite, dans le rythme imposé.", test: T("vit", 12), reussite: { effets: { vit: 1, rep: 4, journal: "Meilleur score au lancer de la promotion." }, next: "cours_chakra" }, echec: { effets: { vol: 1, journal: "Échec public au lancer ; a recommencé jusqu'au soir." }, next: "cours_kunai_echec" } },
      { txt: "Prendre le temps de lire le vent avant chaque jet.", test: T("int", 12), reussite: { effets: { int: 1, journal: "A corrigé sa trajectoire en lisant le vent." }, next: "cours_chakra" }, echec: { effets: { int: 1, journal: "A trop analysé, trop peu lancé." }, next: "cours_kunai_echec" } },
      { txt: "Céder son tour à l'enfant qui tremble derrière soi.", effets: { rep: 3, moral: 8, journal: "A cédé son tour à un camarade paniqué." }, next: "cours_chakra" }
    ]
  },

  cours_kunai_echec: {
    titre: "Après la cloche",
    lieu: "Terrain d'entraînement — 21 h",
    texte: [
      "Le tableau est toujours là. Ton nom aussi, en bas.",
      "Personne ne surveille. Les cibles ne sont pas fatiguées."
    ],
    choix: [
      { txt: "Rester jusqu'à toucher dix fois de suite.", effets: { tai: 1, vol: 2, seances: 1, journal: "A travaillé seul jusqu'à la nuit." }, next: "cours_chakra" },
      { txt: "Effacer discrètement son nom du tableau.", test: T("fur", 12), reussite: { effets: { fur: 1, moral: -6, journal: "A effacé son propre score du tableau." }, next: "cours_chakra" }, echec: { effets: { rep: -10, journal: "Surpris en train de falsifier le tableau." }, next: "cours_chakra" } }
    ]
  },

  cours_chakra: {
    titre: "Théorie du chakra",
    lieu: "Salle 2 — cours magistral",
    texte: [
      "Énergie physique et énergie spirituelle, mélangées selon un rapport que chacun apprend à sentir avant de savoir le nommer. Cinq natures, cinq relations de dominance.",
      "L'instructeur demande : « Que se passe-t-il si on force le mélange ? » Deux mains se lèvent. La tienne compte."
    ],
    choix: [
      { txt: "Répondre : le réseau se déchire, et le corps paie la dette.", test: T("int", 11), reussite: { effets: { int: 1, cha: 1, rep: 4, journal: "A répondu juste sur la dette de chakra." }, next: "rival" }, echec: { effets: { journal: "Réponse approximative en théorie du chakra." }, next: "rival" } },
      { txt: "Ne rien dire et tester soi-même, discrètement, sous la table.", test: T("cha", 13), reussite: { effets: { cha: 2, journal: "A senti son propre flux de chakra en cours, seul." }, next: "rival" }, echec: { effets: { cha: 1, rep: -4, journal: "Malaise en cours après avoir forcé son chakra." }, next: "rival" } },
      { txt: "Demander pourquoi on enseigne la théorie avant la survie.", effets: { rep: -4, noto: 4, vol: 1, journal: "A contesté le programme devant la classe." }, next: "rival" }
    ]
  },

  rival: {
    titre: "Le meilleur élément de la promotion",
    lieu: "Cour intérieure",
    texte: [
      "Il s'appelle Enji. Il gagne tout, sans plaisir apparent, et répète que l'académie est une formalité administrative.",
      "Aujourd'hui il te barre le passage. « Combat d'entraînement. Refuse si tu veux, ça se saura aussi. »"
    ],
    choix: [
      { txt: "Accepter le combat et viser la victoire.", test: T("tai", 14), reussite: { effets: { tai: 1, rep: 8, noto: 5, flags: ["rival_battu"], journal: "A battu Enji devant la cour." }, next: "clan_gate" }, echec: { effets: { vol: 2, flags: ["rival_respect"], journal: "Perdu contre Enji, sans céder." }, next: "clan_gate" } },
      { txt: "Proposer un entraînement commun au lieu d'un duel.", effets: { rep: 5, moral: 6, flags: ["rival_allie"], seances: 1, journal: "A transformé le duel en entraînement commun avec Enji." }, next: "clan_gate" },
      { txt: "L'humilier devant témoins : parler de son père renvoyé du service.", effets: { rep: -6, moral: -12, noto: 8, flags: ["rival_ennemi"], journal: "A humilié Enji en public sur sa famille." }, next: "clan_gate" },
      { txt: "Passer sans un mot.", effets: { fur: 1, journal: "A ignoré la provocation d'Enji." }, next: "clan_gate" }
    ]
  },

  clan_gate: { auto: (s) => ({ uchiha: "clan_uchiha", nara: "clan_nara", senju: "clan_senju", sabaku: "clan_sabaku", kaguya_clan: "clan_kaguya" }[s.clan] || "clan_generic") },

  clan_uchiha: {
    titre: "Trame de clan — Uchiha",
    lieu: "Quartier Uchiha, aile est",
    texte: [
      "On t'a mené devant le stand de tir familial, celui que les aînés appellent le mur. Trois cibles, un shuriken, et une phrase qu'on répète depuis des générations : l'œil s'ouvre dans la perte, jamais dans l'exercice.",
      "Ton oncle te tend un bandeau. « Les yeux fermés. Si tu touches, c'est que tu regardais déjà autre chose que la cible. »",
      "Dehors, deux officiers du village notent qui entre et qui sort du quartier. Ils ne s'en cachent plus."
    ],
    choix: [
      { txt: "Accepter l'épreuve du bandeau.", test: T("gen", 13), reussite: { effets: { gen: 2, cha: 1, flags: ["uchiha_mur"], tech: ["Perception affûtée (pré-éveil)"], journal: "A réussi l'épreuve du mur, les yeux bandés." }, next: "village_gate" }, echec: { effets: { vol: 1, journal: "A échoué au mur ; l'oncle n'a rien commenté." }, next: "village_gate" } },
      { txt: "Interroger l'oncle sur la surveillance du village.", effets: { int: 1, moral: -8, noto: 4, flags: ["uchiha_ressentiment"], journal: "A questionné les anciens sur la surveillance de Konoha." }, next: "village_gate" },
      { txt: "Aller parler aux deux officiers, à découvert.", test: T("vol", 13), reussite: { effets: { rep: 10, moral: 6, flags: ["uchiha_loyal"], journal: "S'est présenté aux officiers chargés de surveiller son clan." }, next: "village_gate" }, echec: { effets: { rep: -6, journal: "Approche maladroite des officiers de surveillance." }, next: "village_gate" } }
    ]
  },

  clan_nara: {
    titre: "Trame de clan — Nara",
    lieu: "Forêt aux cerfs, pavillon de shōgi",
    texte: [
      "Ton grand-oncle joue seul depuis deux heures. Il pousse une pièce, tourne le plateau, répond à son propre coup.",
      "« Assieds-toi. Une partie. Si tu perds, tu m'expliques pourquoi tu as perdu. Si tu gagnes, tu m'expliques pourquoi j'ai perdu. La seconde réponse est plus difficile. »",
      "Sous le pavillon, l'ombre des poutres découpe le sol en bandes régulières. Le kagemane ne fonctionne que là où l'ombre porte."
    ],
    choix: [
      { txt: "Jouer sérieusement, en acceptant de perdre lentement.", test: T("int", 14), reussite: { effets: { int: 2, vol: 1, flags: ["nara_shogi"], tech: ["Kagemane no jutsu — maintien court"], journal: "A tenu tête au vieux Nara au shōgi." }, next: "village_gate" }, echec: { effets: { int: 1, journal: "Battu au shōgi ; a su dire pourquoi." }, next: "village_gate" } },
      { txt: "Renverser le plateau et demander à apprendre le kagemane tout de suite.", effets: { rep: -5, moral: -6, nin: 1, journal: "A exigé le kagemane avant la théorie." }, next: "village_gate" },
      { txt: "Observer les bandes d'ombre au sol au lieu du plateau.", test: T("fur", 12), reussite: { effets: { fur: 1, int: 1, tech: ["Lecture des ombres portées"], journal: "A appris à lire l'ombre avant le jutsu." }, next: "village_gate" }, echec: { effets: { journal: "Distrait pendant la leçon du pavillon." }, next: "village_gate" } }
    ]
  },

  clan_senju: {
    titre: "Trame de clan — Senju",
    lieu: "Maison Senju, salle des rouleaux",
    texte: [
      "Les portraits sont accrochés dans l'ordre : les fondateurs, les Hokage, les morts. On te fait reculer de trois pas pour que tu voies la série entière d'un coup.",
      "« Le clan ne t'apprendra pas de technique aujourd'hui. Le clan t'apprend que le village passe avant la maison. Répète-le, ou pars. »",
      "Dans la cour, une bouture de l'arbre du fondateur refuse de prendre depuis quatre ans."
    ],
    choix: [
      { txt: "Répéter la formule, et la prendre au sérieux.", effets: { vol: 2, rep: 10, moral: 8, flags: ["senju_doctrine"], journal: "A juré la primauté du village sur le clan." }, next: "village_gate" },
      { txt: "Refuser : « Un village, ce sont des gens. Pas une formule. »", effets: { vol: 1, rep: -6, noto: 5, moral: -4, flags: ["senju_dissident"], journal: "A refusé la formule de la maison Senju." }, next: "village_gate" },
      { txt: "Passer la nuit sur la bouture, à y verser du chakra.", test: T("cha", 14), reussite: { effets: { cha: 2, tech: ["Transfert de chakra vital"], flags: ["senju_bouture"], journal: "A fait reprendre la bouture du fondateur." }, next: "village_gate" }, echec: { effets: { cha: 1, vol: 1, journal: "A épuisé son chakra sur une bouture morte." }, next: "village_gate" } }
    ]
  },

  clan_sabaku: {
    titre: "Trame de clan — Sabaku",
    lieu: "Résidence du Kazekage, aile privée",
    texte: [
      "On ne te convoque pas : on te place. Devant toi, une jarre de sable fin et un conseiller qui tient les registres de la maison.",
      "« Le sable répond au sang de cette famille. Il répond mal à la peur. Montre-nous où tu en es. »",
      "Plus bas dans le bâtiment, une porte scellée. Derrière, on garde ce que le village appelle par un chiffre plutôt que par un nom."
    ],
    choix: [
      { txt: "Prendre la jarre et tenter de lever le sable.", test: T("nin", 13), reussite: { effets: { nin: 2, cha: 1, tech: ["Sabaku · Voile de sable"], flags: ["sabaku_sable"], journal: "A levé le sable devant le conseil de la maison." }, next: "village_gate" }, echec: { effets: { vol: 1, rep: -5, journal: "Le sable n'a pas répondu devant le conseil." }, next: "village_gate" } },
      { txt: "Demander ce qu'il y a derrière la porte scellée.", effets: { int: 1, noto: 5, rep: -4, flags: ["sabaku_porte"], journal: "A posé la question de la porte scellée." }, next: "village_gate" },
      { txt: "Refuser la démonstration : « Je ne suis pas un argument politique. »", effets: { vol: 2, rep: -8, moral: -5, flags: ["sabaku_refus"], journal: "A refusé de servir de démonstration à la maison du Kazekage." }, next: "village_gate" }
    ]
  },

  clan_kaguya: {
    titre: "Trame de clan — Kaguya",
    lieu: "Kirigakure, logement déclaré sous un faux nom",
    texte: [
      "Ta mère a brûlé les papiers du clan avant ta naissance. Le nom Kaguya figure encore sur trois listes officielles, toutes closes par la mention « éteint ».",
      "Ce matin, ta main a produit un éclat d'os sous la peau de l'avant-bras. Personne ne l'a vu. Pour l'instant.",
      "L'académie fait passer une visite médicale dans quatre jours."
    ],
    choix: [
      { txt: "Apprendre à contenir le shikotsumyaku avant la visite.", test: T("vol", 14), reussite: { effets: { vol: 2, tai: 1, flags: ["kaguya_cache"], tech: ["Contention osseuse"], journal: "A appris à masquer son kekkei genkai." }, next: "village_gate" }, echec: { effets: { tai: 1, noto: 8, flags: ["kaguya_soupcon"], journal: "Anomalie osseuse relevée par l'infirmerie." }, next: "village_gate" } },
      { txt: "Se déclarer volontairement au bureau du Mizukage.", effets: { rep: 12, moral: 6, noto: 10, flags: ["kaguya_declare"], journal: "S'est déclaré porteur d'un kekkei genkai à Kiri." }, next: "village_gate" },
      { txt: "Chercher les autres survivants du clan dans les registres clos.", test: T("int", 14), reussite: { effets: { int: 1, flags: ["kaguya_survivants"], journal: "A trouvé trace de deux Kaguya vivants." }, next: "village_gate" }, echec: { effets: { noto: 5, journal: "Consultation de registres clos signalée." }, next: "village_gate" } }
    ]
  },

  clan_generic: {
    titre: "Héritage",
    lieu: "Chez soi",
    texte: [
      "Pas de convocation, pas de cérémonie. Une pièce, un repas, et la question la plus banale du monde : est-ce que tu tiendras.",
      "Ce que ton clan sait faire, il te le montrera plus tard, ou jamais. L'académie, elle, note tout dès maintenant."
    ],
    choix: [
      { txt: "Travailler la technique familiale seul, ce soir.", effets: { seances: 2, vol: 1, journal: "S'est entraîné seul sur l'héritage familial." }, next: "village_gate" },
      { txt: "Dormir. Demain commence l'évaluation continue.", effets: { cha: 1, int: 1, journal: "A choisi le repos avant l'évaluation." }, next: "village_gate" }
    ]
  },

  village_gate: { auto: (s) => ({ konoha: "vil_konoha", suna: "vil_suna", kiri: "vil_kiri" }[s.village] || "vil_konoha") },

  vil_konoha: {
    titre: "Trame de village — Konoha",
    lieu: "Pierre du souvenir",
    texte: [
      "La pierre est noire, plate, couverte de noms gravés serré. Un instructeur y amène chaque promotion une fois, sans discours.",
      "« Ceux-là ont tenu la Volonté du Feu. La moitié d'entre vous finira ici. L'autre moitié lira les noms. Choisissez maintenant ce que vous voulez que ça veuille dire. »",
      "Un élève demande à voix haute si mourir pour le village en vaut la peine. Personne ne répond à sa place."
    ],
    choix: [
      { txt: "Répondre : « Oui, si le village protège ceux qui restent. »", effets: { rep: 8, moral: 10, vol: 1, flags: ["konoha_volonte"], journal: "A affirmé la Volonté du Feu devant la pierre." }, next: "depot" },
      { txt: "Répondre : « Non. Un village qui exige la mort de ses enfants s'est déjà perdu. »", effets: { rep: -8, moral: -10, noto: 8, vol: 2, flags: ["konoha_doute"], journal: "A contesté publiquement le sacrifice au village." }, next: "depot" },
      { txt: "Chercher le nom de ses propres morts sur la pierre.", test: T("vol", 12), reussite: { effets: { vol: 2, moral: 4, journal: "A trouvé le nom des siens sur la pierre." }, next: "depot" }, echec: { effets: { moral: -4, journal: "N'a pas trouvé le nom qu'il cherchait." }, next: "depot" } }
    ]
  },

  vil_suna: {
    titre: "Trame de village — Suna",
    lieu: "Citerne nord",
    texte: [
      "Quatre jours de tempête. La citerne nord est descendue sous le seuil de rationnement et le conseil a suspendu la distribution pour les quartiers extérieurs avant celle du secteur administratif.",
      "Ton instructeur vous met en rang devant la citerne. « Voilà votre premier vrai cours. Un village pauvre choisit qui a soif. »",
      "Deux enfants des quartiers extérieurs sont dans ta promotion. Ils n'ont pas bu depuis hier."
    ],
    choix: [
      { txt: "Donner sa ration aux deux élèves des quartiers extérieurs.", effets: { moral: 12, rep: 5, cha: -1, journal: "A donné sa ration d'eau pendant la restriction." }, next: "depot" },
      { txt: "Détourner de l'eau du secteur administratif, la nuit.", test: T("fur", 14), reussite: { effets: { fur: 2, moral: -6, noto: 8, flags: ["suna_detournement"], journal: "A détourné de l'eau pour les quartiers extérieurs." }, next: "depot" }, echec: { effets: { rep: -12, noto: 6, journal: "Pris en train de détourner l'eau de la citerne." }, next: "depot" } },
      { txt: "Rédiger une note au conseil sur l'ordre de rationnement.", test: T("int", 13), reussite: { effets: { int: 2, rep: 10, flags: ["suna_note"], journal: "Note transmise au conseil de Suna sur le rationnement." }, next: "depot" }, echec: { effets: { rep: -5, journal: "Note au conseil classée sans suite." }, next: "depot" } }
    ]
  },

  vil_kiri: {
    titre: "Trame de village — Kiri",
    lieu: "Salle des sept socles",
    texte: [
      "Sept socles de pierre, sept noms d'épées. Trois socles sont vides : les lames sont en service. Un est vide depuis douze ans : la lame a déserté avec son porteur.",
      "L'instructeur, un ancien de la génération de la promotion sanglante, ne prononce pas le mot examen. Il dit : « De mon temps, on sortait d'ici à trente sur cent. »",
      "« Le village a changé la règle. Pas les attentes. Celui qui veut un socle peut se présenter au test des épéistes. Vous avez le droit de dire non. »"
    ],
    choix: [
      { txt: "Se présenter au test des épéistes, malgré son âge.", test: T("tai", 15), reussite: { effets: { tai: 2, rep: 10, noto: 10, flags: ["kiri_candidat_epeiste"], tech: ["Kenjutsu de la Brume — base"], journal: "Retenu sur la liste des candidats aux Sept Épéistes." }, next: "depot" }, echec: { effets: { tai: 1, vol: 2, journal: "Recalé au test des épéistes ; nom conservé au dossier." }, next: "depot" } },
      { txt: "Demander le nom du déserteur et ce qu'il est devenu.", effets: { int: 1, noto: 6, rep: -4, flags: ["kiri_deserteur"], journal: "A demandé le nom du déserteur des Sept Épéistes." }, next: "depot" },
      { txt: "Dire non, à voix haute, devant la classe.", effets: { vol: 2, rep: -5, moral: 5, flags: ["kiri_refus"], journal: "A refusé publiquement la voie des épéistes." }, next: "depot" }
    ]
  },

  depot: {
    titre: "Dépôt d'armes",
    lieu: "Académie — réserve, sous-sol",
    texte: [
      "Inventaire : quarante kunai manquants, deux rouleaux de niveau C, un registre raturé. Le vol date de moins de deux jours.",
      "L'administration promet une sanction collective si rien ne remonte avant demain soir. Tu as vu quelque chose : une silhouette petite, sortie par la trappe de service."
    ],
    choix: [
      { txt: "Suivre la trace jusqu'à la trappe, discrètement.", test: T("fur", 13), reussite: { effets: { fur: 2, flags: ["depot_preuve"], journal: "A remonté la piste du vol jusqu'au coupable." }, next: "denonce" }, echec: { effets: { journal: "Piste perdue dans les couloirs du sous-sol." }, next: "denonce" } },
      { txt: "Reconstituer le vol à partir du registre raturé.", test: T("int", 13), reussite: { effets: { int: 2, flags: ["depot_preuve"], journal: "A reconstitué le vol à partir du registre." }, next: "denonce" }, echec: { effets: { int: 1, journal: "Lecture du registre non concluante." }, next: "denonce" } },
      { txt: "Ne rien faire. La sanction collective tombera sur tout le monde.", effets: { moral: -6, rep: -5, journal: "A laissé tomber la sanction collective." }, next: "denonce" }
    ]
  },

  denonce: {
    titre: "Le coupable",
    lieu: "Toit de l'aile ouest",
    texte: [
      "C'est Rin, la plus petite de la promotion. Les rouleaux sont dans son sac. Elle ne les a pas ouverts.",
      "« Ma mère est malade. Les rouleaux valent quatre mois de soins au marché noir. Je les rends si tu veux. Dis-moi juste ce que tu vas faire. »"
    ],
    choix: [
      { txt: "La dénoncer à l'administration. La règle est la règle.", effets: { rep: 12, moral: -8, flags: ["rin_denoncee"], journal: "A dénoncé Rin à l'administration." }, next: "bijuu" },
      { txt: "Couvrir Rin et remettre les rouleaux à sa place soi-même.", test: T("fur", 14), reussite: { effets: { fur: 1, moral: 12, flags: ["rin_couverte"], journal: "A couvert Rin et remis les rouleaux en place." }, next: "bijuu" }, echec: { effets: { rep: -14, moral: 6, flags: ["rin_couverte", "dossier_noir"], journal: "Pris en train de replacer les rouleaux volés ; dossier ouvert à son nom." }, next: "bijuu" } },
      { txt: "Garder les rouleaux et le silence contre son obéissance.", effets: { moral: -22, noto: 10, int: 1, flags: ["rin_chantage"], journal: "Fait chanter Rin en échange de son silence." }, next: "bijuu" },
      { txt: "Payer les soins de sa mère avec l'argent de son clan.", cond: (s) => !s.clanRef.id.startsWith("sansclan"), effets: { rep: 6, moral: 14, journal: "A payé les soins de la mère de Rin sur les fonds du clan." }, next: "bijuu" }
    ]
  },

  bijuu: {
    titre: "Le dossier scellé",
    lieu: "Périphérie du village",
    texte: [
      "Chaque grand village en garde un. Konoha compte le Kyūbi, Suna l'Ichibi, Kiri le Sanbi et le Rokubi. Une bête à queues, un sceau, un enfant pour porter les deux.",
      "On ne l'appelle pas par son nom. On dit « l'arme », ou on ne dit rien. Il vit ici, dans ce village, il a à peu près ton âge, et personne ne s'assoit à côté de lui.",
      "Ce soir, il est assis seul sur le remblai. Il t'a vu arriver."
    ],
    choix: [
      { txt: "S'asseoir à côté de lui et parler d'autre chose.", effets: { moral: 14, vol: 1, flags: ["jinchuriki_lien"], journal: "S'est assis à côté du jinchūriki du village." }, next: "entrainement" },
      { txt: "Lui demander ce que la bête lui dit, la nuit.", test: T("vol", 13), reussite: { effets: { vol: 2, cha: 1, flags: ["jinchuriki_confidence", "savoir_bijuu"], journal: "A recueilli la confidence du jinchūriki sur la voix du bijū." }, next: "entrainement" }, echec: { effets: { moral: -5, flags: ["jinchuriki_froid"], journal: "Question maladroite au jinchūriki ; il est parti." }, next: "entrainement" } },
      { txt: "Noter ses habitudes et l'emplacement du sceau. L'information a un prix.", effets: { moral: -20, noto: 14, int: 1, flags: ["jinchuriki_dossier", "savoir_bijuu"], journal: "A constitué un dossier de renseignement sur le jinchūriki." }, next: "entrainement" },
      { txt: "Faire demi-tour.", effets: { fur: 1, journal: "A évité le jinchūriki." }, next: "entrainement" }
    ]
  },

  entrainement: {
    titre: "Quatre semaines avant l'examen",
    lieu: "Terrain libre 7",
    texte: [
      "Pas d'événement, pas d'instructeur. Quatre semaines, un terrain, et ce que tu décides d'en faire. Les séances accumulées peuvent être dépensées maintenant dans l'onglet ENTRAÎNEMENT.",
      "L'examen de sortie comporte trois épreuves : maîtrise du clonage, résistance au genjutsu, combat libre. Les instructeurs ne cachent pas les seuils : ils comptent sur le fait que la plupart n'écoutent pas."
    ],
    choix: [
      { txt: "Régime complet : volume, répétition, sommeil compté.", effets: { seances: 3, cha: 1, journal: "Quatre semaines de régime d'entraînement complet." }, next: "exam_intro" },
      { txt: "Travail ciblé sur la seule épreuve qu'on redoute.", effets: { seances: 2, vol: 1, int: 1, journal: "A concentré ses quatre semaines sur une seule épreuve." }, next: "exam_intro" },
      { txt: "Prendre des missions de rang D payées au village pour financer son matériel.", effets: { seances: 1, rep: 6, fur: 1, journal: "A pris des missions de rang D avant l'examen." }, next: "exam_intro" },
      { txt: "S'entraîner avec Enji.", cond: (s) => s.flags.includes("rival_allie") || s.flags.includes("rival_respect"), effets: { seances: 3, tai: 1, rep: 4, journal: "A préparé l'examen avec Enji." }, next: "exam_intro" }
    ]
  },

  exam_intro: {
    titre: "Examen de sortie — convocation",
    lieu: "Académie — grand hall",
    texte: [
      "Trois épreuves, une note globale, pas de rattrapage avant l'année suivante. Les bandeaux frontaux sont posés sur la table, comptés à l'avance : il y en a moins que de candidats.",
      "On appelle les noms par ordre de dossier. Le tien passe en milieu de liste."
    ],
    choix: [{ txt: "Se présenter.", next: "exam_bunshin" }]
  },

  exam_bunshin: {
    titre: "Épreuve 1 — clonage",
    lieu: "Salle d'examen",
    texte: ["Trois clones tenus dix secondes. Dosage du chakra : trop peu, ils s'effondrent ; trop, ils se voient."],
    choix: [
      { txt: "Exécuter le clonage standard.", test: T("nin", 13), reussite: { effets: { nin: 1, flags: ["exam1_ok"], journal: "Épreuve de clonage réussie." }, next: "exam_genjutsu" }, echec: { effets: { vol: 1, flags: ["exam1_ko"], journal: "Épreuve de clonage manquée." }, next: "exam_genjutsu" } },
      { txt: "Compenser le dosage par la réserve brute.", test: T("cha", 13), reussite: { effets: { cha: 1, flags: ["exam1_ok"], journal: "Clonage réussi à la force de la réserve." }, next: "exam_genjutsu" }, echec: { effets: { cha: 1, flags: ["exam1_ko"], journal: "Clones dissipés par excès de chakra." }, next: "exam_genjutsu" } },
      { txt: "Substituer la technique du clan à celle du programme.", cond: (s) => !s.clanRef.id.startsWith("sansclan"), test: T("nin", 15), reussite: { effets: { nin: 2, rep: 8, noto: 5, flags: ["exam1_ok", "exam1_eclat"], journal: "A remplacé l'épreuve par une technique de clan — validée." }, next: "exam_genjutsu" }, echec: { effets: { rep: -8, flags: ["exam1_ko"], journal: "Technique de clan refusée par le jury." }, next: "exam_genjutsu" } }
    ]
  },

  exam_genjutsu: {
    titre: "Épreuve 2 — résistance au genjutsu",
    lieu: "Salle d'examen, lumière baissée",
    texte: [
      "L'examinatrice pose deux doigts sur ton front. L'illusion est courte et personnelle : elle prend ce que tu crains et le montre une fois.",
      "Il faut en sortir seul. Crier suffit à échouer."
    ],
    choix: [
      { txt: "Rompre le flux de chakra par la douleur.", test: T("vol", 13), reussite: { effets: { vol: 2, flags: ["exam2_ok"], journal: "Illusion rompue par la volonté." }, next: "exam_combat" }, echec: { effets: { moral: -5, flags: ["exam2_ko"], journal: "Est resté dans l'illusion jusqu'au bout." }, next: "exam_combat" } },
      { txt: "Analyser l'incohérence de l'illusion et la retourner.", test: T("gen", 14), reussite: { effets: { gen: 2, rep: 6, flags: ["exam2_ok", "exam2_eclat"], journal: "A retourné le genjutsu contre l'examinatrice." }, next: "exam_combat" }, echec: { effets: { gen: 1, flags: ["exam2_ko"], journal: "Analyse trop lente de l'illusion." }, next: "exam_combat" } },
      { txt: "Rester dedans volontairement et regarder jusqu'au bout.", effets: { vol: 3, moral: -8, flags: ["exam2_ok", "regard_sombre"], journal: "A traversé l'illusion sans la fuir." }, next: "exam_combat" }
    ]
  },

  exam_combat: {
    titre: "Épreuve 3 — combat libre",
    lieu: "Arène de l'académie",
    texte: [
      "Tirage au sort truqué par la logique administrative : on met les dossiers forts ensemble.",
      "En face : Enji."
    ],
    choix: [
      { txt: "Combat franc, à visage découvert.", test: T("tai", 14), reussite: { effets: { tai: 2, rep: 10, noto: 6, flags: ["exam3_ok"], journal: "A gagné le combat d'examen contre Enji." }, next: "diplome" }, echec: { effets: { vol: 2, flags: ["exam3_ko"], journal: "Battu par Enji à l'examen." }, next: "diplome" } },
      { txt: "Gagner par la ruse : terrain, angle mort, faux départ.", test: T("int", 13), reussite: { effets: { int: 2, fur: 1, flags: ["exam3_ok"], journal: "A gagné l'examen par la préparation du terrain." }, next: "diplome" }, echec: { effets: { int: 1, flags: ["exam3_ko"], journal: "Ruse éventée en combat d'examen." }, next: "diplome" } },
      { txt: "Viser une blessure qui le retirera de la liste des reçus.", effets: { moral: -25, noto: 16, rep: -10, tai: 1, flags: ["exam3_ok", "sang_academie"], journal: "A blessé Enji pour l'écarter de la liste des reçus." }, next: "diplome" },
      { txt: "Abandonner le combat pour lui laisser le dernier bandeau.", cond: (s) => s.flags.includes("rival_allie"), effets: { moral: 18, rep: 4, flags: ["exam3_ko", "don_bandeau"], journal: "A cédé le dernier bandeau à Enji." }, next: "diplome" }
    ]
  },

  diplome: {
    auto: (s) => {
      const ok = ["exam1_ok", "exam2_ok", "exam3_ok"].filter((f) => s.flags.includes(f)).length;
      if (ok === 0) return "epi_recale";
      if (s.moral <= -30) return "epi_ombre";
      if (s.rep >= 60) return "epi_loyal";
      return "epi_neutre";
    }
  },

  epi_loyal: {
    titre: "Remise des bandeaux — mention",
    lieu: "Toit de l'administration",
    texte: [
      "Ton dossier sort en tête. Le bandeau t'est remis avant l'appel général, ce qui, dans un village shinobi, est une information transmise à trois bureaux différents.",
      "On te parle déjà d'affectation : équipe de trois, jōnin instructeur, missions de rang D pendant six mois, puis la candidature à l'examen chūnin si le sensei signe.",
      "Le registre te classe désormais : GENIN. Le reste de l'échelle est affiché dans le hall : chūnin, jōnin, ANBU, jōnin d'élite, conseil, et le poste qu'un seul détient à la fois."
    ],
    choix: [{ txt: "Prendre le bandeau.", effets: { rang: 1, rep: 5, journal: "Diplômé genin avec mention." }, next: "fin_prologue" }]
  },

  epi_neutre: {
    titre: "Remise des bandeaux",
    lieu: "Cour de l'académie",
    texte: [
      "Ton nom passe dans le lot. Bandeau, numéro de dossier, signature. L'instructeur ne commente pas.",
      "C'est la manière la plus sûre de commencer : sans dette et sans attente. Le village te regardera au premier mort.",
      "Le registre te classe : GENIN."
    ],
    choix: [{ txt: "Prendre le bandeau.", effets: { rang: 1, journal: "Diplômé genin." }, next: "fin_prologue" }]
  },

  epi_ombre: {
    titre: "Remise des bandeaux — note au dossier",
    lieu: "Bureau des affectations",
    texte: [
      "Tu es reçu. On te le dit sans te regarder, et on ajoute une ligne à ton dossier que tu n'as pas le droit de lire.",
      "Un homme t'attend dehors. Pas d'insigne, pas de nom. « Ton profil intéresse des gens qui ne travaillent pas pour le bureau du Kage. Il y a une différence entre servir un village et servir un ordre. Tu la sentiras. »",
      "Il ne prononce pas de nom d'organisation. Il dit seulement que le manteau se mérite, et qu'on ne le demande jamais."
    ],
    choix: [
      { txt: "Prendre le bandeau et sa carte.", effets: { rang: 1, noto: 12, flags: ["contact_ombre"], journal: "A accepté le contact d'un recruteur sans insigne." }, next: "fin_prologue" },
      { txt: "Prendre le bandeau et signaler l'homme à l'administration.", effets: { rang: 1, rep: 14, moral: 10, journal: "A signalé le recruteur au bureau du Kage." }, next: "fin_prologue" }
    ]
  },

  epi_recale: {
    titre: "Liste des reçus — absence",
    lieu: "Panneau d'affichage",
    texte: [
      "Trois épreuves manquées. Ton nom n'est pas sur la liste. L'académie te garde un an de plus, ce qui n'est pas une sanction : c'est un délai.",
      "L'instructeur te retient. « Un an de retard sur une carrière qui en compte trente. Reviens au terrain 7 demain à six heures. »"
    ],
    choix: [{ txt: "Revenir demain.", effets: { vol: 3, seances: 4, journal: "Recalé à l'examen de sortie ; redouble." }, next: "fin_prologue" }]
  },

  fin_prologue: {
    titre: "Fin du prologue",
    lieu: "Dossier ouvert",
    texte: [
      "Le prologue s'arrête ici. Ta fiche, tes stats, ton journal et tes drapeaux de trame sont enregistrés — la suite s'y branche directement.",
      "Ce qui est déjà déterminé par tes choix : ta réputation dans le village, ton moral (qui ouvre ou ferme la voie de la trahison, du groupe criminel et du manteau rouge), ta notoriété hors des frontières, ton lien ou ton dossier sur le jinchūriki, et la trame propre à ton clan.",
      "Ce qui suit dans la campagne : les missions de rang C et B sur la carte, l'examen chūnin, la sélection jōnin, l'ANBU, la guerre, les bijū, et l'échelle jusqu'au poste de Kage. La lignée s'ouvre après le premier palier jōnin."
    ],
    choix: [
      { txt: "Consulter la carte et prendre une mission.", effets: { flags: ["prologue_fini"], journal: "Prologue terminé." }, next: "libre" },
      { txt: "Rester sur la fiche.", effets: { flags: ["prologue_fini"] }, next: "libre" }
    ]
  },

  libre: {
    titre: "Registre des affectations",
    lieu: "Bureau des missions",
    texte: [
      "Entre deux arcs, un shinobi fait ce que fait un shinobi : il prend des missions, il s'entraîne, il tient son rang.",
      "Les onglets CARTE et ENTRAÎNEMENT sont ouverts. Reviens ici quand la suite de la campagne sera branchée."
    ],
    choix: [{ txt: "Rester en service.", next: "libre" }]
  }
};

export const MISSIONS = [
  { id: "d1", rang: "D", village: "*", nom: "Escorte d'un convoi de marchands", res: "Deux jours de route, aucun incident sérieux attendu.", test: T("vol", 10), gain: { rep: 4, seances: 1 }, perte: { rep: -2 } },
  { id: "d2", rang: "D", village: "*", nom: "Récupération de documents administratifs", res: "Un greffe, trois classeurs, un employé désagréable.", test: T("int", 11), gain: { int: 1, rep: 3 }, perte: { rep: -3 } },
  { id: "d3", rang: "D", village: "*", nom: "Patrouille du périmètre nord", res: "Marche de nuit, relevé des sceaux de bornage.", test: T("fur", 11), gain: { fur: 1, seances: 1 }, perte: { rep: -2 } },
  { id: "c1", rang: "C", village: "konoha", nom: "Braconniers dans la forêt aux cerfs", res: "Trois hommes armés, territoire du clan Nara.", test: T("tai", 13), gain: { tai: 1, rep: 8 }, perte: { rep: -5, moral: -2 } },
  { id: "c2", rang: "C", village: "suna", nom: "Puits empoisonné au village de Kigiri", res: "Poison lent, probablement d'origine artisanale.", test: T("int", 13), gain: { int: 1, rep: 8 }, perte: { rep: -5 } },
  { id: "c3", rang: "C", village: "kiri", nom: "Recherche d'un déserteur dans les îles sud", res: "Un chūnin en fuite, deux semaines d'avance.", test: T("fur", 13), gain: { fur: 1, rep: 8, noto: 4 }, perte: { rep: -5 } },
  { id: "c4", rang: "C", village: "*", nom: "Interception d'un courrier chiffré", res: "Le pli ne doit pas traverser la frontière.", test: T("vit", 13), gain: { vit: 1, rep: 6, noto: 3 }, perte: { rep: -4 } },
  { id: "b1", rang: "B", village: "*", nom: "Appui à une unité en repli", res: "Front secondaire. Pertes attendues des deux côtés.", test: T("tai", 15), gain: { tai: 1, vol: 1, rep: 12, noto: 6 }, perte: { rep: -8, moral: -5 } }
];

export const ARCS = [
  { nom: "Examen chūnin", req: "Genin · réputation ≥ 30", etat: "Prochain palier" },
  { nom: "Sélection jōnin", req: "Chūnin · 20 missions de rang C", etat: "Verrouillé" },
  { nom: "Corps ANBU / Racine", req: "Jōnin · furtivité ≥ 14", etat: "Verrouillé" },
  { nom: "Voie de la trahison — groupe criminel", req: "Moral ≤ -30", etat: "Condition suivie" },
  { nom: "Recrutement — manteau rouge", req: "Moral ≤ -60 · notoriété ≥ 40", etat: "Condition suivie" },
  { nom: "Chasse aux bijū et jinchūriki", req: "Rang B · dossier ou lien jinchūriki", etat: "Condition suivie" },
  { nom: "Grande Guerre des shinobi", req: "Jōnin · arcs de village résolus", etat: "Verrouillé" },
  { nom: "Course au poste de Kage", req: "Jōnin d'élite · réputation ≥ 85", etat: "Verrouillé" },
  { nom: "Lignée — génération suivante", req: "Palier jōnin atteint", etat: "Verrouillé" }
];
