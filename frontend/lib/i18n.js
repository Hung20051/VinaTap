// Từ điển dịch — bao phủ toàn bộ khung ứng dụng, trang Cài đặt (Settings),
// Admin Sidebar, Admin Dashboard, Customer Sidebar & Dashboard.

export const dict = {
  vi: {
    // ─── NAV & CHROME ───
    dashboard: "Dashboard",
    activateNfc: "Kích hoạt NFC",
    myMap: "Bản đồ của tôi",
    collection: "Bộ sưu tập",
    admin: "Quản trị",
    account: "Tài khoản",
    password: "Mật khẩu",
    appearance: "Giao diện",
    support: "Hỗ trợ",
    legal: "Điều khoản & Bảo mật",
    about: "Về VinaTap",
    settings: "Cài đặt",
    learnMore: "Tìm hiểu thêm",
    logout: "Đăng xuất",
    greeting: "Chào",
    journeySubtitle: "Đây là hành trình sưu tầm bản đồ Việt Nam của bạn",
    activateNewCard: "Kích hoạt thẻ NFC mới",
    provincesCollected: "Tỉnh thành đã sưu tầm",
    memoryAlbums: "Album kỷ niệm",
    totalViews: "Tổng lượt xem album",
    myCollection: "Bộ sưu tập của tôi",
    searchMenu: "Tìm trong menu...",
    noResults: "Không tìm thấy mục nào",
    backToApp: "Quay lại ứng dụng",
    backToAdmin: "Quay lại Quản trị",
    shop: "Cửa hàng",
    myOrders: "Đơn hàng của tôi",
    accountSettings: "Cài đặt tài khoản",
    adminPortal: "Trang quản trị Admin",
    nfcStore: "Cửa hàng thẻ NFC",
    vouchers: "Ví voucher",
    quickAdd: "Tạo nhanh",
    searchPlaceholder: "Tìm kiếm...",

    // ─── ADMIN NAV ───
    adminOverview: "Tổng quan",
    adminRevenue: "Doanh thu",
    adminNfcCards: "Serial NFC",
    adminProvinces: "Tỉnh & Địa danh",
    adminUsers: "Người dùng",
    adminAlbums: "Album & Kiểm duyệt",
    adminStickers: "Sticker theme",
    adminAnalytics: "Lượt truy cập",
    adminSystemSettings: "Cài đặt hệ thống",
    adminRole: "Quản trị",

    // ─── ADMIN DASHBOARD ───
    adminOverviewTitle: "📊 Tổng quan",
    adminOverviewSubtitle: "Số liệu hệ thống VinaTap",
    totalRevenueOffline: "Tổng doanh thu (offline)",
    totalCardsSold: "Số thẻ đã bán",
    nfcActivatedCount: "Serial NFC đã kích hoạt",
    totalUsers: "Tổng người dùng",
    inLast7Days: "trong 7 ngày qua",
    totalAlbums: "Tổng album",
    publicAlbums: "album public",
    pendingRequests: "Yêu cầu chờ duyệt",
    revenue30Days: "Doanh thu 30 ngày gần nhất",
    noSalesIn30Days: "Chưa có đơn bán nào trong 30 ngày qua",
    topProvincesActivated: "Tỉnh được kích hoạt nhiều nhất",

    // ─── APPEARANCE SETTINGS ───
    appearanceTitle: "🎨 Giao diện",
    appearanceSubtitle: "Ngôn ngữ và chủ đề hiển thị ứng dụng",
    settingsLanguage: "Ngôn ngữ",
    languageDesc: "Chọn ngôn ngữ hiển thị cho toàn bộ ứng dụng.",
    settingsTheme: "Chủ đề giao diện",
    themeDesc: "Chọn giao diện sáng hoặc tối cho phù hợp mắt nhìn.",
    themeLight: "Sáng",
    themeDark: "Tối",

    // ─── ACCOUNT SETTINGS ───
    accountTitle: "👤 Tài khoản",
    accountSubtitle:
      "Thông tin cá nhân — địa chỉ dùng để nhận thẻ NFC khi đặt hàng.",
    profileName: "Họ và tên",
    displayName: "Tên hiển thị",
    profileEmail: "Email",
    emailReadOnlyHint: "Email không thể thay đổi sau khi đăng ký.",
    profileAvatarChange: "Đổi ảnh đại diện",
    profileAvatarUploading: "Đang tải lên...",
    profilePhone: "Số điện thoại",
    profilePhonePlaceholder: "VD: 0912 345 678",
    profileAddress: "Địa chỉ nhận hàng",
    profileAddressPlaceholder:
      "Số nhà, đường, phường/xã, tỉnh/thành — dùng để ship thẻ NFC",
    profileSaveNote:
      "Thông tin này được dùng để giao thẻ NFC vật lý tới bạn khi đặt hàng.",
    saveChanges: "Lưu thay đổi",
    saving: "Đang lưu...",
    savedSuccess: "Đã lưu thành công",
    save: "Lưu thay đổi",
    saved: "Đã lưu",
    close: "Đóng",

    // ─── PASSWORD SETTINGS ───
    passwordTitle: "🔑 Mật khẩu",
    passwordSubtitle: "Cập nhật mật khẩu để bảo vệ tài khoản của bạn",
    currentPassword: "Mật khẩu hiện tại",
    currentPasswordPlaceholder: "Nhập mật khẩu hiện tại",
    newPassword: "Mật khẩu mới",
    newPasswordPlaceholder: "Tối thiểu 6 ký tự",
    confirmPassword: "Xác nhận mật khẩu mới",
    confirmPasswordPlaceholder: "Nhập lại mật khẩu mới",
    updatePassword: "Cập nhật mật khẩu",
    passwordMismatch: "Mật khẩu xác nhận không khớp",
    passwordSuccess: "Đổi mật khẩu thành công",

    // ─── SUPPORT SETTINGS ───
    supportTitle: "🎧 Hỗ trợ & Trợ giúp",
    supportSubtitle: "Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7",
    hotline: "Tổng đài hỗ trợ",
    supportEmail: "Email hỗ trợ",
    supportDocs: "Tài liệu hướng dẫn",
    supportDocsDesc: "Xem hướng dẫn kích hoạt thẻ NFC và tạo album ảnh",

    // ─── ABOUT SETTINGS ───
    aboutTitle: "ℹ️ Về VinaTap",
    aboutSubtitle: "Nền tảng lưu trữ kỷ niệm bằng thẻ NFC thông minh",
    aboutDesc:
      "VinaTap giúp bạn lưu giữ từng khoảng khắc đáng nhớ qua từng thẻ NFC bản đồ Việt Nam.",
    appVersion: "Phiên bản ứng dụng",
    developer: "Phát triển bởi",

    // ─── LEGAL SETTINGS ───
    legalTitle: "📜 Điều khoản & Bảo mật",
    legalSubtitle: "Chính sách bảo vệ dữ liệu và quy định sử dụng VinaTap",
    privacyPolicy: "Chính sách bảo mật",
    termsOfService: "Điều khoản dịch vụ",

    // ─── HOMEPAGE & PUBLIC ───
    homeNavHome: "Trang chủ",
    homeNavAbout: "Giới thiệu",
    homeNavProducts: "Sản phẩm",
    homeNavHandbook: "Cẩm nang",
    homeNavFaq: "Hỏi đáp",
    signIn: "Đăng nhập",
    signUp: "Đăng ký",
    backToHome: "Về trang chủ",

    // Hero
    heroEyebrow: "Khám phá Việt Nam",
    heroTitleLine1: "Chạm một điểm đến",
    heroTitleAccent: "giữ trọn một hành trình",
    heroDesc:
      "Sưu tầm những chiếc thẻ NFC mang dấu ấn của từng điểm đến Việt Nam. Chỉ với một cú chạm, bạn có thể khám phá câu chuyện địa phương, xem nội dung về văn hóa – du lịch và lưu giữ hình ảnh, ghi chú của riêng mình sau mỗi hành trình.",
    heroBtnActivate: "Chạm thẻ NFC",
    heroBtnExplore: "Khám phá điểm đến",
    heroHighlightTitle: "Thẻ theo từng điểm đến",
    heroHighlightSub:
      "Mỗi thẻ là một nơi bạn đã đi qua và một câu chuyện để lưu giữ.",
    heroPhoneTitle: "Khám phá Việt Nam",
    heroPhoneSub: "qua từng điểm đến",
    heroCardActivate: "Chạm thẻ NFC",
    heroCardTapOpen: "Mở ngay album của điểm đến",
    heroCardAiCaption: "AI viết caption",
    heroCardAiDesc: "Tự động tạo caption đầy cảm xúc",
    heroCardMemories: "Lưu giữ kỷ niệm",
    heroCardMemoriesDesc: "Tạo album riêng, thêm ảnh & ghi chú",

    // Feature strip
    featNoApp: "Không cần cài app",
    featAllPhones: "Hoạt động trên mọi điện thoại",
    featPrivacy: "Album riêng tư, tự chọn công khai",
    featCollect34: "Sưu tầm đủ 34 thẻ NFC",

    // About
    aboutEyebrow: "Giới thiệu",
    aboutHeading: "Mỗi điểm đến là một tấm thẻ, một hành trình đáng nhớ.",
    aboutDescription:
      "VinaTap kết hợp thẻ NFC vật lý với trải nghiệm web tương tác, cho phép bạn chạm thẻ để khám phá thông tin về điểm đến, văn hóa địa phương, địa danh nổi bật và lưu lại hình ảnh, ghi chú cá nhân sau mỗi chuyến đi.",
    aboutStatProvinces: "Tỉnh thành",
    aboutStatLayers: "Lớp trải nghiệm",
    aboutStatYear: "Năm ra mắt",
    aboutIconPhysical: "Vật lý",
    aboutIconWeb: "Web tương tác",
    aboutIconAi: "Album AI",
    aboutIconGamification: "Gamification",

    // Pricing
    pricingEyebrow: "Các gói",
    pricingTitle: "Chọn gói phù hợp với bạn",
    pricingTier1Name: "Thẻ NFC lẻ (1 thẻ)",
    pricingTier1Desc: "1 thẻ NFC cho 1 tỉnh thành bất kỳ",
    pricingTier1F1: "1 thẻ NFC vật lý",
    pricingTier1F2: "1 album ảnh AI",
    pricingTier1F3: "Kích hoạt trọn đời",
    pricingTier2Name: "Combo 3 thẻ",
    pricingTier2Desc: "Lựa chọn phổ biến cho bạn bè & người thân",
    pricingTier2Badge: "Phổ biến nhất",
    pricingTier2F1: "3 thẻ NFC tự chọn",
    pricingTier2F2: "3 album ảnh AI",
    pricingTier2F3: "Tiết kiệm so với mua lẻ",
    pricingTier3Name: "Combo 5 thẻ",
    pricingTier3Desc: "Khởi đầu hành trình sưu tầm trọn vẹn",
    pricingTier3F1: "5 thẻ NFC tự chọn",
    pricingTier3F2: "5 album ảnh AI",
    pricingTier3F3: "Ưu đãi tốt nhất theo gói",
    pricingChooseBtn: "Chọn gói này",

    // Provinces
    provEyebrow: "Mới",
    provTitle: "Tỉnh thành nổi bật",
    provSearchPlaceholder: "Tìm tỉnh thành...",
    provFilterAll: "Tất cả",
    provFilterNorth: "Miền Bắc",
    provFilterCentral: "Miền Trung",
    provFilterSouth: "Miền Nam",
    provFilterIsland: "Hải đảo",
    provEmpty: "Không tìm thấy tỉnh thành nào",

    // Policy
    policyEyebrow: "Chính sách",
    policyTitle: "Cam kết & Quyền lợi khách hàng",
    policy1Title: "Bảo hành 1-1 trong 30 ngày",
    policy1Desc:
      "Đổi mới miễn phí 100% nếu thẻ hoặc chip NFC gặp lỗi kỹ thuật từ nhà sản xuất trong vòng 30 ngày đầu.",
    policy2Title: "Bảo mật & Quyền riêng tư",
    policy2Desc:
      "Toàn quyền kiểm soát album riêng tư hoặc công khai. Mọi hình ảnh và video kỷ niệm được mã hóa lưu trữ an toàn trên đám mây.",
    policy3Title: "Giao hàng & Freeship từ 500k",
    policy3Desc:
      "Giao hàng tận nơi toàn quốc từ 2 - 4 ngày. Miễn phí vận chuyển tự động áp dụng cho đơn hàng từ 500.000đ.",
    policy4Title: "Chuyển nhượng & Tặng thẻ",
    policy4Desc:
      "Toàn quyền tặng hoặc chuyển nhượng quyền sở hữu thẻ và album kỷ niệm cho người thân qua email xác thực an toàn.",
    policy5Title: "Thanh toán VietQR & COD",
    policy5Desc:
      "Hỗ trợ quét mã VietQR tự động qua cổng PayOS minh bạch, hoặc kiểm tra hàng và thanh toán tiền mặt khi nhận hàng (COD).",
    policy6Title: "Cam kết chất lượng di sản",
    policy6Desc:
      "Thẻ vật lý chống nước, chống xước bền bỉ. Nội dung danh lam thắng cảnh 34 tỉnh thành được tra cứu và kiểm duyệt kỹ lưỡng.",
    policyDisclaimer:
      "VinaTap cam kết đồng hành và bảo vệ tối đa quyền lợi của khách hàng trong suốt hành trình sưu tầm và khám phá di sản Việt Nam.",

    // FAQ
    faqEyebrow: "Hỏi đáp",
    faqTitle: "Những điều bạn cần biết",
    faqBotName: "Trợ lý VinaTap",
    faqBotStatus: "Đang sẵn sàng hỗ trợ",
    faqBotGreeting:
      "Chào bạn! Mình là Trợ lý VinaTap. Mình có thể giải đáp chi tiết về giá thẻ & combo, cách đặt mua, công nghệ NFC, album kỷ niệm và bảo hành.",
    faqPlaceholder: "Hỏi về giá thẻ, combo, cách mua, NFC, bảo hành...",
    faqNoAnswer:
      "Mình có thể hỗ trợ bạn về giá thẻ (1 thẻ 49k, combo 3 thẻ 139k, 5 thẻ 239k), cách thức đặt mua, công nghệ chạm NFC hoặc bảo hành thẻ. Bạn hãy thử chọn câu hỏi nhanh bên trên hoặc nhập từ khóa nhé!",

    // Footer
    footerDesc:
      "Bản đồ du lịch NFC Việt Nam — sưu tầm, khám phá, lưu giữ kỷ niệm từng chuyến đi.",
    footerProductCol: "Sản phẩm",
    footerExploreCol: "Khám phá",
    footerCompanyCol: "Công ty",
    footerAbout: "Về VinaTap",
    footerContact: "Liên hệ",
    footerTerms: "Điều khoản",
    footerPolicy: "Chính sách",
    footerCopyright: "© 2026 VinaTap. Tất cả quyền được bảo lưu.",

    // Auth
    authBrandTitle1: "Khám phá",
    authBrandTitle2: "Việt Nam",
    authBrandDesc1: "Nơi mỗi tỉnh thành là một kỷ niệm.",
    authBrandDesc2: "Sưu tầm, khám phá và lưu giữ hành trình của bạn.",
    authTabLogin: "Đăng nhập",
    authTabRegister: "Đăng ký",
    authLabelName: "Họ tên",
    authPlaceholderName: "Nhập họ tên của bạn",
    authLabelEmail: "Email",
    authPlaceholderEmail: "Nhập email của bạn",
    authLabelPassword: "Mật khẩu",
    authPlaceholderPassword: "Ít nhất 6 ký tự",
    authForgotPassword: "Quên mật khẩu?",
    authBtnLogin: "Đăng nhập",
    authBtnSendOtp: "Gửi mã xác thực",
    authBtnConfirm: "Xác nhận",
    authProcessing: "Đang xử lý...",
    authOr: "hoặc",
    authGoogle: "Tiếp tục với Google",
    authNoAccount: "Chưa có tài khoản?",
    authRegisterNow: "Đăng ký ngay",
    authHasAccount: "Đã có tài khoản?",
    authLoginNow: "Đăng nhập",
    authOtpTitle: "Nhập mã xác thực",
    authOtpDesc: "Mã gồm 6 số vừa được gửi tới",
    authOtpExpire: "Mã có hiệu lực trong 10 phút.",
    authResendOtp: "Gửi lại mã",
    authResendOtpIn: "Gửi lại mã sau",
    authBack: "← Quay lại",
    authGoogleFail: "Đăng nhập Google thất bại, vui lòng thử lại",

    // ─── CUSTOMER DASHBOARD ───
    rankLevel1: "Tân Thủ Du Hành",
    rankLevel2: "Người Đồng Hành",
    rankLevel3: "Nhà Thám Hiểm",
    passportTitle: "Hộ Chiếu Du Hành",
    collectorBadge: "Nhà Sưu Tầm",
    journeyBadge: "Hành Trình",
    btnActivateCard: "Kích hoạt thẻ",
    btnCardStore: "Cửa hàng thẻ",
    mapUnlockProgress: "Tiến độ mở khóa bản đồ",
    provincesCount: "Tỉnh thành",
    cardsOwned: "Thẻ sở hữu",
    tabOwnedCards: "Thẻ đã sở hữu",
    tabAll34Provinces: "Toàn bộ 34 tỉnh thành",
    searchProvincePlaceholder: "Tìm kiếm tỉnh thành, mã serial...",
    layoutSlider: "Dạng trượt",
    layoutGrid: "Dạng lưới",
    allRegions: "Tất cả miền",
    regionNorth: "Miền Bắc",
    regionCentral: "Miền Trung",
    regionSouth: "Miền Nam",
    regionIsland: "Hải Đảo",
    emptyTilesTitle: "Bạn chưa có thẻ NFC nào",
    emptyTilesDesc:
      "Chạm thẻ NFC vào điện thoại hoặc kích hoạt mã thẻ để mở khóa địa danh đầu tiên trên bản đồ!",
    btnActivateNow: "Kích hoạt ngay",
    btnBuyNewCards: "Mua thẻ mới",
    noFilterResults: "Không tìm thấy địa danh nào phù hợp với bộ lọc hiện tại.",
    btnResetFilters: "Đặt lại bộ lọc",
    cardActivated: "Đã kích hoạt",
    cardOwned: "Đã sở hữu",
    cardLocked: "Chưa mở khóa",
    albumArchived: "Album bị khóa",
    viewLockReason: "Xem lý do khóa",
    openAlbum: "Mở album",
    uploadPhoto: "Đăng ảnh",
    createAlbum: "Tạo album",
    creatingAlbum: "Đang tạo...",
    giftCard: "Tặng",
    giftCardTitle: "Tặng / Chuyển nhượng thẻ này cho bạn bè qua email",
    photosMemories: "bức ảnh kỷ niệm lưu giữ",
    emptyAlbumPrompt: "📸 Album trống • Hãy tải lên bức ảnh đầu tiên!",
    readyToCreateAlbum: "✨ Thẻ đã sẵn sàng • Chạm để tạo album",
    lockAlbumPrompt: "🔒 Sưu tầm thẻ để mở khóa album địa danh này",
    nfcMapTileDesc: "Thẻ bản đồ du lịch NFC Việt Nam",
    cardSerialPrefix: "Mã thẻ",
    readyCreateProvinceAlbum: "✨ Sẵn sàng tạo album kỷ niệm",
    noPhotoYet: "📸 Chưa có ảnh • Chạm để thêm ảnh",
    passportExplorer: "Nhà Thám Hiểm",
    passportSubtitle: "Hành trình chinh phục 34 thẻ bản đồ di sản Việt Nam",
    passportIdTag: "Hộ chiếu",
    buyUnlockCard: "Mua thẻ mở khóa",
    slideLeftTitle: "Trượt sang trái",
    slideRightTitle: "Trượt sang phải",

    // ─── ADMIN SIDEBAR ACCORDION ───
    adminSecOverview: "Tổng quan & Báo cáo",
    adminSecSales: "Bán hàng & Kho thẻ",
    adminSecContent: "Dữ liệu & Du lịch",
    adminSecUsers: "Người dùng & Tài khoản",
    adminSecSystem: "Quản trị & Hệ thống",
    adminTrafficStats: "Thống kê truy cập",
    adminProductsShipping: "Sản phẩm",
    adminNotifications: "Gửi thông báo",
    adminProductsShippingFull: "Sản phẩm & vận chuyển",
    adminVouchers: "Mã giảm giá",
  },
  en: {
    // ─── NAV & CHROME ───
    dashboard: "Dashboard",
    activateNfc: "Activate NFC",
    myMap: "My Map",
    collection: "Collection",
    admin: "Admin",
    account: "Account",
    password: "Password",
    appearance: "Appearance",
    support: "Support",
    legal: "Terms & Privacy",
    about: "About VinaTap",
    settings: "Settings",
    learnMore: "Learn more",
    logout: "Log out",
    greeting: "Hi",
    journeySubtitle: "This is your journey collecting Vietnam's map",
    activateNewCard: "Activate new NFC card",
    provincesCollected: "Provinces collected",
    memoryAlbums: "Memory albums",
    totalViews: "Total album views",
    myCollection: "My collection",
    searchMenu: "Search menu...",
    noResults: "No matching items",
    backToApp: "Back to App",
    backToAdmin: "Back to Admin",
    shop: "Store",
    myOrders: "My Orders",
    accountSettings: "Account Settings",
    adminPortal: "Admin Portal",
    nfcStore: "NFC Card Store",
    vouchers: "Vouchers",
    quickAdd: "Quick Create",
    searchPlaceholder: "Search...",

    // ─── ADMIN NAV ───
    adminOverview: "Overview",
    adminRevenue: "Revenue",
    adminNfcCards: "NFC Serials",
    adminProvinces: "Provinces & Sights",
    adminUsers: "Users",
    adminAlbums: "Albums & Moderation",
    adminStickers: "Sticker Themes",
    adminAnalytics: "Traffic Analytics",
    adminSystemSettings: "System Settings",
    adminRole: "Admin",

    // ─── ADMIN DASHBOARD ───
    adminOverviewTitle: "📊 Overview",
    adminOverviewSubtitle: "VinaTap System Statistics",
    totalRevenueOffline: "Total Revenue (offline)",
    totalCardsSold: "Total Cards Sold",
    nfcActivatedCount: "Activated NFC Serials",
    totalUsers: "Total Users",
    inLast7Days: "in the last 7 days",
    totalAlbums: "Total Albums",
    publicAlbums: "public albums",
    pendingRequests: "Pending Requests",
    revenue30Days: "Revenue (Last 30 days)",
    noSalesIn30Days: "No sales recorded in the last 30 days",
    topProvincesActivated: "Top Activated Provinces",

    // ─── APPEARANCE SETTINGS ───
    appearanceTitle: "🎨 Appearance",
    appearanceSubtitle: "Language and visual theme preferences",
    settingsLanguage: "Language",
    languageDesc: "Choose your preferred display language across the app.",
    settingsTheme: "Display Theme",
    themeDesc: "Switch between light and dark mode for eye comfort.",
    themeLight: "Light",
    themeDark: "Dark",

    // ─── ACCOUNT SETTINGS ───
    accountTitle: "👤 Account",
    accountSubtitle: "Personal profile and physical NFC shipping address.",
    profileName: "Full name",
    displayName: "Display name",
    profileEmail: "Email",
    emailReadOnlyHint: "Email cannot be changed after registration.",
    profileAvatarChange: "Change avatar",
    profileAvatarUploading: "Uploading...",
    profilePhone: "Phone number",
    profilePhonePlaceholder: "e.g., 0912 345 678",
    profileAddress: "Shipping address",
    profileAddressPlaceholder:
      "Street, ward, city/province — for physical card delivery",
    profileSaveNote:
      "This info is used to deliver physical NFC cards to your address.",
    saveChanges: "Save changes",
    saving: "Saving...",
    savedSuccess: "Saved successfully",
    save: "Save changes",
    saved: "Saved",
    close: "Close",

    // ─── PASSWORD SETTINGS ───
    passwordTitle: "🔑 Password",
    passwordSubtitle: "Update your password to keep your account secure",
    currentPassword: "Current password",
    currentPasswordPlaceholder: "Enter your current password",
    newPassword: "New password",
    newPasswordPlaceholder: "Minimum 6 characters",
    confirmPassword: "Confirm new password",
    confirmPasswordPlaceholder: "Re-enter new password",
    updatePassword: "Update password",
    passwordMismatch: "New passwords do not match",
    passwordSuccess: "Password updated successfully",

    // ─── SUPPORT SETTINGS ───
    supportTitle: "🎧 Support & Help",
    supportSubtitle: "We are here to assist you 24/7",
    hotline: "Hotline",
    supportEmail: "Support Email",
    supportDocs: "Guides & Docs",
    supportDocsDesc: "Learn how to scan NFC cards and manage albums",

    // ─── ABOUT SETTINGS ───
    aboutTitle: "ℹ️ About VinaTap",
    aboutSubtitle: "Smart NFC memory collection platform",
    aboutDesc:
      "VinaTap helps you preserve precious memories through Vietnam map tiles.",
    appVersion: "App version",
    developer: "Developed by",

    // ─── LEGAL SETTINGS ───
    legalTitle: "📜 Terms & Privacy",
    legalSubtitle: "Data privacy policy and terms of service",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",

    // ─── HOMEPAGE & PUBLIC ───
    homeNavHome: "Home",
    homeNavAbout: "About",
    homeNavProducts: "Products",
    homeNavHandbook: "Handbook",
    homeNavFaq: "FAQ",
    signIn: "Sign in",
    signUp: "Sign up",
    backToHome: "Back to Home",

    // Hero
    heroEyebrow: "Discover Vietnam",
    heroTitleLine1: "Touch a destination",
    heroTitleAccent: "keep a whole journey",
    heroDesc:
      "Collect NFC cards marked with Vietnam's destinations. With just a tap, explore local stories, cultural and travel content, and preserve your own photos and notes after every journey.",
    heroBtnActivate: "Tap NFC Card",
    heroBtnExplore: "Explore Destinations",
    heroHighlightTitle: "Cards by Destination",
    heroHighlightSub:
      "Every card is a place you visited and a story to preserve.",
    heroPhoneTitle: "Discover Vietnam",
    heroPhoneSub: "across every destination",
    heroCardActivate: "Tap NFC Card",
    heroCardTapOpen: "Instantly open destination album",
    heroCardAiCaption: "AI Caption",
    heroCardAiDesc: "Generate inspiring travel stories",
    heroCardMemories: "Preserve Memories",
    heroCardMemoriesDesc: "Create albums, add photos & notes",

    // Feature strip
    featNoApp: "No app installation required",
    featAllPhones: "Works on all smartphones",
    featPrivacy: "Private albums, optional public sharing",
    featCollect34: "Collect all 34 map tiles",

    // About
    aboutEyebrow: "About Us",
    aboutHeading: "Every destination is a card, a memorable journey",
    aboutDescription:
      "VinaTap combines physical NFC cards with an interactive web experience, allowing you to tap the card to explore destination information, local culture, famous landmarks, and save personal photos and notes after every trip.",
    aboutStatProvinces: "Provinces",
    aboutStatLayers: "Experience Layers",
    aboutStatYear: "Launch Year",
    aboutIconPhysical: "Physical",
    aboutIconWeb: "Interactive Web",
    aboutIconAi: "AI Album",
    aboutIconGamification: "Gamification",

    // Pricing
    pricingEyebrow: "Packages",
    pricingTitle: "Choose the plan that fits you",
    pricingTier1Name: "Single Card (1 card)",
    pricingTier1Desc: "1 NFC card for any province of your choice",
    pricingTier1F1: "1 physical NFC card",
    pricingTier1F2: "1 AI photo album",
    pricingTier1F3: "Lifetime activation",
    pricingTier2Name: "Combo 3 Cards",
    pricingTier2Desc: "Popular choice for friends & family",
    pricingTier2Badge: "Most Popular",
    pricingTier2F1: "3 custom NFC cards",
    pricingTier2F2: "3 AI photo albums",
    pricingTier2F3: "Save compared to single purchases",
    pricingTier3Name: "Combo 5 Cards",
    pricingTier3Desc: "Begin your complete collection journey",
    pricingTier3F1: "5 custom NFC cards",
    pricingTier3F2: "5 AI photo albums",
    pricingTier3F3: "Best value package discount",
    pricingChooseBtn: "Choose this plan",

    // Provinces
    provEyebrow: "New",
    provTitle: "Featured Provinces",
    provSearchPlaceholder: "Search provinces...",
    provFilterAll: "All",
    provFilterNorth: "Northern",
    provFilterCentral: "Central",
    provFilterSouth: "Southern",
    provFilterIsland: "Islands",
    provEmpty: "No matching provinces found",

    // Policy
    policyEyebrow: "Policies",
    policyTitle: "Commitments & Customer Rights",
    policy1Title: "30-Day 1-to-1 Warranty",
    policy1Desc:
      "100% free replacement if the card or NFC chip has any technical defect within the first 30 days.",
    policy2Title: "Privacy & Data Security",
    policy2Desc:
      "Complete control over private or public albums. All travel photos and videos are securely encrypted in cloud storage.",
    policy3Title: "Shipping & Free Delivery from 500k",
    policy3Desc:
      "Nationwide delivery in 2-4 days. Free shipping is automatically applied for orders from 500,000 VND.",
    policy4Title: "Card Transfer & Gifting",
    policy4Desc:
      "Full ownership of cards and travel albums can be easily gifted or transferred via verified email.",
    policy5Title: "Secure VietQR & COD Payment",
    policy5Desc:
      "Supports transparent instant VietQR via PayOS gateway, or inspect cards and pay cash on delivery (COD).",
    policy6Title: "Heritage Quality Guarantee",
    policy6Desc:
      "Physical cards are waterproof and scratch-resistant. Cultural landmarks and regional travel information are thoroughly verified.",
    policyDisclaimer:
      "VinaTap is dedicated to supporting and protecting our customers throughout your journey of collecting and exploring Vietnam's heritage.",

    // FAQ
    faqEyebrow: "FAQ",
    faqTitle: "Things You Need To Know",
    faqBotName: "VinaTap Assistant",
    faqBotStatus: "Ready to help",
    faqBotGreeting:
      "Hello! I am VinaTap Assistant. I can help answer questions about card prices & combos, ordering, NFC technology, photo albums, and warranty.",
    faqPlaceholder: "Ask about card prices, combos, ordering, NFC, warranty...",
    faqNoAnswer:
      "I can help with card prices (1 card 49k, combo 3 cards 139k, 5 cards 239k), ordering instructions, NFC tap technology, or warranty. Please try one of the quick suggestions above or type your question!",

    // Footer
    footerDesc:
      "Vietnam Smart NFC Travel Map — collect, explore, and preserve memories from every trip.",
    footerProductCol: "Products",
    footerExploreCol: "Explore",
    footerCompanyCol: "Company",
    footerAbout: "About VinaTap",
    footerContact: "Contact",
    footerTerms: "Terms",
    footerPolicy: "Policies",
    footerCopyright: "© 2026 VinaTap. All rights reserved.",

    // Auth
    authBrandTitle1: "Discover",
    authBrandTitle2: "Vietnam",
    authBrandDesc1: "Where every province is a memory.",
    authBrandDesc2: "Collect, explore, and preserve your journey.",
    authTabLogin: "Sign in",
    authTabRegister: "Sign up",
    authLabelName: "Full name",
    authPlaceholderName: "Enter your full name",
    authLabelEmail: "Email",
    authPlaceholderEmail: "Enter your email",
    authLabelPassword: "Password",
    authPlaceholderPassword: "At least 6 characters",
    authForgotPassword: "Forgot password?",
    authBtnLogin: "Sign in",
    authBtnSendOtp: "Send Verification Code",
    authBtnConfirm: "Confirm",
    authProcessing: "Processing...",
    authOr: "or",
    authGoogle: "Continue with Google",
    authNoAccount: "Don't have an account?",
    authRegisterNow: "Sign up now",
    authHasAccount: "Already have an account?",
    authLoginNow: "Sign in",
    authOtpTitle: "Enter verification code",
    authOtpDesc: "A 6-digit code was sent to",
    authOtpExpire: "Code is valid for 10 minutes.",
    authResendOtp: "Resend code",
    authResendOtpIn: "Resend code in",
    authBack: "← Go back",
    authGoogleFail: "Google login failed, please try again",

    // ─── CUSTOMER DASHBOARD ───
    rankLevel1: "Novice Traveler",
    rankLevel2: "Companion",
    rankLevel3: "Explorer",
    passportTitle: "Traveler Passport",
    collectorBadge: "Collector",
    journeyBadge: "Journey",
    btnActivateCard: "Activate Card",
    btnCardStore: "Card Store",
    mapUnlockProgress: "Map Unlock Progress",
    provincesCount: "Provinces",
    cardsOwned: "Tiles Owned",
    tabOwnedCards: "Owned Cards",
    tabAll34Provinces: "All 34 Provinces",
    searchProvincePlaceholder: "Search province, serial code...",
    layoutSlider: "Slider",
    layoutGrid: "Grid",
    allRegions: "All Regions",
    regionNorth: "Northern",
    regionCentral: "Central",
    regionSouth: "Southern",
    regionIsland: "Islands",
    emptyTilesTitle: "You don't have any tiles yet",
    emptyTilesDesc:
      "Tap your NFC card to your phone or enter the serial code to unlock your first province on the map!",
    btnActivateNow: "Activate Now",
    btnBuyNewCards: "Buy New Cards",
    noFilterResults: "No locations found matching current filters.",
    btnResetFilters: "Reset filters",
    cardActivated: "Activated",
    cardOwned: "Owned",
    cardLocked: "Locked",
    albumArchived: "Album Locked",
    viewLockReason: "View lock reason",
    openAlbum: "Open Album",
    uploadPhoto: "Upload Photo",
    createAlbum: "Create Album",
    creatingAlbum: "Creating...",
    giftCard: "Gift",
    giftCardTitle: "Gift / Transfer this card to a friend via email",
    photosMemories: "photos preserved",
    emptyAlbumPrompt: "📸 Album empty • Upload your first photo!",
    readyToCreateAlbum: "✨ Card ready • Tap to create album",
    lockAlbumPrompt: "🔒 Collect card to unlock this province album",
    nfcMapTileDesc: "Vietnam NFC Smart Travel Map Tile",
    cardSerialPrefix: "Serial Code",
    readyCreateProvinceAlbum: "✨ Ready to create memory album",
    noPhotoYet: "📸 No photos yet • Tap to add photos",
    passportExplorer: "Explorer",
    passportSubtitle: "Journey to conquer 34 tiles of Vietnam's heritage map",
    passportIdTag: "Passport",
    buyUnlockCard: "Buy card to unlock",
    slideLeftTitle: "Slide left",
    slideRightTitle: "Slide right",

    // ─── ADMIN SIDEBAR ACCORDION ───
    adminSecOverview: "Overview & Reports",
    adminSecSales: "Sales & Inventory",
    adminSecContent: "Content & Map",
    adminSecUsers: "Users & Accounts",
    adminSecSystem: "Config & System",
    adminTrafficStats: "Traffic Analytics",
    adminProductsShipping: "Products",
    adminNotifications: "Send Notifications",
    adminProductsShippingFull: "Products & Shipping",
    adminVouchers: "Discount Vouchers",
  },
};

