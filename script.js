const music = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
const heroSlider = document.getElementById('heroSlider');
const featureStack = document.getElementById('featureStack');
const gallery = document.getElementById('gallery');
const filters = document.getElementById('filters');
const videoGrid = document.getElementById('videoGrid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightbox = document.getElementById('closeLightbox');
const openLetter = document.getElementById('openLetter');
const letterPaper = document.getElementById('letterPaper');

const images = galleryData.images;
const videos = galleryData.videos;
const featureImages = images.filter(i => i.feature).slice(0, 2);
const heroImages = [...featureImages, ...images.filter(i => ['amor da minha vida.JPG','eu te amo meu amor.jpg'].includes(i.original))].slice(0, 4);

function createHero(){
  const selected = heroImages.length ? heroImages : images.slice(0, 3);
  heroSlider.innerHTML = selected.map(img => `<div class="hero-slide" style="background-image:url('${img.src}')"></div>`).join('');
  let idx = 0;
  setInterval(() => {
    idx = (idx + 1) % selected.length;
    heroSlider.style.transform = `translateX(-${idx * 100}%)`;
  }, 5200);
}

function createFeatures(){
  const selected = featureImages.length ? featureImages : images.filter(i => i.category === 'Fernando de Noronha').slice(0,2);
  featureStack.innerHTML = selected.map(img => `<img src="${img.src}" alt="${img.title}" loading="lazy">`).join('');
}

function createFilters(){
  const preferred = ['Todos','Uberlândia','São Sebastião e Ilhabela','Pirenópolis','Jalapão','Ilha Grande','Recife','Paraty','São Lourenço','Rio de Janeiro','Goiás Velho','Fernando de Noronha','Colômbia','Nosso jeito','Datas especiais','Detalhes'];
  const cats = [...new Set(images.map(i => i.category))];
  const final = preferred.filter(label => label === 'Todos' || cats.some(c => c.includes(label) || label.includes(c))).concat(cats.filter(c => !preferred.some(p => c.includes(p) || p.includes(c))));
  filters.innerHTML = final.map((f,i)=>`<button type="button" class="${i===0?'active':''}" data-filter="${f}">${f}</button>`).join('');
  filters.addEventListener('click', e => {
    if(e.target.tagName !== 'BUTTON') return;
    [...filters.querySelectorAll('button')].forEach(b => b.classList.remove('active'));
    e.target.classList.add('active');
    renderGallery(e.target.dataset.filter);
  });
}

function matchesFilter(img, filter){
  if(filter === 'Todos') return true;
  if(filter === 'Colômbia') return img.category.startsWith('Colômbia');
  if(filter === 'Nosso jeito') return img.category === 'Nosso jeito de viver' || img.category === 'Sabores e brindes' || img.category === 'Caminhos e chegadas';
  if(filter === 'Detalhes') return img.category === 'Detalhes que amo' || img.category === 'Momentos especiais';
  return img.category === filter;
}

function renderGallery(filter='Todos'){
  const list = images.filter(img => matchesFilter(img, filter));
  gallery.innerHTML = list.map((img, idx) => `
    <article class="memory-card" data-src="${img.src}" data-caption="${img.category} — ${img.title}">
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="memory-copy">
        <span>${img.category}</span>
        <h3>${img.title}</h3>
        <p>${img.caption}</p>
      </div>
    </article>`).join('');
}

function createVideos(){
  videoGrid.innerHTML = videos.map(v => `
    <article class="video-card">
      <video controls preload="metadata" playsinline>
        <source src="${v.src}" type="video/mp4">
      </video>
      <div>
        <h3>${v.title}</h3>
        <p>${v.caption}</p>
      </div>
    </article>`).join('');
}

musicBtn.addEventListener('click', async () => {
  try{
    if(music.paused){
      await music.play();
      musicBtn.textContent = '⏸ Pausar nossa música';
    }else{
      music.pause();
      musicBtn.textContent = '▶ Tocar nossa música';
    }
  }catch(err){
    musicBtn.textContent = 'Toque novamente para iniciar';
  }
});

gallery.addEventListener('click', e => {
  const card = e.target.closest('.memory-card');
  if(!card) return;
  lightboxImg.src = card.dataset.src;
  lightboxCaption.textContent = card.dataset.caption;
  lightbox.classList.add('show');
  lightbox.setAttribute('aria-hidden','false');
});
closeLightbox.addEventListener('click', () => { lightbox.classList.remove('show'); lightbox.setAttribute('aria-hidden','true'); });
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox.click(); });

openLetter.addEventListener('click', () => {
  letterPaper.hidden = !letterPaper.hidden;
  openLetter.textContent = letterPaper.hidden ? 'Abrir a carta' : 'Guardar a carta';
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{ if(entry.isIntersecting) entry.target.classList.add('visible'); });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

createHero();
createFeatures();
createFilters();
renderGallery();
createVideos();
