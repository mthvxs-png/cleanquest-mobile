import type {
  BuffType,
  ChestRarity,
  CosmeticCategory,
  Difficulty,
  Reward,
  Room,
  TaskDefinition,
} from "./types";

export const TASK_REWARDS: Record<Difficulty, Reward> = {
  easy: { xp: 10, coins: 5 },
  medium: { xp: 25, coins: 12 },
  hard: { xp: 50, coins: 25 },
};

export const TASK_DURATION_RANGES: Record<Difficulty, [number, number]> = {
  easy: [5, 15],
  medium: [15, 30],
  hard: [30, 90],
};

export const EASY_MISSION_EQUIVALENT_REWARD: Reward = TASK_REWARDS.easy;

export const FIXED_TASKS: TaskDefinition[] = [
  { id: "make-bed", room: "bedroom", title: "Arrumar cama", difficulty: "easy", durationMinutes: 5 },
  { id: "store-bedroom-items", room: "bedroom", title: "Guardar objetos fora do lugar", difficulty: "easy", durationMinutes: 7 },
  { id: "tidy-pillows", room: "livingRoom", title: "Organizar almofadas e objetos", difficulty: "easy", durationMinutes: 5 },
  { id: "small-trash", room: "livingRoom", title: "Tirar lixo pequeno", difficulty: "easy", durationMinutes: 5 },
  { id: "wash-few-dishes", room: "kitchen", title: "Lavar pouca louca", difficulty: "easy", durationMinutes: 10 },
  { id: "wipe-counter", room: "kitchen", title: "Limpar bancada", difficulty: "easy", durationMinutes: 7 },
  { id: "quick-sink-clean", room: "bathroom", title: "Limpar pia rapidamente", difficulty: "easy", durationMinutes: 8 },
  { id: "bathroom-trash", room: "bathroom", title: "Trocar lixo", difficulty: "easy", durationMinutes: 5 },
  { id: "organize-desk", room: "office", title: "Organizar mesa", difficulty: "easy", durationMinutes: 8 },
  { id: "discard-papers", room: "office", title: "Descartar papeis e lixo", difficulty: "easy", durationMinutes: 5 },
  { id: "collect-balcony-items", room: "balcony", title: "Recolher objetos fora do lugar", difficulty: "easy", durationMinutes: 7 },
  { id: "light-balcony-sweep", room: "balcony", title: "Varrer superficialmente", difficulty: "easy", durationMinutes: 10 },
  { id: "collect-leaves", room: "yard", title: "Recolher folhas leves", difficulty: "easy", durationMinutes: 10 },
  { id: "separate-clothes", room: "laundry", title: "Separar roupas", difficulty: "easy", durationMinutes: 8 },
  { id: "organize-products", room: "laundry", title: "Organizar produtos", difficulty: "easy", durationMinutes: 7 },
  { id: "small-garage-items", room: "garage", title: "Organizar itens pequenos", difficulty: "easy", durationMinutes: 10 },

  { id: "bedroom-floor", room: "bedroom", title: "Varrer e passar pano", difficulty: "medium", durationMinutes: 20 },
  { id: "change-sheets", room: "bedroom", title: "Trocar roupa de cama", difficulty: "medium", durationMinutes: 15 },
  { id: "wardrobe-section", room: "bedroom", title: "Organizar uma parte do guarda-roupa", difficulty: "medium", durationMinutes: 20 },
  { id: "living-room-floor", room: "livingRoom", title: "Varrer e passar pano", difficulty: "medium", durationMinutes: 20 },
  { id: "dust-living-room", room: "livingRoom", title: "Limpar moveis e tirar po", difficulty: "medium", durationMinutes: 15 },
  { id: "full-dishes", room: "kitchen", title: "Lavar louca de refeicao completa", difficulty: "medium", durationMinutes: 20 },
  { id: "stove-clean", room: "kitchen", title: "Limpar fogao", difficulty: "medium", durationMinutes: 15 },
  { id: "simple-meal", room: "kitchen", title: "Preparar refeicao simples", difficulty: "medium", durationMinutes: 25 },
  { id: "clean-toilet", room: "bathroom", title: "Limpar vaso sanitario", difficulty: "medium", durationMinutes: 15 },
  { id: "mirror-and-sink", room: "bathroom", title: "Limpar espelho e pia detalhado", difficulty: "medium", durationMinutes: 15 },
  { id: "clean-office-setup", room: "office", title: "Limpar mesa e equipamentos", difficulty: "medium", durationMinutes: 15 },
  { id: "organize-documents", room: "office", title: "Organizar documentos", difficulty: "medium", durationMinutes: 20 },
  { id: "balcony-full-clean", room: "balcony", title: "Limpeza completa", difficulty: "medium", durationMinutes: 20 },
  { id: "yard-medium-sweep", room: "yard", title: "Varrer area media", difficulty: "medium", durationMinutes: 20 },
  { id: "water-plants", room: "yard", title: "Regar plantas", difficulty: "medium", durationMinutes: 15 },
  { id: "hang-clothes", room: "laundry", title: "Estender roupas", difficulty: "medium", durationMinutes: 15 },
  { id: "collect-clothes", room: "laundry", title: "Recolher roupas", difficulty: "medium", durationMinutes: 15 },
  { id: "sweep-garage", room: "garage", title: "Varrer garagem", difficulty: "medium", durationMinutes: 20 },

  { id: "bedroom-deep-clean", room: "bedroom", title: "Limpeza completa", difficulty: "hard", durationMinutes: 40 },
  { id: "full-wardrobe", room: "bedroom", title: "Organizar guarda-roupa inteiro", difficulty: "hard", durationMinutes: 60 },
  { id: "living-room-deep-clean", room: "livingRoom", title: "Limpeza completa", difficulty: "hard", durationMinutes: 40 },
  { id: "vacuum-rugs", room: "livingRoom", title: "Limpar tapetes e aspirar", difficulty: "hard", durationMinutes: 30 },
  { id: "kitchen-deep-clean", room: "kitchen", title: "Limpeza completa", difficulty: "hard", durationMinutes: 50 },
  { id: "full-meal", room: "kitchen", title: "Preparar refeicao completa", difficulty: "hard", durationMinutes: 60 },
  { id: "clean-fridge", room: "kitchen", title: "Limpar geladeira", difficulty: "hard", durationMinutes: 40 },
  { id: "bathroom-deep-clean", room: "bathroom", title: "Limpeza completa do banheiro", difficulty: "hard", durationMinutes: 45 },
  { id: "office-deep-clean", room: "office", title: "Limpeza completa", difficulty: "hard", durationMinutes: 30 },
  { id: "office-reset", room: "office", title: "Reorganizacao total", difficulty: "hard", durationMinutes: 40 },
  { id: "heavy-balcony-clean", room: "balcony", title: "Limpeza pesada", difficulty: "hard", durationMinutes: 30 },
  { id: "heavy-yard-clean", room: "yard", title: "Limpeza pesada", difficulty: "hard", durationMinutes: 40 },
  { id: "cut-grass", room: "yard", title: "Cortar grama", difficulty: "hard", durationMinutes: 60 },
  { id: "full-laundry-cycle", room: "laundry", title: "Lavar roupa completo", difficulty: "hard", durationMinutes: 90 },
  { id: "iron-clothes", room: "laundry", title: "Passar roupa", difficulty: "hard", durationMinutes: 60 },
  { id: "garage-deep-clean", room: "garage", title: "Limpeza completa", difficulty: "hard", durationMinutes: 40 },
  { id: "wash-car", room: "garage", title: "Lavar carro", difficulty: "hard", durationMinutes: 60 },
];

