export const WAGE_DATA_2026 = {
  BASE_SALARY: 2340000,
  REGIONS: [
    { 
      id: 1, 
      name: "Vùng I", 
      minWage: 5310000, 
      label: "Hà Nội, TP. HCM, Hải Phòng, Quảng Ninh...",
      locations: [
        { province: "Hà Nội", details: "Các quận: Hoàn Kiếm, Ba Đình, Hai Bà Trưng, Đống Đa, Hoàng Mai, Thanh Xuân, Cầu Giấy, Tây Hồ, Bắc Từ Liêm, Nam Từ Liêm, Long Biên, Hà Đông; các huyện: Gia Lâm, Đông Anh, Sóc Sơn, Thanh Trì, Thường Tín, Hoài Đức, Thạch Thất, Quốc Oai, Thanh Oai, Mê Linh, Chương Mỹ và thị xã Sơn Tây." },
        { province: "TP. Hồ Chí Minh", details: "Các quận: 1, 3, 4, 5, 6, 7, 8, 10, 11, 12, Bình Tân, Bình Thạnh, Gò Vấp, Phú Nhuận, Tân Bình, Tân Phú; TP. Thủ Đức; các huyện: Củ Chi, Hóc Môn, Bình Chánh, Nhà Bè." },
        { province: "Hải Phòng", details: "Các quận: Hồng Bàng, Ngô Quyền, Lê Chân, Hải An, Đồ Sơn, Kinh Dương, Kiến An; các huyện: Thủy Nguyên, An Dương, An Lão, Vĩnh Bảo, Tiên Lãng, Kiến Thụy và đặc khu Cát Hải." },
        { province: "Quảng Ninh", details: "Các TP: Hạ Long, Cẩm Phả, Uông Bí, Móng Cái; các thị xã: Quảng Yên, Đông Triều." },
        { province: "Đồng Nai", details: "Các TP: Biên Hòa, Long Khánh; các huyện: Nhơn Trạch, Long Thành, Vĩnh Cửu, Trảng Bom, Xuân Lộc, Thống Nhất." },
        { province: "Bình Dương", details: "Các TP: Thủ Dầu Một, Thuận An, Dĩ An, Tân Uyên, Bến Cát; các huyện: Bàu Bàng, Bắc Tân Uyên, Dầu Tiếng, Phú Giáo." },
        { province: "Bà Rịa - Vũng Tàu", details: "TP. Vũng Tàu, thị xã Phú Mỹ." }
      ]
    },
    { 
      id: 2, 
      name: "Vùng II", 
      minWage: 4730000, 
      label: "Hà Nội (Huyện còn lại), Đà Nẵng, Cần Thơ...",
      locations: [
        { province: "Hà Nội", details: "Các huyện còn lại: Ba Vì, Đan Phượng, Phú Xuyên, Phúc Thọ, Mỹ Đức, Ứng Hòa." },
        { province: "Hải Phòng", details: "Huyện Bạch Long Vĩ." },
        { province: "Đà Nẵng", details: "Các quận, huyện thuộc TP. Đà Nẵng." },
        { province: "Cần Thơ", details: "Các quận thuộc TP. Cần Thơ." },
        { province: "Lào Cai", details: "TP. Lào Cai." },
        { province: "Thái Nguyên", details: "Các TP: Thái Nguyên, Sông Công, Phổ Yên." },
        { province: "Bắc Ninh", details: "TP. Bắc Ninh, thị xã Từ Sơn và các huyện: Quế Võ, Tiên Du, Yên Phong, Thuận Thành." },
        { province: "Quảng Ninh", details: "Các huyện: Vân Đồn, Tiên Yên, Đầm Hà, Hải Hà." }
      ]
    },
    { 
      id: 3, 
      name: "Vùng III", 
      minWage: 4140000, 
      label: "Các TP/Thị xã trực thuộc tỉnh còn lại...",
      locations: [
        { province: "Các tỉnh", details: "Các thành phố trực thuộc tỉnh còn lại (không thuộc vùng I, II)." },
        { province: "Các thị xã", details: "Các thị xã trực thuộc tỉnh còn lại (không thuộc vùng I, II)." },
        { province: "Huyện tiêu biểu", details: "Các huyện: Vân Canh (Bình Định), Tân Kỳ (Nghệ An), Nông Cống (Thanh Hóa)..." }
      ]
    },
    { 
      id: 4, 
      name: "Vùng IV", 
      minWage: 3700000, 
      label: "Các địa bàn còn lại...",
      locations: [
        { province: "Toàn quốc", details: "Các địa bàn còn lại chưa được liệt kê ở Vùng I, II, III." }
      ]
    },
  ]
};

export const UI_RULES = {
  BENEFIT_RATE: 0.6, // 60%
  MAX_BENEFIT_MONTHS: 12,
  MIN_CONTRIBUTION_FOR_3_MONTHS: 12,
  MAX_CONTRIBUTION_FOR_3_MONTHS: 36,
  ADDITIONAL_MONTH_STEP: 12,
  MAX_CAP_MULTIPLIER: 5,
};
