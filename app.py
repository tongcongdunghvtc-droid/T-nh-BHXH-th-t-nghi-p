import streamlit as st
import math

# --- CONSTANTS (Synced with constants.ts) ---
WAGE_DATA_2026 = {
    "BASE_SALARY": 2340000,
    "REGIONS": [
        { 
            "id": 1, 
            "name": "Vùng I", 
            "minWage": 5310000, 
            "label": "Hà Nội, TP. HCM, Hải Phòng, Quảng Ninh...",
            "locations": [
                {"province": "Hà Nội", "details": "Các quận: Hoàn Kiếm, Ba Đình, Hai Bà Trưng, Đống Đa, Hoàng Mai, Thanh Xuân, Cầu Giấy, Tây Hồ, Bắc Từ Liêm, Nam Từ Liêm, Long Biên, Hà Đông; các huyện: Gia Lâm, Đông Anh, Sóc Sơn, Thanh Trì, Thường Tín, Hoài Đức, Thạch Thất, Quốc Oai, Thanh Oai, Mê Linh, Chương Mỹ và thị xã Sơn Tây."},
                {"province": "TP. Hồ Chí Minh", "details": "Các quận: 1, 3, 4, 5, 6, 7, 8, 10, 11, 12, Bình Tân, Bình Thạnh, Gò Vấp, Phú Nhuận, Tân Bình, Tân Phú; TP. Thủ Đức; các huyện: Củ Chi, Hóc Môn, Bình Chánh, Nhà Bè."},
                {"province": "Hải Phòng", "details": "Các quận: Hồng Bàng, Ngô Quyền, Lê Chân, Hải An, Đồ Sơn, Kinh Dương, Kiến An; các huyện: Thủy Nguyên, An Dương, An Lão, Vĩnh Bảo, Tiên Lãng, Kiến Thụy và đặc khu Cát Hải."},
                {"province": "Quảng Ninh", "details": "Các TP: Hạ Long, Cẩm Phả, Uông Bí, Móng Cái; các thị xã: Quảng Yên, Đông Triều."},
                {"province": "Đồng Nai", "details": "Các TP: Biên Hòa, Long Khánh; các huyện: Nhơn Trạch, Long Thành, Vĩnh Cửu, Trảng Bom, Xuân Lộc, Thống Nhất."},
                {"province": "Bình Dương", "details": "Các TP: Thủ Dầu Một, Thuận An, Dĩ An, Tân Uyên, Bến Cát; các huyện: Bàu Bàng, Bắc Tân Uyên, Dầu Tiếng, Phú Giáo."},
                {"province": "Bà Rịa - Vũng Tàu", "details": "TP. Vũng Tàu, thị xã Phú Mỹ."}
            ]
        },
        { 
            "id": 2, 
            "name": "Vùng II", 
            "minWage": 4730000, 
            "label": "Hà Nội (Huyện còn lại), Đà Nẵng, Cần Thơ...",
            "locations": [
                {"province": "Hà Nội", "details": "Các huyện còn lại: Ba Vì, Đan Phượng, Phú Xuyên, Phúc Thọ, Mỹ Đức, Ứng Hòa."},
                {"province": "Hải Phòng", "details": "Huyện Bạch Long Vĩ."},
                {"province": "Đà Nẵng", "details": "Các quận, huyện thuộc TP. Đà Nẵng."},
                {"province": "Cần Thơ", "details": "Các quận thuộc TP. Cần Thơ."},
                {"province": "Lào Cai", "details": "TP. Lào Cai."},
                {"province": "Thái Nguyên", "details": "Các TP: Thái Nguyên, Sông Công, Phổ Yên."},
                {"province": "Bắc Ninh", "details": "TP. Bắc Ninh, thị xã Từ Sơn và các huyện: Quế Võ, Tiên Du, Yên Phong, Thuận Thành."},
                {"province": "Quảng Ninh", "details": "Các huyện: Vân Đồn, Tiên Yên, Đầm Hà, Hải Hà."}
            ]
        },
        { 
            "id": 3, 
            "name": "Vùng III", 
            "minWage": 4140000, 
            "label": "Các TP/Thị xã trực thuộc tỉnh còn lại...",
            "locations": [
                {"province": "Các tỉnh", "details": "Các thành phố trực thuộc tỉnh còn lại (không thuộc vùng I, II)."},
                {"province": "Các thị xã", "details": "Các thị xã trực thuộc tỉnh còn lại (không thuộc vùng I, II)."},
                {"province": "Huyện tiêu biểu", "details": "Các huyện: Vân Canh (Bình Định), Tân Kỳ (Nghệ An), Nông Cống (Thanh Hóa)..."}
            ]
        },
        { 
            "id": 4, 
            "name": "Vùng IV", 
            "minWage": 3700000, 
            "label": "Các địa bàn còn lại...",
            "locations": [
                {"province": "Toàn quốc", "details": "Các địa bàn còn lại chưa được liệt kê ở Vùng I, II, III."}
            ]
        },
    ]
}

