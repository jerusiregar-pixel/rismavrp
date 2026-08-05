const C = window.SITE_CONFIG;
const $ = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const ytId = u => (u.match(/(?:youtu\.be\/|v=)([\w-]{6,})/)||[])[1]||'';
const thumb = u => `https://img.youtube.com/vi/${ytId(u)}/hqdefault.jpg`;
const waUrl = `https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent(C.whatsappMessage)}`;
$$('[data-user]').forEach(e=>e.textContent=C.userName);
$$('[data-brand]').forEach(e=>e.textContent=C.brandName);
$$('[data-phone]').forEach(e=>e.textContent=C.phoneDisplay);
$$('.register-link').forEach(e=>{e.href=C.registrationUrl;e.target='_blank';e.rel='noopener'});
$$('.whatsapp-link').forEach(e=>{e.href=waUrl;e.target='_blank';e.rel='noopener'});
$('#phoneLink').href=`tel:+${C.whatsappNumber}`;
$('#posterImage').src=C.posterPath;
const [v1,v2]=C.explainerVideos;
$('#explainerTitle').textContent=v1.title;$('#explainerPreview').href=v1.url;$('#explainerPreview').style.backgroundImage=`url(${thumb(v1.url)})`;$('#video1').href=v1.url;$('#video2').href=v2.url;
$('#testimonialGrid').innerHTML=C.testimonials.map(t=>`<article class="testimonial-card"><a class="testimonial-thumb" href="${t.videoUrl}" target="_blank" style="background-image:url('${thumb(t.videoUrl)}')"><span>▶</span></a><div class="testimonial-body"><h3>${t.name}</h3><small>${t.role}</small><p>${t.text}</p><a class="watch-btn" href="${t.videoUrl}" target="_blank">Tonton di YouTube</a></div></article>`).join('');

async function imageExists(src){return new Promise(resolve=>{const i=new Image();i.onload=()=>resolve(true);i.onerror=()=>resolve(false);i.src=`${src}?v=${Date.now()}`})}
async function initLegalitas(){
 const {folder,filePrefix,extension,maxScan}=C.legalitas, files=[];
 for(let n=1;n<=maxScan;n++){const src=`${folder}/${filePrefix}${n}${extension}`;if(await imageExists(src))files.push(src);else if(n>4)break;}
 const track=$('#legalTrack'),dots=$('#legalDots'); let index=0,startX=0;
 track.innerHTML=files.map((src,i)=>`<div class="legal-slide"><figure class="legal-card"><div class="legal-image"><img src="${src}" alt="Dokumen legalitas ${i+1}" loading="lazy" tabindex="0" role="button" aria-label="Buka dokumen legalitas ${i+1} dalam tampilan penuh"></div><figcaption>Dokumen legalitas ${i+1}</figcaption></figure></div>`).join('');
 dots.innerHTML=files.map((_,i)=>`<button aria-label="Slide ${i+1}" data-i="${i}"></button>`).join('');
 const update=()=>{track.style.transform=`translateX(-${index*100}%)`;$$('button',dots).forEach((b,i)=>b.classList.toggle('active',i===index));};
 const go=d=>{index=(index+d+files.length)%files.length;update()};
 $('.next').onclick=()=>go(1);$('.prev').onclick=()=>go(-1);dots.onclick=e=>{if(e.target.dataset.i!==undefined){index=+e.target.dataset.i;update()}};
 $('.legal-viewport').addEventListener('pointerdown',e=>startX=e.clientX);$('.legal-viewport').addEventListener('pointerup',e=>{const d=e.clientX-startX;if(Math.abs(d)>45)go(d<0?1:-1)});update();
}
initLegalitas();
const toggle=$('.menu-toggle'),nav=$('#mainNav');toggle.onclick=()=>{nav.classList.toggle('open');toggle.setAttribute('aria-expanded',nav.classList.contains('open'))};
$$('section,.testimonial-card').forEach(e=>e.classList.add('reveal'));const io=new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});$$('.reveal').forEach(e=>io.observe(e));


const lightbox = $('#imageLightbox');
const lightboxImage = $('#lightboxImage');
const lightboxClose = $('.lightbox-close');

function openLegalLightbox(src, alt) {
  lightboxImage.src = src;
  lightboxImage.alt = alt || 'Dokumen legalitas dalam tampilan penuh';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');
  lightboxClose.focus();
}

function closeLegalLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');
  lightboxImage.src = '';
}

document.addEventListener('click', e => {
  const image = e.target.closest('.legal-image img');
  if (image) openLegalLightbox(image.currentSrc || image.src, image.alt);
});

document.addEventListener('keydown', e => {
  if ((e.key === 'Enter' || e.key === ' ') && e.target.matches('.legal-image img')) {
    e.preventDefault();
    openLegalLightbox(e.target.currentSrc || e.target.src, e.target.alt);
  }
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLegalLightbox();
});

lightboxClose.addEventListener('click', closeLegalLightbox);
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLegalLightbox();
});
