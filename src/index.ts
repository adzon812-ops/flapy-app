import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

// --- СЭР, ВСТАВЬТЕ ВАШИ КЛЮЧИ СЮДА ---
const SUPABASE_URL = "https://sxcgzagyxylolgblhnkj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2d6YWd5eHlsb2xnYmxobmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTE0NjksImV4cCI6MjA5MDUyNzQ2OX0.ufNNrL59Oem57qurp9N1eHIDMKin7KVbaOCiXA7Qe60"
// ------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Flapy - Real Estate Astana</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f8fafc; color: #1e293b; }
        .kaspi-blue { background-color: #0047FF; }
        .eco-white { background-color: #ffffff; }
        .nav-shadow { box-shadow: 0 -2px 10px rgba(0,0,0,0.05); }
        .card-blur { backdrop-filter: blur(10px); background: rgba(255, 255, 255, 0.8); }
        video { border-radius: 12px; object-fit: cover; }
        .active-tab { color: #0047FF; }
        .hidden { display: none; }
    </style>
</head>
<body class="pb-24">

    <header class="sticky top-0 z-50 eco-white border-b p-4 flex justify-between items-center">
        <h1 class="text-xl font-semibold tracking-tight">Flapy <span class="text-xs text-blue-500">Astana</span></h1>
        <div id="admin-trigger" class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs opacity-0">A</div>
    </header>

    <main id="app-content" class="p-4 space-y-4">
        <div id="loader" class="text-center py-20 text-gray-400">Загрузка объектов...</div>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 eco-white border-t nav-shadow px-6 py-3 flex justify-between items-center z-50">
        <button onclick="switchTab('listings')" class="flex flex-col items-center space-y-1">
            <span class="text-xl">🏠</span><span class="text-[10px]">Объекты</span>
        </button>
        <button onclick="switchTab('feed')" class="flex flex-col items-center space-y-1">
            <span class="text-xl">📱</span><span class="text-[10px]">Лента</span>
        </button>
        <button onclick="openAddModal()" class="kaspi-blue w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg -mt-8 border-4 border-white">
            <span class="text-2xl">+</span>
        </button>
        <button onclick="switchTab('flai')" class="flex flex-col items-center space-y-1">
            <span class="text-xl">🤖</span><span class="text-[10px]">Flai AI</span>
        </button>
        <button onclick="switchTab('more')" class="flex flex-col items-center space-y-1">
            <span class="text-xl">☰</span><span class="text-[10px]">Ещё</span>
        </button>
    </nav>

    <div id="add-modal" class="fixed inset-0 bg-black/60 z-[60] hidden flex items-end">
        <div class="eco-white w-full rounded-t-3xl p-6 space-y-4 animate-slide-up">
            <div class="flex justify-between items-center">
                <h2 class="text-lg font-semibold">Добавить объект</h2>
                <button onclick="closeAddModal()" class="text-gray-400 text-2xl">&times;</button>
            </div>
            <input type="text" id="price" placeholder="Цена (тг)" class="w-full p-3 bg-gray-50 rounded-xl border-none">
            <select id="district" class="w-full p-3 bg-gray-50 rounded-xl border-none">
                <option value="Есильский">Есильский район</option>
                <option value="Алматы">Район Алматы</option>
                <option value="Сарыарка">Район Сарыарка</option>
                <option value="Байконур">Район Байконур</option>
                <option value="Нура">Район Нура</option>
            </select>
            <div class="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center relative">
                <input type="file" id="video-input" accept="video/*" class="absolute inset-0 opacity-0 cursor-pointer">
                <span id="upload-status" class="text-sm text-gray-500">Нажмите, чтобы загрузить видео</span>
            </div>
            <button id="save-btn" onclick="saveListing()" class="w-full kaspi-blue text-white py-4 rounded-xl font-semibold">Опубликовать</button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        const supabase = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');
        let currentTab = 'listings';

        async function fetchListings() {
            const { data, error } = await supabase.from('listings').select('*').order('created_at', { ascending: false });
            if (error) return console.error(error);
            render(data);
        }

        function render(items) {
            const container = document.getElementById('app-content');
            if (items.length === 0) {
                container.innerHTML = '<div class="text-center py-20 text-gray-400">Пока нет объектов</div>';
                return;
            }
            container.innerHTML = items.map(item => \`
                <div class="eco-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    \${item.video_url ? \`<video src="\${item.video_url}" class="w-full h-64" loop muted playsinline onclick="this.paused ? this.play() : this.pause()"></video>\` : '<div class="h-64 bg-gray-100 flex items-center justify-center">Нет видео</div>'}
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-lg font-bold">\${Number(item.price).toLocaleString()} ₸</h3>
                            <span class="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-full uppercase font-bold">\${item.district}</span>
                        </div>
                        <p class="text-sm text-gray-500 mb-4">\${item.type || 'Квартира'} • Астана</p>
                        <div class="grid grid-cols-2 gap-3">
                            <a href="tel:\${item.phone}" class="flex items-center justify-center space-x-2 bg-gray-900 text-white py-3 rounded-xl text-sm">
                                <span>📞 Позвонить</span>
                            </a>
                            <a href="https://wa.me/77000000000" class="flex items-center justify-center space-x-2 border border-gray-200 py-3 rounded-xl text-sm">
                                <span>💬 Написать</span>
                            </a>
                        </div>
                    </div>
                </div>
            \`).join('');
        }

        async function saveListing() {
            const btn = document.getElementById('save-btn');
            const file = document.getElementById('video-input').files[0];
            const price = document.getElementById('price').value;
            const district = document.getElementById('district').value;

            if (!price || !file) return alert('Сэр, введите цену и выберите видео!');
            
            btn.innerText = 'Загрузка...';
            btn.disabled = true;

            // 1. Загрузка видео в Supabase Storage
            const fileName = \`\${Date.now()}_video.mp4\`;
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('flapy-media')
                .upload(fileName, file);

            if (uploadError) return alert('Ошибка загрузки видео');

            const videoUrl = supabase.storage.from('flapy-media').getPublicUrl(fileName).data.publicUrl;

            // 2. Сохранение данных в таблицу
            const { error: dbError } = await supabase.from('listings').insert([
                { price: price, district: district, video_url: videoUrl, phone: '77015554433' }
            ]);

            if (dbError) alert('Ошибка сохранения данных');
            else {
                closeAddModal();
                fetchListings();
            }
            btn.innerText = 'Опубликовать';
            btn.disabled = false;
        }

        function switchTab(tab) {
            currentTab = tab;
            if (tab === 'listings') fetchListings();
            else document.getElementById('app-content').innerHTML = '<div class="text-center py-20 text-gray-400 italic">Сэр, раздел ' + tab + ' находится в разработке</div>';
        }

        function openAddModal() { document.getElementById('add-modal').classList.remove('hidden'); }
        function closeAddModal() { document.getElementById('add-modal').classList.add('hidden'); }

        // Секретный вход для Админа (Долгое нажатие на логотип)
        let timer;
        const logo = document.querySelector('header h1');
        logo.addEventListener('mousedown', () => timer = setTimeout(() => {
            const pass = prompt('Пароль Сэр:');
            if(pass === '2026') alert('Добро пожаловать в пульт управления!');
        }, 3000));
        logo.addEventListener('mouseup', () => clearTimeout(timer));

        fetchListings();
    </script>
</body>
</html>
  `)
})

export default app
