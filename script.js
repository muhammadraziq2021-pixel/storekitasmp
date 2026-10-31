'use strict';

/* ------------------------------------------------------------
   Konfigurasi
   ------------------------------------------------------------ */

const WA_NUMBER = '6281270551570';
const WA_BASE = 'https://wa.me/' + WA_NUMBER;
const QRIS_URL = 'https://www.image2url.com/r2/default/images/1782458859060-3c93a54a-a932-4b97-861e-25e7d62e0a08.jpg';

/* Data pembeli hanya hidup di memori. Refresh halaman = kosong lagi. */
const buyer = { name: '', type: '' };
let pending = null;
let dialogMode = 'checkout';

const CATALOG = new Map();

const SERVER_INFO = {
  economy: {
    name: 'Economy',
    desc: 'Survival Economy Server',
    cats: ['Rank', 'Ability', 'Kit', 'Fly', 'Partikel', 'Aksesoris', 'MISC']
  },
  rpg: {
    name: 'RPG',
    desc: 'Adventure RPG Server',
    cats: ['Rank', 'Currency']
  }
};

/* ------------------------------------------------------------
   Data rank
   ------------------------------------------------------------ */

const ECO_RANKS = [
  { name: 'Nova', price: 'Rp 10.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌑 Nova</strong>', '/kit nova', '+2 Hati', 'Ability: Speed I', '11 /sethome', 'Daily Reward Tier 2'] },
  { name: 'Lunar', price: 'Rp 25.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌙 Lunar</strong>', '/kit lunar', '+5 Hati', 'Ability: Speed II', '12 /sethome', 'Sell Bonus: <strong>+20%</strong>', 'Skill Multiplier: <strong>+20%</strong>', 'Player Warp ×2', 'Daily Reward Tier 2'] },
  { name: 'Astra', price: 'Rp 35.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌠 Astra</strong>', '/kit astra', '+7 Hati', 'Ability: Speed II / Jump Boost I', '15 /sethome', 'Sell Bonus: <strong>+30%</strong>', 'Skill Multiplier: <strong>+30%</strong>', 'Fly v1 ✈️', 'Player Warp ×2', 'Daily Reward Tier 2'] },
  { name: 'Solar', price: 'Rp 50.000', tier: 'core', benefits: ['Title Exclusive: <strong>☀️ Solar</strong>', '/kit solar', '+10 Hati', 'Ability: Speed II / Jump Boost II', '20 /sethome', 'Sell Bonus: <strong>+40%</strong>', 'Skill Multiplier: <strong>+40%</strong>', 'Fly v1 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Athena', price: 'Rp 75.000', tier: 'core', benefits: ['Title Exclusive: <strong>🛡️ Athena</strong>', '/kit athena', '+15 Hati', 'Ability: Speed III / Jump Boost II', '25 /sethome', 'Sell Bonus: <strong>+40%</strong>', 'Skill Multiplier: <strong>+40%</strong>', 'Fly v1 ✈️', 'Portable: /enderchest, /workbench', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Stellar', price: 'Rp 100.000', tier: 'core', benefits: ['Title Exclusive: <strong>⭐ Stellar</strong>', '/kit stellar', '+20 Hati', 'Ability: Speed II / Jump Boost II', '30 /sethome', 'Sell Bonus: <strong>+50%</strong>', 'Skill Multiplier: <strong>+50%</strong>', 'Skill: 🔥 Inferno', '3 Slot Backpack', 'Portable: /enderchest, /workbench, /anvil', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Nexus', price: 'Rp 150.000', tier: 'core', benefits: ['Title Exclusive: <strong>🔗 Nexus</strong>', '/kit nexus', '+25 Hati', 'Ability: Speed III / Jump Boost II', '35 /sethome', 'Sell Bonus: <strong>+50%</strong>', 'Skill Multiplier: <strong>+50%</strong>', 'Skill: 🔥 Inferno', '5 Slot Backpack', 'Portable: /enderchest, /workbench, /anvil, /stonecutter', 'Special Command: /feed', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Nebula', price: 'Rp 200.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌌 Nebula</strong>', '/kit nebula', '+30 Hati', 'Ability: Speed III / Jump Boost III', '40 /sethome', 'Sell Bonus: <strong>+60%</strong>', 'Skill Multiplier: <strong>+60%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift', '8 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Gargantua', price: 'Rp 250.000', tier: 'core', benefits: ['Title Exclusive: <strong>🕳️ Gargantua</strong>', '/kit gargantua', '+35 Hati', 'Ability: Speed III / Jump Boost III / Night Vision', '45 /sethome', 'Sell Bonus: <strong>+65%</strong>', 'Skill Multiplier: <strong>+65%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift', '10 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 3'] },
  { name: 'Cosmic', price: 'Rp 300.000', tier: 'peak', benefits: ['Title Exclusive: <strong>✨ Cosmic</strong>', '/kit cosmic', '+40 Hati', 'Ability: Speed III / Jump Boost III / Night Vision / Haste I', '50 /sethome', 'Sell Bonus: <strong>+70%</strong>', 'Skill Multiplier: <strong>+70%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal', '15 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 3'] },
  { name: 'Celestial', price: 'Rp 400.000', tier: 'peak', benefits: ['Title Exclusive: <strong>🌟 Celestial</strong>', '/kit celestial', '+50 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+80%</strong>', 'Skill Multiplier: <strong>+80%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 1 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '20 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 3'] },
  { name: 'Quasar', price: 'Rp 600.000', tier: 'peak', benefits: ['Title Exclusive: <strong>💫 Quasar</strong>', '/kit quasar', '+60 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Strength I / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+90%</strong>', 'Skill Multiplier: <strong>+90%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 2 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '30 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair, /glow, /colorpicker, emojipicker', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 4'] },
  { name: 'Empyrean', price: 'Rp 800.000', tier: 'peak', inverted: true, benefits: ['Title Exclusive: <strong>👑 Empyrean</strong>', '/kit empyrean', '+70 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Strength II / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+120%</strong>', 'Skill Multiplier: <strong>+120%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 3 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '50 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair, /glow, /colorpicker, emojipicker', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 4'] }
];

const RPG_RANKS = [
  { name: 'Nova', old: 'Rp 10.000', price: 'Rp 8.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌑 Nova</strong>', '/kit nova', 'Auction House: 5 Slots', 'Max Sethome: 5', 'Daily Reward Tier 2'] },
  { name: 'Lunar', old: 'Rp 25.000', price: 'Rp 20.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌙 Lunar</strong>', '/kit lunar', 'Auction House: 8 Slots', 'Max Sethome: 8', 'Skill Multiplier: <strong>+20%</strong>', 'Sell Multiplier: <strong>+20%</strong>', 'Daily Reward Tier 2'] },
  { name: 'Astra', old: 'Rp 35.000', price: 'Rp 28.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌠 Astra</strong>', '/kit astra', 'Auction House: 10 Slots', 'Max Sethome: 10', 'Skill Multiplier: <strong>+30%</strong>', 'Sell Multiplier: <strong>+30%</strong>', 'Portable: /stonecutter', 'Daily Reward Tier 2'] },
  { name: 'Solar', old: 'Rp 50.000', price: 'Rp 40.000', tier: 'core', benefits: ['Title Exclusive: <strong>☀️ Solar</strong>', '/kit solar', 'Auction House: 15 Slots', 'Max Sethome: 15', 'Skill Multiplier: <strong>+40%</strong>', 'Sell Multiplier: <strong>+40%</strong>', 'Portable: /stonecutter, /enderchest, /anvil', 'Daily Reward Tier 2'] },
  { name: 'Athena', old: 'Rp 75.000', price: 'Rp 60.000', tier: 'core', benefits: ['Title Exclusive: <strong>🛡️ Athena</strong>', '/kit athena', 'Auction House: 18 Slots', 'Max Sethome: 18', 'Skill Multiplier: <strong>+40%</strong>', 'Sell Multiplier: <strong>+40%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench', 'Daily Reward Tier 2'] },
  { name: 'Stellar', old: 'Rp 100.000', price: 'Rp 80.000', tier: 'core', benefits: ['Title Exclusive: <strong>⭐ Stellar</strong>', '/kit stellar', 'Auction House: 20 Slots', 'Max Sethome: 20', 'Skill Multiplier: <strong>+50%</strong>', 'Sell Multiplier: <strong>+50%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Daily Reward Tier 2'] },
  { name: 'Nexus', old: 'Rp 150.000', price: 'Rp 120.000', tier: 'core', benefits: ['Title Exclusive: <strong>🔗 Nexus</strong>', '/kit nexus', 'Auction House: 25 Slots', 'Max Sethome: 25', 'Skill Multiplier: <strong>+50%</strong>', 'Sell Multiplier: <strong>+50%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed', 'Daily Reward Tier 2'] },
  { name: 'Nebula', old: 'Rp 200.000', price: 'Rp 160.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌌 Nebula</strong>', '/kit nebula', 'Auction House: 30 Slots', 'Max Sethome: 30', 'Skill Multiplier: <strong>+60%</strong>', 'Sell Multiplier: <strong>+60%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed', 'Daily Reward Tier 2'] },
  { name: 'Gargantua', old: 'Rp 250.000', price: 'Rp 200.000', tier: 'core', benefits: ['Title Exclusive: <strong>🕳️ Gargantua</strong>', '/kit gargantua', 'Auction House: 35 Slots', 'Max Sethome: 35', 'Skill Multiplier: <strong>+65%</strong>', 'Sell Multiplier: <strong>+65%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed', 'Daily Reward Tier 3'] },
  { name: 'Cosmic', old: 'Rp 300.000', price: 'Rp 240.000', tier: 'peak', benefits: ['Title Exclusive: <strong>✨ Cosmic</strong>', '/kit cosmic', 'Auction House: 40 Slots', 'Max Sethome: 40', 'Skill Multiplier: <strong>+70%</strong>', 'Sell Multiplier: <strong>+70%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime', 'Broadcast Announcement', 'Daily Reward Tier 3'] },
  { name: 'Celestial', old: 'Rp 400.000', price: 'Rp 320.000', tier: 'peak', benefits: ['Title Exclusive: <strong>🌟 Celestial</strong>', '/kit celestial', 'Auction House: 50 Slots', 'Max Sethome: 50', 'Skill Multiplier: <strong>+80%</strong>', 'Sell Multiplier: <strong>+80%</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick', 'Broadcast Announcement', 'Daily Reward Tier 3'] },
  { name: 'Quasar', old: 'Rp 600.000', price: 'Rp 480.000', tier: 'peak', benefits: ['Title Exclusive: <strong>💫 Quasar</strong>', '/kit quasar', 'Auction House: 50 Slots', 'Max Sethome: 80', 'Skill Multiplier: <strong>+90%</strong>', 'Sell Multiplier: <strong>+90%</strong>', 'Special Skill: <strong>❄️ Freeze</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick', 'Broadcast Announcement', 'Daily Reward Tier 4'] },
  { name: 'Emphyrean', old: 'Rp 800.000', price: 'Rp 640.000', tier: 'peak', inverted: true, benefits: ['Title Exclusive: <strong>👑 Emphyrean</strong>', '/kit emphyrean', 'Auction House: 100 Slots', 'Max Sethome: 100', 'Skill Multiplier: <strong>+120%</strong>', 'Sell Multiplier: <strong>+120%</strong>', 'Special Skill: <strong>❄️ Freeze, 🔥 Fireball, ⚡ Thunder</strong>', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair', 'Broadcast Announcement', 'Daily Reward Tier 4'] }
];

/* ------------------------------------------------------------
   Data item Economy
   ------------------------------------------------------------ */

const ABILITIES = [
  { id: 'eco-ability-haste', name: '⚡ Haste', wa: 'Haste', price: 'Rp 10.000', note: '/Level', desc: 'Kecepatan menambang naik. Makin tinggi level, makin cepat.' },
  { id: 'eco-ability-resistance', name: '🛡️ Resistance', wa: 'Resistance', price: 'Rp 25.000', note: '/Level · Maks Lv 3', desc: 'Mengurangi damage yang diterima. Cocok untuk pemain tank.' },
  { id: 'eco-ability-strength', name: '⚔️ Strength', wa: 'Strength', price: 'Rp 20.000', note: '/Level · Maks Lv 3', desc: 'Menambah damage serangan jarak dekat.' },
  { id: 'eco-ability-speed', name: '🏃 Speed', wa: 'Speed', price: 'Rp 5.000', note: '/Level', desc: 'Bergerak lebih cepat. Berguna untuk mengejar atau kabur.' },
  { id: 'eco-ability-jump', name: '🐇 Jump Boost', wa: 'Jump Boost', price: 'Rp 5.000', note: '/Level', desc: 'Lompat lebih tinggi. Membantu melewati terrain sulit.' },
  { id: 'eco-ability-fire', name: '🔥 Fire Resistance', wa: 'Fire Resistance', price: 'Rp 10.000', note: 'Flat', desc: 'Kebal api dan lava. Permanen, tanpa potion.' },
  { id: 'eco-ability-water', name: '🌊 Water Breathing', wa: 'Water Breathing', price: 'Rp 10.000', note: 'Flat', desc: 'Bisa bernapas tanpa batas di dalam air.' },
  { id: 'eco-ability-night', name: '🌙 Night Vision', wa: 'Night Vision', price: 'Rp 10.000', note: 'Flat', desc: 'Melihat jelas di kegelapan tanpa torch.' },
  { id: 'eco-ability-hp', name: '❤️ Tambah HP', wa: 'Tambah HP', price: 'Rp 2.500', note: '/2 HP', desc: 'Menambah 2 HP (1 hati) permanen di luar bawaan rank. Bisa dibeli berkali-kali.' }
];

const KITS = [
  { id: 'eco-kit-basic', name: '🟢 Basic Kit', wa: 'Basic Kit', price: 'Rp 20.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Iron Tool & Armor', 'Full Enchant Shield', '5 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-epic', name: '🟡 Epic Kit', wa: 'Epic Kit', price: 'Rp 30.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Diamond Tool', 'Full Enchant Vanilla Iron Armor', '10 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-legendary', name: '🟠 Legendary Kit', wa: 'Legendary Kit', price: 'Rp 40.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Diamond Tool & Armor', '30 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-aqua', name: '🔵 Aqua Kit', wa: 'Aqua Kit', price: 'Rp 60.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Netherite Tool', 'Full Enchant Vanilla Diamond Armor', '50 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-mythic', name: '🔴 Mythic Kit', wa: 'Mythic Kit', price: 'Rp 80.000', enc: 'Full Vanilla Enchant', wide: true, items: ['Full Enchant Vanilla Netherite Tool & Armor', '128 Golden Apple', '128 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-secret', name: '🟣 Secret Kit', wa: 'Secret Kit', price: 'Rp 100.000', enc: '+ Custom Enchant', wide: true, items: ['Custom Enchant + Full Enchant Vanilla Netherite Tool & Armor', '128 Golden Apple', '128 Experience Bottle', '64 Steak'] },
  { id: 'eco-kit-brainrot', name: '🧠 Brainrot Kit', wa: 'Brainrot Kit', price: 'Rp 150.000', enc: '+ Custom Enchant terlengkap', wide: true, items: ['Semua isi Secret Kit', 'Custom Enchant + Full Enchant Bow, Elytra, Mace, Trident', '128 Golden Apple', '128 Experience Bottle'] }
];

const FLY = [
  { id: 'eco-fly-v1', name: 'Fly v1', price: 'Rp 20.000', desc: 'Melayang sesaat seperti kena serangan Shulker. Tinggi dan durasinya bisa diatur.' },
  { id: 'eco-fly-v2', name: 'Fly v2', price: 'Rp 60.000', desc: 'Naik turun perlahan seperti lift udara. Stabil dan nyaman untuk building serta konstruksi besar.' },
  { id: 'eco-fly-v3', name: 'Fly v3', price: 'Rp 150.000', desc: 'Terbang bebas seperti mode kreatif, ke segala arah dengan kecepatan penuh.' }
];

const PARTICLES = [
  {
    group: 'Standar',
    items: [
      { id: 'eco-particle-normal', name: 'Normal', price: 'Rp 50.000', desc: 'Partikel aktif terus di sekitar tubuh.' },
      { id: 'eco-particle-feet', name: 'Feet', price: 'Rp 25.000', desc: 'Partikel muncul di kaki setiap langkah. Terlihat natural di tanah, pasir, atau salju.' },
      { id: 'eco-particle-move', name: 'Move', price: 'Rp 30.000', desc: 'Jejak yang mengikuti langkahmu. Sederhana, tapi terlihat jelas saat berjalan.' },
      { id: 'eco-particle-trail', name: 'Trail', price: 'Rp 40.000', desc: 'Jejak panjang di belakang pemain saat berlari. Lebih dramatis dari Move, cocok untuk PvP atau parkour.' }
    ]
  },
  {
    group: 'Premium',
    items: [
      { id: 'eco-particle-halo', name: 'Halo', price: 'Rp 60.000', desc: 'Lingkaran partikel di atas kepala. Terlihat dari jauh dan memberi kesan elite di keramaian.' },
      { id: 'eco-particle-overhead', name: 'Overhead', price: 'Rp 65.000', desc: 'Partikel seperti mahkota di atas kepala. Statis, tapi selalu terlihat oleh pemain di sekitar.' },
      { id: 'eco-particle-orbit', name: 'Orbit', price: 'Rp 70.000', desc: 'Partikel berputar mengelilingi badan seperti planet. Pilihan menengah yang cukup mencolok.' },
      { id: 'eco-particle-spin', name: 'Spin', price: 'Rp 75.000', desc: 'Partikel berputar cepat mengelilingi pemain. Lebih intens dari Orbit.' },
      { id: 'eco-particle-spiral', name: 'Spiral', price: 'Rp 80.000', desc: 'Partikel berputar spiral ke atas dan ke bawah. Artistik dan tidak pasaran.' },
      { id: 'eco-particle-rings', name: 'Rings', price: 'Rp 90.000', desc: 'Cincin partikel horizontal yang berputar di sekitar tubuh, seperti shield energi.' }
    ]
  },
  {
    group: 'Sultan',
    items: [
      { id: 'eco-particle-beam', name: 'Beam', price: 'Rp 100.000', desc: 'Sinar lurus ke atas dari tubuh seperti tiang cahaya. Terlihat dari jarak jauh.' },
      { id: 'eco-particle-sphere', name: 'Sphere', price: 'Rp 100.000', desc: 'Bola partikel menyelimuti seluruh tubuh. Terlihat seperti bubble energi.' },
      { id: 'eco-particle-companion', name: 'Companion', price: 'Rp 100.000', desc: 'Partikel mengikuti seperti hewan peliharaan kecil.' },
      { id: 'eco-particle-whirlwind', name: 'Whirlwind', price: 'Rp 100.000', desc: 'Angin puyuh partikel berputar kencang di sekitar pemain. Paling ramai.' },
      { id: 'eco-particle-vortex', name: 'Vortex', price: 'Rp 100.000', desc: 'Pusaran besar di sekitar pemain. Lebih luas dari Whirlwind.' },
      { id: 'eco-particle-wings', name: 'Wings', price: 'Rp 100.000', desc: 'Sayap partikel di punggung. Terlihat jelas saat berjalan atau terbang.' }
    ]
  }
];

const ACCESSORIES = [
  { name: 'Custom Hat', desc: 'Topi yang bisa di-request sesuai permintaanmu. Terlihat oleh pemain di sekitarmu.' },
  { name: 'Wing', desc: 'Sayap eksklusif dengan desain kustom pilihanmu sendiri.' }
];

const MISC = [
  { id: 'eco-misc-vip-coin', name: 'VIP Coin', wa: 'VIP Coin', price: 'Rp 5.000 = 30.000 Coin', badge: 'ONE TIME CLAIM', desc: 'Coin in-game untuk fitur server Kita Network. Langsung masuk ke akun, tanpa masa kadaluarsa.' },
  { id: 'eco-misc-shard', name: 'Shard', wa: 'Shard', price: 'Rp 1.000 / Shard', badge: 'ONE TIME CLAIM', desc: 'Mata uang premium untuk item eksklusif dan fitur spesial di server.' },
  { id: 'eco-misc-sethome', name: 'Tambah /sethome', wa: 'Tambah /sethome', price: 'Rp 3.000 / slot', badge: 'PERMANENT', desc: 'Menambah 1 slot /sethome permanen di luar batas rank. Bisa dibeli berkali-kali.' },
  { id: 'eco-misc-role', name: 'Custom Role', wa: 'Custom Role', price: 'Rp 10.000 / role', badge: 'PERMANENT', desc: 'Role permanen dengan nama pilihanmu sendiri. Tampil beda dari pemain lain.' }
];

const RPG_CURRENCY = [
  { id: 'rpg-coin', name: 'Coin RPG', wa: 'Coin RPG', price: 'Rp 5.000 = 30.000 Coin', badge: 'ONE TIME CLAIM', desc: 'Coin in-game server RPG. Langsung masuk ke akun, tanpa masa kadaluarsa.' },
  { id: 'rpg-shard', name: 'Shard RPG', wa: 'Shard RPG', price: 'Rp 5.000 = 10 Shard', badge: 'ONE TIME CLAIM', desc: 'Mata uang premium server RPG untuk item eksklusif dan fitur spesial.' }
];

const PEB = ['angry_villager', 'ash', 'block_crumble', 'bubble_column_up', 'campfire_cosy_smoke', 'campfire_signal_smoke', 'cherry_leaves', 'composter', 'copper_fire_flame', 'crimson_spore', 'crit', 'damage_indicator', 'dolphin', 'dragon_breath', 'dripping_obsidian_tear', 'electric_spark', 'enchant', 'enchanted_hit', 'end_rod', 'entity_effect', 'explosion_emitter', 'falling_honey', 'falling_nectar', 'falling_spore_blossom', 'firefly', 'firework', 'fishing', 'glow', 'glow_squid_ink', 'gust', 'gust_emitter_large', 'gust_emitter_small', 'happy_villager', 'heart', 'infested', 'instant_effect', 'item_slime', 'item_snowball', 'landing_honey', 'landing_obsidian_tear', 'lava', 'mycelium', 'nautilus', 'note', 'ominous_spawning', 'poof', 'portal', 'raid_omen', 'scrape', 'sculk_charge', 'sculk_charge_pop', 'sculk_soul', 'shriek', 'small_gust', 'sneeze', 'snowflake', 'sonic_boom', 'soul_fire_flame', 'spore_blossom_air', 'squid_ink', 'sweep_attack', 'tinted_leaves', 'totem_of_undying', 'trial_omen', 'trial_spawner_detection', 'trial_spawner_detection_ominous', 'vault_connection', 'warped_spore', 'wax_off', 'wax_on', 'witch'];

/* ------------------------------------------------------------
   Helper
   ------------------------------------------------------------ */

const esc = (value) => String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

const slug = (value) => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/(^-|-$)/g, '');

function cleanName(raw) {
  return String(raw)
    .replace(/[\u0000-\u001F\u007F]/g, ' ')
    .replace(/[^\p{L}\p{N} ._-]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 32)
    .trim();
}

function register(items, server) {
  items.forEach((item) => {
    item.server = server;
    if (!item.label) item.label = item.wa || item.name;
    CATALOG.set(item.id, item);
  });
}

ECO_RANKS.forEach((rank) => {
  rank.id = 'eco-rank-' + slug(rank.name);
  rank.label = 'Rank ' + rank.name;
  rank.server = 'Economy';
  CATALOG.set(rank.id, rank);
});

RPG_RANKS.forEach((rank) => {
  rank.id = 'rpg-rank-' + slug(rank.name);
  rank.label = 'Rank ' + rank.name;
  rank.server = 'RPG';
  CATALOG.set(rank.id, rank);
});

ABILITIES.forEach((item) => { item.label = 'Ability ' + item.wa; item.server = 'Economy'; CATALOG.set(item.id, item); });
KITS.forEach((item) => { item.label = item.wa; item.server = 'Economy'; CATALOG.set(item.id, item); });
FLY.forEach((item) => { item.label = item.name; item.server = 'Economy'; CATALOG.set(item.id, item); });
PARTICLES.forEach((group) => {
  group.items.forEach((item) => {
    item.label = 'Partikel ' + item.name;
    item.server = 'Economy';
    CATALOG.set(item.id, item);
  });
});
MISC.forEach((item) => { item.label = item.wa; item.server = 'Economy'; CATALOG.set(item.id, item); });
register(RPG_CURRENCY, 'RPG');

/* ------------------------------------------------------------
   Render
   ------------------------------------------------------------ */

const pad2 = (num) => String(num).padStart(2, '0');

function rankMarkup(rank, index) {
  const classes = ['rank'];
  if (rank.tier === 'peak') classes.push('is-peak');
  if (rank.inverted) classes.push('is-inverted');

  return `
    <article class="${classes.join(' ')}">
      <div class="rank-top">
        <span class="idx" aria-hidden="true">${pad2(index)}</span>
        <h4 class="rank-name">${rank.name}</h4>
        <span class="rank-meta">
          <span class="tag">Permanent</span>
          ${rank.old ? '<span class="discount">-20%</span>' : ''}
        </span>
        <div class="rank-act">
          <div class="price">
            ${rank.old ? `<span class="price-old">${rank.old}</span>` : ''}
            <span class="price-now">${rank.price}</span>
          </div>
          <button type="button" class="buy" data-id="${rank.id}" aria-label="Beli Rank ${esc(rank.name)} ${rank.price}">Beli</button>
        </div>
      </div>
      <ul class="benefits">${rank.benefits.map((benefit) => `<li>${benefit}</li>`).join('')}</ul>
    </article>`;
}

function renderRankGroup(targetId, ranks, startIndex) {
  const target = document.getElementById(targetId);
  if (!target) return;
  target.innerHTML = ranks.map((rank, i) => rankMarkup(rank, startIndex + i)).join('');
}

const ecoCore = ECO_RANKS.filter((rank) => rank.tier === 'core');
const rpgCore = RPG_RANKS.filter((rank) => rank.tier === 'core');

renderRankGroup('eco-rank-core', ecoCore, 1);
renderRankGroup('eco-rank-peak', ECO_RANKS.filter((rank) => rank.tier === 'peak'), ecoCore.length + 1);
renderRankGroup('rpg-rank-core', rpgCore, 1);
renderRankGroup('rpg-rank-peak', RPG_RANKS.filter((rank) => rank.tier === 'peak'), rpgCore.length + 1);

function entryMarkup(item, options = {}) {
  const badge = options.badge ? `<span class="tag">${options.badge}</span>` : '';
  return `
    <article class="entry">
      <div class="entry-main">
        <h3 class="entry-name">${item.name}</h3>
        <p class="entry-desc">${item.desc}</p>
      </div>
      <div class="entry-act">
        ${badge}
        <span class="price-now">${item.price}${options.note ? `<span class="unit"> ${options.note}</span>` : ''}</span>
        <button type="button" class="buy" data-id="${item.id}" aria-label="Beli ${esc(item.label)} ${item.price}">Beli</button>
      </div>
    </article>`;
}

document.getElementById('eco-ability-grid').innerHTML = ABILITIES
  .map((item) => entryMarkup(item, { badge: 'Permanent', note: item.note }))
  .join('');

document.getElementById('eco-kit-grid').innerHTML = KITS.map((kit) => `
  <article class="kit${kit.wide ? ' is-wide' : ''}">
    <div class="kit-head">
      <h3 class="kit-name">${kit.name}</h3>
      <span class="tag">ONE TIME CLAIM</span>
    </div>
    <ul class="kit-items">${kit.items.map((line) => `<li>${line}</li>`).join('')}</ul>
    <p class="kit-enc">${kit.enc}</p>
    <div class="kit-foot">
      <span class="price-now">${kit.price}</span>
      <button type="button" class="buy" data-id="${kit.id}" aria-label="Beli ${esc(kit.label)} ${kit.price}">Beli</button>
    </div>
  </article>`).join('');

document.getElementById('eco-fly-body').innerHTML = FLY.map((fly) => `
  <tr>
    <th scope="row">${fly.name}</th>
    <td class="desc">${fly.desc}</td>
    <td class="col-price">${fly.price}</td>
    <td class="col-act"><button type="button" class="buy" data-id="${fly.id}" aria-label="Beli ${fly.name} ${fly.price}">Beli</button></td>
  </tr>`).join('');

document.getElementById('peb-grid').innerHTML = PEB.map((name) => `<span>${name}</span>`).join('');
document.getElementById('peb-count').textContent = PEB.length;

PARTICLES.forEach((group) => {
  const target = document.getElementById('particle-' + slug(group.group));
  if (!target) return;
  target.innerHTML = group.items.map((item) => entryMarkup(item, { badge: 'Permanent' })).join('');
});

document.getElementById('aksesoris-list').innerHTML = ACCESSORIES.map((item) => `
  <div class="soon-item">
    <h3>${item.name}</h3>
    <p>${item.desc}</p>
    <span class="tag">Segera hadir</span>
  </div>`).join('');

document.getElementById('eco-misc-list').innerHTML = MISC
  .map((item) => entryMarkup(item, { badge: item.badge }))
  .join('');

document.getElementById('rpg-currency-list').innerHTML = RPG_CURRENCY
  .map((item) => entryMarkup(item, { badge: item.badge }))
  .join('');

/* ------------------------------------------------------------
   Server switch
   ------------------------------------------------------------ */

const panes = {
  economy: document.getElementById('pane-economy'),
  rpg: document.getElementById('pane-rpg')
};
const tabs = {
  economy: document.getElementById('tab-economy'),
  rpg: document.getElementById('tab-rpg')
};
const noteName = document.getElementById('server-note-name');
const noteDesc = document.getElementById('server-note-desc');
const noteCats = document.getElementById('server-note-cats');

let activeServer = 'economy';

function setServer(server, options = {}) {
  activeServer = server === 'rpg' ? 'rpg' : 'economy';

  Object.keys(panes).forEach((key) => {
    const isActive = key === activeServer;
    panes[key].hidden = !isActive;
    tabs[key].setAttribute('aria-pressed', String(isActive));
  });

  const info = SERVER_INFO[activeServer];
  noteName.textContent = info.name;
  noteDesc.textContent = info.desc;
  noteCats.innerHTML = info.cats.map((cat) => `<li>${cat}</li>`).join('');

  const url = activeServer === 'rpg' ? '#rpg' : location.pathname + location.search;
  try {
    history.replaceState(null, '', url);
  } catch (error) {
    /* file:// di beberapa browser menolak replaceState, hash tetap berfungsi tanpa ini */
  }

  if (options.scroll) {
    const headerH = document.querySelector('.site-header').offsetHeight;
    const paneTop = panes[activeServer].getBoundingClientRect().top + window.scrollY - headerH - 12;
    if (window.scrollY > paneTop) {
      window.scrollTo({ top: Math.max(paneTop, 0), behavior: 'smooth' });
    }
  }
}

Object.keys(tabs).forEach((key) => {
  tabs[key].addEventListener('click', () => {
    if (key === activeServer) return;
    setServer(key, { scroll: true });
  });
});

/* ------------------------------------------------------------
   Form pembeli
   ------------------------------------------------------------ */

const dialog = document.getElementById('buyer-dialog');
const form = document.getElementById('buyer-form');
const nameInput = document.getElementById('buyer-name');
const typeInputs = Array.from(form.querySelectorAll('input[name="type"]'));
const errorBox = document.getElementById('buyer-error');
const itemBox = document.getElementById('buyer-item');
const submitBtn = document.getElementById('buyer-submit');
const closeBtn = document.getElementById('buyer-close');
const dialogTitle = document.getElementById('buyer-title');
const buyerValue = document.getElementById('buyer-value');
const editBtn = document.getElementById('edit-buyer');

const isComplete = () => Boolean(buyer.name && buyer.type);

function selectedType() {
  const checked = typeInputs.find((input) => input.checked);
  return checked ? checked.value : '';
}

function setError(message) {
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function clearError() {
  errorBox.textContent = '';
  errorBox.hidden = true;
  nameInput.removeAttribute('aria-invalid');
}

function openDialog(mode) {
  dialogMode = mode;
  dialogTitle.textContent = mode === 'checkout' ? 'Data pembeli' : 'Ubah data pembeli';
  submitBtn.textContent = mode === 'checkout' ? 'Lanjut ke WhatsApp' : 'Simpan';

  itemBox.hidden = mode !== 'checkout';
  if (mode === 'checkout' && pending) {
    itemBox.innerHTML = `<span><strong>${pending.label}</strong><br>Server ${pending.server}</span><span class="dlg-item-price">${pending.price}</span>`;
  }

  clearError();
  nameInput.value = buyer.name || '';
  typeInputs.forEach((input) => { input.checked = input.value === buyer.type; });

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
  document.body.classList.add('dialog-open');

  if (mode === 'checkout') {
    const missing = [];
    if (!cleanName(nameInput.value)) missing.push('nama atau gamertag');
    if (!selectedType()) missing.push('tipe Minecraft');
    if (missing.length) setError('Lengkapi dulu ' + missing.join(' dan ') + '.');
  }

  if (!cleanName(nameInput.value)) {
    nameInput.setAttribute('aria-invalid', 'true');
    nameInput.focus();
  } else if (!selectedType()) {
    typeInputs[0].focus();
  } else {
    nameInput.focus();
    nameInput.select();
  }
}

function closeDialog() {
  if (typeof dialog.close === 'function') dialog.close();
  else dialog.removeAttribute('open');
}

function updateBuyerStatus() {
  if (isComplete()) {
    buyerValue.textContent = `${buyer.name} (${buyer.type})`;
    editBtn.textContent = 'Ubah';
    editBtn.setAttribute('aria-label', 'Ubah data pembeli');
  } else {
    buyerValue.textContent = 'Belum diisi';
    editBtn.textContent = 'Isi data';
    editBtn.setAttribute('aria-label', 'Isi data pembeli');
  }
}

function buildWaLink(item) {
  const text = [
    `Halo admin, saya mau beli ${item.label} ${item.price}`,
    `Server: ${item.server}`,
    `Gamertag: ${buyer.name}`,
    `Tipe Minecraft: ${buyer.type}`,
    '',
    `QRIS: ${QRIS_URL}`
  ].join('\n');

  return `${WA_BASE}?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(url) {
  const win = window.open(url, '_blank');
  if (win) {
    win.opener = null;
  } else {
    window.location.href = url;
  }
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('button.buy');
  if (!button) return;

  const item = CATALOG.get(button.dataset.id);
  if (!item) return;

  if (isComplete()) {
    openWhatsApp(buildWaLink(item));
    return;
  }

  pending = item;
  openDialog('checkout');
});

editBtn.addEventListener('click', () => {
  pending = null;
  openDialog('edit');
});

closeBtn.addEventListener('click', closeDialog);

dialog.addEventListener('click', (event) => {
  if (event.target === dialog) closeDialog();
});

dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  clearError();
  pending = null;
  dialogMode = 'checkout';
});

nameInput.addEventListener('input', () => {
  clearError();
});

typeInputs.forEach((input) => {
  input.addEventListener('change', clearError);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const cleaned = cleanName(nameInput.value);
  const type = selectedType();
  const missing = [];
  if (!cleaned) missing.push('nama atau gamertag');
  if (!type) missing.push('tipe Minecraft');

  if (missing.length) {
    nameInput.value = cleaned;
    setError('Lengkapi dulu ' + missing.join(' dan ') + '.');
    if (!cleaned) {
      nameInput.setAttribute('aria-invalid', 'true');
      nameInput.focus();
    } else {
      typeInputs[0].focus();
    }
    return;
  }

  buyer.name = cleaned;
  buyer.type = type;
  nameInput.value = cleaned;
  buyerValue.textContent = `${buyer.name} (${buyer.type})`;

  const item = pending;
  const wasCheckout = dialogMode === 'checkout';
  pending = null;
  updateBuyerStatus();
  closeDialog();

  if (wasCheckout && item) openWhatsApp(buildWaLink(item));
});

/* ------------------------------------------------------------
   State awal
   ------------------------------------------------------------ */

updateBuyerStatus();

const initialHash = location.hash.replace('#', '');
setServer(initialHash === 'rpg' || initialHash === 'rank-rpg' || initialHash === 'banding-rpg' || initialHash === 'currency-rpg' ? 'rpg' : 'economy');

const initialTarget = document.getElementById(initialHash);
if (initialTarget) {
  requestAnimationFrame(() => initialTarget.scrollIntoView());
}
