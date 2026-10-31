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

/* ------------------------------------------------------------
   Data rank
   ------------------------------------------------------------ */

const RANKS = [
  { name: 'Nova', price: 'Rp 10.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌑 Nova</strong>', '/kit nova', '+2 Hati', 'Ability: Speed I', '11 /sethome', 'Daily Reward Tier 2'] },
  { name: 'Lunar', price: 'Rp 25.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌙 Lunar</strong>', '/kit lunar', '+5 Hati', 'Ability: Speed II', '12 /sethome', 'Sell Bonus: <strong>+20%</strong>', 'Skill Multiplier: <strong>+20%</strong>', 'Player Warp ×2', 'Daily Reward Tier 2'] },
  { name: 'Astra', price: 'Rp 35.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌠 Astra</strong>', '/kit astra', '+7 Hati', 'Ability: Speed II / Jump Boost I', '15 /sethome', 'Sell Bonus: <strong>+30%</strong>', 'Skill Multiplier: <strong>+30%</strong>', 'Fly v1 ✈️', 'Player Warp ×2', 'Daily Reward Tier 2'] },
  { name: 'Solar', price: 'Rp 50.000', tier: 'core', benefits: ['Title Exclusive: <strong>☀️ Solar</strong>', '/kit solar', '+10 Hati', 'Ability: Speed II / Jump Boost II', '20 /sethome', 'Sell Bonus: <strong>+40%</strong>', 'Skill Multiplier: <strong>+40%</strong>', 'Fly v1 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Athena', price: 'Rp 75.000', tier: 'core', benefits: ['Title Exclusive: <strong>🛡️ Athena</strong>', '/kit athena', '+15 Hati', 'Ability: Speed III / Jump Boost II', '25 /sethome', 'Sell Bonus: <strong>+40%</strong>', 'Skill Multiplier: <strong>+40%</strong>', 'Fly v1 ✈️', 'Portable: /enderchest, /workbench', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Stellar', price: 'Rp 100.000', tier: 'core', benefits: ['Title Exclusive: <strong>⭐ Stellar</strong>', '/kit stellar', '+20 Hati', 'Ability: Speed II / Jump Boost II', '30 /sethome', 'Sell Bonus: <strong>+50%</strong>', 'Skill Multiplier: <strong>+50%</strong>', 'Skill: 🔥 Inferno', '3 Slot Backpack', 'Portable: /enderchest, /workbench, /anvil', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Nexus', price: 'Rp 150.000', tier: 'core', benefits: ['Title Exclusive: <strong>🔗 Nexus</strong>', '/kit nexus', '+25 Hati', 'Ability: Speed III / Jump Boost II', '35 /sethome', 'Sell Bonus: <strong>+50%</strong>', 'Skill Multiplier: <strong>+50%</strong>', 'Skill: 🔥 Inferno', '5 Slot Backpack', 'Portable: /enderchest, /workbench, /anvil, /stonecutter', 'Special Command: /feed', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Nebula', price: 'Rp 200.000', tier: 'core', benefits: ['Title Exclusive: <strong>🌌 Nebula</strong>', '/kit nebula', '+30 Hati', 'Ability: Speed III / Jump Boost III', '40 /sethome', 'Sell Bonus: <strong>+60%</strong>', 'Skill Multiplier: <strong>+60%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift', '8 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal', 'Fly v2 ✈️', 'Player Warp ×5', 'Daily Reward Tier 2'] },
  { name: 'Gargantua', price: 'Rp 250.000', tier: 'core', benefits: ['Title Exclusive: <strong>🕳️ Gargantua</strong>', '/kit gargantua', '+35 Hati', 'Ability: Speed III / Jump Boost III / Night Vision', '45 /sethome', 'Sell Bonus: <strong>+65%</strong>', 'Skill Multiplier: <strong>+65%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift', '10 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal', 'Fly v3 ✈️', 'Player Warp ×5', 'Daily Reward Tier 3'] },
  { name: 'Cosmic', price: 'Rp 300.000', tier: 'peak', benefits: ['Title Exclusive: <strong>✨ Cosmic</strong>', '/kit cosmic', '+40 Hati', 'Ability: Speed III / Jump Boost III / Night Vision / Haste I', '50 /sethome', 'Sell Bonus: <strong>+70%</strong>', 'Skill Multiplier: <strong>+70%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal', '15 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 3'] },
  { name: 'Celestial', price: 'Rp 400.000', tier: 'peak', benefits: ['Title Exclusive: <strong>🌟 Celestial</strong>', '/kit celestial', '+50 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+80%</strong>', 'Skill Multiplier: <strong>+80%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 1 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '20 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 3'] },
  { name: 'Quasar', price: 'Rp 600.000', tier: 'peak', benefits: ['Title Exclusive: <strong>💫 Quasar</strong>', '/kit quasar', '+60 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Strength I / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+90%</strong>', 'Skill Multiplier: <strong>+90%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 2 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '30 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair, /glow, /colorpicker, emojipicker', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 4'] },
  { name: 'Empyrean', price: 'Rp 800.000', tier: 'peak', inverted: true, benefits: ['Title Exclusive: <strong>👑 Empyrean</strong>', '/kit empyrean', '+70 Hati', 'Ability: Speed III / Jump Boost III / Haste II / Strength II / Night Vision', '90 /sethome', 'Sell Bonus: <strong>+120%</strong>', 'Skill Multiplier: <strong>+120%</strong>', 'Skill: 🔥 Inferno, 📏 Size Shift, 🩸 Lifesteal, ⚡ Lightning Punch', '<strong>Bebas Pilih 3 Partikel</strong> ✨', '<strong>Claim 1 Kit Bebas</strong> (one time claim)', '50 Slot Backpack', 'Portable: /stonecutter, /enderchest, /anvil, /workbench, /grindstone', 'Special Command: /feed, /heal, /ptime, /pweather, /nick, /repair, /glow, /colorpicker, emojipicker', 'Fly v3 ✈️', 'Player Warp ×10', 'Daily Reward Tier 4'] }
];

/* ------------------------------------------------------------
   Data item
   ------------------------------------------------------------ */

const ABILITIES = [
  { id: 'ability-haste', name: '⚡ Haste', wa: 'Haste', price: 'Rp 10.000', note: '/Level', desc: 'Kecepatan menambang naik. Makin tinggi level, makin cepat.' },
  { id: 'ability-resistance', name: '🛡️ Resistance', wa: 'Resistance', price: 'Rp 25.000', note: '/Level · Maks Lv 3', desc: 'Mengurangi damage yang diterima. Cocok untuk pemain tank.' },
  { id: 'ability-strength', name: '⚔️ Strength', wa: 'Strength', price: 'Rp 20.000', note: '/Level · Maks Lv 3', desc: 'Menambah damage serangan jarak dekat.' },
  { id: 'ability-speed', name: '🏃 Speed', wa: 'Speed', price: 'Rp 5.000', note: '/Level', desc: 'Bergerak lebih cepat. Berguna untuk mengejar atau kabur.' },
  { id: 'ability-jump', name: '🐇 Jump Boost', wa: 'Jump Boost', price: 'Rp 5.000', note: '/Level', desc: 'Lompat lebih tinggi. Membantu melewati terrain sulit.' },
  { id: 'ability-fire', name: '🔥 Fire Resistance', wa: 'Fire Resistance', price: 'Rp 10.000', note: 'Flat', desc: 'Kebal api dan lava. Permanen, tanpa potion.' },
  { id: 'ability-water', name: '🌊 Water Breathing', wa: 'Water Breathing', price: 'Rp 10.000', note: 'Flat', desc: 'Bisa bernapas tanpa batas di dalam air.' },
  { id: 'ability-night', name: '🌙 Night Vision', wa: 'Night Vision', price: 'Rp 10.000', note: 'Flat', desc: 'Melihat jelas di kegelapan tanpa torch.' },
  { id: 'ability-hp', name: '❤️ Tambah HP', wa: 'Tambah HP', price: 'Rp 2.500', note: '/2 HP', desc: 'Menambah 2 HP (1 hati) permanen di luar bawaan rank. Bisa dibeli berkali-kali.' }
];

const KITS = [
  { id: 'kit-basic', name: '🟢 Basic Kit', wa: 'Basic Kit', price: 'Rp 20.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Iron Tool & Armor', 'Full Enchant Shield', '5 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'kit-epic', name: '🟡 Epic Kit', wa: 'Epic Kit', price: 'Rp 30.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Diamond Tool', 'Full Enchant Vanilla Iron Armor', '10 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'kit-legendary', name: '🟠 Legendary Kit', wa: 'Legendary Kit', price: 'Rp 40.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Diamond Tool & Armor', '30 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'kit-aqua', name: '🔵 Aqua Kit', wa: 'Aqua Kit', price: 'Rp 60.000', enc: 'Full Vanilla Enchant', items: ['Full Enchant Vanilla Netherite Tool', 'Full Enchant Vanilla Diamond Armor', '50 Golden Apple', '64 Experience Bottle', '64 Steak'] },
  { id: 'kit-mythic', name: '🔴 Mythic Kit', wa: 'Mythic Kit', price: 'Rp 80.000', enc: 'Full Vanilla Enchant', wide: true, items: ['Full Enchant Vanilla Netherite Tool & Armor', '128 Golden Apple', '128 Experience Bottle', '64 Steak'] },
  { id: 'kit-secret', name: '🟣 Secret Kit', wa: 'Secret Kit', price: 'Rp 100.000', enc: '+ Custom Enchant', wide: true, items: ['Custom Enchant + Full Enchant Vanilla Netherite Tool & Armor', '128 Golden Apple', '128 Experience Bottle', '64 Steak'] },
  { id: 'kit-brainrot', name: '🧠 Brainrot Kit', wa: 'Brainrot Kit', price: 'Rp 150.000', enc: '+ Custom Enchant terlengkap', wide: true, items: ['Semua isi Secret Kit', 'Custom Enchant + Full Enchant Bow, Elytra, Mace, Trident', '128 Golden Apple', '128 Experience Bottle'] }
];

const FLY = [
  { id: 'fly-v1', name: 'Fly v1', price: 'Rp 20.000', desc: 'Melayang sesaat seperti kena serangan Shulker. Tinggi dan durasinya bisa diatur.' },
  { id: 'fly-v2', name: 'Fly v2', price: 'Rp 60.000', desc: 'Naik turun perlahan seperti lift udara. Stabil dan nyaman untuk building serta konstruksi besar.' },
  { id: 'fly-v3', name: 'Fly v3', price: 'Rp 150.000', desc: 'Terbang bebas seperti mode kreatif, ke segala arah dengan kecepatan penuh.' }
];

const PARTICLES = [
  {
    group: 'Standar',
    items: [
      { id: 'particle-normal', name: 'Normal', price: 'Rp 50.000', desc: 'Partikel aktif terus di sekitar tubuh.' },
      { id: 'particle-feet', name: 'Feet', price: 'Rp 25.000', desc: 'Partikel muncul di kaki setiap langkah. Terlihat natural di tanah, pasir, atau salju.' },
      { id: 'particle-move', name: 'Move', price: 'Rp 30.000', desc: 'Jejak yang mengikuti langkahmu. Sederhana, tapi terlihat jelas saat berjalan.' },
      { id: 'particle-trail', name: 'Trail', price: 'Rp 40.000', desc: 'Jejak panjang di belakang pemain saat berlari. Lebih dramatis dari Move, cocok untuk PvP atau parkour.' }
    ]
  },
  {
    group: 'Premium',
    items: [
      { id: 'particle-halo', name: 'Halo', price: 'Rp 60.000', desc: 'Lingkaran partikel di atas kepala. Terlihat dari jauh dan memberi kesan elite di keramaian.' },
      { id: 'particle-overhead', name: 'Overhead', price: 'Rp 65.000', desc: 'Partikel seperti mahkota di atas kepala. Statis, tapi selalu terlihat oleh pemain di sekitar.' },
      { id: 'particle-orbit', name: 'Orbit', price: 'Rp 70.000', desc: 'Partikel berputar mengelilingi badan seperti planet. Pilihan menengah yang cukup mencolok.' },
      { id: 'particle-spin', name: 'Spin', price: 'Rp 75.000', desc: 'Partikel berputar cepat mengelilingi pemain. Lebih intens dari Orbit.' },
      { id: 'particle-spiral', name: 'Spiral', price: 'Rp 80.000', desc: 'Partikel berputar spiral ke atas dan ke bawah. Artistik dan tidak pasaran.' },
      { id: 'particle-rings', name: 'Rings', price: 'Rp 90.000', desc: 'Cincin partikel horizontal yang berputar di sekitar tubuh, seperti shield energi.' }
    ]
  },
  {
    group: 'Sultan',
    items: [
      { id: 'particle-beam', name: 'Beam', price: 'Rp 100.000', desc: 'Sinar lurus ke atas dari tubuh seperti tiang cahaya. Terlihat dari jarak jauh.' },
      { id: 'particle-sphere', name: 'Sphere', price: 'Rp 100.000', desc: 'Bola partikel menyelimuti seluruh tubuh. Terlihat seperti bubble energi.' },
      { id: 'particle-companion', name: 'Companion', price: 'Rp 100.000', desc: 'Partikel mengikuti seperti hewan peliharaan kecil.' },
      { id: 'particle-whirlwind', name: 'Whirlwind', price: 'Rp 100.000', desc: 'Angin puyuh partikel berputar kencang di sekitar pemain. Paling ramai.' },
      { id: 'particle-vortex', name: 'Vortex', price: 'Rp 100.000', desc: 'Pusaran besar di sekitar pemain. Lebih luas dari Whirlwind.' },
      { id: 'particle-wings', name: 'Wings', price: 'Rp 100.000', desc: 'Sayap partikel di punggung. Terlihat jelas saat berjalan atau terbang.' }
    ]
  }
];

const ACCESSORIES = [
  { name: 'Custom Hat', desc: 'Topi yang bisa di-request sesuai permintaanmu. Terlihat oleh pemain di sekitarmu.' },
  { name: 'Wing', desc: 'Sayap eksklusif dengan desain kustom pilihanmu sendiri.' }
];

const MISC = [
  { id: 'misc-vip-coin', name: 'VIP Coin', wa: 'VIP Coin', price: 'Rp 5.000 = 30.000 Coin', badge: 'ONE TIME CLAIM', desc: 'Coin in-game untuk fitur server Kita Network. Langsung masuk ke akun, tanpa masa kadaluarsa.' },
  { id: 'misc-shard', name: 'Shard', wa: 'Shard', price: 'Rp 1.000 / Shard', badge: 'ONE TIME CLAIM', desc: 'Mata uang premium untuk item eksklusif dan fitur spesial di server.' },
  { id: 'misc-sethome', name: 'Tambah /sethome', wa: 'Tambah /sethome', price: 'Rp 3.000 / slot', badge: 'PERMANENT', desc: 'Menambah 1 slot /sethome permanen di luar batas rank. Bisa dibeli berkali-kali.' },
  { id: 'misc-role', name: 'Custom Role', wa: 'Custom Role', price: 'Rp 10.000 / role', badge: 'PERMANENT', desc: 'Role permanen dengan nama pilihanmu sendiri. Tampil beda dari pemain lain.' }
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

RANKS.forEach((rank) => {
  rank.id = 'rank-' + slug(rank.name);
  rank.label = 'Rank ' + rank.name;
  CATALOG.set(rank.id, rank);
});

ABILITIES.forEach((item) => {
  item.label = 'Ability ' + item.wa;
  CATALOG.set(item.id, item);
});

KITS.forEach((item) => {
  item.label = item.wa;
  CATALOG.set(item.id, item);
});

FLY.forEach((item) => {
  item.label = item.name;
  CATALOG.set(item.id, item);
});

PARTICLES.forEach((group) => {
  group.items.forEach((item) => {
    item.label = 'Partikel ' + item.name;
    CATALOG.set(item.id, item);
  });
});

MISC.forEach((item) => {
  item.label = item.wa;
  CATALOG.set(item.id, item);
});

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
        </span>
        <div class="rank-act">
          <div class="price">
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

const coreRanks = RANKS.filter((rank) => rank.tier === 'core');

renderRankGroup('rank-core', coreRanks, 1);
renderRankGroup('rank-peak', RANKS.filter((rank) => rank.tier === 'peak'), coreRanks.length + 1);

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

document.getElementById('ability-grid').innerHTML = ABILITIES
  .map((item) => entryMarkup(item, { badge: 'Permanent', note: item.note }))
  .join('');

document.getElementById('kit-grid').innerHTML = KITS.map((kit) => `
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

document.getElementById('fly-body').innerHTML = FLY.map((fly) => `
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

document.getElementById('misc-list').innerHTML = MISC
  .map((item) => entryMarkup(item, { badge: item.badge }))
  .join('');

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
    itemBox.innerHTML = `<span><strong>${pending.label}</strong></span><span class="dlg-item-price">${pending.price}</span>`;
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

nameInput.addEventListener('input', clearError);

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

updateBuyerStatus();
