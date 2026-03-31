import streamlit as st
import math

# --- CONSTANTS ---
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

# --- STREAMLIT UI ---
st.set_page_config(page_title="Tính Trợ Cấp Thất Nghiệp 2026", page_icon="📊", layout="centered")

# Custom CSS for styling
st.markdown("""
    <style>
    .main {
        background-color: #f8fafc;
    }
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        height: 3em;
        background-color: #2563eb;
        color: white;
        font-weight: bold;
    }
    .result-card {
        background-color: white;
        padding: 20px;
        border-radius: 15px;
        border: 1px solid #e2e8f0;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        margin-bottom: 20px;
    }
    .result-label {
        color: #64748b;
        font-size: 0.8em;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    .result-value {
        color: #1e293b;
        font-size: 1.5em;
        font-weight: bold;
    }
    </style>
    """, unsafe_allow_html=True)

st.title("📊 Công cụ tính Trợ cấp thất nghiệp 2026")
st.caption("Cập nhật theo Luật Việc làm 2025 & Nghị định 293/2025/NĐ-CP")

with st.container():
    st.subheader("Nhập thông tin của bạn")
    
    col1, col2 = st.columns(2)
    
    with col1:
        salary_input = st.number_input("Lương bình quân 06 tháng gần nhất (VND)", min_value=0, step=100000, value=10000000)
        
    with col2:
        months_input = st.number_input("Tổng thời gian đóng BHTN (tháng)", min_value=0, step=1, value=36)

    region_names = [r["name"] + " - " + r["label"] for r in WAGE_DATA_2026["REGIONS"]]
    selected_region_idx = st.selectbox("Chọn vùng lương tối thiểu", range(len(region_names)), format_func=lambda x: region_names[x])
    selected_region = WAGE_DATA_2026["REGIONS"][selected_region_idx]

    if st.button("TÍNH TOÁN KẾT QUẢ"):
        if months_input < 12:
            st.error("⚠️ Bạn chưa đủ điều kiện hưởng trợ cấp thất nghiệp (phải đóng đủ từ 12 tháng trở lên).")
        else:
            # Calculation logic
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

            # Display Results
            st.markdown("---")
            st.subheader("Kết quả dự toán")
            
            res_col1, res_col2 = st.columns(2)
            
            with res_col1:
                st.markdown(f"""
                    <div class="result-card">
                        <div class="result-label">Mức hưởng hàng tháng</div>
                        <div class="result-value" style="color: #2563eb;">{format_currency(monthly_benefit)}</div>
                        <p style="font-size: 0.7em; color: #64748b; margin-top: 5px;">
                            {'⚠️ Đã chạm mức trần tối đa' if is_capped else '✓ Nằm trong khung quy định'}
                        </p>
                    </div>
                """, unsafe_allow_html=True)
                
            with res_col2:
                st.markdown(f"""
                    <div class="result-card">
                        <div class="result-label">Thời gian hưởng</div>
                        <div class="result-value" style="color: #059669;">{benefit_months} tháng</div>
                        <p style="font-size: 0.7em; color: #64748b; margin-top: 5px;">
                            Tổng cộng: {format_currency(monthly_benefit * benefit_months)}
                        </p>
                    </div>
                """, unsafe_allow_html=True)

            st.info(f"💡 **Số tháng bảo lưu:** {reserved_months} tháng (Sẽ được cộng dồn cho lần hưởng sau)")

            # Detailed Reasoning
            with st.expander("Xem chi tiết lập luận & Căn cứ pháp lý"):
                st.markdown(f"""
                ### 1. Mức hưởng hàng tháng
                - **Căn cứ:** Khoản 1 Điều 39 Luật Việc làm 2025.
                - **Tính toán:** {format_currency(salary_input)} x 60% = {format_currency(salary_input * 0.6)}
                - **Mức trần ({selected_region['name']}):** {format_currency(max_cap)} (Tối đa 5 lần lương tối thiểu vùng)
                - **Kết luận:** {monthly_benefit:,.0f} VND/tháng.

                ### 2. Thời gian hưởng
                - **Căn cứ:** Khoản 2 Điều 39 Luật Việc làm 2025.
                - **Quy định:** Đóng đủ 12-36 tháng hưởng 3 tháng. Sau đó mỗi 12 tháng thêm được +1 tháng (Tối đa 12 tháng).
                - **Tính toán:** {months_input} tháng đóng -> {benefit_months} tháng hưởng.

                ### 3. Thời gian bảo lưu
                - **Căn cứ:** Khoản 5 Điều 41 Luật Việc làm 2025.
                - **Kết quả:** {reserved_months} tháng được bảo lưu.
                """)

st.markdown("---")
st.caption("© 2026 - Công cụ được phát triển dựa trên quy định mới nhất của Luật Việc làm.")
