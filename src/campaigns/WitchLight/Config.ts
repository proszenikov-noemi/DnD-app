import { lazy } from 'react';

// Player oldalak
const WitchlightPlayerHomePage = lazy(() => import('./player/PlayerHomePage'));
const WitchlightCharacterSheetPage = lazy(() => import('./player/CharacterSheet/CharacterSheetPage'));
const WitchlightCombatPage = lazy(() => import('./player/Combat/CombatPage'));
const WitchlightMapPage = lazy(() => import('./player/Map/MapPage'));
const WitchlightProfilePage = lazy(() => import('./player/ProfilePage'));
const WitchlightTeamPage = lazy(() => import('./player/TeamPage'));
const WitchlightKnowledgePage = lazy(() => import('./player/KnowledgePage'));
const WitchlightLoot = lazy(() => import('./player/LootPage'));
const WitchlightRoad = lazy(() => import('./player/RoadPage'));
const WitchlightPlayerNotes = lazy(() => import('./player/NotesPage'));
const WitchlightPlayerPicture = lazy(() => import('./player/PicturePage'));
const WitchlightPlayerQuest = lazy(() => import('./player/QuestPage'));


// Közös oldalak
const WitchlightChatPage = lazy(() => import('./shared/WitchChatPage'));
const WitchlightShop = lazy(() => import('./shared/WitchShop'));
const WitchlightSchedule = lazy(() => import('./shared/WitchSchedulePage'));


// DM oldalak
const WitchlightDmDashboard = lazy(() => import('./dm/DmDashboard'));
const WitchlightMapEditorPage = lazy(() => import('./dm/DmMapEditor'));
const WitchlightStoryPage = lazy(() => import('./dm/DmStoryManager'));
const WitchlightCombatManagerPage= lazy(() => import('./dm/DmCombatControl'));
const WitchlightNpcManagementPage= lazy(() => import('./dm/DmNpcManager'));
const WitchlightInventory= lazy(() => import('./dm/DmInventory'));
const WitchlightKnowledge= lazy(() => import('./dm/DmKnowledgePage'));
const WitchlightPicture= lazy(() => import('./dm/DmPicture'));
const WitchlightTeam= lazy(() => import('./dm/DmTeamPage'));
const WitchlightNotes= lazy(() => import('./dm/DmNotes'));
const WitchlightQuest= lazy(() => import('./dm/DmQuest'));
const WitchlightDmprofile= lazy (() => import('./dm/DmProfile'));


export const witchlightRoutes = [
    // Player oldalak
    { path: '/witchlight-player-home', component: WitchlightPlayerHomePage, role: 'user', label: 'Kezdőlap' },
    { path: '/witchlight-player-character', component: WitchlightCharacterSheetPage, role: 'user', label: 'Karakterlap' },
    { path: '/witchlight-combat', component: WitchlightCombatPage, role: 'user', label: 'Harc' },
    { path: '/witchlight-player-map', component: WitchlightMapPage, role: 'user', label: 'Térkép' },
    {
       label: 'Kampányom',
       role: 'user',
       submenu: [
           { path: '/witchlight-player-loot', component: WitchlightLoot, role: 'user', label: 'Zsákmányok' },
           { path: '/witchlight-player-road', component: WitchlightRoad, role: 'user', label: 'Történet' },
           { path: '/witchlight-player-notes', component: WitchlightPlayerNotes, role: 'user', label: 'Jegyzetek'  },
           { path: '/witchlight-player-quest', component: WitchlightPlayerQuest, role: 'user', label: 'Küldetések' },
       ]
    },
    { path: '/witchlight-player-profile', component: WitchlightProfilePage, role: 'user', label: 'Profil' },
    { path: '/witchlight-player-team', component: WitchlightTeamPage, role: 'user', label: 'Csapattagok' },
    { path: '/witchlight-player-knowledge', component: WitchlightKnowledgePage, role: 'user', label: 'Tudástér' },
    { path: '/witchlight-player-picture', component: WitchlightPlayerPicture, role: 'user', label: 'Galéria' },


    // Közös oldalak
    { path: '/witchlight-chat', component: WitchlightChatPage, role: 'both', label: 'Chat' },
    { path: '/witchlight-shop', component: WitchlightShop, role: 'both', label: 'Bolt' },
    { path: '/witchlight-schedule', component: WitchlightSchedule, role: 'both', label: 'Naptár' },

    // DM oldalak
    { path: '/witchlight-dm-home', component: WitchlightDmDashboard, role: 'dm', label: 'Kezdőlap' },
    { path: '/witchlight-dm-map', component: WitchlightMapEditorPage, role: 'dm', label: 'Térkép szerkesztő' },
    {
        label: 'Kampányom',
        role: 'dm',
        submenu: [
            {path: '/witchlight-dm-event', component: WitchlightStoryPage, role: 'dm', label: 'Történet'  },
            {path: '/witchlight-dm-npc', component: WitchlightNpcManagementPage, role: 'dm', label: 'NPC/Monsters' },
            {path: '/witchlight-dm-inventory', component: WitchlightInventory, role: 'dm', label: 'Inventory' },
            {path: '/witchlight-dm-notes', component: WitchlightNotes, role: 'dm', label: 'Jegyzetek' },
            {path: '/witchlight-dm-quest', component: WitchlightQuest, role: 'dm', label: 'Küldetések'  }
        ]
    },
    { path: '/witchlight-dm-combat', component: WitchlightCombatManagerPage, role: 'dm', label: 'Harc' },
    { path: '/witchlight-dm-knowledge', component: WitchlightKnowledge, role: 'dm', label: 'Tudástér' },
    { path: '/witchlight-dm-piture', component: WitchlightPicture, role: 'dm', label: 'Képek' },
    { path: '/witchlight-dm-team', component: WitchlightTeam, role: 'dm', label: 'Játékosaim' },
    { path: '/witchlight-dm-profile', component: WitchlightDmprofile, role: 'dm', label: 'Profil'},

];
