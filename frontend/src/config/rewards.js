/**
 * =========================================================================================
 * SNAPGREEN - REWARD CATALOG CONFIGURATION
 * =========================================================================================
 * 
 * 💡 HOW TO ADD A NEW REWARD:
 * -----------------------------------------------------------------------------------------
 * Add a new object inside the `REWARDS_CATALOG` array below:
 * {
 *   id: 'prize-my-item',              // Unique ID (e.g. 'prize-water-bottle')
 *   name: 'ชื่อของรางวัลภาษาไทย',         // Reward Title
 *   description: 'รายละเอียดของรางวัล',  // Short description
 *   creditsCost: 250,                 // Number of Green Credits required to redeem
 *   category: 'อุปกรณ์ทั่วไป',          // Category tag
 *   iconType: 'Gift',                 // Lucide icon name (Headphones, Umbrella, Coffee, Gift, etc.)
 *   imageUrl: '',                     // (Optional) Direct image URL if you want photos
 *   available: true,                  // Set to false if out of stock
 * }
 * 
 * 💡 HOW TO CHANGE POINTS OR DETAILS:
 * -----------------------------------------------------------------------------------------
 * Simply change `creditsCost` or `name` of the item in the array below!
 * =========================================================================================
 */

export const REWARDS_CATALOG = [
  {
    id: 'prize-headphones',
    name: 'หูฟังไร้สาย',
    description: 'หูฟังไร้สาย Bluetooth เสียงคมชัด สำหรับการเรียนและฟังเพลง',
    creditsCost: 100, // 100 pt to redeem
    category: 'แกดเจ็ต',
    iconType: 'Headphones',
    available: true,
  },
  {
    id: 'prize-umbrella',
    name: 'ร่มพับพกพา',
    description: 'ร่มพับกันแดดกันฝน UV Cut น้ำหนักเบา ลายพิเศษ SnapGreen x ICT',
    creditsCost: 300, // 300 pt to redeem
    category: 'ของใช้ทั่วไป',
    iconType: 'Umbrella',
    available: true,
  },
  {
    id: 'prize-bottle',
    name: 'กระบอกน้ำเก็บอุณหภูมิ',
    description: 'กระบอกน้ำสแตนเลสรักษ์โลก เก็บความเย็นได้ 12 ชั่วโมง',
    creditsCost: 250,
    category: 'Eco-friendly',
    iconType: 'Coffee',
    available: true,
  },
  {
    id: 'prize-coffee-discount',
    name: 'คูปองเครื่องดื่ม 20 บาท',
    description: 'ส่วนลด 20 บาท สำหรับร้านกาแฟคาเฟ่คณะ ICT',
    creditsCost: 80,
    category: 'อาหารและเครื่องดื่ม',
    iconType: 'Ticket',
    available: true,
  },
];
