export const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Konut İnşaatı', slug: 'konut-insaati', description: 'Apartman, Villa ve Müstakil Ev Projeleri', icon: 'home', sort_order: 1, is_active: 1 },
  { id: 2, name: 'Ticari İnşaat', slug: 'ticari-insaat', description: 'Ofis, AVM ve İş Merkezi Projeleri', icon: 'building', sort_order: 2, is_active: 1 },
  { id: 3, name: 'Mimarlık ve Tasarım', slug: 'mimarlik-tasarim', description: 'Mimari Proje ve Tasarım Hizmetleri', icon: 'drafting-compass', sort_order: 3, is_active: 1 },
  { id: 4, name: 'Restorasyon', slug: 'restorasyon', description: 'Restorasyon ve Yenileme Projeleri', icon: 'tools', sort_order: 4, is_active: 1 },
  { id: 5, name: 'İç Mimari', slug: 'ic-mimari', description: 'İç Mekan Tasarım ve Dekorasyon', icon: 'couch', sort_order: 5, is_active: 1 },
  { id: 6, name: 'Altyapı', slug: 'altyapi', description: 'Altyapı ve Zemin Etüdü Projeleri', icon: 'layer-group', sort_order: 6, is_active: 1 },
  { id: 7, name: 'Çevre Düzenlemesi', slug: 'cevre-duzenlemesi', description: 'Yol ve Çevre Düzenleme Projeleri', icon: 'tree', sort_order: 7, is_active: 1 },
];

