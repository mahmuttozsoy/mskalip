const fs = require('fs');
const path = require('path');
const os = require('os');
const bcrypt = require('bcryptjs');

const SEED_DB_FILE = path.join(__dirname, '..', 'database', 'local_db.json');
const PERSISTENT_DIR = path.join(os.homedir(), '.msgroup_data');
const PERSISTENT_DB_FILE = path.join(PERSISTENT_DIR, 'local_db.json');

function getDefaultData() {
  const passwordHash = bcrypt.hashSync('Admin123!', 10);
  const now = new Date().toISOString();

  return {
    admins: [
      {
        id: 1,
        username: 'admin',
        email: 'admin@shahgroup.com',
        password: passwordHash,
        full_name: 'Sistem Yöneticisi',
        role: 'super_admin',
        is_active: 1,
        created_at: now,
      },
    ],
    categories: [
      { id: 1, name: 'Konut İnşaatı', slug: 'konut-insaati', description: 'Apartman, Villa ve Müstakil Ev Projeleri', icon: 'home', sort_order: 1, is_active: 1 },
      { id: 2, name: 'Ticari İnşaat', slug: 'ticari-insaat', description: 'Ofis, AVM ve İş Merkezi Projeleri', icon: 'building', sort_order: 2, is_active: 1 },
      { id: 3, name: 'Mimarlık ve Tasarım', slug: 'mimarlik-tasarim', description: 'Mimari Proje ve Tasarım Hizmetleri', icon: 'drafting-compass', sort_order: 3, is_active: 1 },
      { id: 4, name: 'Restorasyon', slug: 'restorasyon', description: 'Restorasyon ve Yenileme Projeleri', icon: 'tools', sort_order: 4, is_active: 1 },
      { id: 5, name: 'İç Mimari', slug: 'ic-mimari', description: 'İç Mekan Tasarım ve Dekorasyon', icon: 'couch', sort_order: 5, is_active: 1 },
      { id: 6, name: 'Altyapı', slug: 'altyapi', description: 'Altyapı ve Zemin Etüdü Projeleri', icon: 'layer-group', sort_order: 6, is_active: 1 },
      { id: 7, name: 'Çevre Düzenlemesi', slug: 'cevre-duzenlemesi', description: 'Yol ve Çevre Düzenleme Projeleri', icon: 'tree', sort_order: 7, is_active: 1 },
    ],
    projects: [
      {
        id: 1,
        category_id: 1,
        title: 'Şah Vadi Konakları',
        slug: 'sah-vadi-konaklari',
        description: 'Modern mimarisi, geniş peyzaj alanları, akıllı ev teknolojileri ve depreme dayanıklı radye temel sistemiyle inşa edilen lüks konut projemiz.',
        short_description: 'Modern mimari ve geniş yeşil alanlarıyla lüks yaşam projesi.',
        location: 'İstanbul, Başakşehir',
        area: 14500,
        year: 2025,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 1,
        is_active: 1,
        created_at: now,
      },
      {
        id: 2,
        category_id: 2,
        title: 'Şah Tower İş Merkezi',
        slug: 'sah-tower-is-merkezi',
        description: 'A+ ofis standartlarında tasarlanan, yüksek enerji verimliliğine sahip, merkezi konumda prestijli ticari iş merkezi projemiz.',
        short_description: 'A+ standartlarda prestijli ofis ve ticari yaşam merkezi.',
        location: 'İstanbul, Ataşehir',
        area: 22000,
        year: 2025,
        status: 'devam_ediyor',
        is_featured: 1,
        sort_order: 2,
        is_active: 1,
        created_at: now,
      },
      {
        id: 3,
        category_id: 1,
        title: 'Panorama Marin Villaları',
        slug: 'panorama-marin-villalari',
        description: 'Deniz manzaralı, müstakil havuzlu ve özel bahçe tasarımlı 12 adet ultra lüks villadan oluşan seçkin yaşam projesi.',
        short_description: 'Müstakil havuzlu ve özel bahçeli ultra lüks villa projesi.',
        location: 'Muğla, Bodrum',
        area: 8400,
        year: 2024,
        status: 'tamamlandi',
        is_featured: 1,
        sort_order: 3,
        is_active: 1,
        created_at: now,
      },
    ],
    media: [
      {
        id: 1,
        project_id: 1,
        file_name: 'project1.jpg',
        original_name: 'Şah Vadi Konakları Dış Cephe',
        file_path: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80',
        thumbnail_path: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
        file_type: 'image',
        is_cover: 1,
        sort_order: 1,
        created_at: now,
      },
      {
        id: 2,
        project_id: 2,
        file_name: 'project2.jpg',
        original_name: 'Şah Tower İş Merkezi',
        file_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80',
        thumbnail_path: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&q=80',
        file_type: 'image',
        is_cover: 1,
        sort_order: 1,
        created_at: now,
      },
      {
        id: 3,
        project_id: 3,
        file_name: 'project3.jpg',
        original_name: 'Panorama Marin Villaları',
        file_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
        thumbnail_path: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
        file_type: 'image',
        is_cover: 1,
        sort_order: 1,
        created_at: now,
      },
      {
        id: 4,
        project_id: 1,
        file_name: 'interior1.jpg',
        original_name: 'Örnek Daire İç Mekan',
        file_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80',
        thumbnail_path: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80',
        file_type: 'image',
        is_cover: 0,
        sort_order: 2,
        created_at: now,
      },
    ],
    services: [
      { id: 1, title: 'Konut İnşaatı', slug: 'konut-insaati', description: 'Apartman, villa ve müstakil ev projelerinde yüksek kaliteli inşaat hizmetleri sunuyoruz.', short_description: 'Hayalinizdeki evi inşa ediyoruz', icon: 'home', sort_order: 1, is_active: 1 },
      { id: 2, title: 'Ticari İnşaat', slug: 'ticari-insaat', description: 'Ofis binaları, alışveriş merkezleri ve iş merkezi projelerinde profesyonel inşaat çözümleri.', short_description: 'Profesyonel ticari yapılar', icon: 'building-2', sort_order: 2, is_active: 1 },
      { id: 3, title: 'Mimarlık ve Proje Tasarımı', slug: 'mimarlik-proje-tasarimi', description: 'Deneyimli mimar kadromuzla özgün ve fonksiyonel mimari projeler tasarlıyoruz.', short_description: 'Özgün mimari çözümler', icon: 'pencil-ruler', sort_order: 3, is_active: 1 },
      { id: 4, title: 'Restorasyon ve Yenileme', slug: 'restorasyon-yenileme', description: 'Tarihi ve mevcut yapıların restorasyon ve yenileme projelerinde uzman hizmet.', short_description: 'Yapılarınıza yeni bir nefes', icon: 'hammer', sort_order: 4, is_active: 1 },
      { id: 5, title: 'İç Mimari ve Dekorasyon', slug: 'ic-mimari-dekorasyon', description: 'İç mekan tasarımı ve dekorasyon hizmetleriyle yaşam alanlarınızı dönüştürüyoruz.', short_description: 'Estetik yaşam alanları', icon: 'sofa', sort_order: 5, is_active: 1 },
      { id: 6, title: 'Altyapı ve Zemin Etüdü', slug: 'altyapi-zemin-etudu', description: 'Zemin etüdü, temel tasarımı ve altyapı çalışmalarında güvenilir çözümler.', short_description: 'Sağlam temeller üzerine', icon: 'layers', sort_order: 6, is_active: 1 },
      { id: 7, title: 'Yol ve Çevre Düzenleme', slug: 'yol-cevre-duzenleme', description: 'Çevre düzenlemesi, peyzaj ve yol yapım projelerinde kaliteli hizmet.', short_description: 'Güzel çevreler yaratıyoruz', icon: 'trees', sort_order: 7, is_active: 1 },
    ],
    contact_messages: [],
    settings: [
      { id: 1, setting_key: 'site_title', setting_value: 'MŞ Group İnşaat Mimarlık', setting_type: 'text' },
      { id: 2, setting_key: 'site_description', setting_value: 'Kalite ve güvenilirliğin adresi - İnşaat ve Mimarlık çözümleri', setting_type: 'textarea' },
      { id: 3, setting_key: 'company_name', setting_value: 'MŞ Group İnşaat Mimarlık', setting_type: 'text' },
      { id: 4, setting_key: 'company_phone', setting_value: '+90 536 869 62 51', setting_type: 'text' },
      { id: 5, setting_key: 'company_email', setting_value: 'info@msgroup.com', setting_type: 'text' },
      { id: 6, setting_key: 'company_address', setting_value: 'İstanbul, Türkiye', setting_type: 'text' },
      { id: 7, setting_key: 'company_founded', setting_value: '2010', setting_type: 'text' },
      { id: 8, setting_key: 'projects_count', setting_value: '500+', setting_type: 'text' },
      { id: 9, setting_key: 'experience_years', setting_value: '15+', setting_type: 'text' },
      { id: 10, setting_key: 'team_size', setting_value: '100+', setting_type: 'text' },
      { id: 11, setting_key: 'facebook_url', setting_value: '', setting_type: 'text' },
      { id: 12, setting_key: 'instagram_url', setting_value: '', setting_type: 'text' },
      { id: 13, setting_key: 'whatsapp_number', setting_value: '+90 536 869 62 51', setting_type: 'text' },
      { id: 14, setting_key: 'google_maps_embed', setting_value: '', setting_type: 'textarea' },
    ],
    stats: [
      { id: 1, title: 'Tamamlanan Proje', value: '500+', icon: 'check-circle', sort_order: 1, is_active: 1 },
      { id: 2, title: 'Yıllık Deneyim', value: '15+', icon: 'calendar', sort_order: 2, is_active: 1 },
      { id: 3, title: 'Mutlu Müşteri', value: '1000+', icon: 'smile', sort_order: 3, is_active: 1 },
      { id: 4, title: 'Uzman Ekip', value: '100+', icon: 'users', sort_order: 4, is_active: 1 },
    ],
    sliders: [],
  };
}

