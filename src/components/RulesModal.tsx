import React from 'react';
import { X, ShieldCheck, Plane, Swords, ShieldAlert } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono">
              คู่มือกติกา "หมากรุก Warfare" (Warfare Chess Manual)
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans select-text">
          {/* Section 1 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-300 flex items-center gap-2 text-sm sm:text-base mb-2">
              <span>1. ยูนิตในเกม (Units Framework)</span>
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-slate-300 text-xs sm:text-sm">
              <li>
                <strong className="text-slate-100">President (ประธานาธิบดี - แทน King):</strong> เดินได้ 1 ช่องรอบตัวทุกทิศทาง
              </li>
              <li>
                <strong className="text-slate-100">First Lady (สุภาพสตรีหมายเลขหนึ่ง - แทน Queen):</strong> เดินได้อิสระทุกทิศทาง (แนวตั้ง แนวนอน แนวทแยง)
              </li>
              <li>
                <strong className="text-slate-100">Bodyguard (บอดี้การ์ด - แทน Bishop):</strong> เดินได้ในแนวทแยงทุกระยะ
              </li>
              <li>
                <strong className="text-slate-100">Jet (เครื่องบินขับไล่ - แทน Knight):</strong> เดินแบบ L-Shape ข้ามหมากอื่นได้ <span className="text-rose-400 font-bold">แต่มีคูลดาวน์: เดินได้ 1 ครั้ง เว้น 2 เทิร์นที่เกิดขึ้นบนกระดาน (นับรวมเทิร์นที่ศัตรูเดิน)</span>
              </li>
              <li>
                <strong className="text-slate-100">Tank (รถถัง - แทน Rook):</strong> เดินได้ในแนวตั้งและแนวนอนทุกระยะ
              </li>
              <li>
                <strong className="text-slate-100">Citizen (พลเมือง - แทน Pawn):</strong> เดินหน้า 1 ช่อง (ตาแรกเดินได้ 2 ช่อง) และกินทแยงมุม
              </li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-cyan-300 flex items-center gap-2 text-sm sm:text-base mb-2">
              <Plane className="w-4 h-4" />
              <span>2. การโปรโมทเมื่อ Citizen เข้าฐานฝั่งตรงข้าม (Pawn Promotion)</span>
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              เมื่อ Citizen เดินไปถึงแถวสุดท้ายของข้าศึก สามารถเลือกเปลี่ยนเป็น 4 ยูนิตพิเศษเท่านั้น:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-amber-300">1. Brave Soldier (ทหารผู้กล้า)</div>
                <div className="text-slate-300">เดินเหมือน Queen แต่จำกัดระยะทางไม่เกิน 5 ช่อง</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-cyan-300">2. Trainee Pilot (นักบินฝึกหัด)</div>
                <div className="text-slate-300">เดินและกินเหมือน Knight <strong className="text-emerald-400">เดินได้ทุกตา ไม่มีคูลดาวน์</strong></div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-blue-300">3. Police (ตำรวจ)</div>
                <div className="text-slate-300">
                  เดินแนวทแยง <strong className="text-rose-400">ไม่กินหมาก</strong> แต่เป็นการ "ล็อก" หมากเป้าหมายให้หยุดนิ่ง 1 ตา <span className="text-amber-300 font-semibold">เมื่อตำรวจล็อกตัวหมากนั้น ตำรวจจะเดินไปประชิดหมากนั้นทันที</span> และ <span className="text-cyan-300 font-semibold">หมากนั้นจะไม่ถูกล็อกซ้ำในตาถัดไปได้</span>
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="font-bold text-orange-300">4. Armored Car (รถหุ้มเกราะ)</div>
                <div className="text-slate-300">เดินเหมือน Tank แต่จำกัดระยะทางไม่เกิน 4 ช่อง</div>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-emerald-300 flex items-center gap-2 text-sm sm:text-base mb-2">
              <ShieldAlert className="w-4 h-4" />
              <span>3. กติกาพิเศษ (Special Warfare Rules)</span>
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-xs sm:text-sm text-slate-300">
              <li>
                <strong className="text-amber-300">President Invincibility (ประธานาธิบดีอมตะ):</strong> President จะมีสถานะอมตะ ไม่ถูกบังคับให้หนีเมื่อโดนรุก และฝั่งตรงข้ามไม่สามารถกิน President ได้ ตราบใดที่ Bodyguard ทั้งหมด และ First Lady ของฝ่ายนั้นยังไม่ถูกกำจัดหมด
              </li>
              <li>
                <strong className="text-cyan-300">ข้อห้ามเดินเข้าตาโจมตี (Movement Restriction):</strong> แม้ President จะอยู่ในสถานะอมตะ <span className="text-rose-400 font-bold">ก็จะไม่สามารถเดินเข้าไปในช่องที่อยู่ในอำนาจการโจมตีของหมากฝ่ายตรงข้ามได้อยู่ดี</span>
              </li>
              <li>
                <strong className="text-rose-400">เกราะแตก (Vulnerable):</strong> เมื่อ Bodyguard ทั้งหมด และ First Lady ถูกกำจัดหมดแล้ว President จะเสียสถานะอมตะ และสามารถถูกรุกฆาต (Checkmate) ได้ตามปกติ
              </li>
              <li>
                <strong className="text-emerald-400">ชัยชนะจากการรุกฆาต (Checkmate):</strong> เกมจะจบลงทันทีเมื่อ President ของฝ่ายใดฝ่ายหนึ่งที่ไม่มีสถานะอมตะถูกรุกจนมุม
              </li>
              <li>
                <strong className="text-amber-400">กองกำลังไม่พอ (Insufficient Material):</strong> หลังจากที่เกมถูกตัดสินว่ามีหมากไม่เหลือพอที่จะรุกฆาตได้ เกมจะจบลงทันทีด้วยคำว่า <span className="text-amber-300 font-bold">"กองกำลังไม่พอ"</span> (ผลคือเสมอ)
              </li>
              <li>
                <strong className="text-cyan-400">อับ (Stalemate):</strong> คือการที่ฝั่งตรงข้ามถูกไล่จนเดินไปไหนไม่ได้แล้ว แต่ก็ไม่ถูกอยู่ในระยะโจมตีและเป็นตาของฝั่งนั้นที่โดนปิดทางไม่เหลือให้หมากอะไรเดิน เกมจะจบลงด้วยคำว่า <span className="text-cyan-300 font-bold">"ประธานาธิบดีปะปนกับฝูงชน (ผลคือเสมอ)"</span>
              </li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-purple-300 flex items-center gap-2 text-sm sm:text-base mb-2">
              <Swords className="w-4 h-4" />
              <span>4. ระบบแสดงผลและการตอบกลับ (Visual & Interaction Standard)</span>
            </h3>
            <ul className="space-y-1.5 list-disc pl-4 text-xs sm:text-sm text-slate-300">
              <li>
                เมื่อคลิกเลือกหมาก ช่องที่สามารถเดินได้จะแสดงจุดกึ่งกลาง <code className="bg-slate-800 text-amber-300 px-1 py-0.5 rounded font-mono">[ • ]</code>
              </li>
              <li>
                ช่องที่มีหมากฝ่ายตรงข้ามที่สามารถกินหรือล็อกได้ จะแสดงสัญลักษณ์เน้นความสว่างใต้ช่อง เช่น <code className="bg-rose-950 text-rose-300 px-1 py-0.5 rounded font-mono">[*X*]</code> หรือ <code className="bg-cyan-950 text-cyan-300 px-1 py-0.5 rounded font-mono">[🔒X🔒]</code>
              </li>
              <li>
                แสดงผลกระดาน 8x8 ในรูปแบบ Text-Based Grid พร้อมแสดงสถานะคูลดาวน์ของ Jet และรายชื่อยูนิตคุ้มกันที่เหลืออยู่ของทั้งสองฝ่ายเสมอ
              </li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 flex items-center gap-2 text-sm sm:text-base mb-2">
              <span>5. การทอยเหรียญกำหนดฝ่ายเริ่มเดิน (Coin Toss Initiative)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              ในการเริ่มเกมแต่ละศึก ฝั่งที่จะได้เดินก่อนจะตัดสินด้วยการทอยเหรียญ โดยฝ่ายน้ำเงินสามารถเลือกหน้าเหรียญได้ 1 หน้า (หัว หรือ ก้อย) และฝ่ายแดงจะถูกบังคับเลือกอีกหน้าโดยอัตโนมัติ (โอกาส 50/50) ฝ่ายที่ทายถูกจะได้สิทธิ์เดินก่อนเสมอ
            </p>
          </div>

          {/* Section 6 */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <h3 className="font-bold text-amber-400 flex items-center gap-2 text-sm sm:text-base mb-2">
              <span>6. โหมดทดสอบกระดานเปล่า (Sandbox / Test Mode)</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              สามารถสลับเข้าสู่โหมด Sandbox ได้จากแถบเมนูด้านบน เมื่อเริ่มต้น กระดานจะว่างเปล่า และผู้เล่นสามารถคลิกที่ช่องใดก็ได้เพื่อเสกยูนิตของฝ่ายใดก็ได้ออกมาได้อย่างอิสระ เมื่อจัดวางเสร็จแล้ว สามารถกดปุ่ม <strong>"เริ่มทดสอบ (Play)"</strong> เพื่อเริ่มการเดินหมากจริง โดยจะใช้กติกาการรบ การคุ้มกัน และการรุกฆาตเต็มรูปแบบเช่นเดิม
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg transition-colors"
          >
            รับทราบคำสั่งปฏิบัติการ
          </button>
        </div>
      </div>
    </div>
  );
};