export const FALLBACK_PROJECTS = [
  {
    id: 1,
    category_id: 1,
    category_name: 'Konut İnşaatı',
    category_slug: 'konut-insaati',
    title: 'Toplu Konut & Betonarme Yapı Kompleksi',
    slug: 'toplu-konut-betonarme-yapi-kompleksi',
    description:
      'Deprem yönetmeliğine tam uyumlu, yüksek dayanımlı betonarme taşıyıcı sistem ve modern kalıp teknolojileriyle inşa edilen çok bloklu konut ve yaşam projemiz. Saha dökümleri, perde beton imalatları ve üst yapı uygulamaları uzman mühendis kadromuz kontrolünde tamamlanmıştır.',
    short_description: 'Depreme dayanıklı betonarme taşıyıcı sistemli çok bloklu toplu konut projesi.',
    location: 'Türkiye',
    area: 18500,
    year: 2025,
    status: 'tamamlandi',
    is_featured: 1,
    sort_order: 1,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-037.jpg',
  },
  {
    id: 2,
    category_id: 6,
    category_name: 'Altyapı',
    category_slug: 'altyapi',
    title: 'Yüksek İstinat Duvarı & Perde Beton Projesi',
    slug: 'yuksek-istinat-duvari-perde-beton-projesi',
    description:
      'Yüksek kot farklarına sahip arazilerde zemin güvenliğini sağlamak amacıyla projelendirilen ağır hizmet tipi betonarme istinat duvarı ve perde beton imalatları. Çelik yüzeyli endüstriyel kalıp sistemleri ile pürüzsüz brüt beton yüzey kalitesi elde edilmiştir.',
    short_description: 'Endüstriyel kalıp sistemleriyle yüksek dayanımlı brüt beton istinat ve perde duvar uygulaması.',
    location: 'Türkiye',
    area: 9200,
    year: 2025,
    status: 'tamamlandi',
    is_featured: 1,
    sort_order: 2,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-089.jpg',
  },
  {
    id: 3,
    category_id: 6,
    category_name: 'Altyapı',
    category_slug: 'altyapi',
    title: 'Ağır Demir Donatı & Radye Temel Uygulaması',
    slug: 'agir-demir-donati-radye-temel-uygulamasi',
    description:
      'Büyük ölçekli üstyapı ve mühendislik yapıları için yüksek yoğunluklu nervürlü çelik donatı işçiliği, temel kirişleri ve radye temel beton döküm çalışmaları. Statik projeye birebir uygunluk ve maksimum mukavemet standartlarında uygulanmıştır.',
    short_description: 'Yüksek yoğunluklu çelik donatı ve radye temel mühendislik uygulaması.',
    location: 'Türkiye',
    area: 14000,
    year: 2025,
    status: 'tamamlandi',
    is_featured: 1,
    sort_order: 3,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-067.jpg',
  },
  {
    id: 4,
    category_id: 2,
    category_name: 'Ticari İnşaat',
    category_slug: 'ticari-insaat',
    title: 'Endüstriyel Tesis & Fabrika Temel İnşaatı',
    slug: 'endustriyel-tesis-fabrika-temel-insaati',
    description:
      'Ağır makine yüklerine ve endüstriyel operasyonlara dayanıklı fabrika içi makine temelleri, derin temel çukuru donatı imalatları ve yüksek mukavemetli endüstriyel saha betonu uygulamaları.',
    short_description: 'Ağır yük taşıma kapasiteli endüstriyel tesis ve makine temeli inşaatı.',
    location: 'Türkiye',
    area: 11500,
    year: 2025,
    status: 'devam_ediyor',
    is_featured: 1,
    sort_order: 4,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-003.jpg',
  },
  {
    id: 5,
    category_id: 7,
    category_name: 'Çevre Düzenlemesi',
    category_slug: 'cevre-duzenlemesi',
    title: 'Altyapı Galerisi & Tünel Kalıp Sistemi',
    slug: 'altyapi-galerisi-tunel-kalip-sistemi',
    description:
      'Uzun metrajlı altyapı hatları, betonarme galeri kanalları ve çevre düzenleme kapsamında gerçekleştirilen kazı, grobeton, demir donatı ve modüler kalıp imalatları.',
    short_description: 'Uzun metrajlı betonarme altyapı galerisi, kanal ve saha mühendisliği projesi.',
    location: 'Türkiye',
    area: 16800,
    year: 2025,
    status: 'devam_ediyor',
    is_featured: 1,
    sort_order: 5,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-086.jpg',
  },
  {
    id: 6,
    category_id: 1,
    category_name: 'Konut İnşaatı',
    category_slug: 'konut-insaati',
    title: 'Anahtar Teslim Betonarme & Saha Uygulamaları',
    slug: 'anahtar-teslim-betonarme-saha-uygulamalari',
    description:
      'Vinç destekli ağır kalıp montajı, gece ve gündüz kesintisiz pompa beton dökümleri, kolon-perde imalatları ve anahtar teslim şantiye yönetimi çalışmalarımız.',
    short_description: 'Vinç destekli modüler kalıp montajı ve anahtar teslim betonarme saha uygulamaları.',
    location: 'Türkiye',
    area: 12400,
    year: 2024,
    status: 'tamamlandi',
    is_featured: 1,
    sort_order: 6,
    is_active: 1,
    cover_image: '/uploads/images/sah-photo-144.jpg',
  },
];

export function getFallbackProjectBySlug(slug) {
  const proj = FALLBACK_PROJECTS.find((p) => p.slug === slug);
  if (!proj) return null;

  const images = [];
  for (let i = 0; i < 148; i++) {
    if ((i % 6) + 1 === proj.id) {
      const num = String(i + 1).padStart(3, '0');
      const filePath = `/uploads/images/sah-photo-${num}.jpg`;
      images.push({
        id: i + 1,
        project_id: proj.id,
        file_name: `sah-photo-${num}.jpg`,
        original_name: `${proj.title} - Fotoğraf #${i + 1}`,
        file_path: filePath,
        thumbnail_path: filePath,
        file_type: 'image',
        is_cover: filePath === proj.cover_image ? 1 : 0,
      });
    }
  }

  const videos = [];
  for (let i = 0; i < 14; i++) {
    if ((i % 6) + 1 === proj.id) {
      const num = String(i + 1).padStart(2, '0');
      videos.push({
        id: 1000 + i + 1,
        project_id: proj.id,
        file_name: `sah-video-${num}.mp4`,
        original_name: `${proj.title} - Saha Videosu #${i + 1}`,
        file_path: `/uploads/videos/sah-video-${num}.mp4`,
        file_type: 'video',
        is_cover: 0,
      });
    }
  }

  return {
    ...proj,
    media: [...images.sort((a, b) => b.is_cover - a.is_cover), ...videos],
  };
}