function normalizePhoneSettings(store) {
  if (!store || !Array.isArray(store.settings)) return store;
  let changed = false;
  for (const s of store.settings) {
    if (
      s.setting_key === 'company_phone' &&
      (!s.setting_value || s.setting_value.includes('555 00 00') || s.setting_value.includes('xxx'))
    ) {
      s.setting_value = '+90 536 869 62 51';
      changed = true;
    }
    if (
      s.setting_key === 'whatsapp_number' &&
      (!s.setting_value || s.setting_value.includes('5001234567') || s.setting_value.includes('xxx'))
    ) {
      s.setting_value = '+90 536 869 62 51';
      changed = true;
    }
  }
  if (changed) {
    saveStore(store);
  }
  return store;
}

function loadStore() {
  try {
    // 1. Önce kalıcı dizindeki (os.homedir()/.msgroup_data/local_db.json) veritabanına bak (Hostinger deploylarında silinmez!)
    if (fs.existsSync(PERSISTENT_DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(PERSISTENT_DB_FILE, 'utf8'));
      return normalizePhoneSettings(data);
    }

    // 2. Kalıcı dizinde yoksa proje içindeki local_db.json'dan oku ve kalıcı dizine kopyala
    if (fs.existsSync(SEED_DB_FILE)) {
      const seedData = JSON.parse(fs.readFileSync(SEED_DB_FILE, 'utf8'));
      const normalized = normalizePhoneSettings(seedData);
      saveStore(normalized);
      return normalized;
    }

    const initial = getDefaultData();
    saveStore(initial);
    return initial;
  } catch {
    return getDefaultData();
  }
}