export const t = (lang, key) => dict[lang]?.[key] || dict.vi[key] || key;

// ─── TRANSLATION DATA CHO 34 TỈNH THÀNH VIỆT NAM ───
export const PROVINCES_EN = {
  "ha-noi": {
    name: "Hanoi",
    description:
      "A thousand-year-old capital of culture featuring 36 ancient streets, sacred Hoan Kiem Lake, Thang Long Imperial Citadel, and world-renowned culinary heritage.",
  },
  "ho-chi-minh": {
    name: "Ho Chi Minh City",
    description:
      "Vietnam's most vibrant economic, financial, and cultural powerhouse, blending classical colonial elegance with an energetic modern rhythm that never sleeps.",
  },
  "da-nang": {
    name: "Da Nang",
    description:
      "Vietnam's most livable coastal metropolis with stunning My Khe Beach, the iconic Golden Bridge at Ba Na Hills, legendary Dragon Bridge, and Marble Mountains.",
  },
  "quang-ninh": {
    name: "Quang Ninh",
    description:
      "UNESCO World Natural Wonder Ha Long Bay, the sacred mountain sanctuaries of Yen Tu, and an extraordinary maritime island heritage.",
  },
  "lam-dong": {
    name: "Lam Dong",
    description:
      "The dreamy mist and flower kingdom of Da Lat, lush rolling tea hills, year-round cool highland breeze, and majestic waterfalls.",
  },
  "hai-phong": {
    name: "Hai Phong",
    description:
      "The vibrant port city of red flamboyant blooms, the emerald waters of Cat Ba Archipelago, Do Son beach, and a renowned street food tour haven.",
  },
  hue: {
    name: "Hue",
    description:
      "The poetic imperial citadel along the Perfume River, royal palace complexes, UNESCO royal court music (Nha Nhac), and exquisite gastronomy.",
  },
  "can-tho": {
    name: "Can Tho",
    description:
      "The bustling capital of the Mekong Delta, famous for lively Cai Rang floating market, scenic Ninh Kieu Wharf, and boundless tropical fruit orchards.",
  },
  "bac-ninh": {
    name: "Bac Ninh",
    description:
      "The cradle of traditional Kinh Bac culture, birthplace of UNESCO-recognized Quan Ho folk melodies and centuries-old artisan craft villages.",
  },
  "hung-yen": {
    name: "Hung Yen",
    description:
      "The storied Pho Hien river port with ancient sacred temples, blooming fragrant lotus ponds, and royal-tribute longan fruits.",
  },
  "ninh-binh": {
    name: "Ninh Binh",
    description:
      "The thousand-year ancient capital Hoa Lu, UNESCO dual heritage Trang An landscape, Tam Coc river caves, and ethereal karst peaks.",
  },
  "phu-tho": {
    name: "Phu Tho",
    description:
      "Ancestral heartland of the Vietnamese nation and the sacred Hung Kings Temple, surrounded by lush rolling Long Coc tea hills.",
  },
  "thai-nguyen": {
    name: "Thai Nguyen",
    description:
      "Vietnam's premier tea capital with world-class Tan Cuong plantations, tranquil Nui Coc Lake, and historic ATK Dinh Hoa revolutionary base.",
  },
  "lao-cai": {
    name: "Lao Cai",
    description:
      "Where northwest mountain ranges meet the sky, crowned by Mount Fansipan - Roof of Indochina, misty alpine Sa Pa, and breathtaking stepped rice terraces.",
  },
  "tuyen-quang": {
    name: "Tuyen Quang",
    description:
      "Historic cradle of resistance with Tan Trao national relic, stunning Na Hang Lake among karst peaks, and Vietnam's grandest Mid-Autumn lantern festival.",
  },
  "cao-bang": {
    name: "Cao Bang",
    description:
      "UNESCO Global Geopark Non Nuoc Cao Bang, majestic Ban Gioc Waterfall—one of Southeast Asia's greatest natural wonders, and historic Pac Bo.",
  },
  "lang-son": {
    name: "Lang Son",
    description:
      "The historic northern frontier gateway featuring heroic Chi Lang Pass, Tam Thanh Pagoda caves, snowy Mau Son peak, and bustling border trade.",
  },
  "son-la": {
    name: "Son La",
    description:
      "The idyllic Moc Chau highland blooming through four seasons, heart-shaped tea plantations, Ban Ang pine groves, and the monumental Son La hydropower plant.",
  },
  "dien-bien": {
    name: "Dien Bien",
    description:
      "Echoes of historic Dien Bien Phu victories, golden Muong Thanh rice valley, and indigenous Thai culture along the peaceful Nam Rom River.",
  },
  "lai-chau": {
    name: "Lai Chau",
    description:
      "A mountaineer's heaven boasting towering peaks like Pu Si Lung, the dramatic O Quy Ho mountain pass, and untouched Thu Lum terraced fields.",
  },
  "thanh-hoa": {
    name: "Thanh Hoa",
    description:
      "A land of legends home to UNESCO World Heritage Citadel of the Ho Dynasty, lively Sam Son beach, pristine Pu Luong nature reserve, and sacred Cam Luong fish stream.",
  },
  "nghe-an": {
    name: "Nghe An",
    description:
      "The beloved homeland of President Ho Chi Minh, picturesque Cua Lo coastline, Pu Mat National Park, and bright blooming sunflower fields in Nghia Dan.",
  },
  "ha-tinh": {
    name: "Ha Tinh",
    description:
      "Poetic lands framed by Hong Linh mountain and La River, memorial sites of national poet Nguyen Du, and emerald-water Thien Cam beach.",
  },
  "quang-tri": {
    name: "Quang Tri",
    description:
      "A heroic land of peace and reflection, preserving Quang Tri Ancient Citadel, Truong Son Martyrs Cemetery, Vinh Moc Tunnels, and historic Hien Luong Bridge.",
  },
  "quang-ngai": {
    name: "Quang Ngai",
    description:
      "Volcanic ocean paradise of Ly Son island, sacred Thien An Mountain, serene Tra Khuc River, and tranquil beaches.",
  },
  "khanh-hoa": {
    name: "Khanh Hoa",
    description:
      "International resort paradise of Nha Trang Bay, crystal-clear Cam Ranh and Ninh Van lagoons, and thriving marine coral reefs.",
  },
  "gia-lai": {
    name: "Gia Lai",
    description:
      "The wild Central Highlands featuring emerald T'Nung volcanic lake, golden blooming Chu Dang Ya volcano, and vibrant indigenous gong heritage.",
  },
  "dak-lak": {
    name: "Dak Lak",
    description:
      "World-famous coffee capital Buon Ma Thuot, tranquil Lak Lake, Yok Don elephant wilderness, and deep-rooted Ede longhouse folklore.",
  },
  "dong-nai": {
    name: "Dong Nai",
    description:
      "Southeastern economic powerhouse and UNESCO Cat Tien Biosphere Reserve, scenic Giang Dien cascades, and expansive breezes over Tri An Lake.",
  },
  "tay-ninh": {
    name: "Tay Ninh",
    description:
      "Spiritual sanctuary crowned by Ba Den Mountain—the highest peak in southern Vietnam, the ornate Cao Dai Holy See, and expansive Dau Tieng Lake.",
  },
  "vinh-long": {
    name: "Vinh Long",
    description:
      "The peaceful green heart of the Mekong Delta with An Binh fruit islets, rustic river cruises, and glowing red heritage pottery kilns along the Co Chi River.",
  },
  "dong-thap": {
    name: "Dong Thap",
    description:
      "The fragrant lotus heartland of Thap Muoi, vibrant year-round Sa Dec flower gardens, Tram Chim red-crowned crane sanctuary, and colonial Huynh Thuy Le house.",
  },
  "an-giang": {
    name: "An Giang",
    description:
      "Mystic Seven Mountains realm, sacred Ba Chua Xu Temple on Mount Sam, duckweed carpets of Tra Su cajuput forest, and lively Long Xuyen floating market.",
  },
  "ca-mau": {
    name: "Ca Mau",
    description:
      "The sacred southernmost tip of Vietnam at Cape Ca Mau where ancient mangrove forests meet the sea, U Minh Ha wilderness, and world-renowned fresh crabs.",
  },
};

