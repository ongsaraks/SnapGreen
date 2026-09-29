/**
 * =========================================================================================
 * SNAPGREEN - TRASH & BIN CATEGORY CONFIGURATION
 * =========================================================================================
 * 
 * 💡 HOW TO MOVE A CLASS TO A DIFFERENT BIN:
 * -----------------------------------------------------------------------------------------
 * Simply move the class string (e.g. 'Plastic_Bottle' or 'Plastic_Cup') between the
 * `classes` arrays in TRASH_BINS below!
 * For example:
 *   If you want Plastic_Bottle and Plastic_Cup to go to the BLUE bin:
 *   Just cut them from YELLOW.classes and add them to BLUE.classes.
 * 
 * 💡 HOW TO CHANGE BOUNDING BOX & BADGE COLORS:
 * -----------------------------------------------------------------------------------------
 * - To change the default color for an entire bin: edit `boxBorder` and `badgeBg` in TRASH_BINS.
 * - To customize a specific class individually (like the red badge for "Snack_Wrapper"):
 *   edit or add to `CLASS_STYLE_OVERRIDES` below!
 * 
 * 💡 HOW TO CHANGE THAI TRANSLATIONS:
 * -----------------------------------------------------------------------------------------
 * Edit the text in `CLASS_THAI_NAMES` below.
 * =========================================================================================
 */

// -----------------------------------------------------------------------------------------
// 1. TRASH BIN SETS (Categories)
// Each bin is a big set containing its assigned classes, default colors, and points.
// -----------------------------------------------------------------------------------------
export const TRASH_BINS = {
  BLUE: {
    id: 'blue',
    name: 'ถังสีน้ำเงิน',
    type: 'ขยะทั่วไป',
    binColor: '#2563eb',     // Blue
    badgeBg: '#1d4ed8',      // Darker blue
    badgeText: '#ffffff',
    boxBorder: '#3b82f6',
    iconColor: '#2563eb',
    points: 15,
    // List of classes belonging to Blue Bin:
    classes: [
      'Snack_Wrapper',         // ถุงขนม
      'Plastic_Bag',           // ถุงพลาสติก
      'Plastic film',          // ฟิล์มพลาสติก / ห่อพลาสติก
      'Plastic straw',         // หลอดพลาสติก
      'Plastic utensils',      // ช้อนส้อมพลาสติก
      'Foam food container',   // กล่องโฟมใส่อาหาร
      'Paper cup',             // แก้วกระดาษเคลือบ
      'Sauce_Packet',          // ซองซอส
      'Face_Mask',             // หน้ากากอนามัย
      'Aluminium Foil',        // ฟอยล์อลูมิเนียมเปื้อน
    ],
  },

  YELLOW: {
    id: 'yellow',
    name: 'ถังสีเหลือง',
    type: 'ขยะรีไซเคิล',
    binColor: '#eab308',     // Yellow
    badgeBg: '#ca8a04',      // Warm yellow/gold
    badgeText: '#ffffff',
    boxBorder: '#eab308',
    iconColor: '#ca8a04',
    points: 15,
    // List of classes belonging to Yellow Bin:
    classes: [
      'Plastic_Bottle',        // ขวดพลาสติกใส
      'Plastic_Cup',           // แก้วพลาสติก
      'Plastic_Food_Container',// กล่องพลาสติกใส่อาหาร
      'Plastic bottle cap',    // ฝาขวดพลาสติก
      'METAL',                 // กระป๋องโลหะ
      'Glass',                 // ขวดแก้ว
      'Cardboard_Box',         // กล่องกระดาษ / ลัง
      'Paper Bag',             // ถุงกระดาษ
      'paper',                 // กระดาษสะอาด
      'Drink carton',          // กล่องเครื่องดื่ม UHT
    ],
  },

  GREEN: {
    id: 'green',
    name: 'ถังสีเขียว',
    type: 'ขยะอินทรีย์ / เศษอาหาร',
    binColor: '#22c55e',     // Green
    badgeBg: '#16a34a',
    badgeText: '#ffffff',
    boxBorder: '#22c55e',
    iconColor: '#16a34a',
    points: 15,
    // List of classes belonging to Green Bin:
    classes: [
      'Food_Scraps',           // เศษอาหาร / ผักผลไม้
    ],
  },

  ORANGE: {
    id: 'orange',
    name: 'ถังสีส้ม / แดง',
    type: 'ขยะอันตราย',
    binColor: '#f97316',     // Orange
    badgeBg: '#ea580c',
    badgeText: '#ffffff',
    boxBorder: '#f97316',
    iconColor: '#ea580c',
    points: 15,
    // List of classes belonging to Orange/Red Bin:
    classes: [
      'Battery',               // แบตเตอรี่ / ถ่านไฟฉาย
    ],
  },
};