function saveStore(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  try {
    if (!fs.existsSync(PERSISTENT_DIR)) fs.mkdirSync(PERSISTENT_DIR, { recursive: true });
    fs.writeFileSync(PERSISTENT_DB_FILE, jsonStr, 'utf8');
  } catch {}
  try {
    const seedDir = path.dirname(SEED_DB_FILE);
    if (!fs.existsSync(seedDir)) fs.mkdirSync(seedDir, { recursive: true });
    fs.writeFileSync(SEED_DB_FILE, jsonStr, 'utf8');
  } catch {}
}

function nextId(list) {
  return list.length === 0 ? 1 : Math.max(...list.map((i) => Number(i.id) || 0)) + 1;
}

async function executeLocalQuery(sql, params = []) {
  const q = sql.replace(/\s+/g, ' ').trim();
  const qLower = q.toLowerCase();
  const store = loadStore();

  // --- ADMINS ---
  if (qLower.includes('from admins')) {
    if (qLower.includes('username = ? or email = ?')) {
      const [u, e] = params;
      const rows = store.admins.filter(
        (a) => (a.username === u || a.email === e) && Number(a.is_active) === 1
      );
      return [rows];
    }
    if (qLower.includes('where id = ?')) {
      const rows = store.admins.filter((a) => Number(a.id) === Number(params[0]));
      return [rows];
    }
  }
  if (qLower.startsWith('update admins set password')) {
    const [newPassword, id] = params;
    store.admins = store.admins.map((a) =>
      Number(a.id) === Number(id) ? { ...a, password: newPassword } : a
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- CATEGORIES ---
  if (qLower.includes('from categories') && !qLower.includes('from projects')) {
    let rows = [...store.categories];
    if (qLower.includes('is_active = 1')) {
      rows = rows.filter((c) => Number(c.is_active) === 1);
    }
    rows.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return [rows];
  }
  if (qLower.startsWith('insert into categories')) {
    const [name, slug, description, icon, sort_order] = params;
    const id = nextId(store.categories);
    store.categories.push({ id, name, slug, description, icon, sort_order: sort_order || 0, is_active: 1 });
    saveStore(store);
    return [{ insertId: id }];
  }
  if (qLower.startsWith('update categories set')) {
    const [name, slug, description, icon, sort_order, is_active, id] = params;
    store.categories = store.categories.map((c) =>
      Number(c.id) === Number(id) ? { ...c, name, slug, description, icon, sort_order, is_active } : c
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }
  if (qLower.startsWith('delete from categories')) {
    store.categories = store.categories.filter((c) => Number(c.id) !== Number(params[0]));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- PROJECTS ---
  if (qLower.includes('from projects p')) {
    let rows = store.projects.map((p) => {
      const cat = store.categories.find((c) => Number(c.id) === Number(p.category_id));
      const cover =
        store.media.find((m) => Number(m.project_id) === Number(p.id) && Number(m.is_cover) === 1) ||
        store.media.find((m) => Number(m.project_id) === Number(p.id) && m.file_type === 'image');
      return {
        ...p,
        category_name: cat ? cat.name : null,
        category_slug: cat ? cat.slug : null,
        cover_image: cover ? cover.file_path : null,
      };
    });

    if (qLower.includes('where p.slug = ?')) {
      const slug = params[0];
      const found = rows.filter((p) => p.slug === slug && Number(p.is_active) === 1);
      return [found];
    }

    rows = rows.filter((p) => Number(p.is_active) === 1);
    let pIdx = 0;
    if (qLower.includes('c.slug = ?')) {
      const catSlug = params[pIdx++];
      rows = rows.filter((p) => p.category_slug === catSlug);
    }
    if (qLower.includes('p.is_featured = ?')) {
      const feat = Number(params[pIdx++]);
      rows = rows.filter((p) => Number(p.is_featured) === feat);
    }
    if (qLower.includes('p.status = ?')) {
      const st = params[pIdx++];
      rows = rows.filter((p) => p.status === st);
    }

    if (qLower.startsWith('select count(*) as total from projects')) {
      return [[{ total: rows.length }]];
    }

    rows.sort((a, b) => {
      if (Number(b.is_featured) !== Number(a.is_featured)) return Number(b.is_featured) - Number(a.is_featured);
      if ((a.sort_order || 0) !== (b.sort_order || 0)) return (a.sort_order || 0) - (b.sort_order || 0);
      return Number(b.id) - Number(a.id);
    });

    const limit = params[params.length - 2] || 20;
    const offset = params[params.length - 1] || 0;
    return [rows.slice(offset, offset + limit)];
  }

  if (qLower.startsWith('insert into projects')) {
    const [category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order] = params;
    if (store.projects.some((p) => p.slug === slug)) {
      const err = new Error('Duplicate slug');
      err.code = 'ER_DUP_ENTRY';
      throw err;
    }
    const id = nextId(store.projects);
    store.projects.push({
      id,
      category_id: category_id ? Number(category_id) : null,
      title,
      slug,
      description,
      short_description,
      location,
      area,
      year,
      status: status || 'tamamlandi',
      is_featured: is_featured ? 1 : 0,
      sort_order: sort_order || 0,
      is_active: 1,
      created_at: new Date().toISOString(),
    });
    saveStore(store);
    return [{ insertId: id }];
  }

  if (qLower.startsWith('update projects set')) {
    const [category_id, title, slug, description, short_description, location, area, year, status, is_featured, sort_order, is_active, id] = params;
    store.projects = store.projects.map((p) =>
      Number(p.id) === Number(id)
        ? {
            ...p,
            category_id: category_id ? Number(category_id) : null,
            title,
            slug,
            description,
            short_description,
            location,
            area,
            year,
            status,
            is_featured: is_featured ? 1 : 0,
            sort_order: sort_order || 0,
            is_active: is_active ? 1 : 0,
          }
        : p
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  if (qLower.startsWith('delete from projects')) {
    const id = Number(params[0]);
    store.projects = store.projects.filter((p) => Number(p.id) !== id);
    store.media = store.media.filter((m) => Number(m.project_id) !== id);
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- MEDIA ---
  if (qLower.startsWith('insert into media')) {
    const [project_id, file_name, original_name, file_path, thumbnail_path, file_type, mime_type, file_size, width, height] = params;
    const id = nextId(store.media);
    const hasCover = project_id && store.media.some((m) => Number(m.project_id) === Number(project_id) && Number(m.is_cover) === 1);
    store.media.push({
      id,
      project_id: project_id ? Number(project_id) : null,
      file_name,
      original_name,
      file_path,
      thumbnail_path,
      file_type,
      mime_type,
      file_size,
      width,
      height,
      is_cover: project_id && !hasCover && file_type === 'image' ? 1 : 0,
      sort_order: 0,
      created_at: new Date().toISOString(),
    });
    saveStore(store);
    return [{ insertId: id }];
  }

  if (qLower.includes('from media where project_id = ?')) {
    const pid = Number(params[0]);
    const rows = store.media
      .filter((m) => Number(m.project_id) === pid)
      .sort((a, b) => Number(b.is_cover || 0) - Number(a.is_cover || 0));
    return [rows];
  }

  if (qLower.includes('from media where id = ?')) {
    const rows = store.media.filter((m) => Number(m.id) === Number(params[0]));
    return [rows];
  }

  if (qLower.includes('from media m')) {
    let rows = store.media.map((m) => {
      const proj = store.projects.find((p) => Number(p.id) === Number(m.project_id));
      return { ...m, project_title: proj ? proj.title : null };
    });
    let pIdx = 0;
    if (qLower.includes('file_type = ?')) {
      const ft = params[pIdx++];
      rows = rows.filter((m) => m.file_type === ft);
    }
    if (qLower.includes('project_id = ?')) {
      const pid = Number(params[pIdx++]);
      rows = rows.filter((m) => Number(m.project_id) === pid);
    }
    if (qLower.startsWith('select count(*) as total from media')) {
      return [[{ total: rows.length }]];
    }
    rows.sort((a, b) => Number(b.id) - Number(a.id));
    const limit = params[params.length - 2] || 50;
    const offset = params[params.length - 1] || 0;
    return [rows.slice(offset, offset + limit)];
  }

  if (qLower.startsWith('update media set is_cover = 0 where project_id = ?')) {
    const pid = Number(params[0]);
    store.media = store.media.map((m) => (Number(m.project_id) === pid ? { ...m, is_cover: 0 } : m));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  if (qLower.startsWith('update media set is_cover = 1 where id = ?')) {
    const id = Number(params[0]);
    store.media = store.media.map((m) => (Number(m.id) === id ? { ...m, is_cover: 1 } : m));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  if (qLower.startsWith('update media set project_id = ? where id = ?')) {
    const [pid, id] = params;
    store.media = store.media.map((m) =>
      Number(m.id) === Number(id) ? { ...m, project_id: pid ? Number(pid) : null } : m
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  if (qLower.startsWith('delete from media where id = ?')) {
    store.media = store.media.filter((m) => Number(m.id) !== Number(params[0]));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- SERVICES ---
  if (qLower.includes('from services')) {
    const rows = store.services
      .filter((s) => Number(s.is_active) === 1)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return [rows];
  }
  if (qLower.startsWith('insert into services')) {
    const [title, slug, description, short_description, icon, sort_order] = params;
    const id = nextId(store.services);
    store.services.push({ id, title, slug, description, short_description, icon, sort_order: sort_order || 0, is_active: 1 });
    saveStore(store);
    return [{ insertId: id }];
  }
  if (qLower.startsWith('update services set')) {
    const [title, slug, description, short_description, icon, sort_order, is_active, id] = params;
    store.services = store.services.map((s) =>
      Number(s.id) === Number(id) ? { ...s, title, slug, description, short_description, icon, sort_order, is_active } : s
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }
  if (qLower.startsWith('delete from services')) {
    store.services = store.services.filter((s) => Number(s.id) !== Number(params[0]));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- CONTACT MESSAGES ---
  if (qLower.startsWith('insert into contact_messages')) {
    const [name, email, phone, subject, message, ip_address] = params;
    const id = nextId(store.contact_messages);
    store.contact_messages.push({
      id,
      name,
      email: email || '',
      phone: phone || '',
      subject: subject || '',
      message,
      ip_address: ip_address || '',
      is_read: 0,
      is_replied: 0,
      created_at: new Date().toISOString(),
    });
    saveStore(store);
    return [{ insertId: id }];
  }

  if (qLower.includes('from contact_messages')) {
    if (qLower.includes('count(*) as unread')) {
      const unread = store.contact_messages.filter((m) => !m.is_read).length;
      return [[{ unread }]];
    }
    let rows = [...store.contact_messages];
    if (qLower.includes('where is_read = ?')) {
      const isRead = Number(params[0]);
      rows = rows.filter((m) => Number(m.is_read) === isRead);
    }
    if (qLower.startsWith('select count(*) as total from contact_messages')) {
      return [[{ total: rows.length }]];
    }
    rows.sort((a, b) => Number(b.id) - Number(a.id));
    const limit = params[params.length - 2] || 20;
    const offset = params[params.length - 1] || 0;
    return [rows.slice(offset, offset + limit)];
  }

  if (qLower.startsWith('update contact_messages set is_read = 1')) {
    const id = Number(params[0]);
    store.contact_messages = store.contact_messages.map((m) =>
      Number(m.id) === id ? { ...m, is_read: 1 } : m
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  if (qLower.startsWith('delete from contact_messages')) {
    store.contact_messages = store.contact_messages.filter((m) => Number(m.id) !== Number(params[0]));
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- SETTINGS ---
  if (qLower.includes('from settings')) {
    return [store.settings];
  }
  if (qLower.startsWith('insert into settings')) {
    const [key, value] = params;
    const exists = store.settings.find((s) => s.setting_key === key);
    if (exists) {
      store.settings = store.settings.map((s) =>
        s.setting_key === key ? { ...s, setting_value: value } : s
      );
    } else {
      store.settings.push({ id: nextId(store.settings), setting_key: key, setting_value: value, setting_type: 'text' });
    }
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- STATS ---
  if (qLower.includes('from stats')) {
    const rows = store.stats
      .filter((s) => Number(s.is_active) === 1)
      .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    return [rows];
  }
  if (qLower.startsWith('update stats set')) {
    const [title, value, icon, sort_order, is_active, id] = params;
    store.stats = store.stats.map((s) =>
      Number(s.id) === Number(id) ? { ...s, title, value, icon, sort_order, is_active } : s
    );
    saveStore(store);
    return [{ affectedRows: 1 }];
  }

  // --- SLIDERS ---
  if (qLower.includes('from sliders')) {
    return [store.sliders.filter((s) => Number(s.is_active) === 1)];
  }

  return [[]];
}

module.exports = { executeLocalQuery, loadStore };

