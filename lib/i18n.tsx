import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import { PropsWithChildren, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { LanguageCode } from '@/types/domain';

const STORAGE_KEY = 'msale.language';

const en: Record<string, string> = {
  'app.tagline': 'Good things, nearby.',
  'nav.discover': 'Discover',
  'nav.search': 'Search',
  'nav.sell': 'Sell',
  'nav.inbox': 'Inbox',
  'nav.profile': 'Profile',
  'common.back': 'Back',
  'common.cancel': 'Cancel',
  'common.close': 'Close',
  'common.continue': 'Continue',
  'common.done': 'Done',
  'common.edit': 'Edit',
  'common.retry': 'Try again',
  'common.save': 'Save',
  'common.send': 'Send',
  'common.share': 'Share',
  'common.more': 'More',
  'common.viewAll': 'View all',
  'common.demo': 'Demo mode',
  'common.loading': 'Loading…',
  'discover.eyebrow': 'MALAYSIA’S LOCAL MARKETPLACE',
  'discover.greeting': 'Find something worth keeping.',
  'discover.search': 'Search furniture, cameras, bicycles…',
  'discover.location': 'Browsing near {{location}}',
  'discover.categories': 'Browse by category',
  'discover.fresh': 'Fresh near you',
  'discover.freshSubtitle': 'New finds from people around your neighbourhood.',
  'discover.heroTitle': 'Meet nearby. Buy thoughtfully.',
  'discover.heroBody': 'Chat directly, choose a public meetup spot, and give good things a longer life.',
  'discover.heroAction': 'Explore nearby',
  'discover.noResults': 'No finds here yet',
  'discover.noResultsBody': 'Try another category or widen your search.',
  'search.title': 'Search the neighbourhood',
  'search.placeholder': 'What are you looking for?',
  'search.filters': 'Filters',
  'search.results': '{{count}} local finds',
  'search.category': 'Category',
  'search.condition': 'Condition',
  'search.location': 'Location',
  'search.sort': 'Sort',
  'search.all': 'All',
  'search.newest': 'Newest',
  'search.nearby': 'Nearest',
  'search.priceLow': 'Price: low to high',
  'search.priceHigh': 'Price: high to low',
  'listing.condition': 'Condition',
  'listing.description': 'About this item',
  'listing.location': 'Meetup area',
  'listing.seller': 'Meet the seller',
  'listing.message': 'Message seller',
  'listing.favorite': 'Save listing',
  'listing.unfavorite': 'Remove from saved',
  'listing.safetyTitle': 'Meet safely',
  'listing.safetyBody': 'Choose a busy public place, inspect the item before paying, and never share verification codes.',
  'listing.posted': 'Listed {{time}}',
  'listing.responses': '{{count}}% responses',
  'condition.new': 'New',
  'condition.like_new': 'Like new',
  'condition.good': 'Good',
  'condition.fair': 'Fair',
  'category.furniture': 'Furniture',
  'category.electronics': 'Electronics',
  'category.fashion': 'Fashion',
  'category.vehicles': 'Vehicles',
  'category.hobbies': 'Hobbies',
  'category.home': 'Home',
  'category.sports': 'Sports',
  'category.other': 'Other',
  'sell.eyebrow': 'PASS IT FORWARD',
  'sell.title': 'List something lovely.',
  'sell.subtitle': 'A few honest details help the right buyer find it.',
  'sell.photos': 'Photos',
  'sell.photosHint': 'Add up to 8 clear photos. The first will be your cover.',
  'sell.addPhotos': 'Add photos',
  'sell.details': 'Item details',
  'sell.titleLabel': 'Title',
  'sell.titlePlaceholder': 'e.g. Solid oak side table',
  'sell.descriptionLabel': 'Description',
  'sell.descriptionPlaceholder': 'Share the story, size, age and any flaws…',
  'sell.priceLabel': 'Price',
  'sell.categoryLabel': 'Category',
  'sell.conditionLabel': 'Condition',
  'sell.meetup': 'Meetup',
  'sell.stateLabel': 'State or territory',
  'sell.areaLabel': 'Area',
  'sell.areaPlaceholder': 'e.g. Bangsar',
  'sell.meetupNotesLabel': 'Meetup notes (optional)',
  'sell.meetupNotesPlaceholder': 'Suggest a public location and suitable times.',
  'sell.publish': 'Publish listing',
  'sell.success': 'Your listing is live',
  'sell.successBody': 'Local buyers can now discover it and start a conversation.',
  'sell.validation': 'Please complete the highlighted details.',
  'inbox.title': 'Your conversations',
  'inbox.subtitle': 'Keep plans clear and meet in a public place.',
  'inbox.empty': 'No messages yet',
  'inbox.emptyBody': 'When you message a seller, the conversation will appear here.',
  'chat.placeholder': 'Write a message…',
  'chat.safety': 'Never send deposits or verification codes.',
  'chat.quickReply': 'Usually replies quickly',
  'chat.startConversation': 'Start the conversation',
  'profile.memberSince': 'Member since {{year}}',
  'profile.rating': 'Rating',
  'profile.responses': 'Response rate',
  'profile.reviews': 'Reviews',
  'profile.listings': 'My listings',
  'profile.saved': 'Saved',
  'profile.language': 'Language',
  'profile.settings': 'Settings',
  'profile.help': 'Safety & help',
  'profile.signIn': 'Sign in',
  'profile.signOut': 'Sign out',
  'language.title': 'Choose your language',
  'language.english': 'English',
  'language.malay': 'Bahasa Melayu',
  'language.mandarin': '中文',
  'auth.eyebrow': 'WELCOME TO MSALE',
  'auth.title': 'Your neighbourhood marketplace.',
  'auth.subtitle': 'Sign in to list items, save finds and chat with people nearby.',
  'auth.email': 'Email address',
  'auth.password': 'Password',
  'auth.signIn': 'Sign in',
  'auth.signUp': 'Create account',
  'auth.switchSignIn': 'Already have an account? Sign in',
  'auth.switchSignUp': 'New here? Create an account',
  'auth.checkEmail': 'Check your email to confirm your account.',
  'auth.validation': 'Use a valid email and a password with at least 8 characters.',
  'auth.demoNotice': 'Supabase is not configured, so msale is running with safe demo data.',
  'notFound.title': 'This page wandered off',
  'notFound.body': 'The item or conversation may no longer be available.',
};

const ms: Record<string, string> = {
  ...en,
  'app.tagline': 'Barang baik, dekat anda.',
  'nav.discover': 'Temui', 'nav.search': 'Cari', 'nav.sell': 'Jual', 'nav.inbox': 'Mesej', 'nav.profile': 'Profil',
  'common.back': 'Kembali', 'common.cancel': 'Batal', 'common.close': 'Tutup', 'common.continue': 'Teruskan', 'common.done': 'Selesai', 'common.edit': 'Sunting', 'common.retry': 'Cuba lagi', 'common.save': 'Simpan', 'common.send': 'Hantar', 'common.share': 'Kongsi', 'common.more': 'Lagi', 'common.viewAll': 'Lihat semua', 'common.demo': 'Mod demo', 'common.loading': 'Memuatkan…',
  'discover.eyebrow': 'PASARAN TEMPATAN MALAYSIA', 'discover.greeting': 'Temui sesuatu yang berbaloi disimpan.', 'discover.search': 'Cari perabot, kamera, basikal…', 'discover.location': 'Melayari berhampiran {{location}}', 'discover.categories': 'Semak mengikut kategori', 'discover.fresh': 'Terbaharu berdekatan', 'discover.freshSubtitle': 'Barangan baharu daripada orang di kawasan anda.', 'discover.heroTitle': 'Jumpa berdekatan. Beli dengan bijak.', 'discover.heroBody': 'Berbual terus, pilih tempat pertemuan awam dan panjangkan hayat barangan yang baik.', 'discover.heroAction': 'Terokai berdekatan', 'discover.noResults': 'Belum ada barangan di sini', 'discover.noResultsBody': 'Cuba kategori lain atau luaskan carian anda.',
  'search.title': 'Cari di kawasan anda', 'search.placeholder': 'Apa yang anda cari?', 'search.filters': 'Penapis', 'search.results': '{{count}} barangan tempatan', 'search.category': 'Kategori', 'search.condition': 'Keadaan', 'search.location': 'Lokasi', 'search.sort': 'Susun', 'search.all': 'Semua', 'search.newest': 'Terbaharu', 'search.nearby': 'Terdekat', 'search.priceLow': 'Harga: rendah ke tinggi', 'search.priceHigh': 'Harga: tinggi ke rendah',
  'listing.condition': 'Keadaan', 'listing.description': 'Tentang barangan ini', 'listing.location': 'Kawasan pertemuan', 'listing.seller': 'Kenali penjual', 'listing.message': 'Mesej penjual', 'listing.favorite': 'Simpan iklan', 'listing.unfavorite': 'Buang daripada simpanan', 'listing.safetyTitle': 'Berjumpa dengan selamat', 'listing.safetyBody': 'Pilih tempat awam yang sibuk, periksa barangan sebelum membayar dan jangan kongsi kod pengesahan.', 'listing.posted': 'Disenaraikan {{time}}', 'listing.responses': '{{count}}% balasan',
  'condition.new': 'Baharu', 'condition.like_new': 'Seperti baharu', 'condition.good': 'Baik', 'condition.fair': 'Sederhana',
  'category.furniture': 'Perabot', 'category.electronics': 'Elektronik', 'category.fashion': 'Fesyen', 'category.vehicles': 'Kenderaan', 'category.hobbies': 'Hobi', 'category.home': 'Rumah', 'category.sports': 'Sukan', 'category.other': 'Lain-lain',
  'sell.eyebrow': 'BERI PELUANG KEDUA', 'sell.title': 'Senaraikan barangan anda.', 'sell.subtitle': 'Butiran yang jujur membantu pembeli yang sesuai menemuinya.', 'sell.photos': 'Foto', 'sell.photosHint': 'Tambah sehingga 8 foto yang jelas. Foto pertama ialah muka depan.', 'sell.addPhotos': 'Tambah foto', 'sell.details': 'Butiran barangan', 'sell.titleLabel': 'Tajuk', 'sell.titlePlaceholder': 'cth. Meja sisi kayu oak', 'sell.descriptionLabel': 'Penerangan', 'sell.descriptionPlaceholder': 'Kongsi cerita, saiz, usia dan sebarang kecacatan…', 'sell.priceLabel': 'Harga', 'sell.categoryLabel': 'Kategori', 'sell.conditionLabel': 'Keadaan', 'sell.meetup': 'Pertemuan', 'sell.stateLabel': 'Negeri atau wilayah', 'sell.areaLabel': 'Kawasan', 'sell.areaPlaceholder': 'cth. Bangsar', 'sell.meetupNotesLabel': 'Nota pertemuan (pilihan)', 'sell.meetupNotesPlaceholder': 'Cadangkan lokasi awam dan masa yang sesuai.', 'sell.publish': 'Terbitkan iklan', 'sell.success': 'Iklan anda sudah disiarkan', 'sell.successBody': 'Pembeli tempatan kini boleh menemuinya dan memulakan perbualan.', 'sell.validation': 'Sila lengkapkan butiran yang ditandakan.',
  'inbox.title': 'Perbualan anda', 'inbox.subtitle': 'Pastikan rancangan jelas dan berjumpa di tempat awam.', 'inbox.empty': 'Belum ada mesej', 'inbox.emptyBody': 'Apabila anda menghantar mesej kepada penjual, perbualan akan muncul di sini.', 'chat.placeholder': 'Tulis mesej…', 'chat.safety': 'Jangan hantar deposit atau kod pengesahan.', 'chat.quickReply': 'Biasanya membalas dengan cepat', 'chat.startConversation': 'Mulakan perbualan',
  'profile.memberSince': 'Ahli sejak {{year}}', 'profile.rating': 'Penilaian', 'profile.responses': 'Kadar balasan', 'profile.reviews': 'Ulasan', 'profile.listings': 'Iklan saya', 'profile.saved': 'Disimpan', 'profile.language': 'Bahasa', 'profile.settings': 'Tetapan', 'profile.help': 'Keselamatan & bantuan', 'profile.signIn': 'Log masuk', 'profile.signOut': 'Log keluar',
  'language.title': 'Pilih bahasa anda', 'language.english': 'English', 'language.malay': 'Bahasa Melayu', 'language.mandarin': '中文',
  'auth.eyebrow': 'SELAMAT DATANG KE MSALE', 'auth.title': 'Pasaran kawasan anda.', 'auth.subtitle': 'Log masuk untuk menjual, menyimpan pilihan dan berbual dengan orang berdekatan.', 'auth.email': 'Alamat e-mel', 'auth.password': 'Kata laluan', 'auth.signIn': 'Log masuk', 'auth.signUp': 'Cipta akaun', 'auth.switchSignIn': 'Sudah mempunyai akaun? Log masuk', 'auth.switchSignUp': 'Pengguna baharu? Cipta akaun', 'auth.checkEmail': 'Semak e-mel anda untuk mengesahkan akaun.', 'auth.validation': 'Gunakan e-mel yang sah dan kata laluan sekurang-kurangnya 8 aksara.', 'auth.demoNotice': 'Supabase belum dikonfigurasi, jadi msale menggunakan data demo yang selamat.',
  'notFound.title': 'Halaman ini tidak ditemui', 'notFound.body': 'Barangan atau perbualan ini mungkin tidak lagi tersedia.',
};

const zh: Record<string, string> = {
  ...en,
  'app.tagline': '好物，就在附近。',
  'nav.discover': '发现', 'nav.search': '搜索', 'nav.sell': '出售', 'nav.inbox': '消息', 'nav.profile': '我的',
  'common.back': '返回', 'common.cancel': '取消', 'common.close': '关闭', 'common.continue': '继续', 'common.done': '完成', 'common.edit': '编辑', 'common.retry': '重试', 'common.save': '保存', 'common.send': '发送', 'common.share': '分享', 'common.more': '更多', 'common.viewAll': '查看全部', 'common.demo': '演示模式', 'common.loading': '加载中…',
  'discover.eyebrow': '马来西亚本地市集', 'discover.greeting': '寻找值得珍藏的好物。', 'discover.search': '搜索家具、相机、自行车…', 'discover.location': '正在浏览 {{location}} 附近', 'discover.categories': '按类别浏览', 'discover.fresh': '附近新品', 'discover.freshSubtitle': '看看邻里刚刚发布的好物。', 'discover.heroTitle': '附近见面，安心选购。', 'discover.heroBody': '直接沟通、选择公共见面地点，让好物延续更久。', 'discover.heroAction': '探索附近', 'discover.noResults': '这里暂时没有商品', 'discover.noResultsBody': '试试其他类别或扩大搜索范围。',
  'search.title': '搜索你的邻里', 'search.placeholder': '你在找什么？', 'search.filters': '筛选', 'search.results': '{{count}} 件本地商品', 'search.category': '类别', 'search.condition': '成色', 'search.location': '地点', 'search.sort': '排序', 'search.all': '全部', 'search.newest': '最新', 'search.nearby': '最近', 'search.priceLow': '价格：从低到高', 'search.priceHigh': '价格：从高到低',
  'listing.condition': '成色', 'listing.description': '商品详情', 'listing.location': '见面区域', 'listing.seller': '卖家信息', 'listing.message': '联系卖家', 'listing.favorite': '收藏商品', 'listing.unfavorite': '取消收藏', 'listing.safetyTitle': '安全见面', 'listing.safetyBody': '选择人多的公共场所，付款前检查商品，切勿分享验证码。', 'listing.posted': '{{time}}发布', 'listing.responses': '回复率 {{count}}%',
  'condition.new': '全新', 'condition.like_new': '几乎全新', 'condition.good': '良好', 'condition.fair': '一般',
  'category.furniture': '家具', 'category.electronics': '电子产品', 'category.fashion': '时尚', 'category.vehicles': '交通工具', 'category.hobbies': '兴趣爱好', 'category.home': '家居', 'category.sports': '运动', 'category.other': '其他',
  'sell.eyebrow': '让好物继续流转', 'sell.title': '发布你的好物。', 'sell.subtitle': '诚实清楚的描述，帮助合适的买家找到它。', 'sell.photos': '照片', 'sell.photosHint': '最多添加 8 张清晰照片，第一张将作为封面。', 'sell.addPhotos': '添加照片', 'sell.details': '商品详情', 'sell.titleLabel': '标题', 'sell.titlePlaceholder': '例如：实木橡木边桌', 'sell.descriptionLabel': '描述', 'sell.descriptionPlaceholder': '说明故事、尺寸、使用时间和任何瑕疵…', 'sell.priceLabel': '价格', 'sell.categoryLabel': '类别', 'sell.conditionLabel': '成色', 'sell.meetup': '见面取货', 'sell.stateLabel': '州或联邦直辖区', 'sell.areaLabel': '地区', 'sell.areaPlaceholder': '例如：Bangsar', 'sell.meetupNotesLabel': '见面备注（选填）', 'sell.meetupNotesPlaceholder': '建议公共地点和合适时间。', 'sell.publish': '发布商品', 'sell.success': '商品已发布', 'sell.successBody': '附近买家现在可以发现它并与你联系。', 'sell.validation': '请完成标记的资料。',
  'inbox.title': '你的对话', 'inbox.subtitle': '清楚确认安排，并选择公共地点见面。', 'inbox.empty': '暂无消息', 'inbox.emptyBody': '联系卖家后，对话会显示在这里。', 'chat.placeholder': '输入消息…', 'chat.safety': '切勿支付订金或分享验证码。', 'chat.quickReply': '通常很快回复', 'chat.startConversation': '开始对话',
  'profile.memberSince': '{{year}} 年加入', 'profile.rating': '评分', 'profile.responses': '回复率', 'profile.reviews': '评价', 'profile.listings': '我的商品', 'profile.saved': '已收藏', 'profile.language': '语言', 'profile.settings': '设置', 'profile.help': '安全与帮助', 'profile.signIn': '登录', 'profile.signOut': '退出登录',
  'language.title': '选择语言', 'language.english': 'English', 'language.malay': 'Bahasa Melayu', 'language.mandarin': '中文',
  'auth.eyebrow': '欢迎来到 MSALE', 'auth.title': '你的邻里市集。', 'auth.subtitle': '登录后即可发布、收藏并与附近的人聊天。', 'auth.email': '电子邮箱', 'auth.password': '密码', 'auth.signIn': '登录', 'auth.signUp': '创建账户', 'auth.switchSignIn': '已有账户？登录', 'auth.switchSignUp': '第一次使用？创建账户', 'auth.checkEmail': '请查看电子邮件以确认账户。', 'auth.validation': '请输入有效的电子邮箱和至少 8 个字符的密码。', 'auth.demoNotice': '尚未配置 Supabase，msale 正在使用安全的演示数据。',
  'notFound.title': '这个页面走丢了', 'notFound.body': '该商品或对话可能已不可用。',
};

const translations: Record<LanguageCode, Record<string, string>> = { en, ms, zh };

type I18nContextValue = {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => Promise<void>;
  t: (key: string, variables?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getDeviceLanguage(): LanguageCode {
  const code = getLocales()[0]?.languageCode;
  if (code === 'ms' || code === 'zh') return code;
  return 'en';
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<LanguageCode>(getDeviceLanguage);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((stored) => {
      if (stored === 'en' || stored === 'ms' || stored === 'zh') setLanguageState(stored);
    });
  }, []);

  const setLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    setLanguageState(nextLanguage);
    await AsyncStorage.setItem(STORAGE_KEY, nextLanguage);
  }, []);

  const t = useCallback((key: string, variables?: Record<string, string | number>) => {
    let result = translations[language][key] ?? translations.en[key] ?? key;
    for (const [name, value] of Object.entries(variables ?? {})) {
      result = result.replaceAll(`{{${name}}}`, String(value));
    }
    return result;
  }, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, setLanguage, t]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) throw new Error('useI18n must be used inside I18nProvider');
  return value;
}