export const PROVINCE_BY_NAME_EN = {
  "Hà Nội": PROVINCES_EN["ha-noi"],
  "TP. Hồ Chí Minh": PROVINCES_EN["ho-chi-minh"],
  "Đà Nẵng": PROVINCES_EN["da-nang"],
  "Quảng Ninh": PROVINCES_EN["quang-ninh"],
  "Lâm Đồng": PROVINCES_EN["lam-dong"],
  "Hải Phòng": PROVINCES_EN["hai-phong"],
  Huế: PROVINCES_EN["hue"],
  "Cần Thơ": PROVINCES_EN["can-tho"],
  "Bắc Ninh": PROVINCES_EN["bac-ninh"],
  "Hưng Yên": PROVINCES_EN["hung-yen"],
  "Ninh Bình": PROVINCES_EN["ninh-binh"],
  "Phú Thọ": PROVINCES_EN["phu-tho"],
  "Thái Nguyên": PROVINCES_EN["thai-nguyen"],
  "Lào Cai": PROVINCES_EN["lao-cai"],
  "Tuyên Quang": PROVINCES_EN["tuyen-quang"],
  "Cao Bằng": PROVINCES_EN["cao-bang"],
  "Lạng Sơn": PROVINCES_EN["lang-son"],
  "Sơn La": PROVINCES_EN["son-la"],
  "Điện Biên": PROVINCES_EN["dien-bien"],
  "Lai Châu": PROVINCES_EN["lai-chau"],
  "Thanh Hóa": PROVINCES_EN["thanh-hoa"],
  "Nghệ An": PROVINCES_EN["nghe-an"],
  "Hà Tĩnh": PROVINCES_EN["ha-tinh"],
  "Quảng Trị": PROVINCES_EN["quang-tri"],
  "Quảng Ngãi": PROVINCES_EN["quang-ngai"],
  "Khánh Hòa": PROVINCES_EN["khanh-hoa"],
  "Gia Lai": PROVINCES_EN["gia-lai"],
  "Đắk Lắk": PROVINCES_EN["dak-lak"],
  "Đồng Nai": PROVINCES_EN["dong-nai"],
  "Tây Ninh": PROVINCES_EN["tay-ninh"],
  "Vĩnh Long": PROVINCES_EN["vinh-long"],
  "Đồng Tháp": PROVINCES_EN["dong-thap"],
  "An Giang": PROVINCES_EN["an-giang"],
  "Cà Mau": PROVINCES_EN["ca-mau"],
};

export const getProvinceName = (item, lang = "vi") => {
  if (!item) return "";
  const viName =
    typeof item === "string" ? item : item.name || item.province_name || "";
  if (lang !== "en") return viName;

  const slug =
    typeof item === "object" ? item.slug || item.province_slug : null;
  if (slug && PROVINCES_EN[slug]?.name) {
    return PROVINCES_EN[slug].name;
  }
  const byName = PROVINCE_BY_NAME_EN[viName];
  if (byName?.name) return byName.name;
  return viName;
};

export const getProvinceDesc = (item, lang = "vi") => {
  if (!item) return "";
  const viDesc = item.description || "";
  if (lang !== "en") return viDesc || "Khám phá địa danh nổi tiếng tại đây";

  const slug = item.slug || item.province_slug;
  if (slug && PROVINCES_EN[slug]?.description) {
    return PROVINCES_EN[slug].description;
  }
  const viName = item.name || item.province_name || "";
  if (viName && PROVINCE_BY_NAME_EN[viName]?.description) {
    return PROVINCE_BY_NAME_EN[viName].description;
  }
  return viDesc || "Discover famous landmarks here";
};
