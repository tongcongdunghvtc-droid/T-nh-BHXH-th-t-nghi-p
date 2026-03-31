import streamlit as st

# Thiết lập giao diện
st.set_page_config(page_title="Công cụ tính lương 2026", layout="centered")
st.title("🧮 Công cụ tính toán dữ liệu 2026")

# Input từ người dùng (tương đương với các state avgSalary, contributionMonths trong React)
avg_salary = st.number_input("Mức lương bình quân (VNĐ):", min_value=0, step=100000)
contribution_months = st.number_input("Số tháng đóng bảo hiểm:", min_value=0, step=1)
region = st.selectbox("Chọn vùng (Region):", options=[1, 2, 3, 4])

# Logic tính toán (Bạn có thể cập nhật công thức từ file constants.ts của mình vào đây)
if st.button("Tính kết quả"):
    if avg_salary > 0 and contribution_months > 0:
        # Giả sử một công thức tính toán đơn giản
        result = avg_salary * contribution_months * 0.75 
        st.success(f"Kết quả tính toán dự kiến: {result:,.0f} VNĐ")
    else:
        st.warning("Vui lòng nhập đầy đủ thông tin.")
