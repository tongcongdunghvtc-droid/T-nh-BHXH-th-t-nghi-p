import { useState, useMemo, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calculator, 
  Info, 
  MapPin, 
  Calendar, 
  Wallet, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  History,
  FileText,
  X,
  Search,
  ExternalLink
} from "lucide-react";
import { WAGE_DATA_2026, UI_RULES } from "./constants";
import { CalculationResult, Region } from "./types";

export default function App() {
  const [avgSalary, setAvgSalary] = useState<number | "">("");
  const [salaryInput, setSalaryInput] = useState<string>("");
  const [contributionMonths, setContributionMonths] = useState<number | "">("");
  const [selectedRegionId, setSelectedRegionId] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedRegion = useMemo(() => {
    return WAGE_DATA_2026.REGIONS.find(r => r.id === selectedRegionId) || WAGE_DATA_2026.REGIONS[0];
  }, [selectedRegionId]);

  const formatNumber = (val: number | string) => {
    if (!val) return "";
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleSalaryChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (/^\d*$/.test(rawValue)) {
      const numValue = rawValue === "" ? "" : parseInt(rawValue, 10);
      setAvgSalary(numValue);
      setSalaryInput(formatNumber(rawValue));
    }
  };

  const result = useMemo((): CalculationResult | null => {
    if (avgSalary === "" || contributionMonths === "" || avgSalary === 0) return null;

    // 1. Monthly benefit calculation
    let rawBenefit = Number(avgSalary) * UI_RULES.BENEFIT_RATE;
    const maxCap = selectedRegion.minWage * UI_RULES.MAX_CAP_MULTIPLIER;
    const isCapped = rawBenefit > maxCap;
    const monthlyBenefit = isCapped ? maxCap : rawBenefit;

    // 2. Benefit months calculation
    let benefitMonths = 0;
    let usedMonths = 0;
    const months = Number(contributionMonths);

    if (months >= 12) {
      benefitMonths = 3;
      if (months <= 36) {
        usedMonths = 36; 
      } else {
        const additionalMonths = months - 36;
        const extraBenefitMonths = Math.floor(additionalMonths / 12);
        benefitMonths += extraBenefitMonths;
        if (benefitMonths > UI_RULES.MAX_BENEFIT_MONTHS) {
          benefitMonths = UI_RULES.MAX_BENEFIT_MONTHS;
        }
        usedMonths = 36 + (extraBenefitMonths * 12);
      }
    }

    let reservedMonths = 0;
    if (months >= 12) {
      if (months <= 36) {
        reservedMonths = 0;
      } else {
        reservedMonths = months - usedMonths;
      }
    }

    return {
      monthlyBenefit,
      benefitMonths,
      totalBenefit: monthlyBenefit * benefitMonths,
      reservedMonths,
      maxCap,
      isCapped
    };
  }, [avgSalary, contributionMonths, selectedRegion]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="p-2 bg-blue-600/20 rounded-lg">
            <Calculator className="w-8 h-8 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight glow-text">
            BẢO HIỂM THẤT NGHIỆP <span className="text-blue-500">2026</span>
          </h1>
        </div>
        <p className="text-slate-400 text-sm uppercase tracking-widest font-mono">
          Căn cứ Luật Việc làm 2025 & Nghị định 293/2025/NĐ-CP
        </p>
      </motion.header>

      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Section */}
        <motion.section 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-5 space-y-6"
        >
          <div className="hardware-card p-6 rounded-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <div className="status-indicator bg-blue-600" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Thông số đầu vào</h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors uppercase tracking-tighter"
              >
                <Search className="w-3 h-3" /> Tra cứu địa bàn
              </button>
            </div>

            {/* Salary Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase">
                  <Wallet className="w-4 h-4 text-blue-600" /> Lương bình quân 06 tháng
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold text-blue-600 mb-1">Đây là gì?</p>
                    <p className="mb-2">Trung bình cộng tiền lương tháng đóng BHTN của 06 tháng liền kề trước khi nghỉ việc.</p>
                    <p className="font-bold text-blue-600 mb-1">Ảnh hưởng kết quả:</p>
                    <p>Mức hưởng hàng tháng = 60% con số này. Nếu vượt quá mức trần (5 lần lương tối thiểu vùng) thì sẽ lấy mức trần.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="text"
                  value={salaryInput}
                  onChange={handleSalaryChange}
                  className="input-field w-full p-4 rounded-xl text-xl font-mono"
                  placeholder="Gợi ý: 10,000,000"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">VND</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Xem trên sổ BHXH hoặc tờ rời chốt sổ 06 tháng cuối.
              </p>
            </div>

            {/* Months Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase">
                  <Calendar className="w-4 h-4 text-blue-600" /> Tổng thời gian đóng (tháng)
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold text-blue-600 mb-1">Cách tính:</p>
                    <p className="mb-2">Tổng số tháng bạn đã đóng BHTN chưa hưởng trợ cấp. (Ví dụ: 2 năm 6 tháng = 30 tháng).</p>
                    <p className="font-bold text-blue-600 mb-1">Ảnh hưởng kết quả:</p>
                    <p>Quyết định số tháng được hưởng trợ cấp (3 - 12 tháng) và số tháng được bảo lưu cho lần sau.</p>
                  </div>
                </div>
              </div>
              <div className="relative">
                <input 
                  type="number"
                  value={contributionMonths}
                  onChange={(e) => setContributionMonths(e.target.value === "" ? "" : Number(e.target.value))}
                  className="input-field w-full p-4 rounded-xl text-xl font-mono"
                  placeholder="Gợi ý: 24"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono">THÁNG</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                * Nhập tổng số tháng tích lũy chưa hưởng.
              </p>
            </div>

            {/* Region Selection */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 uppercase">
                  <MapPin className="w-4 h-4 text-blue-600" /> Khu vực làm việc (Vùng)
                </label>
                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute right-0 bottom-full mb-2 w-64 p-3 bg-white border border-slate-200 rounded-xl text-[10px] text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    <p className="font-bold text-blue-600 mb-1">Tại sao cần chọn?</p>
                    <p className="mb-2">Mỗi vùng có mức lương tối thiểu khác nhau.</p>
                    <p className="font-bold text-blue-600 mb-1">Ảnh hưởng kết quả:</p>
                    <p>Dùng để tính "Mức trần" tối đa bạn có thể nhận (5 lần lương tối thiểu vùng). Vùng I có mức trần cao nhất.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {WAGE_DATA_2026.REGIONS.map((region) => (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedRegionId === region.id 
                        ? "border-blue-600 bg-blue-50 text-blue-700" 
                        : "border-slate-200 bg-white text-slate-500 hover:border-blue-200"
                    }`}
                  >
                    <div className="text-xs font-bold">{region.name}</div>
                    <div className="text-[10px] opacity-60 truncate">{region.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex gap-3">
            <Info className="w-5 h-5 text-blue-600 shrink-0" />
            <div className="text-xs text-slate-600 leading-relaxed">
              Mức lương tối thiểu {selectedRegion.name} năm 2026 là <span className="text-blue-600 font-bold">{formatCurrency(selectedRegion.minWage)}</span>. 
              Mức hưởng tối đa (5 lần) là <span className="text-blue-600 font-bold">{formatCurrency(selectedRegion.minWage * 5)}</span>.
            </div>
          </div>
        </motion.section>

        {/* Results Section */}
        <motion.section 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-7 space-y-6"
        >
          {!result ? (
            <div className="hardware-card p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 border-dashed border-slate-200">
              <Calculator className="w-16 h-16 text-slate-300" />
              <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest">Đang chờ dữ liệu...</h3>
              <p className="text-slate-500 max-w-xs text-sm">
                Vui lòng nhập mức lương và thời gian đóng bảo hiểm để hệ thống tính toán quyền lợi của bạn.
              </p>
            </div>
          ) : Number(contributionMonths) < 12 ? (
            <div className="hardware-card p-12 rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
              <AlertCircle className="w-16 h-16 text-amber-500 opacity-20" />
              <h3 className="text-xl font-bold text-amber-600">Chưa đủ điều kiện hưởng</h3>
              <p className="text-slate-600 max-w-xs">
                Theo Điều 38 Luật Việc làm 2025, bạn cần đóng BHTN từ đủ 12 tháng trở lên để được hưởng trợ cấp.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Primary Result */}
              <div className="hardware-card p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <Wallet className="w-32 h-32 text-blue-600" />
                </div>
                
                <div className="relative z-10 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Mức hưởng hàng tháng</p>
                      <h2 className="text-5xl font-mono font-bold tracking-tighter text-slate-900">
                        {formatCurrency(result.monthlyBenefit).split(',')[0]}
                        <span className="text-xl text-slate-400 ml-1">VND</span>
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Thời gian hưởng</p>
                      <div className="text-3xl font-mono font-bold text-slate-900">
                        {result.benefitMonths} <span className="text-sm text-slate-400 uppercase">Tháng</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Tổng nhận dự kiến</p>
                      <p className="text-xl font-mono text-slate-900">{formatCurrency(result.totalBenefit)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Số tháng bảo lưu</p>
                      <p className="text-xl font-mono text-emerald-600">+{result.reservedMonths} THÁNG</p>
                    </div>
                  </div>

                  {result.isCapped && (
                    <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span className="text-[10px] text-amber-700 uppercase font-bold">
                        Đã áp dụng mức trần tối đa (5 lần lương tối thiểu vùng)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Detailed Breakdown - Enhanced with Reasoning and Legal Citations */}
              <div className="hardware-card p-6 rounded-2xl space-y-6 border-blue-100">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-blue-600 flex items-center gap-2">
                    <History className="w-4 h-4" /> Lập luận & Căn cứ tính toán
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">STEP-BY-STEP ANALYSIS</div>
                </div>
                
                <div className="space-y-6">
                  {/* Step 1: Monthly Benefit */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-200">01</div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Xác định mức hưởng hàng tháng</h4>
                    </div>
                    <div className="pl-8 space-y-2">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Theo <span className="text-slate-900 font-semibold">Khoản 1 Điều 39 Luật Việc làm 2025</span>, mức hưởng bằng 60% bình quân tiền lương 06 tháng gần nhất.
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px]">
                        <div className="flex justify-between mb-1">
                          <span className="text-slate-400">Tính toán:</span>
                          <span className="text-slate-900">{formatCurrency(Number(avgSalary))} x 60% = {formatCurrency(Number(avgSalary) * 0.6)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Mức trần ({selectedRegion.name}):</span>
                          <span className="text-amber-600">{formatCurrency(result.maxCap)} (Tối đa 5 lần lương tối thiểu)</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-blue-600/80 italic">
                        {result.isCapped 
                          ? "➔ Vì mức 60% vượt quá mức trần, nên mức hưởng của bạn được điều chỉnh về mức trần tối đa." 
                          : "➔ Mức hưởng của bạn nằm trong phạm vi cho phép (không vượt quá mức trần)."}
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Duration */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-200">02</div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Xác định thời gian hưởng</h4>
                    </div>
                    <div className="pl-8 space-y-2">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Căn cứ <span className="text-slate-900 font-semibold">Khoản 2 Điều 39 Luật Việc làm 2025</span>: Đóng đủ 12-36 tháng hưởng 03 tháng trợ cấp. Sau đó, cứ thêm đủ 12 tháng đóng thì hưởng thêm 01 tháng trợ cấp (Tối đa 12 tháng).
                      </p>
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tổng thời gian đóng:</span>
                          <span className="text-slate-900">{contributionMonths} tháng</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Phân bổ:</span>
                          <span className="text-slate-900">36 tháng đầu (3 tháng hưởng) + {Math.max(0, Number(contributionMonths) - 36)} tháng dư</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 mt-1">
                          <span className="text-blue-600 font-bold">Kết quả:</span>
                          <span className="text-blue-600 font-bold">{result.benefitMonths} tháng hưởng trợ cấp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3: Reservation */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-bold border border-blue-200">03</div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase">Xác định thời gian bảo lưu</h4>
                    </div>
                    <div className="pl-8 space-y-2">
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Theo <span className="text-slate-900 font-semibold">Khoản 5 Điều 41 Luật Việc làm 2025</span>, những tháng đóng BHTN chưa được tính hưởng trợ cấp sẽ được bảo lưu cho lần sau.
                      </p>
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl font-mono text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Số tháng đã dùng:</span>
                          <span className="text-slate-900">{Number(contributionMonths) <= 36 ? Number(contributionMonths) : 36 + (result.benefitMonths - 3) * 12} tháng</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-600 mt-1 pt-1 border-t border-emerald-100">
                          <span>Số tháng bảo lưu:</span>
                          <span>{result.reservedMonths} tháng</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Benefits */}
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" /> Quyền lợi bổ sung (Điều 39.4)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="flex gap-2 items-start">
                        <div className="mt-1 w-1 h-1 rounded-full bg-blue-600 shrink-0" />
                        <p className="text-[10px] text-slate-500 leading-tight">Được hưởng chế độ BHYT do Quỹ BHTN đóng trong suốt thời gian nhận trợ cấp.</p>
                      </div>
                      <div className="flex gap-2 items-start">
                        <div className="mt-1 w-1 h-1 rounded-full bg-blue-600 shrink-0" />
                        <p className="text-[10px] text-slate-500 leading-tight">Hỗ trợ tư vấn, giới thiệu việc làm miễn phí từ Trung tâm dịch vụ việc làm.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legal References */}
          <div className="hardware-card p-6 rounded-2xl space-y-4 border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <FileText className="w-4 h-4" /> Căn cứ pháp lý quan trọng
            </h3>
            <div className="space-y-4">
              <div className="group cursor-help">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">Điều 39 Luật Việc làm 2025</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Mức hưởng hằng tháng bằng 60% bình quân tiền lương 06 tháng gần nhất. 
                  Tối đa không quá 05 lần mức lương tối thiểu vùng.
                </p>
              </div>
              <div className="group cursor-help">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">Nghị định 293/2025/NĐ-CP</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors" />
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Quy định mức lương tối thiểu vùng mới áp dụng từ 01/01/2026. 
                  Đây là căn cứ để xác định mức trần hưởng trợ cấp.
                </p>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* SEO Content & Detailed Guide Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl mt-16 space-y-12 pb-20"
      >
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent w-full" />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Sidebar Navigation for Guide */}
          <div className="md:col-span-1 space-y-4 sticky top-8 h-fit hidden md:block">
            <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-6">Mục lục hướng dẫn</h3>
            <nav className="space-y-2">
              {["Điều kiện hưởng", "Mức hưởng & Cách tính", "Hồ sơ & Thủ tục", "Các câu hỏi thường gặp"].map((item, i) => (
                <a key={i} href={`#guide-section-${i}`} className="block text-sm text-slate-500 hover:text-blue-600 transition-colors py-2 border-l-2 border-slate-100 pl-4 hover:border-blue-600">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Main Guide Content */}
          <div className="md:col-span-2 space-y-16 text-slate-600">
            
            {/* Section 0: Conditions */}
            <div id="guide-section-0" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                Điều kiện hưởng trợ cấp thất nghiệp 2026
              </h2>
              <p className="leading-relaxed">
                Theo <span className="text-blue-600 font-semibold">Điều 38 Luật Việc làm 2025</span>, người lao động được hưởng trợ cấp thất nghiệp khi hội đủ 4 điều kiện sau:
              </p>
              <ul className="space-y-4">
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span><strong className="text-slate-900">Chấm dứt hợp đồng đúng pháp luật:</strong> Không thuộc trường hợp đơn phương chấm dứt trái luật hoặc nghỉ việc hưởng lương hưu.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span><strong className="text-slate-900">Thời gian đóng:</strong> Đóng đủ 12 tháng trở lên trong vòng 24 tháng trước khi nghỉ việc (hoặc 36 tháng đối với hợp đồng ngắn hạn).</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span><strong className="text-slate-900">Thời hạn nộp hồ sơ:</strong> Trong vòng 03 tháng kể từ ngày chấm dứt hợp đồng lao động.</span>
                </li>
                <li className="flex gap-3 items-start">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-1" />
                  <span><strong className="text-slate-900">Chưa có việc làm:</strong> Sau 15 ngày kể từ ngày nộp hồ sơ mà vẫn chưa tìm được việc làm mới.</span>
                </li>
              </ul>
            </div>

            {/* Section 1: Calculation */}
            <div id="guide-section-1" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                Mức hưởng và Cách tính trợ cấp thất nghiệp
              </h2>
              <div className="hardware-card p-6 rounded-2xl bg-blue-50 border-blue-100">
                <h3 className="text-blue-600 font-bold mb-4 uppercase tracking-wider text-sm">Công thức chuẩn:</h3>
                <div className="text-xl font-mono text-center py-4 border-y border-slate-200 my-4 text-slate-900">
                  Mức hưởng = 60% x Lương bình quân 06 tháng gần nhất
                </div>
                <p className="text-sm text-slate-500 leading-relaxed italic">
                  * Lưu ý: Mức hưởng tối đa không quá 05 lần mức lương tối thiểu vùng tại thời điểm nghỉ việc.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-bold text-slate-900">Thời gian hưởng trợ cấp:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Đóng từ 12 - 36 tháng</p>
                    <p className="text-lg font-bold text-slate-900">Hưởng 03 tháng</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <p className="text-xs text-slate-500 mb-1">Mỗi 12 tháng tiếp theo</p>
                    <p className="text-lg font-bold text-slate-900">+ 01 tháng hưởng</p>
                  </div>
                </div>
                <p className="text-sm text-slate-500">
                  Thời gian hưởng tối đa là <span className="text-blue-600 font-bold">12 tháng</span>. Những tháng dư chưa đủ 12 tháng sẽ được <span className="text-emerald-600 font-bold">bảo lưu</span> cho lần sau.
                </p>
              </div>
            </div>

            {/* Section 2: Procedures */}
            <div id="guide-section-2" className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                Hồ sơ và Thủ tục cần chuẩn bị
              </h2>
              <div className="space-y-4">
                <p>Để nhận tiền BHTN nhanh chóng, bạn cần chuẩn bị bộ hồ sơ gồm:</p>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    "Đề nghị hưởng trợ cấp thất nghiệp (theo mẫu).",
                    "Bản chính hoặc bản sao có chứng thực của Hợp đồng lao động đã hết hạn hoặc Quyết định thôi việc.",
                    "Sổ bảo hiểm xã hội đã được chốt (bản gốc và tờ rời).",
                    "CCCD/Hộ chiếu và thẻ ATM để nhận tiền qua tài khoản."
                  ].map((text, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i+1}</div>
                      <span className="text-sm text-slate-700">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: FAQs */}
            <div id="guide-section-3" className="space-y-8">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                <div className="w-2 h-8 bg-blue-600 rounded-full" />
                Câu hỏi thường gặp (FAQ)
              </h2>
              <div className="space-y-6">
                {[
                  {
                    q: "Tự nghỉ việc (đơn phương chấm dứt HĐLĐ) có được hưởng BHTN không?",
                    a: "Có, nếu bạn chấm dứt hợp đồng lao động đúng quy định của Bộ luật Lao động. Nếu bạn nghỉ việc trái luật (không báo trước đủ ngày...), bạn sẽ không được hưởng trợ cấp."
                  },
                  {
                    q: "Thời hạn nộp hồ sơ là bao lâu?",
                    a: "Trong thời hạn 03 tháng kể từ ngày chấm dứt hợp đồng lao động. Quá thời hạn này, thời gian đóng BHTN của bạn sẽ được bảo lưu tự động cho lần sau."
                  },
                  {
                    q: "Đang hưởng BHTN mà có việc làm mới thì phải làm sao?",
                    a: "Bạn phải thông báo cho Trung tâm dịch vụ việc làm trong vòng 03 ngày. Trợ cấp sẽ chấm dứt, nhưng số tháng chưa hưởng sẽ được bảo lưu."
                  },
                  {
                    q: "Mức hưởng tối đa năm 2026 là bao nhiêu?",
                    a: "Tại Vùng I (Hà Nội, TP.HCM...), mức lương tối thiểu là 5.310.000đ, nên mức hưởng tối đa là 26.550.000đ/tháng."
                  }
                ].map((faq, i) => (
                  <div key={i} className="space-y-2 group">
                    <h4 className="text-blue-600 font-bold text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> {faq.q}
                    </h4>
                    <p className="text-sm text-slate-500 pl-6 border-l border-slate-200 group-hover:border-blue-600 transition-colors leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* Region Details Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="hardware-card w-full max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden relative flex flex-col border-slate-200 shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <MapPin className="w-6 h-6 text-blue-600" />
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">Danh mục địa bàn áp dụng</h2>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">Nghị định 293/2025/NĐ-CP</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50">
                {WAGE_DATA_2026.REGIONS.map((region) => (
                  <div key={region.id} className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-md uppercase">
                        {region.name}
                      </div>
                      <div className="h-px flex-1 bg-slate-200" />
                      <div className="text-xs font-mono text-slate-500">
                        Lương tối thiểu: {formatCurrency(region.minWage)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {region.locations.map((loc, idx) => (
                        <div key={idx} className="p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all">
                          <h4 className="text-sm font-bold text-blue-600 mb-2 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                            {loc.province}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {loc.details}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-white border-t border-slate-100 text-center">
                <p className="text-[10px] text-slate-400 italic">
                  * Danh sách trên được cập nhật theo quy định mới nhất. Vui lòng đối chiếu với địa bàn nơi doanh nghiệp đăng ký kinh doanh.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-slate-600 text-[10px] uppercase tracking-widest text-center max-w-2xl">
        Lưu ý: Kết quả này chỉ mang tính chất tham khảo. Mức hưởng thực tế sẽ do Cơ quan Bảo hiểm Xã hội quyết định dựa trên hồ sơ cụ thể của bạn.
      </footer>
    </div>
  );
}