export const CHEST_COSTS: Record<ChestRarity, number> = {
  common: 50,
  uncommon: 100,
  rare: 175,
  epic: 300,
  legendary: 500,
};

export const BUFF_COSTS: Record<BuffType, number> = {
  streakShield: 120,
  doubleXp: 140,
  doubleCoins: 140,
};

export const COSMETIC_POOLS: Record<ChestRarity, Array<{ id: string; category: CosmeticCategory }>> = {
  common: [
    { id: "linen-shirt", category: "outfits" },
    { id: "straw-hat", category: "hats" },
    { id: "soft-sneakers", category: "shoes" },
  ],
  uncommon: [
    { id: "garden-pants", category: "pants" },
    { id: "mint-aura", category: "auras" },
    { id: "sunny-wallpaper", category: "backgrounds" },
  ],
  rare: [
    { id: "tabby-pet", category: "pets" },
    { id: "sky-hoodie", category: "outfits" },
    { id: "cloud-cap", category: "hats" },
  ],
  epic: [
    { id: "galaxy-aura", category: "auras" },
    { id: "velvet-boots", category: "shoes" },
    { id: "fox-pet", category: "pets" },
  ],
  legendary: [
    { id: "prince-outfit", category: "outfits" },
    { id: "phoenix-aura", category: "auras" },
    { id: "dragon-pet", category: "pets" },
  ],
};

