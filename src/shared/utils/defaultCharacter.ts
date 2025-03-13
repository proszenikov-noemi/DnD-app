export const defaultCharacter = {
    name: "Új Karakter",
    class: "Harcos",
    level: 1,
    hp: 10,
    ac: 15,
    stats: { STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10 },
    inventory: [],
    spells: [],
    skills: [  // 🔥 Alap képességek hozzáadva
        { name: "Akrobatika", modifier: 0 },
        { name: "Zsebmetszés", modifier: 0 },
        { name: "Túlélés", modifier: 0 },
        { name: "Rejtőzés", modifier: 0 },
    ],
    savingThrows: [  // 🔥 Alap mentődobások hozzáadva
        { name: "Erő", modifier: 0 },
        { name: "Bölcsesség", modifier: 0 },
        { name: "Ügyesség", modifier: 0 },
    ],
    backstory: ""
};