UI_RULES = {
    "BENEFIT_RATE": 0.6,
    "MAX_BENEFIT_MONTHS": 12,
    "MIN_CONTRIBUTION_FOR_3_MONTHS": 12,
    "MAX_CONTRIBUTION_FOR_3_MONTHS": 36,
    "ADDITIONAL_MONTH_STEP": 12,
    "MAX_CAP_MULTIPLIER": 5,
}

# --- HELPER FUNCTIONS ---
def format_currency(val):
    return f"{val:,.0f} ₫".replace(",", ".")

# --- STREAMLIT CONFIG ---
st.set_page_config(page_title="Tính Trợ Cấp Thất Nghiệp 2026", page_icon="📊", layout="centered")

# --- CUSTOM CSS (Matching React Light Theme) ---
st.markdown("""
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
    
    .stApp {
        background-color: #f8fafc;
        font-family: 'Inter', sans-serif;
    }
    
    .main-header {
        text-align: center;
        padding: 2rem 0;
    }
    
    .hardware-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 24px;
        padding: 24px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.05);
        margin-bottom: 24px;
    }
    
    .result-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        margin-top: 24px;
    }
    
    .result-item {
        background: #f1f5f9;
        padding: 20px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
    }
    
    .label-small {
        font-size: 10px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        color: #64748b;
        margin-bottom: 8px;
    }
    
    .value-large {
        font-size: 24px;
        font-weight: 800;
        color: #1e293b;
        font-family: 'JetBrains Mono', monospace;
    }
    
    .step-box {
        border-left: 2px solid #3b82f6;
        padding-left: 16px;
        margin-bottom: 24px;
    }
    
    .step-number {
        background: #dbeafe;
        color: #2563eb;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        margin-right: 8px;
    }
    
    /* Override Streamlit elements */
    .stNumberInput label, .stSelectbox label {
        font-size: 12px !important;
        font-weight: 700 !important;
        text-transform: uppercase !important;
        color: #64748b !important;
    }
    
    .stButton>button {
        background: #2563eb !important;
        color: white !important;
        border-radius: 12px !important;
        font-weight: 700 !important;
        height: 3.5rem !important;
        width: 100% !important;
        border: none !important;
        transition: all 0.2s !important;
    }
    
    .stButton>button:hover {
        background: #1d4ed8 !important;
        transform: translateY(-2px) !important;
    }
    </style>
    """, unsafe_allow_html=True)

# --- HEADER ---
st.markdown("""
    <div class="main-header">
        <h1 style="font-size: 32px; font-weight: 800; color: #1e293b; margin-bottom: 8px;">
            📊 TÍNH TRỢ CẤP THẤT NGHIỆP 2026
        </h1>
        <p style="color: #64748b; font-size: 14px; font-weight: 500;">
            Cập nhật theo Luật Việc làm 2025 & Nghị định 293/2025/NĐ-CP
        </p>
    </div>
    """, unsafe_allow_html=True)

