import { lazy } from 'react';

// Player oldalak
const IcespirePlayerHomePage = lazy(() => import('./player/PlayerHomePage'));
const IcespireCharacterSheetPage = lazy(() => import('./player/CharacterSheet/CharacterSheetPage'));
const IcespireCombatPage = lazy(() => import('./player/Combat/CombatPage'));
const IcespireMapPage = lazy(() => import('./player/Map/MapPage'));
const IcespireProfilePage = lazy(() => import('./player/ProfilePage'));
const IcespireTeamPage = lazy(() => import('./player/TeamPage'));
const IcespireKnowledgePage = lazy(() => import('./player/KnowledgePage'));
const IcespireLoot = lazy(() => import('./player/LootPage'));
const IcespireRoad = lazy(() => import('./player/RoadPage'));
const IcespirePlayerNotes = lazy(() => import('./player/NotesPage'));
const IcespirePlayerPicture = lazy(() => import('./player/PicturePage'));
const IcespirePlayerQuest = lazy(() => import('./player/QuestPage'));

// Közös oldalak
const IcespireChatPage = lazy(() => import('./shared/IceChatPage'));
const IcespireShop = lazy(() => import('./shared/IceShop'));
const IcespireSchedule = lazy(() => import('./shared/IceSchedulePage'));

// DM oldalak
const IcespireDmDashboard = lazy(() => import('./dm/DmDashboard'));
const IcespireMapEditorPage = lazy(() => import('./dm/DmMapEditor'));
const IcespireStoryPage = lazy(() => import('./dm/DmStoryManager'));
const IcespireCombatManagerPage = lazy(() => import('./dm/DmCombatControl'));
const IcespireNpcManagementPage = lazy(() => import('./dm/DmNpcManager'));
const IcespireInventory = lazy(() => import('./dm/DmInventory'));
const IcespireKnowledge = lazy(() => import('./dm/DmKnowledgePage'));
const IcespirePicture = lazy(() => import('./dm/DmPicture'));
const IcespireTeam = lazy(() => import('./dm/DmTeamPage'));
const IcespireNotes = lazy(() => import('./dm/DmNotes'));
const IcespireQuest = lazy(() => import('./dm/DmQuest'));
const IcespireDmProfile = lazy(() => import('./dm/DmProfile'));

export const icespireRoutes = [
    // Player oldalak
    { path: '/icespire-player-home', component: IcespirePlayerHomePage, role: 'user', label: 'Kezdőlap' },
    { path: '/icespire-player-character', component: IcespireCharacterSheetPage, role: 'user', label: 'Karakterlap' },
    { path: '/icespire-combat', component: IcespireCombatPage, role: 'user', label: 'Harc' },
    { path: '/icespire-player-map', component: IcespireMapPage, role: 'user', label: 'Térkép' },
    {
        label: 'Kampányom',
        role: 'user',
        submenu: [
            { path: '/icespire-player-loot', component: IcespireLoot, role: 'user', label: 'Zsákmányok' },
            { path: '/icespire-player-road', component: IcespireRoad, role: 'user', label: 'Történet' },
            { path: '/icespire-player-notes', component: IcespirePlayerNotes, role: 'user', label: 'Jegyzetek' },
            { path: '/icespire-player-quest', component: IcespirePlayerQuest, role: 'user', label: 'Küldetések' },
        ]
    },
    { path: '/icespire-player-profile', component: IcespireProfilePage, role: 'user', label: 'Profil' },
    { path: '/icespire-player-team', component: IcespireTeamPage, role: 'user', label: 'Csapattagok' },
    { path: '/icespire-player-knowledge', component: IcespireKnowledgePage, role: 'user', label: 'Tudástér' },
    { path: '/icespire-player-picture', component: IcespirePlayerPicture, role: 'user', label: 'Galéria' },

    // Közös oldalak
    { path: '/icespire-chat', component: IcespireChatPage, role: 'both', label: 'Chat' },
    { path: '/icespire-shop', component: IcespireShop, role: 'both', label: 'Bolt' },
    { path: '/icespire-schedule', component: IcespireSchedule, role: 'both', label: 'Naptár' },

    // DM oldalak
    { path: '/icespire-dm-home', component: IcespireDmDashboard, role: 'dm', label: 'Kezdőlap' },
    { path: '/icespire-dm-map', component: IcespireMapEditorPage, role: 'dm', label: 'Térkép szerkesztő' },
    {
        label: 'Kampányom',
        role: 'dm',
        submenu: [
            { path: '/icespire-dm-event', component: IcespireStoryPage, role: 'dm', label: 'Történet' },
            { path: '/icespire-dm-npc', component: IcespireNpcManagementPage, role: 'dm', label: 'NPC/Monsters' },
            { path: '/icespire-dm-inventory', component: IcespireInventory, role: 'dm', label: 'Inventory' },
            { path: '/icespire-dm-notes', component: IcespireNotes, role: 'dm', label: 'Jegyzetek' },
            { path: '/icespire-dm-quest', component: IcespireQuest, role: 'dm', label: 'Küldetések' }
        ]
    },
    { path: '/icespire-dm-combat', component: IcespireCombatManagerPage, role: 'dm', label: 'Harc' },
    { path: '/icespire-dm-knowledge', component: IcespireKnowledge, role: 'dm', label: 'Tudástér' },
    { path: '/icespire-dm-picture', component: IcespirePicture, role: 'dm', label: 'Képek' },
    { path: '/icespire-dm-team', component: IcespireTeam, role: 'dm', label: 'Játékosaim' },
    { path: '/icespire-dm-profile', component: IcespireDmProfile, role: 'dm', label: 'Profil' }
];
