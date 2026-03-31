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
    <title>Flapy | Real Estate</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;600;700&display=swap');
        body { 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background-color: #F9FAFB; 
            color: #111827; 
            -webkit-tap-highlight-color: transparent;
        }
        .luxury-card {
            background: #FFFFFF;
            border: 1px solid rgba(229, 231, 235, 0.5);
            box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
            border-radius: 24px;
        }
        .bottom-nav {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }
        .btn-kaspi {
            background: #0047FF;
            transition: all 0.2s ease;
        }
        .btn-kaspi:active { transform: scale(0.96); }
        .tab-active { color: #0047FF; }
        .tab-inactive { color: #9CA3AF; }
        
        /* Анимация появления */
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-feed { animation: fadeIn 0.4s ease forwards; }
    </style>
</head>
<body class="pb-32">

    <header class="sticky top-0 z-40 bg-[#F9FAFB]/80 backdrop-blur-md px-6 py-4 flex justify-between items-center">
        <div>
            <h1 class="text-xl font-bold tracking-tight text-gray-900">Flapy.</h1>
            <p class="text-[10px] text-blue-500 font-semibold uppercase tracking-widest">Astana Realtors</p>
        </div>
        <button class="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center shadow-sm">
            <i data-lucide="search" class="w-5 h-5 text-gray-500"></i>
        </button>
    </header>

    <div class="px-6 mb-6 overflow-x-auto flex space-x-3 no-scrollbar">
        <button class="px-5 py-2 rounded-full bg-gray-900 text-white text-xs font-semibold whitespace-nowrap">Все районы</button>
        <button class="px-5 py-2 rounded-full bg-white border border-gray-100 text-gray-500 text-xs font-semibold whitespace-nowrap">Есильский</button>
        <button class="px-5 py-2 rounded-full bg-white border border-gray-100 text-gray-500 text-xs font-semibold whitespace-nowrap">Нура</button>
    </div>

    <main id="app-content" class="px-6 space-y-6">
        <div id="loader" class="flex flex-col items-center justify-center py-20 space-y-4">
            <div class="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p class="text-sm text-gray-400">Поиск лучших предложений...</p>
        </div>
    </main>

    <nav class="fixed bottom-0 left-0 right-0 h-20 bottom-nav flex justify-around items-center px-4 z-50">
        <button onclick="switchTab('listings')" class="flex flex-col items-center space-y-1 tab-active">
            <i data-lucide="home" class="w-6 h-6"></i>
            <span class="text-[10px] font-medium">Объекты</span>
        </button>
        <button onclick="switchTab('feed')" class="flex flex-col items-center space-y-1 tab-inactive">
            <i data-lucide="layout-grid" class="w-6 h-6"></i>
            <span class="text-[10px] font-medium">Лента</span>
        </button>
        
        <button onclick="openAddModal()" class="btn-kaspi w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200 -mt-10 border-4 border-white">
            <i data-lucide="plus" class="w-8 h-8"></i>
        </button>

        <button onclick="switchTab('flai')" class="flex flex-col items-center space-y-1 tab-inactive">
            <i data-lucide="sparkles" class="w-6 h-6"></i>
            <span class="text-[10px] font-medium">Flai AI</span>
        </button>
        <button onclick="switchTab('more')" class="flex flex-col items-center space-y-1 tab-inactive">
            <i data-lucide="user" class="w-6 h-6"></i>
            <span class="text-[10px] font-medium">Профиль</span>
        </button>
    </nav>

    <div id="add-modal" class="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] hidden flex items-end">
        <div class="bg-white w-full rounded-t-[32px] p-8 space-y-6 animate-slide-up shadow-2xl">
            <div class="flex justify-between items-center">
                <h2 class="text-xl font-bold">Новый объект</h2>
                <button onclick="closeAddModal()" class="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full text-gray-500">&times;</button>
            </div>
            <div class="space-y-4">
                <input type="number" id="price" placeholder="Цена в тенге" class="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                <select id="district" class="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value="Есильский">Есильский район</option>
                    <option value="Нура">Район Нура</option>
                    <option value="Алматы">Район Алматы</option>
                    <option value="Сарыарка">Район Сарыарка</option>
                </select>
                <label class="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 hover:bg-gray-50 cursor-pointer transition-all">
                    <i data-lucide="video" class="w-10 h-10 text-gray-300 mb-2"></i>
                    <span id="upload-status" class="text-xs text-gray-400 font-medium text-center">Загрузите видеообзор квартиры</span>
                    <input type="file" id="video-input" accept="video/*" class="hidden">
                </label>
            </div>
            <button id="save-btn" onclick="saveListing()" class="w-full btn-kaspi text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100">Опубликовать</button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        const supabaseClient = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');
        
        async function fetchListings() {
            const { data, error } = await supabaseClient.from('listings').select('*').order('created_at', { ascending: false });
            if (error) return console.error(error);
            render(data);
            lucide.createIcons(); // Обновляем иконки после рендера
        }

        function render(items) {
            const container = document.getElementById('app-content');
            if (!items || items.length === 0) {
                container.innerHTML = \`
                    <div class="flex flex-col items-center justify-center py-20 text-center">
                        <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                             <i data-lucide="ghost" class="w-10 h-10 text-gray-300"></i>
                        </div>
                        <h3 class="text-gray-900 font-bold">Пока пусто</h3>
                        <p class="text-xs text-gray-400 mt-1 px-10">Будьте первым, кто добавит объект в базу Flapy</p>
                    </div>
                \`;
                lucide.createIcons();
                return;
            }
            container.innerHTML = items.map(item => \`
                <div class="luxury-card overflow-hidden animate-feed">
                    <div class="relative h-72">
                        <video src="\${item.video_url}" class="w-full h-full object-cover" loop muted playsinline onclick="this.paused ? this.play() : this.pause()"></video>
                        <div class="absolute top-4 left-4">
                            <span class="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm uppercase tracking-wider">\${item.district}</span>
                        </div>
                    </div>
                    <div class="p-5">
                        <div class="flex justify-between items-end mb-4">
                            <div>
                                <p class="text-[10px] text-gray-400 font-bold uppercase mb-1">Стоимость</p>
                                <h3 class="text-xl font-bold text-gray-900">\${Number(item.price).toLocaleString()} ₸</h3>
                            </div>
                            <div class="flex -space-x-2">
                                <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                                <div class="w-8 h-8 rounded-full border-2 border-white bg-gray-300 flex items-center justify-center text-[8px] font-bold">R</div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-50">
                            <a href="tel:\${item.phone}" class="flex items-center justify-center space-x-2 bg-gray-900 text-white py-3.5 rounded-xl text-[12px] font-bold active:scale-95 transition-all">
                                <i data-lucide="phone" class="w-4 h-4"></i>
                                <span>Позвонить</span>
                            </a>
                            <a href="https://wa.me/\${item.phone}" class="flex items-center justify-center space-x-2 bg-white border border-gray-100 py-3.5 rounded-xl text-[12px] font-bold active:scale-95 transition-all">
                                <i data-lucide="message-circle" class="w-4 h-4 text-green-500"></i>
                                <span>WhatsApp</span>
                            </a>
                        </div>
                    </div>
                </div>
            \`).join('');
            lucide.createIcons();
        }

        async function saveListing() {
            const btn = document.getElementById('save-btn');
            const file = document.getElementById('video-input').files[0];
            const price = document.getElementById('price').value;
            const district = document.getElementById('district').value;

            if (!price || !file) return alert('Сэр, заполните цену и загрузите видео!');
            
            btn.innerText = 'Публикация...';
            btn.disabled = true;

            const fileName = \`\${Date.now()}_v.mp4\`;
            const { data: up, error: upE } = await supabaseClient.storage.from('flapy-media').upload(fileName, file);

            if (upE) return alert('Ошибка загрузки');

            const videoUrl = supabaseClient.storage.from('flapy-media').getPublicUrl(fileName).data.publicUrl;

            await supabaseClient.from('listings').insert([{ price, district, video_url: videoUrl, phone: '77001234567' }]);

            closeAddModal();
            fetchListings();
            btn.innerText = 'Опубликовать';
            btn.disabled = false;
        }

        function switchTab(tab) {
            document.querySelectorAll('nav button').forEach(b => {
                b.classList.remove('tab-active');
                b.classList.add('tab-inactive');
            });
            event.currentTarget.classList.add('tab-active');
            event.currentTarget.classList.remove('tab-inactive');
            if (tab === 'listings') fetchListings();
            else document.getElementById('app-content').innerHTML = '<div class="text-center py-20 text-gray-400 italic text-sm">Раздел в разработке...</div>';
        }

        function openAddModal() { document.getElementById('add-modal').classList.remove('hidden'); }
        function closeAddModal() { document.getElementById('add-modal').classList.add('hidden'); }

        lucide.createIcons();
        fetchListings();
    </script>
</body>
</html>
  `)
})

export default app