# --- INPUT SECTION ---
with st.container():
    st.markdown('<div class="hardware-card">', unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    with col1:
        salary_input = st.number_input("Lương bình quân 06 tháng gần nhất", min_value=0, step=100000, value=10000000)
    with col2:
        months_input = st.number_input("Tổng thời gian đóng BHTN (tháng)", min_value=0, step=1, value=36)
    
    region_names = [f"{r['name']} - {r['label']}" for r in WAGE_DATA_2026["REGIONS"]]
    selected_region_idx = st.selectbox("Chọn vùng lương tối thiểu", range(len(region_names)), format_func=lambda x: region_names[x])
    selected_region = WAGE_DATA_2026["REGIONS"][selected_region_idx]
    
    with st.expander("🔍 Tra cứu chi tiết các địa phương theo vùng"):
        for r in WAGE_DATA_2026["REGIONS"]:
            st.markdown(f"**{r['name']} ({format_currency(r['minWage'])})**")
            for loc in r['locations']:
                st.markdown(f"- *{loc['province']}*: {loc['details']}")
            st.markdown("---")
    
    calculate = st.button("TÍNH TOÁN KẾT QUẢ")
    st.markdown('</div>', unsafe_allow_html=True)

# --- CALCULATION & RESULTS ---
if calculate:
    if months_input < 12:
        st.error("⚠️ Bạn chưa đủ điều kiện hưởng trợ cấp thất nghiệp (phải đóng đủ từ 12 tháng trở lên).")
    else:
        # Logic
        raw_benefit = salary_input * UI_RULES["BENEFIT_RATE"]
        max_cap = selected_region["minWage"] * UI_RULES["MAX_CAP_MULTIPLIER"]
        is_capped = raw_benefit > max_cap
        monthly_benefit = max_cap if is_capped else raw_benefit

        benefit_months = 0
        used_months = 0
        if months_input >= 12:
            benefit_months = 3
            if months_input <= 36:
                used_months = 36
            else:
                extra_months = months_input - 36
                extra_benefit = math.floor(extra_months / 12)
                benefit_months += extra_benefit
                if benefit_months > UI_RULES["MAX_BENEFIT_MONTHS"]:
                    benefit_months = UI_RULES["MAX_BENEFIT_MONTHS"]
                used_months = 36 + (extra_benefit * 12)

        reserved_months = 0
        if months_input >= 12:
            if months_input <= 36:
                reserved_months = 0
            else:
                reserved_months = months_input - used_months

        # Result Cards
        st.markdown(f"""
            <div class="result-grid">
                <div class="result-item" style="border-left: 4px solid #3b82f6;">
                    <div class="label-small">Mức hưởng hàng tháng</div>
                    <div class="value-large" style="color: #2563eb;">{format_currency(monthly_benefit)}</div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 8px;">
                        {'⚠️ Đã chạm mức trần tối đa' if is_capped else '✓ Nằm trong khung quy định'}
                    </div>
                </div>
                <div class="result-item" style="border-left: 4px solid #10b981;">
                    <div class="label-small">Thời gian hưởng</div>
                    <div class="value-large" style="color: #059669;">{benefit_months} tháng</div>
                    <div style="font-size: 10px; color: #64748b; margin-top: 8px;">
                        Tổng nhận: {format_currency(monthly_benefit * benefit_months)}
                    </div>
                </div>
            </div>
            <div class="result-item" style="margin-top: 16px; background: #ecfdf5; border: 1px solid #d1fae5;">
                <div class="label-small" style="color: #059669;">Thời gian bảo lưu</div>
                <div class="value-large" style="color: #047857; font-size: 18px;">{reserved_months} tháng</div>
                <div style="font-size: 10px; color: #059669; margin-top: 4px;">Sẽ được cộng dồn cho lần hưởng tiếp theo</div>
            </div>
            """, unsafe_allow_html=True)

        # Detailed Breakdown
        st.markdown('<div class="hardware-card" style="margin-top: 32px;">', unsafe_allow_html=True)
        st.markdown('<h3 style="font-size: 14px; font-weight: 800; color: #2563eb; margin-bottom: 24px; text-transform: uppercase;">Lập luận & Căn cứ tính toán</h3>', unsafe_allow_html=True)
        
        # Step 1
        st.markdown(f"""
            <div class="step-box">
                <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                    <span class="step-number">01</span> XÁC ĐỊNH MỨC HƯỞNG HÀNG THÁNG
                </div>
                <p style="font-size: 11px; color: #64748b; line-height: 1.6;">
                    Theo <b>Khoản 1 Điều 39 Luật Việc làm 2025</b>, mức hưởng bằng 60% bình quân tiền lương.
                </p>
                <div style="background: #f8fafc; padding: 12px; border-radius: 12px; font-family: monospace; font-size: 11px; color: #1e293b;">
                    Tính toán: {format_currency(salary_input)} x 60% = {format_currency(salary_input * 0.6)}<br/>
                    Mức trần ({selected_region['name']}): {format_currency(max_cap)}
                </div>
            </div>
            """, unsafe_allow_html=True)
            
        # Step 2
        st.markdown(f"""
            <div class="step-box" style="border-left-color: #10b981;">
                <div style="font-size: 12px; font-weight: 700; color: #1e293b; margin-bottom: 8px;">
                    <span class="step-number" style="background: #d1fae5; color: #059669;">02</span> XÁC ĐỊNH THỜI GIAN HƯỞNG
                </div>
                <p style="font-size: 11px; color: #64748b; line-height: 1.6;">
                    Căn cứ <b>Khoản 2 Điều 39 Luật Việc làm 2025</b>: Đóng 12-36 tháng hưởng 3 tháng trợ cấp.
                </p>
                <div style="background: #f8fafc; padding: 12px; border-radius: 12px; font-family: monospace; font-size: 11px; color: #1e293b;">
                    Tổng đóng: {months_input} tháng<br/>
                    Kết quả: {benefit_months} tháng hưởng
                </div>
            </div>
            """, unsafe_allow_html=True)
            
        st.markdown('</div>', unsafe_allow_html=True)

# --- LEGAL & FAQ SECTION ---
st.markdown("---")
st.markdown('<h2 style="font-size: 20px; font-weight: 800; color: #1e293b; margin-bottom: 24px;">Hướng dẫn & Căn cứ pháp lý</h2>', unsafe_allow_html=True)

tab1, tab2, tab3 = st.tabs(["Điều kiện hưởng", "Hồ sơ thủ tục", "Câu hỏi thường gặp"])

with tab1:
    st.markdown("""
    - **Chấm dứt HĐLĐ đúng luật:** Không đơn phương chấm dứt trái luật.
    - **Thời gian đóng:** Đóng đủ 12 tháng trở lên trong vòng 24 tháng trước khi nghỉ.
    - **Thời hạn nộp:** Trong vòng 03 tháng kể từ ngày nghỉ việc.
    - **Chưa có việc làm:** Sau 15 ngày nộp hồ sơ mà chưa tìm được việc mới.
    """)

with tab2:
    st.markdown("""
    1. **Đề nghị hưởng trợ cấp** (theo mẫu).
    2. **Quyết định thôi việc** hoặc HĐLĐ hết hạn (bản chính/sao y).
    3. **Sổ BHXH** đã được chốt tờ rời.
    4. **CCCD** và thẻ ATM chính chủ.
    """)

with tab3:
    with st.expander("Tự nghỉ việc có được hưởng BHTN không?"):
        st.write("Có, nếu bạn nghỉ việc đúng quy định báo trước của Luật Lao động.")
    with st.expander("Quá 3 tháng chưa nộp hồ sơ thì sao?"):
        st.write("Thời gian đóng của bạn sẽ được tự động bảo lưu cho lần sau.")

st.markdown("""
    <div style="text-align: center; margin-top: 48px; border-top: 1px solid #e2e8f0; padding-top: 24px;">
        <p style="color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em;">
            Lưu ý: Kết quả chỉ mang tính chất tham khảo dựa trên quy định dự kiến cho năm 2026.
        </p>
    </div>
    """, unsafe_allow_html=True)
