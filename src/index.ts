import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

const app = new Hono()

// --- СЭР, ВАШИ КЛЮЧИ ---
const SUPABASE_URL = "https://sxcgzagyxylolgblhnkj.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2d6YWd5eHlsb2xnYmxobmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ5NTE0NjksImV4cCI6MjA5MDUyNzQ2OX0.ufNNrL59Oem57qurp9N1eHIDMKin7KVbaOCiXA7Qe60"
// ----------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Flapy | Premium Real Estate</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/lucide@latest"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
        
        :root { --kaspi-blue: #0047FF; --bg-gray: #F8F9FB; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: var(--bg-gray); color: #1A1D21; -webkit-font-smoothing: antialiased; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .luxury-card { background: white; border: 1px solid rgba(0,0,0,0.03); box-shadow: 0 10px 25px -5px rgba(0,0,0,0.04); border-radius: 28px; }
        .btn-primary { background: var(--kaspi-blue); color: white; border-radius: 18px; transition: all 0.2s; }
        .btn-primary:active { transform: scale(0.95); opacity: 0.9; }
        
        .nav-blur { background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(0,0,0,0.05); }
        .plus-btn { background: var(--kaspi-blue); box-shadow: 0 8px 25px rgba(0, 71, 255, 0.3); border: 4px solid white; transform: translateY(-20px); }
        
        .tag { background: rgba(0, 71, 255, 0.05); color: var(--kaspi-blue); font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; }
        
        video { width: 100%; height: 100%; object-fit: cover; border-radius: 24px 24px 0 0; }
        .status-pill { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); padding: 6px 12px; border-radius: 100px; font-weight: 700; font-size: 10px; }
        
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: slideIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    </style>
</head>
<body class="pb-32">

    <header class="sticky top-0 z-50 bg-[#F8F9FB]/80 backdrop-blur-lg px-6 py-5 flex justify-between items-center">
        <div>
            <h1 class="text-2xl font-extrabold tracking-tight">Flapy<span class="text-blue-600">.</span></h1>
            <div class="flex items-center space-x-1 mt-0.5">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Astana Live Market</p>
            </div>
        </div>
        <div class="flex space-x-3">
            <button class="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                <i data-lucide="bell" class="w-5 h-5 text-gray-400"></i>
            </button>
            <button class="w-11 h-11 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-gray-100">
                <i data-lucide="search" class="w-5 h-5 text-gray-400"></i>
            </button>
        </div>
    </header>

    <div class="px-6 mb-8 overflow-x-auto flex space-x-3 no-scrollbar py-2">
        <button class="px-6 py-2.5 rounded-2xl bg-gray-900 text-white text-xs font-bold whitespace-nowrap shadow-lg shadow-gray-200">Все объекты</button>
        <button class="px-6 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-bold whitespace-nowrap">Есильский</button>
        <button class="px-6 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-bold whitespace-nowrap">Нура</button>
        <button class="px-6 py-2.5 rounded-2xl bg-white border border-gray-100 text-gray-500 text-xs font-bold whitespace-nowrap">Алматы</button>
    </div>

    <main id="view-container" class="px-6 space-y-8">
        </main>

    <nav class="fixed bottom-0 left-0 right-0 h-24 nav-blur flex justify-around items-center px-4 z-50">
        <button onclick="switchTab('listings')" class="flex flex-col items-center space-y-1.5 group">
            <div class="p-2 rounded-xl group-[.active]:bg-blue-50 transition-colors">
                <i data-lucide="home" class="w-6 h-6 text-blue-600"></i>
            </div>
            <span class="text-[10px] font-bold text-blue-600">Главная</span>
        </button>
        
        <button onclick="switchTab('realtors')" class="flex flex-col items-center space-y-1.5">
            <i data-lucide="users" class="w-6 h-6 text-gray-400"></i>
            <span class="text-[10px] font-bold text-gray-400 uppercase">Риэлторы</span>
        </button>
        
        <button onclick="openAddModal()" class="plus-btn w-16 h-16 rounded-3xl flex items-center justify-center text-white">
            <i data-lucide="plus" class="w-8 h-8"></i>
        </button>

        <button onclick="switchTab('flai')" class="flex flex-col items-center space-y-1.5">
            <i data-lucide="message-square" class="w-6 h-6 text-gray-400"></i>
            <span class="text-[10px] font-bold text-gray-400 uppercase">Flai AI</span>
        </button>
        
        <button onclick="switchTab('profile')" class="flex flex-col items-center space-y-1.5">
            <i data-lucide="user" class="w-6 h-6 text-gray-400"></i>
            <span class="text-[10px] font-bold text-gray-400 uppercase">Профиль</span>
        </button>
    </nav>

    <div id="add-modal" class="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] hidden flex items-end">
        <div class="bg-white w-full rounded-t-[40px] p-8 space-y-6 shadow-2xl">
            <div class="w-12 h-1.5 bg-gray-100 rounded-full mx-auto mb-2"></div>
            <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Опубликовать</h2>
                <button onclick="closeAddModal()" class="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">&times;</button>
            </div>
            <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <input type="number" id="price" placeholder="Цена ₸" class="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold text-lg outline-none">
                    <select id="rooms" class="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none">
                        <option>1 комн.</option>
                        <option>2 комн.</option>
                        <option>3 комн.</option>
                    </select>
                </div>
                <select id="district" class="w-full p-4 bg-gray-50 rounded-2xl border-none font-bold outline-none">
                    <option>Есильский район</option>
                    <option>Район Нура</option>
                    <option>Район Алматы</option>
                </select>
                <label class="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl p-12 bg-gray-50/50 hover:bg-gray-50 transition-all cursor-pointer">
                    <i data-lucide="video" class="w-10 h-10 text-blue-500 mb-3"></i>
                    <span id="upload-status" class="text-xs font-bold text-gray-400">Нажмите, чтобы добавить видео</span>
                    <input type="file" id="video-input" accept="video/*" class="hidden">
                </label>
            </div>
            <button id="save-btn" onclick="saveListing()" class="w-full btn-primary py-5 text-lg font-bold shadow-xl shadow-blue-200">Создать объявление</button>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        const client = supabase.createClient('${SUPABASE_URL}', '${SUPABASE_ANON_KEY}');

        async function fetchListings() {
            const container = document.getElementById('view-container');
            container.innerHTML = '<div class="py-20 text-center opacity-50 font-bold">Ищем объекты в Астане...</div>';
            
            const { data, error } = await client.from('listings').select('*').order('created_at', { ascending: false });
            
            if (!data || data.length === 0) {
                container.innerHTML = '<div class="text-center py-20"><i data-lucide="camera-off" class="w-12 h-12 mx-auto text-gray-200 mb-4"></i><p class="font-bold text-gray-400">Объектов пока нет</p></div>';
                lucide.createIcons();
                return;
            }

            container.innerHTML = data.map(item => \`
                <div class="luxury-card animate-in">
                    <div class="relative h-80">
                        <video src="\${item.video_url}" loop muted playsinline onclick="this.paused ? this.play() : this.pause()"></video>
                        <div class="status-pill text-blue-600 tracking-tighter uppercase">🔥 Хит продаж</div>
                        <div class="absolute bottom-4 left-4 flex space-x-2">
                             <span class="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase">\${item.district}</span>
                        </div>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-5">
                            <div>
                                <h3 class="text-2xl font-extrabold text-gray-900">\${Number(item.price).toLocaleString()} ₸</h3>
                                <p class="text-[11px] text-gray-400 font-bold uppercase mt-1">\${item.rooms || '2 комн.'} • \${item.area || '65'} м² • Астана</p>
                            </div>
                            <div class="flex -space-x-3">
                                <div class="w-10 h-10 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center text-[10px] font-black text-blue-600 uppercase">AP</div>
                                <div class="w-10 h-10 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                                    <img src="https://i.pravatar.cc/100?u=\${item.id}" class="w-full h-full object-cover">
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-4 pt-5 border-t border-gray-50">
                            <a href="tel:\${item.phone}" class="btn-primary flex items-center justify-center space-x-2 py-4 shadow-lg shadow-blue-50">
                                <i data-lucide="phone" class="w-4 h-4"></i>
                                <span class="text-sm font-bold">Позвонить</span>
                            </a>
                            <a href="https://wa.me/\${item.phone}" class="bg-white border border-gray-100 flex items-center justify-center space-x-2 py-4 rounded-[18px] active:scale-95 transition-all">
                                <i data-lucide="message-circle" class="w-4 h-4 text-green-500"></i>
                                <span class="text-sm font-bold text-gray-700">Написать</span>
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

            if (!price || !file) return alert('Сэр, нужно видео и цена!');
            
            btn.innerText = 'Публикуем...';
            btn.disabled = true;

            const fileName = \`\${Date.now()}_v.mp4\`;
            const { error: upE } = await client.storage.from('flapy-media').upload(fileName, file);
            if (upE) return alert('Сбой загрузки');

            const videoUrl = client.storage.from('flapy-media').getPublicUrl(fileName).data.publicUrl;

            await client.from('listings').insert([{ 
                price, district, video_url: videoUrl, phone: '77005556677', rooms: document.getElementById('rooms').value 
            }]);

            closeAddModal();
            fetchListings();
            btn.innerText = 'Создать объявление';
            btn.disabled = false;
        }

        function switchTab(tab) {
            const container = document.getElementById('view-container');
            if(tab === 'listings') fetchListings();
            else if(tab === 'realtors') {
                container.innerHTML = \`
                    <div class="space-y-4">
                        <h2 class="text-2xl font-black">Топ риэлторов</h2>
                        <div class="luxury-card p-6 flex items-center space-x-4">
                            <div class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">1</div>
                            <div class="flex-1">
                                <h4 class="font-bold">Адиль Есиль</h4>
                                <p class="text-xs text-gray-400">98 сделок • 5.0 рейтинг</p>
                            </div>
                            <i data-lucide="chevron-right" class="text-gray-200"></i>
                        </div>
                    </div>
                \`;
            } else if(tab === 'flai') {
                container.innerHTML = \`
                    <div class="flex flex-col h-[60vh] justify-between">
                        <div class="space-y-4">
                             <div class="bg-blue-600 text-white p-5 rounded-[32px] rounded-bl-none max-w-[80%] shadow-xl">
                                <p class="text-sm font-medium">Сэр, я Flai. Помогу найти лучшую квартиру в Астане или проверю документы. Что ищем?</p>
                             </div>
                        </div>
                        <div class="relative">
                            <input type="text" placeholder="Спросить у Flai..." class="w-full p-6 bg-white rounded-3xl shadow-xl border-none outline-none font-bold pr-20">
                            <button class="absolute right-3 top-3 w-12 h-12 bg-blue-600 rounded-2xl text-white flex items-center justify-center shadow-lg"><i data-lucide="send" class="w-5 h-5"></i></button>
                        </div>
                    </div>
                \`;
            }
            lucide.createIcons();
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