export const ROOM_POOL: Room[] = [
  "kitchen",
  "bedroom",
  "livingRoom",
  "bathroom",
  "office",
  "balcony",
  "laundry",
  "yard",
  "garage",
  "pantry",
  "closet",
];

export const ROOM_SUBTASKS: Record<
  Room,
  Array<{ id: string; labelKey: string; difficulty: Difficulty; durationMinutes: number }>
> = {
  kitchen: [
    { id: "countertops", labelKey: "missions.subtasks.countertops", difficulty: "easy", durationMinutes: 10 },
    { id: "stove", labelKey: "missions.subtasks.stove", difficulty: "medium", durationMinutes: 20 },
    { id: "floor", labelKey: "missions.subtasks.floor", difficulty: "easy", durationMinutes: 10 },
  ],
  bedroom: [
    { id: "bed", labelKey: "missions.subtasks.bed", difficulty: "easy", durationMinutes: 8 },
    { id: "shelves", labelKey: "missions.subtasks.shelves", difficulty: "medium", durationMinutes: 18 },
    { id: "floor", labelKey: "missions.subtasks.floor", difficulty: "easy", durationMinutes: 10 },
  ],
  livingRoom: [
    { id: "sofa", labelKey: "missions.subtasks.sofa", difficulty: "easy", durationMinutes: 10 },
    { id: "table", labelKey: "missions.subtasks.table", difficulty: "easy", durationMinutes: 8 },
    { id: "vacuum", labelKey: "missions.subtasks.vacuum", difficulty: "medium", durationMinutes: 20 },
  ],
  bathroom: [
    { id: "sink", labelKey: "missions.subtasks.sink", difficulty: "easy", durationMinutes: 10 },
    { id: "toilet", labelKey: "missions.subtasks.toilet", difficulty: "medium", durationMinutes: 20 },
    { id: "shower", labelKey: "missions.subtasks.shower", difficulty: "medium", durationMinutes: 25 },
  ],
  office: [
    { id: "desk", labelKey: "missions.subtasks.desk", difficulty: "easy", durationMinutes: 10 },
    { id: "drawers", labelKey: "missions.subtasks.drawers", difficulty: "medium", durationMinutes: 18 },
    { id: "cables", labelKey: "missions.subtasks.cables", difficulty: "easy", durationMinutes: 8 },
  ],
  balcony: [
    { id: "plants", labelKey: "missions.subtasks.plants", difficulty: "easy", durationMinutes: 10 },
    { id: "rail", labelKey: "missions.subtasks.rail", difficulty: "easy", durationMinutes: 8 },
    { id: "floor", labelKey: "missions.subtasks.floor", difficulty: "medium", durationMinutes: 15 },
  ],
  laundry: [
    { id: "sort", labelKey: "missions.subtasks.sort", difficulty: "easy", durationMinutes: 10 },
    { id: "machines", labelKey: "missions.subtasks.machines", difficulty: "medium", durationMinutes: 18 },
    { id: "shelves", labelKey: "missions.subtasks.shelves", difficulty: "easy", durationMinutes: 8 },
  ],
  yard: [
    { id: "sweep", labelKey: "missions.subtasks.sweep", difficulty: "medium", durationMinutes: 20 },
    { id: "plants", labelKey: "missions.subtasks.plants", difficulty: "medium", durationMinutes: 18 },
    { id: "trash", labelKey: "missions.subtasks.trash", difficulty: "easy", durationMinutes: 10 },
  ],
  garage: [
    { id: "tools", labelKey: "missions.subtasks.tools", difficulty: "medium", durationMinutes: 20 },
    { id: "boxes", labelKey: "missions.subtasks.boxes", difficulty: "medium", durationMinutes: 20 },
    { id: "floor", labelKey: "missions.subtasks.floor", difficulty: "easy", durationMinutes: 10 },
  ],
  pantry: [
    { id: "shelves", labelKey: "missions.subtasks.shelves", difficulty: "easy", durationMinutes: 10 },
    { id: "expired", labelKey: "missions.subtasks.expired", difficulty: "medium", durationMinutes: 15 },
    { id: "inventory", labelKey: "missions.subtasks.inventory", difficulty: "easy", durationMinutes: 10 },
  ],
  closet: [
    { id: "fold", labelKey: "missions.subtasks.fold", difficulty: "easy", durationMinutes: 10 },
    { id: "separate", labelKey: "missions.subtasks.separate", difficulty: "medium", durationMinutes: 15 },
    { id: "dust", labelKey: "missions.subtasks.dust", difficulty: "easy", durationMinutes: 8 },
  ],
};