// -----------------------------------------------------------------------------------------
// 2. THAI DISPLAY NAMES FOR MODEL CLASSES
// -----------------------------------------------------------------------------------------
export const CLASS_THAI_NAMES = {
  'Aluminium Foil': 'ฟอยล์อลูมิเนียม',
  'Battery': 'แบตเตอรี่ / ถ่าน',
  'Cardboard_Box': 'กล่องกระดาษ',
  'Drink carton': 'กล่องเครื่องดื่ม UHT',
  'Face_Mask': 'หน้ากากอนามัย',
  'Foam food container': 'กล่องโฟม',
  'Food_Scraps': 'เศษอาหาร',
  'Glass': 'ขวดแก้ว',
  'METAL': 'กระป๋อง',
  'Paper Bag': 'ถุงกระดาษ',
  'Paper cup': 'แก้วกระดาษ',
  'Plastic bottle cap': 'ฝาขวดพลาสติก',
  'Plastic film': 'ฟิล์มพลาสติก',
  'Plastic straw': 'หลอดพลาสติก',
  'Plastic utensils': 'ช้อนส้อมพลาสติก',
  'Plastic_Bag': 'ถุงพลาสติก',
  'Plastic_Bottle': 'ขวดพลาสติก',
  'Plastic_Cup': 'แก้วพลาสติก',
  'Plastic_Food_Container': 'กล่องพลาสติกใส่อาหาร',
  'Sauce_Packet': 'ซองซอส',
  'Snack_Wrapper': 'ถุงขนม',
  'paper': 'กระดาษ',
};

// -----------------------------------------------------------------------------------------
// 3. INDIVIDUAL CLASS STYLE OVERRIDES (Optional per-class customization)
// Matching your Figma design:
// - "ถุงขนม" (Snack_Wrapper) has a bold red border and red header badge.
// - "กระป๋อง" (METAL) has a warm brown border and badge.
// Feel free to adjust these hex colors or add any other class here!
// -----------------------------------------------------------------------------------------
export const CLASS_STYLE_OVERRIDES = {
  'Snack_Wrapper': {
    boxBorder: '#FF2E2E',    // Red bounding box
    badgeBg: '#E60000',      // Red badge background
    badgeText: '#FFFFFF',    // White text
  },
  'Plastic_Bag': {
    boxBorder: '#F87171',
    badgeBg: '#EF4444',
    badgeText: '#FFFFFF',
  },
  'METAL': {
    boxBorder: '#A6805E',    // Warm brown/taupe box (matching Figma mockup)
    badgeBg: '#8C6848',      // Warm brown badge
    badgeText: '#FFFFFF',
  },
  'Plastic_Bottle': {
    boxBorder: '#38BDF8',
    badgeBg: '#0284C7',
    badgeText: '#FFFFFF',
  },
};

/**
 * Resolves complete information (Thai name, bin set, box styling, points) for any class name.
 */
export function getClassMeta(className) {
  // Find which bin this class belongs to
  let assignedBin = TRASH_BINS.BLUE; // fallback
  for (const binKey of Object.keys(TRASH_BINS)) {
    if (TRASH_BINS[binKey].classes.includes(className)) {
      assignedBin = TRASH_BINS[binKey];
      break;
    }
  }

  const thaiName = CLASS_THAI_NAMES[className] || className;
  const override = CLASS_STYLE_OVERRIDES[className] || {};

  return {
    rawClass: className,
    thaiName: thaiName,
    binId: assignedBin.id,
    binName: assignedBin.name,
    binType: assignedBin.type,
    binColor: assignedBin.binColor,
    iconColor: assignedBin.iconColor,
    points: assignedBin.points,
    boxBorder: override.boxBorder || assignedBin.boxBorder,
    badgeBg: override.badgeBg || assignedBin.badgeBg,
    badgeText: override.badgeText || assignedBin.badgeText,
  };
}
